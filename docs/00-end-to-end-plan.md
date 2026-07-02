# Zeva — End-to-End Implementation Plan

Everything you need to go from zero to a working product, in order. Each step tells you **what to do, what commands to run, and where to find the design details** in the architecture docs.

---

## Your machine — what's installed vs what's needed

| Tool | Required | Your status | Install command (if missing) |
|------|----------|-------------|------------------------------|
| Node.js | ≥ 20 | ✅ v24.12.0 | — |
| pnpm | ≥ 9 | ✅ v11.7.0 | — |
| Docker Desktop | latest | ✅ v29.6.1 (need to open app) | — |
| Git | any | ✅ v2.52.0 | — |
| Homebrew | any | ✅ v5.0.9 | — |
| NestJS CLI | any | ✅ v11 (workspace) | `pnpm exec nest` |
| PostgreSQL client (optional, for debugging) | — | ❌ | `brew install libpq && brew link --force libpq` |
| Redis CLI (optional, for debugging) | — | ❌ | `brew install redis` |

> PostgreSQL and Redis run in **Docker containers** — you don't install them on bare metal. The client tools (`psql`, `redis-cli`) are optional for debugging only.

---

## End-to-end build sequence

```
Phase 0 — Environment setup                    ← YOU ARE HERE
Phase 1 — Backend skeleton (NestJS + Prisma)
Phase 2 — Auth + RBAC + Tenancy (Sprint 1)
Phase 3 — Identity connector (mock provider)
Phase 4 — Organization, Users, Teams, Departments
Phase 5 — Dashboard, Tasks, Meetings, Calendar (Sprint 2)
Phase 6 — Connect frontend to real API
Phase 7 — AI Engine + Voice (Sprint 3)
Phase 8 — Real enterprise connectors (Sprint 4)
```

---

## Phase 0 — Environment setup (do now)

### 0.1 Start Docker Desktop

Open Docker Desktop (click the app). Wait until it says "Running". Then:

```bash
cd ~/Meeting
docker compose up -d
```

This starts PostgreSQL (port 5432) and Redis (port 6379).

Verify:

```bash
docker compose ps
# Both containers should show "healthy" / "running"
```

### 0.2 Add pnpm global bin to your PATH (one-time fix)

Your pnpm global bin directory isn't in PATH. Run this once:

```bash
pnpm setup
```

Then restart your terminal (or `source ~/.zshrc`). This lets globally installed tools work from anywhere.

### 0.3 Verify the workspace

```bash
cd ~/Meeting
pnpm install           # should succeed (frontend + root deps)
pnpm dev:web           # should start Vite on http://localhost:4000
```

Login works (mock auth). Ctrl+C to stop.

---

## Phase 1 — Backend skeleton

### 1.1 Scaffold NestJS

```bash
cd ~/Meeting
pnpm exec nest new backend --package-manager pnpm --skip-git --strict
```

### 1.2 Add backend to the monorepo

Edit `pnpm-workspace.yaml`:

```yaml
packages:
  - "frontend"
  - "backend"
```

### 1.3 Install core backend dependencies

```bash
cd backend

# NestJS platform
pnpm add @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt
pnpm add @nestjs/websockets @nestjs/platform-socket.io socket.io

# Database
pnpm add prisma @prisma/client

# Queues
pnpm add bullmq ioredis @nestjs/bullmq

# Validation
pnpm add zod class-validator class-transformer

# Auth
pnpm add bcryptjs
pnpm add -D @types/bcryptjs @types/passport-jwt

# Dev
pnpm add -D @types/node
```

### 1.4 Initialize Prisma

```bash
cd backend
pnpm prisma init
```

This creates `prisma/schema.prisma`. Set DATABASE_URL in `backend/.env`:

```env
DATABASE_URL="postgresql://zeva:zeva@localhost:5432/zeva?schema=public"
```

### 1.5 Create the full `.env` file

```bash
# backend/.env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://zeva:zeva@localhost:5432/zeva?schema=public"
REDIS_URL="redis://localhost:6379"

JWT_ACCESS_SECRET="dev-access-secret-change-me"
JWT_REFRESH_SECRET="dev-refresh-secret-change-me"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

IDENTITY_PROVIDER=mock
AI_PROVIDER=mock
```

### 1.6 Add root scripts

Update root `package.json`:

```json
{
  "scripts": {
    "dev:web": "pnpm --filter frontend dev",
    "dev:api": "pnpm --filter backend start:dev",
    "build:web": "pnpm --filter frontend build",
    "build:api": "pnpm --filter backend build",
    "lint:web": "pnpm --filter frontend lint",
    "db:migrate": "pnpm --filter backend prisma migrate dev",
    "db:generate": "pnpm --filter backend prisma generate",
    "db:seed": "pnpm --filter backend prisma db seed",
    "db:studio": "pnpm --filter backend prisma studio",
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down"
  }
}
```

> Design reference: [10 — Technical Architecture](./10-technical-architecture.md)

---

## Phase 2 — Auth + RBAC + Tenancy (Sprint 1)

### 2.1 Generate NestJS modules

```bash
cd backend
pnpm exec nest g module core/auth
pnpm exec nest g module core/rbac
pnpm exec nest g module core/tenancy
pnpm exec nest g module modules/organization
pnpm exec nest g module modules/users
pnpm exec nest g module modules/teams
pnpm exec nest g module modules/departments
```

### 2.2 Write the Prisma schema

Model from [11 — Data Model](./11-data-model.md):

```prisma
// Organization, User (with entraUserId, managerId), Membership,
// Role, Permission, RolePermission, Department, Team, TeamMember
```

Run:

```bash
pnpm prisma migrate dev --name init
pnpm prisma generate
```

### 2.3 Implement in this order

1. **PrismaModule** (shared DB access) + **RedisModule** (shared ioredis).
2. **TenancyModule** — interceptor that extracts `organizationId` from the JWT and injects it into every request.
3. **AuthModule** — register, login (email+password), JWT issue/refresh, `/auth/me`.
4. **RbacModule** — `@RequirePermission('task:assign', 'team')` guard using data from Role/Permission tables.
5. **Seed** — create default roles (admin, manager, lead, developer, qa, hr) and their permissions from the matrix in [07 — RBAC](./07-organization-and-permissions.md).

### 2.4 Test

```bash
# Start the API
pnpm dev:api

# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Janani","email":"jr@gmail.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jr@gmail.com","password":"test123"}'
```

> Design reference: [07](./07-organization-and-permissions.md), [11](./11-data-model.md), [12 — API Specs](./12-api-specifications.md)

---

## Phase 3 — Identity connector (mock provider)

### 3.1 Build the IdentityProvider interface

```bash
pnpm exec nest g module integrations/identity
pnpm exec nest g service integrations/identity
```

```ts
// src/integrations/identity/identity-provider.interface.ts
export interface IdentityProvider {
  syncUsers(): Promise<SyncedUser[]>
  syncManagers(): Promise<ManagerMapping[]>
  syncDepartments(): Promise<SyncedDepartment[]>
}
```

### 3.2 MockMicrosoftProvider

Returns a realistic sample org: CEO → Engineering Manager (Karthik) → [Janani, Rahul, Priya], QA dept, HR dept. Seed this into the DB on first run.

### 3.3 MicrosoftGraphProvider (stub)

Will call Microsoft Graph when `IDENTITY_PROVIDER=microsoft`. Leave as a skeleton for now.

### 3.4 Seed the mock org

```bash
pnpm db:seed    # populates org, departments, teams, users, managers from mock
pnpm db:studio  # visually verify at http://localhost:5555
```

> Design reference: [16 — Identity & Microsoft Graph](./16-identity-and-microsoft-graph.md), [09](./09-integration-architecture.md)

---

## Phase 4 — Organization, Users, Teams, Departments

### 4.1 CRUD endpoints

```bash
pnpm exec nest g controller modules/organization
pnpm exec nest g service modules/organization
# repeat for users, teams, departments
```

Build the REST endpoints from [12 — API Specs](./12-api-specifications.md):

- `GET /api/orgs/:id` (org details)
- `GET /api/users` (list org members)
- `GET /api/teams` / departments
- `POST /api/orgs/:id/invites`
- etc.

### 4.2 Admin dashboard endpoint

```
GET /api/analytics/org → employees count, departments, integrations, projects
```

> Design reference: [04](./04-core-features-and-modules.md) (Admin Dashboard), [12](./12-api-specifications.md)

---

## Phase 5 — Dashboard, Tasks, Meetings, Calendar (Sprint 2)

### 5.1 Modules

```bash
pnpm exec nest g module modules/projects
pnpm exec nest g module modules/tasks
pnpm exec nest g module modules/meetings
pnpm exec nest g module modules/calendar
pnpm exec nest g module modules/notifications
```

### 5.2 Implement

- Tasks CRUD (title, description, assignee, status, priority, dueDate).
- Meetings CRUD (title, start, end, agenda, notes, action items → tasks).
- Calendar (unified view, focus blocks, conflict detection).
- Notifications (in-app, mark read, preferences).

### 5.3 Wire Socket.IO for real-time notifications

```bash
pnpm exec nest g gateway realtime/notifications
```

> Design reference: [04](./04-core-features-and-modules.md), [12](./12-api-specifications.md)

---

## Phase 6 — Connect frontend to real API

### 6.1 Replace the mock AuthProvider

Switch `frontend/src/app/AuthProvider.tsx` from the client-side mock back to real `fetch` calls against `localhost:5000/api/auth/*`.

### 6.2 Wire TanStack Query hooks

Create hooks per resource:

```ts
// e.g. src/hooks/useTasks.ts
export function useTasks() {
  return useQuery({ queryKey: ['tasks'], queryFn: () => api.get('/api/tasks') })
}
```

### 6.3 Wire Socket.IO client

```bash
cd frontend && pnpm add socket.io-client
```

Connect for notifications and live dashboard updates.

### 6.4 Test end-to-end

- Register → see org seeded from mock identity provider.
- Dashboard shows meetings, tasks, calendar.
- Notifications arrive in real-time.

---

## Phase 7 — AI Engine + Voice (Sprint 3)

### 7.1 Modules

```bash
pnpm exec nest g module ai/intent-router
pnpm exec nest g module ai/voice
# domain services: meeting-ai, task-ai, calendar-ai, notification-ai, analytics-ai
```

### 7.2 Implement

- **Intent Router** — classifies text/voice input → domain + entities.
- **Domain AI services** — read scoped context from Prisma, generate responses via OpenAI Responses API.
- **Voice gateway** — bridge browser audio ↔ OpenAI Realtime API via WebSocket.
- **Recommendations** — AI generates, user accepts/snoozes/dismisses (feedback loop).

### 7.3 Mock vs real AI

- `AI_PROVIDER=mock` → canned responses, no API key needed.
- `AI_PROVIDER=openai` → real OpenAI calls (needs `OPENAI_API_KEY`).

> Design reference: [08 — AI Architecture](./08-ai-architecture.md)

---

## Phase 8 — Real enterprise connectors (Sprint 4)

Integration order (identity first — see [09](./09-integration-architecture.md)):

1. **Microsoft Entra ID** → real org sync (needs Azure app registration).
2. **Jira** → projects + tasks two-way sync (MCP or REST).
3. **Outlook** → meetings + calendar via Microsoft Graph.
4. **GitHub** → PRs + reviews (MCP).
5. **Teams / Slack** → presence + notifications.

Each uses BullMQ for scheduled syncs and the same provider-interface pattern.

> Design reference: [09](./09-integration-architecture.md), [16](./16-identity-and-microsoft-graph.md)

---

## Complete technology list (what gets installed across all phases)

### Already on your machine

| Tool | Version |
|------|---------|
| Node.js | 24.12.0 |
| pnpm | 11.7.0 |
| Docker Desktop | 29.6.1 |
| Git | 2.52.0 |
| Homebrew | 5.0.9 |

### Installed now (workspace)

| Tool | Version |
|------|---------|
| @nestjs/cli | 11.0.23 (workspace devDep) |

### Docker containers (started when Docker Desktop opens)

| Container | Image | Port |
|-----------|-------|------|
| PostgreSQL | postgres:16 | 5432 |
| Redis | redis:7-alpine | 6379 |

### Backend npm packages (installed in Phase 1)

| Package | Purpose |
|---------|---------|
| @nestjs/core, @nestjs/common, @nestjs/platform-express | NestJS framework |
| @nestjs/config | Environment config |
| @nestjs/jwt, @nestjs/passport, passport, passport-jwt | Auth |
| @nestjs/websockets, @nestjs/platform-socket.io, socket.io | Realtime |
| prisma, @prisma/client | ORM + DB |
| bullmq, ioredis, @nestjs/bullmq | Job queues |
| zod | Validation |
| bcryptjs | Password hashing |

### Frontend npm packages (already installed)

| Package | Purpose |
|---------|---------|
| react, react-dom | UI framework |
| vite, @vitejs/plugin-react | Build |
| @mui/material, @mui/icons-material | Components |
| tailwindcss, @tailwindcss/vite | Styling |
| @tanstack/react-query | Server state |
| react-router-dom | Routing |
| react-hook-form, @hookform/resolvers, zod | Forms |
| framer-motion | Animation |
| lucide-react | Icons |

### Frontend packages to add later

| Package | When | Purpose |
|---------|------|---------|
| @azure/msal-browser, @azure/msal-react | Phase 8 (real Entra) | Microsoft login |
| socket.io-client | Phase 6 | Realtime |
| openai | Phase 7 (real AI) | OpenAI SDK |

### Optional local tools

| Tool | Install | Purpose |
|------|---------|---------|
| psql | `brew install libpq && brew link --force libpq` | Query Postgres directly |
| redis-cli | `brew install redis` | Debug Redis |

---

## Quick-start checklist (what to do RIGHT NOW)

- [ ] Open Docker Desktop (let it start)
- [ ] Run `docker compose up -d` (starts Postgres + Redis)
- [ ] Run `pnpm exec nest new backend --package-manager pnpm --skip-git --strict`
- [ ] Add `"backend"` to `pnpm-workspace.yaml`
- [ ] Install backend deps (Phase 1.3 commands above)
- [ ] Run `pnpm prisma init` in backend
- [ ] Create `backend/.env` (Phase 1.5 above)
- [ ] Write initial Prisma schema from [11 — Data Model](./11-data-model.md)
- [ ] Run `pnpm prisma migrate dev --name init`
- [ ] Start coding Auth module (Phase 2)

---

## File-by-file what you'll build (backend tree)

```
backend/
├── prisma/
│   ├── schema.prisma         # full data model
│   ├── seed.ts               # mock org + RBAC roles
│   └── migrations/
├── src/
│   ├── main.ts
│   ├── app.module.ts         # imports all feature modules
│   ├── core/
│   │   ├── auth/             # auth.module, auth.controller, auth.service, jwt.strategy
│   │   ├── rbac/             # rbac.module, rbac.guard, permissions.decorator
│   │   └── tenancy/          # tenancy.module, tenancy.interceptor
│   ├── modules/
│   │   ├── organization/     # org.module, org.controller, org.service
│   │   ├── users/
│   │   ├── teams/
│   │   ├── departments/
│   │   ├── projects/
│   │   ├── tasks/
│   │   ├── meetings/
│   │   ├── calendar/
│   │   ├── notifications/
│   │   └── analytics/
│   ├── integrations/
│   │   ├── identity/         # interface + mock + microsoft-graph providers
│   │   ├── jira/
│   │   ├── outlook/
│   │   └── github/
│   ├── ai/
│   │   ├── intent-router/
│   │   ├── voice/
│   │   └── domain/           # meeting-ai, task-ai, calendar-ai, etc.
│   ├── realtime/
│   │   └── notifications.gateway.ts
│   ├── jobs/
│   │   └── sync.processor.ts
│   └── platform/
│       ├── prisma/           # prisma.module, prisma.service
│       ├── redis/            # redis.module, redis.service
│       └── config/           # env validation
├── .env
├── package.json
└── tsconfig.json
```

---

## Timeline estimate

| Phase | Effort | Delivers |
|-------|--------|----------|
| 0 — Env setup | 30 min | ✅ Done (Postgres, Redis, NestJS CLI ready) |
| 1 — Backend skeleton | 1–2 hours | Empty NestJS app + Prisma + all deps |
| 2 — Auth + RBAC | 1–2 days | Working register/login, role guards, tenant scoping |
| 3 — Identity mock | 0.5 day | Realistic org seeded, dashboards have data |
| 4 — Org/Users/Teams CRUD | 1 day | Admin can manage the org |
| 5 — Tasks/Meetings/Calendar | 2–3 days | Employee daily briefing works |
| 6 — Frontend wiring | 1–2 days | Real API calls, real-time notifs |
| 7 — AI + Voice | 2–3 days | Recommendations + voice commands |
| 8 — Enterprise connectors | 3–5 days | Live Entra/Jira/Outlook sync |

**Total to full demo: ~2–3 weeks** (one person, focused). For a hackathon: Phases 0–5 can be done in a **weekend** (you'd demo on mock data with the real architecture).

---

*This plan maps directly to the roadmap in [14 — Roadmap](./14-roadmap.md). Architecture details in docs 07–12, identity in [16](./16-identity-and-microsoft-graph.md), full setup reference in [17](./17-setup-and-installation.md).*
