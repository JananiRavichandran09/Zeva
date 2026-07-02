# 17 — Setup & Installation

A practical, step-by-step guide to get Zeva running locally and to sequence what you build. It is **mock-first**: you can run the whole app with **no external accounts** (no Azure tenant, no paid APIs), then swap in real integrations later without changing app code (see [09](./09-integration-architecture.md), [16](./16-identity-and-microsoft-graph.md)).

## 0. What you'll install

| Tool | Version | Why | macOS install |
|------|---------|-----|---------------|
| Node.js | ≥ 20 (LTS) | Runtime for frontend + backend | `brew install node@20` |
| pnpm | ≥ 9 | Monorepo package manager | `corepack enable && corepack prepare pnpm@latest --activate` |
| Docker Desktop | latest | Runs PostgreSQL + Redis locally | `brew install --cask docker` |
| Git | latest | Version control | `brew install git` |
| NestJS CLI | latest | Scaffold/generate backend modules | `pnpm add -g @nestjs/cli` |

Optional (only for **real** integrations, not needed for the mock path):

- An **Azure account** (Microsoft Entra ID app registration) — [16](./16-identity-and-microsoft-graph.md).
- An **OpenAI API key** — for real AI/voice ([08](./08-ai-architecture.md)).
- **Jira / GitHub** developer apps — later connectors.

> You do **not** need any of the optional accounts to run and demo the MVP. Use the mock providers.

## 1. Repository

The repo is a pnpm monorepo:

```
Meeting/
├── frontend/        # React 19 + Vite (exists)
├── backend/         # NestJS API (to be created — see step 4)
├── docs/            # this documentation
├── package.json     # workspace scripts
└── pnpm-workspace.yaml
```

Install existing workspace deps:

```bash
pnpm install
```

## 2. Local infrastructure (PostgreSQL + Redis)

Use Docker so you don't install databases by hand. Create `docker-compose.yml` at the repo root:

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: zeva
      POSTGRES_PASSWORD: zeva
      POSTGRES_DB: zeva
    ports: ["5432:5432"]
    volumes: ["zeva_pg:/var/lib/postgresql/data"]
  redis:
    image: redis:7
    ports: ["6379:6379"]
volumes:
  zeva_pg:
```

Start it:

```bash
docker compose up -d
```

## 3. Environment variables

`.env` files are git-ignored. Create them from these templates.

### `backend/.env`

```bash
# Core
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://zeva:zeva@localhost:5432/zeva?schema=public"
REDIS_URL="redis://localhost:6379"

# Auth
JWT_ACCESS_SECRET="dev-access-secret-change-me"
JWT_REFRESH_SECRET="dev-refresh-secret-change-me"

# Integrations — start in mock mode (no external accounts needed)
IDENTITY_PROVIDER=mock            # mock | microsoft | google
AI_PROVIDER=mock                  # mock | openai

# --- Fill these only when switching to real providers ---
# Microsoft Entra ID (see docs/16)
MS_TENANT_ID=
MS_CLIENT_ID=
MS_CLIENT_SECRET=
MS_REDIRECT_URI="http://localhost:5000/api/integrations/microsoft/callback"
# OpenAI (see docs/08)
OPENAI_API_KEY=
```

### `frontend/.env`

```bash
VITE_API_URL="http://localhost:5000"
# MSAL (only for real Entra login; blank keeps the mock login)
VITE_MS_CLIENT_ID=
VITE_MS_TENANT_ID=
VITE_MS_REDIRECT_URI="http://localhost:4000"
```

> The frontend dev server runs on port 4000 and proxies `/api` (see `frontend/vite.config.ts`). Point the proxy target at `PORT` above (5000) when the backend is running.

## 4. Create the backend (NestJS)

The old backend was removed. Scaffold a fresh NestJS app and the core modules that match [10 — Technical Architecture](./10-technical-architecture.md):

```bash
# from repo root
nest new backend --package-manager pnpm --skip-git

cd backend
# core + platform deps
pnpm add @nestjs/config @nestjs/jwt @nestjs/websockets @nestjs/platform-socket.io socket.io
pnpm add prisma @prisma/client zod
pnpm add bullmq ioredis
pnpm add bcryptjs
pnpm add -D @types/bcryptjs

# generate modules (one bounded context each)
nest g module core/auth && nest g module core/rbac && nest g module core/tenancy
nest g module modules/organization && nest g module modules/users
nest g module modules/teams && nest g module modules/departments
nest g module modules/projects && nest g module modules/tasks
nest g module modules/meetings && nest g module modules/calendar
nest g module modules/notifications && nest g module modules/analytics
nest g module integrations/identity && nest g module ai/intent-router
```

Add it to the workspace (root `pnpm-workspace.yaml`):

```yaml
packages:
  - "frontend"
  - "backend"
```

## 5. Database schema (Prisma)

```bash
cd backend
pnpm prisma init      # creates prisma/schema.prisma (uses DATABASE_URL)
```

Model the schema from [11 — Data Model](./11-data-model.md) (Organization, User with `entraUserId`/`managerId`/`tenantId`, Membership, Role, Permission, RolePermission, Department, Team, Project, Task, Meeting, etc.). Then:

```bash
pnpm prisma migrate dev --name init   # create + apply the first migration
pnpm prisma generate                  # generate the typed client
```

Seed baseline RBAC roles/permissions and (in mock mode) a sample org from `MockMicrosoftProvider`:

```bash
pnpm prisma db seed
```

## 6. Run the app

Two terminals (or use the root scripts):

```bash
# terminal 1 — API (once backend exists)
pnpm --filter backend start:dev      # NestJS on http://localhost:5000

# terminal 2 — web
pnpm dev:web                          # Vite on http://localhost:4000
```

Open http://localhost:4000. In mock mode you can log in immediately (temporary client-side mock), and the dashboard is populated from the mock identity provider.

## 7. Switching to real integrations (later)

Do these **in order** — identity first ([09](./09-integration-architecture.md)):

1. **Microsoft Entra ID** — register an app in Azure, add Graph permissions + admin consent, fill `MS_*` and `VITE_MS_*`, set `IDENTITY_PROVIDER=microsoft`. Details: [16](./16-identity-and-microsoft-graph.md).
2. **OpenAI** — add `OPENAI_API_KEY`, set `AI_PROVIDER=openai`.
3. **Jira** → **Outlook/Calendar** → **GitHub** → **Teams/Slack** — add each connector's OAuth app and flip its provider flag.

Because every integration sits behind a provider interface, flipping a flag is all that changes in app code.

## 8. Verification checklist

- [ ] `docker compose ps` shows postgres + redis healthy.
- [ ] `pnpm --filter backend start:dev` boots with no missing-env errors.
- [ ] `GET http://localhost:5000/api/health` returns ok.
- [ ] `pnpm prisma studio` shows seeded roles + sample org.
- [ ] Web app loads at :4000, login works, dashboard shows mock org data.
- [ ] `pnpm --filter frontend build` and backend build both pass.

## 9. Recommended build order (maps to the roadmap)

1. Infra + backend skeleton + Prisma schema (steps 2–5).
2. **Core:** auth, RBAC, tenancy → [Sprint 1](./14-roadmap.md).
3. **Identity connector (mock):** seed org from `MockMicrosoftProvider`.
4. **Daily work:** organization, users, teams, tasks, meetings, calendar, notifications → Sprint 2.
5. **AI Engine:** intent router + domain services + voice → Sprint 3.
6. **Real connectors:** Entra ID → Jira → Outlook → GitHub → Teams/Slack → Sprint 4.

---

*Previous: [16 — Identity & Microsoft Graph](./16-identity-and-microsoft-graph.md) · Back to [README index](./README.md)*
