# 06 — Information Architecture

Information Architecture (IA) defines **navigation and module hierarchy** — how a user moves through Zeva and where every screen lives.

## Top-level flow

Everything follows this flow, from first visit to ongoing use:

```
Landing
   ↓
Register
   ↓
Create Organization
   ↓
Invite Team
   ↓
Connect Integrations
   ↓
Dashboard
   ↓
Daily Work
   ↓
AI
   ↓
Reports
```

- **Landing → Connect Integrations** is the one-time onboarding (see [05 — User Journeys](./05-user-journeys.md)).
- **Dashboard → Reports** is the recurring daily loop.

## Navigation model

Zeva uses a persistent **left sidebar** for module navigation and a **top bar** for global search, notifications, voice, and profile. This matches the existing frontend shell (`AppLayout`, `Sidebar`, `TopBar`).

```
┌──────────────────────────────────────────────┐
│ TopBar: search · voice · notifications · me    │
├──────────┬───────────────────────────────────┤
│ Sidebar  │                                     │
│  Dashboard│         Page content               │
│  Coordinator                                    │
│  Chat AI  │   (module composed from features)  │
│  Calendar │                                     │
│  Meetings │                                     │
│  Tasks    │                                     │
│  Projects │                                     │
│  Team     │                                     │
│  Documents│                                     │
│  Analytics│                                     │
│  Notifs   │                                     │
│  Settings │                                     │
└──────────┴───────────────────────────────────┘
```

## Route → Module map

These are the **actual frontend routes** (from `frontend/src/App.tsx`) mapped to their modules.

### Public routes

| Route | Page | Module |
|-------|------|--------|
| `/landing` | LandingPage | Marketing |
| `/register` | RegisterPage | Authentication |
| `/login` | LoginPage | Authentication |
| `/forgot-password` | ForgotPasswordPage | Authentication |

### Protected app routes (inside `AppLayout` + `ProtectedRoute`)

| Route | Page | Module | MVP? |
|-------|------|--------|------|
| `/` (index) | DashboardPage | Dashboard (role-aware) | [MVP] |
| `/coordinator` | CoordinatorPage | AI Coordinator | [Phase 3] |
| `/chat-ai` | ChatAIPage | AI Coordinator (chat) | [Phase 3] |
| `/calendar` | CalendarPage | Calendar | [MVP] |
| `/meetings` | MeetingsPage | Meetings | [MVP] |
| `/tasks` | TasksPage | Tasks | [MVP] |
| `/projects` | ProjectsPage | Projects | [MVP] |
| `/team` | TeamPage | Teams / Users | [MVP] |
| `/documents` | DocumentsPage | Documents | [Phase 2] |
| `/analytics` | AnalyticsPage | Analytics | [Phase 2] |
| `/notifications` | NotificationsPage | Notifications | [MVP] |
| `/settings` | SettingsPage | Settings | [MVP] |
| `/profile` | ProfilePage | Users | [MVP] |

> Catch-all redirects unknown routes to `/landing`. Admin-only screens (Organization setup, Departments, Integrations, Licenses) live under Settings/Admin and are gated by role (see [07 — RBAC](./07-organization-and-permissions.md)).

## Module hierarchy

```
App
├── Public
│   ├── Landing
│   └── Auth (Register · Login · Forgot Password)
└── Workspace (authenticated, org-scoped)
    ├── Dashboard (role-aware: Admin | Manager | Employee)
    ├── Daily Work
    │   ├── Calendar
    │   ├── Meetings
    │   ├── Tasks
    │   └── Projects
    ├── Knowledge
    │   └── Documents
    ├── People
    │   ├── Team
    │   └── Profile
    ├── AI
    │   ├── Coordinator
    │   ├── Chat AI
    │   └── Voice Assistant (global, via TopBar)
    ├── Insights
    │   └── Analytics
    ├── Notifications
    └── Admin & Settings
        ├── Settings (user + org)
        ├── Organization / Departments / Teams
        ├── Integrations
        └── Licenses
```

## Navigation principles

- **Role-aware, not role-forked.** The same routes exist for everyone; content and available actions adapt to role. The Dashboard renders Admin, Manager, or Employee views based on role.
- **AI is ambient.** The Voice Assistant is reachable from the TopBar on every screen; the Coordinator is also a destination for deeper interaction.
- **Progressive disclosure.** Admin/org configuration is tucked under Settings/Admin so daily users aren't overwhelmed.
- **Empty states guide onboarding.** Before integrations are connected, modules show guided empty states pointing to the next onboarding step.

---

*Previous: [05 — User Journeys](./05-user-journeys.md) · Next: [07 — Organization Architecture & RBAC](./07-organization-and-permissions.md)*
