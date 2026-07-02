# 04 — Core Features, Modules & Product Requirements

Think in **modules, not pages**. Each module owns its own business logic, data, and API surface. Pages compose modules.

## Product Modules

```
Authentication
Organization
Users
Teams
Departments
Projects
Meetings
Calendar
Tasks
Documents
Analytics
Notifications
AI Coordinator
Voice Assistant
Settings
Admin
```

Each module owns its own business logic.

## Module responsibilities

| Module | Owns | Key entities | MVP? |
|--------|------|--------------|------|
| **Authentication** | Sign up, sign in, sessions, password reset | User, Session | [MVP] |
| **Organization** | Org creation, settings, org-level config | Organization | [MVP] |
| **Users** | Employee profiles, roles, membership | User, Membership | [MVP] |
| **Teams** | Team grouping within departments | Team | [MVP] |
| **Departments** | Departmental grouping (Eng, QA, HR, Product) | Department | [MVP] |
| **Projects** | Projects and their metadata (often synced from Jira) | Project | [MVP] |
| **Meetings** | Meeting records, agendas, notes, action items | Meeting, ActionItem | [MVP] |
| **Calendar** | Unified calendar view, focus blocks, conflicts | CalendarEvent | [MVP] |
| **Tasks** | Tasks/issues, assignment, status (often synced from Jira) | Task | [MVP] |
| **Documents** | Document metadata + links (often from Confluence) | Document | [Phase 2] |
| **Analytics** | Dashboards, workload, sprint, focus metrics | (derived) | [Phase 2] |
| **Notifications** | In-app + digest notifications, preferences | Notification | [MVP] |
| **AI Coordinator** | Recommendations, summaries, intent routing | Recommendation | [Phase 3] |
| **Voice Assistant** | Voice interaction via OpenAI Realtime API | (session) | [Phase 3] |
| **Settings** | User + org preferences, theme, connectors config | Preference | [MVP] |
| **Admin** | Org administration, licenses, member management | (cross-module) | [MVP] |

> Module → frontend page mapping is in [06 — Information Architecture](./06-information-architecture.md). Data ownership per module is in [09 — Integration Architecture](./09-integration-architecture.md) and [11 — Data Model](./11-data-model.md).

---

## Core Features (functional requirements / PRD)

Each feature is written as a capability with acceptance-style intent. Grouped by module.

### Authentication [MVP]

- Users can register with name, email, password.
- Users can log in and receive a session (JWT).
- Users can request a password reset via email token.
- Sessions expire and refresh according to policy.

### Organization & Admin [MVP]

- A registering user can create an Organization and becomes its Admin.
- Admin can create Departments and Teams.
- Admin can invite users by email; invitees join the org with an assigned role.
- Admin can view org health: employees, departments, integrations, projects, licenses.
- Admin can connect/disconnect integrations.

### Users, Teams, Departments [MVP]

- Every user belongs to exactly one Organization.
- A user can belong to one Department and one or more Teams.
- Each user has a role (see [07 — RBAC](./07-organization-and-permissions.md)).

### Projects, Tasks [MVP]

- Projects group tasks and map to a team/department.
- Tasks have title, description, assignee, status, priority, due date, and (optionally) a source system reference (e.g., Jira key).
- Users can view *their* tasks; managers can view *team* tasks.
- Task status changes sync back to the source system where applicable.

### Meetings & Calendar [MVP]

- Users see a unified calendar aggregating meetings from connected sources.
- Meetings carry an agenda, notes, and **action items** that become tasks.
- Zeva flags **conflicts** (overlapping meetings) and suggests **focus blocks**.

### Notifications [MVP]

- Users receive in-app notifications for assignments, mentions, blockers, and AI recommendations.
- Users control notification preferences per category.
- Notifications are designed to *reduce* noise (batched digests over constant pings).

### Documents [Phase 2]

- Zeva stores document **metadata and links** (source, title, owner, updated-at), not full content, for Confluence and similar.
- Users can search and open documents from within Zeva.

### Analytics [Phase 2]

- Role-scoped dashboards for org health, team coordination, and personal briefing.
- Aggregate, privacy-respecting workload and focus metrics.

### AI Coordinator [Phase 3]

- AI produces daily briefings and next-best-action recommendations.
- AI prepares meeting context (related tasks, docs, prior notes).
- AI detects blockers and sprint risk and suggests rebalancing.
- Users can accept, snooze, or dismiss recommendations (feedback loop).

### Voice Assistant [Phase 3]

- Users can navigate and act by voice ("what's on my plate today?", "reschedule my 3pm").
- Voice runs on the OpenAI Realtime API; see [08 — AI Architecture](./08-ai-architecture.md).

---

## Dashboard Strategy

Don't build one dashboard. Build **three**, one per audience.

### Admin Dashboard — *organization health*

```
Employees · Departments · Integrations · Projects · Licenses
```

Answers: *Is the org set up correctly and healthy?*

### Manager Dashboard — *team coordination*

```
Sprint · Capacity · Blockers · Late Tasks · Recommendations
```

Answers: *Is my team on track, and where do I need to intervene?*

### Employee Dashboard — *daily briefing*

```
Meetings · Tasks · Calendar · AI · Voice · Focus Time
```

Answers: *What should I do today, and what do I need to know?*

> Which dashboard a user sees is determined by their role (see [07 — RBAC](./07-organization-and-permissions.md)).

---

*Previous: [03 — Product Goals & KPIs](./03-product-goals-and-kpis.md) · Next: [05 — User Journeys](./05-user-journeys.md)*
