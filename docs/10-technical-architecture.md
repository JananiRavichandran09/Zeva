# 10 — Technical / System Architecture

High-level architecture, technology choices, service boundaries, and cross-cutting concerns. This doc is the bridge between product design and code. It reflects the **enterprise system design**: a NestJS modular monolith behind a single gateway, PostgreSQL + Redis for state, and an integration layer that treats **Microsoft Entra ID as the primary identity source** (see [16 — Identity & Microsoft Graph](./16-identity-and-microsoft-graph.md)).

## System design flow (recommended)

```
                           ┌─────────────────────────┐
                           │        React App        │
                           │  Dashboard • Voice • UI  │
                           │  (MSAL for Entra login)  │
                           └────────────┬────────────┘
                                        │  REST + WebSocket (Socket.IO)
                           ┌────────────▼────────────┐
                           │      NestJS Gateway      │
                           │  authN • RBAC • routing  │
                           └────────────┬────────────┘
        ┌───────────────┬──────────────┼──────────────┬────────────────┐
        │               │              │              │                │
     Auth          Organization      Task          Meeting         AI Engine
    Service          Service        Service        Service      (Intent Router)
        │               │              │              │                │
        └───────────────┴──────────────┼──────────────┴────────────────┘
                                        │
                              Integration Layer
                        (IdentityProvider + connectors)
                                        │
   ┌───────────┬────────────┬───────────┬────────────┬──────────────┐
   │ Entra ID  │ Jira MCP   │ Outlook   │ GitHub MCP │ Google Cal /  │
   │ (Graph)   │            │ (Graph)   │            │ Teams · Slack │
   └───────────┴────────────┴───────────┴────────────┴──────────────┘
                                        │
                              PostgreSQL + Redis
                        (Prisma ORM · BullMQ queues)
```

Layering principle, the way large enterprises operate:

- **Identity** comes from an identity provider (Entra ID / Google Workspace) → users, roles, managers, departments.
- **Work items** come from project tools (Jira) → projects, tasks, sprints, blockers.
- **Calendar** comes from Outlook / Google Calendar → meetings, events.
- **Code** comes from GitHub → PRs, commits, reviews.
- **Communication** comes from Teams / Slack → presence, notifications.
- **Reasoning** comes from OpenAI → recommendations, voice.
- **Zeva sits above them** as the AI coordination layer.

## Technology stack (finalized)

### Frontend

| Concern | Choice |
|---------|--------|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| UI components | MUI |
| Styling | Tailwind CSS + Emotion (MUI engine) |
| Server state | TanStack React Query |
| Routing | React Router |
| Forms + validation | React Hook Form + Zod |
| Animation | Framer Motion |
| **Enterprise auth** | **MSAL React** (Microsoft Entra ID — OAuth 2.0 / OpenID Connect) |
| Voice / AI | OpenAI Realtime API (browser audio) |
| Lint | oxlint |

### Backend

> **Decision: NestJS modular monolith.** The product is explicitly organized into modules ([04](./04-core-features-and-modules.md)); NestJS maps one module = one bounded context, gives DI, guards, and WebSocket gateways out of the box, and can later be split into services without rewriting business logic. This supersedes the earlier "Express or NestJS" note.

| Concern | Choice | Notes |
|---------|--------|-------|
| Runtime | Node.js ≥ 20 (ESM) | Matches root `engines` |
| Language | TypeScript | Shared Zod schemas with frontend |
| Framework | **NestJS** (modular monolith) | One module per bounded context |
| ORM | **Prisma** | Type-safe, migrations ([11](./11-data-model.md)) |
| Database | **PostgreSQL** | Relational fit for org/RBAC/work graph |
| Cache / sessions | **Redis** | Sessions, JWT denylist, dashboard cache, AI/voice session state |
| Jobs / queues | **BullMQ** (on Redis) | Periodic Entra/Jira/Graph sync, digests |
| Realtime | **Socket.IO** | Notifications, live recommendations, voice signaling |
| Validation | Zod | Same schemas usable on both ends |
| Auth | JWT (access + refresh) + Entra ID (OIDC) | Zeva-issued session after Entra login |
| AI | OpenAI Realtime + Responses/Chat Completions | via the AI Engine module |
| Connectors | **MCP (Model Context Protocol)** where available (Jira, GitHub) + REST for Graph | Pluggable integration layer |

### Why PostgreSQL (not MongoDB)

Zeva's data is highly relational — organization → departments → teams → users → (manager, tasks, meetings), plus RBAC and cross-entity AI queries ("developers under Karthik with overdue Jira tasks and meetings today"). Those are natural SQL joins with transactional integrity. MongoDB fits document/flexible-JSON workloads with few relationships — not this product. **PostgreSQL + Prisma** is the choice; Redis complements it for cache/sessions/queues (it is not a replacement for Postgres).

## Backend module architecture (NestJS)

One NestJS module per bounded context. Business logic lives in services; controllers stay thin; guards enforce RBAC; gateways handle Socket.IO.

```
api/src/
├── core/
│   ├── auth/          # Entra OIDC login, JWT issue/refresh, sessions (Redis)
│   ├── rbac/          # roles, permissions, guards (resource:action + scope)
│   └── tenancy/       # organizationId scoping interceptor
├── modules/
│   ├── organization/  users/  teams/  departments/
│   ├── projects/  tasks/  meetings/  calendar/
│   ├── documents/  notifications/  analytics/
├── ai/
│   ├── intent-router/         # classifies intent → domain service
│   ├── meeting-ai/ task-ai/ calendar-ai/ notification-ai/ analytics-ai/
│   └── voice/                 # OpenAI Realtime session bridge
├── integrations/
│   ├── identity/              # IdentityProvider: Mock | MicrosoftGraph | Google
│   ├── jira/  outlook/  teams/  github/  google-calendar/  slack/
│   └── shared/                # connector interface, token store, sync engine
├── realtime/                  # Socket.IO gateway (notifications, recommendations)
├── jobs/                      # BullMQ processors (sync, digests)
└── platform/
    └── prisma/  redis/  config/  logging/  http/
```

## End-to-end flows

### Request flow (authenticated API call)

```
React (MSAL token) → NestJS Gateway
  → AuthN guard (validate Zeva JWT / Entra token)
  → Tenancy interceptor (inject organizationId)
  → RBAC guard (resource:action + scope)
  → Module service (business logic)
  → Prisma → PostgreSQL      (Redis cache checked first for hot reads)
  → response
```

### Enterprise sync flow (identity-first)

```
Admin connects Microsoft (Settings → Connect)
  → OAuth 2.0 (Entra ID) → access token stored encrypted per org
  → BullMQ enqueues "sync:identity"
  → IdentityProvider (MicrosoftGraph) pulls:
        /users → /users/{id}/manager → /users/{id}/directReports → /groups
  → map to Zeva schema (User.managerId, departmentId, entraUserId)
  → Prisma upsert into PostgreSQL
  → subsequent syncs: Jira → Outlook/Calendar → GitHub → Teams/Slack
  → dashboards + AI now have the full org graph
```

### AI/voice flow

```
Voice (browser) ↔ OpenAI Realtime  |  Text → /api/ai/chat
  → Intent Router (classify + extract entities, enforce RBAC scope)
  → domain AI service (reads org-scoped context from Postgres/Redis)
  → optional write-back via integration layer (with confirmation + audit)
  → streamed response over Socket.IO
```

## Cross-cutting concerns

### Multi-tenancy

- Every table carries `organizationId`. A NestJS interceptor derives the active org from the session and injects an org filter into every query. No query crosses tenant boundaries. Entra `tenantId` maps to a Zeva Organization ([07](./07-organization-and-permissions.md), [11](./11-data-model.md)).

### Authentication & authorization

- **Enterprise login via Microsoft Entra ID** (OIDC) using MSAL on the frontend; Zeva exchanges the Entra identity for its own JWT (access + refresh, refresh rotation, denylist in Redis).
- A local email/password path remains for non-Entra orgs and for the hackathon mock (bcrypt-hashed). The current frontend uses a temporary client-side mock until this backend exists.
- An RBAC guard checks `resource:action` + scope on every protected route. **Server is the source of truth**; the client only hides UI.

### API style

- REST for CRUD; **Socket.IO** for realtime (voice signaling, live recommendations, notifications). Conventions in [12 — API Specifications](./12-api-specifications.md).

### Security

- HTTPS everywhere; CORS restricted to known origins.
- OAuth/Graph tokens encrypted at rest, scoped per org, never logged or sent to the browser.
- Input validated with Zod at the edge; parameterized queries via Prisma.
- Secrets in environment/secret manager, never in the repo. Any network-exposed endpoint has auth by default.
- Audit log for AI-initiated and admin actions; Graph calls use least-privilege scopes ([16](./16-identity-and-microsoft-graph.md)).

### Observability

- Structured logging, request tracing, BullMQ job metrics, per-connector sync metrics, and the technical KPIs from [03](./03-product-goals-and-kpis.md) (API p95, AI latency, sync success rate).

## Deployment

| Concern | Approach |
|---------|----------|
| Repo | pnpm monorepo (`frontend`, `backend`) |
| Frontend host | Static hosting / CDN (Vite build output) |
| Backend host | Container (NestJS) behind a load balancer |
| Database | Managed PostgreSQL |
| Cache / queues | Managed Redis (Socket.IO adapter, BullMQ, sessions) |
| Local dev | Docker Compose for PostgreSQL + Redis ([17 — Setup](./17-setup-and-installation.md)) |
| Environments | dev → staging → prod |
| CI/CD | Build + lint + test per package on PR; deploy on merge |

## Environments & config

- Config via environment variables (DB URL, Redis URL, JWT secret, Entra client/tenant IDs, OpenAI key, per-connector OAuth creds). Full list in [17 — Setup & Installation](./17-setup-and-installation.md).
- `.env` files are git-ignored (already configured in root `.gitignore`).

---

*Previous: [09 — Integration Architecture](./09-integration-architecture.md) · Next: [11 — Data Model](./11-data-model.md)*
