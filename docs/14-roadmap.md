# 14 — Roadmap

The roadmap sequences delivery so each phase ships something usable and de-risks the next. **Don't try to build everything at once.**

## Guiding rule

Build the **coordination surface** (org, work, dashboards) before the **coordination intelligence** (AI), and connect **external systems** last — because the AI and connectors are only valuable once the unified work model and UI exist. When you do connect external systems, **identity comes first** (Microsoft Entra ID / Google Workspace), because every task, meeting, and recommendation must attach to a known employee, manager, department, and org ([16](./16-identity-and-microsoft-graph.md)).

## Technology stack (summary)

Finalized stack (full detail + rationale in [10 — Technical Architecture](./10-technical-architecture.md)):

- **Frontend:** React 19 + TypeScript, Vite, MUI, Tailwind, TanStack Query, React Hook Form + Zod, Framer Motion, **MSAL React** (Entra login), OpenAI Realtime API.
- **Backend:** **NestJS** (modular monolith) + TypeScript, **Prisma**, JWT, **BullMQ**, **Socket.IO**.
- **Data:** **PostgreSQL** (primary) + **Redis** (cache, sessions, queues).
- **AI:** OpenAI Realtime + Responses/Chat Completions, **MCP** connectors.
- **Integrations:** Microsoft Entra ID + Microsoft Graph, Jira, Outlook, GitHub, Teams/Slack.

## Hackathon strategy (mock-first)

You likely won't have a real corporate Microsoft tenant. Build the **architecture**, run on **mocks**, and keep a clean swap to real APIs:

- Implement the `IdentityProvider` interface with `MockMicrosoftProvider` (sample org) and `MicrosoftGraphProvider` (real). Toggle with `IDENTITY_PROVIDER=mock|microsoft`.
- Same pattern for AI (`AI_PROVIDER=mock|openai`) and other connectors.
- The whole product demos end-to-end with **no external accounts**; flip flags to go live. See [09](./09-integration-architecture.md) and [17 — Setup](./17-setup-and-installation.md).

## MVP Scope

The MVP is delivered in four sprints. Sprints 1–2 are the true "minimum" product; 3–4 complete the differentiated vision.

### Sprint 1 — Foundation

- Landing Page
- Login / Register (+ forgot password)
- Organization (create, settings)
- Admin Portal (departments, teams, org health)
- User Management (invite, roles / RBAC)

*Exit criteria:* an Admin can create an org, invite users with roles, and see an Admin Dashboard. Auth + RBAC + multi-tenancy are in place ([07](./07-organization-and-permissions.md), [10](./10-technical-architecture.md)).

### Sprint 2 — Daily Work

- Dashboard (role-aware: Admin / Manager / Employee)
- Tasks
- Meetings
- Calendar (+ focus blocks, conflict flags)
- Notifications

*Exit criteria:* an employee has a real daily briefing built on Zeva's own data model, before any external sync.

### Sprint 3 — Intelligence

- Voice Assistant
- AI Coordinator (recommendations + feedback loop)
- OpenAI Realtime API integration
- Intent Router + domain AI services ([08](./08-ai-architecture.md))

*Exit criteria:* users get and act on AI recommendations; voice can navigate and act. North Star metric becomes measurable.

### Sprint 4 — Connect the enterprise (identity first)

Wire real connectors in enterprise priority order, behind the provider interfaces (swap from mock to real):

1. **Microsoft Entra ID** (identity) — users, managers, departments, org hierarchy via Microsoft Graph. **Build this first** ([16](./16-identity-and-microsoft-graph.md)).
2. **Jira** — projects, tasks, sprints (two-way).
3. **Outlook / Google Calendar** — meetings, calendar.
4. **GitHub** — PRs, commits, reviews.
5. **Teams / Slack** — presence, notifications.

Plus: connector framework + sync observability + BullMQ scheduled syncs ([09](./09-integration-architecture.md)).

*Exit criteria:* the org graph is imported from Entra ID; real tasks/meetings flow in and changes write back; sync-success KPI is tracked.

## Phase mapping

| Phase | Theme | Modules | Docs |
|-------|-------|---------|------|
| Sprint 1 (**MVP**) | Foundation | Auth, Org, Admin, Users, Teams, Departments, RBAC | 07, 10 |
| Sprint 2 (**MVP**) | Daily work | Dashboard, Tasks, Meetings, Calendar, Notifications | 04, 06 |
| Sprint 3 (**Phase 3**) | Intelligence | AI Coordinator, Voice, Intent Router | 08 |
| Sprint 4 (**Phase 4**) | Integrations (identity-first) | Entra ID → Jira → Outlook → GitHub → Teams/Slack | 09, 16 |
| Later (**Phase 2/Future**) | Depth | Documents, Analytics, GitHub/Google/Slack/Confluence | 09 |

> Documents and Analytics are tagged **[Phase 2]** in the module docs — they layer in as data volume grows, in parallel with or just after the connector work.

## Future Vision

After the MVP, Zeva evolves from *coordinating* work to *proactively managing* it — a true AI work coordinator.

- AI **schedules meetings automatically** around focus time and availability.
- AI **reallocates work** between teams based on capacity.
- AI **predicts sprint risks** before they slip.
- AI **detects burnout** from workload and meeting-load patterns.
- AI **generates project status reports** automatically.
- AI **answers executive questions**, such as:
  - "Which projects are at risk?"
  - "Who is overloaded?"
  - "Which sprint is behind schedule?"

These capabilities all build on the same foundation: a unified, permission-scoped work model fed by connectors and reasoned over by the AI services.

## Sequencing rationale

- **Foundation first (S1):** multi-tenancy and RBAC are load-bearing; retrofitting them is expensive ([11](./11-data-model.md)).
- **Value before integrations (S2):** shipping a working daily briefing on Zeva's own data proves the UX without waiting on OAuth and connector complexity.
- **AI before connectors (S3 before S4):** the AI is the differentiator; wiring it to internal data first lets us tune quality, then connectors amplify it with real enterprise data.
- **Connectors last (S4):** highest external dependency and security surface, so it benefits from a mature model and UI underneath.
- **Identity first among connectors (S4):** Entra ID/Graph is the first connector wired to real data — the org graph (users, managers, departments) is what every other connector and AI recommendation hangs off of ([16](./16-identity-and-microsoft-graph.md)).

---

*Previous: [13 — UI/UX Design System](./13-ui-ux-design-system.md) · Next: [15 — Risk Register](./15-risk-register.md)*
