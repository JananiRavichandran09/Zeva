# 12 — API Specifications

The API is the contract between the React frontend and the Zeva backend. This doc defines conventions and the endpoint surface per module. It guides the backend rebuild ([10](./10-technical-architecture.md)) and the frontend data layer (TanStack Query).

## Conventions

- **Base path:** `/api`
- **Style:** REST for CRUD; **WebSocket** for realtime (voice, live recommendations, notifications).
- **Auth:** `Authorization: Bearer <accessToken>`; refresh via `/api/auth/refresh`.
- **Tenancy:** the active organization is derived from the session; org-scoped routes may also accept an explicit `organizationId` that must match the caller's membership.
- **Validation:** all request bodies validated with Zod; invalid input → `400` with field errors.
- **Authorization:** every route checks a `resource:action` permission + scope ([07](./07-organization-and-permissions.md)); failures → `403`.
- **Errors:** consistent shape.

```json
{ "error": { "code": "FORBIDDEN", "message": "You lack task:assign for this team", "details": {} } }
```

- **Pagination:** `?page=1&pageSize=25`; responses include `{ items, page, pageSize, total }`.
- **Timestamps:** ISO 8601 UTC.
- **IDs:** opaque strings (cuid).

## Standard response envelope

```json
{ "data": { }, "meta": { } }
```

Errors use the `error` envelope above. HTTP status codes: `200/201` success, `400` validation, `401` unauthenticated, `403` unauthorized, `404` not found, `409` conflict, `429` rate limited, `5xx` server.

## Endpoint surface by module

### Authentication [MVP]

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/register` | Create user (+ optional org bootstrap) |
| POST | `/api/auth/login` | Issue access + refresh tokens |
| POST | `/api/auth/refresh` | Rotate tokens |
| POST | `/api/auth/logout` | Invalidate refresh token |
| POST | `/api/auth/forgot-password` | Issue reset token |
| POST | `/api/auth/reset-password` | Reset with token |
| GET | `/api/auth/me` | Current user + memberships |

### Organization & Admin [MVP]

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| POST | `/api/orgs` | Create organization | (bootstrap) |
| GET | `/api/orgs/:id` | Org details | `org:view_health` |
| PATCH | `/api/orgs/:id` | Update org | `org:manage` |
| GET | `/api/orgs/:id/health` | Admin dashboard metrics | `org:view_health` |
| POST | `/api/orgs/:id/invites` | Invite user | `user:invite` |
| GET | `/api/departments` / POST / PATCH / DELETE | Manage departments | `department:manage` |
| GET | `/api/teams` / POST / PATCH / DELETE | Manage teams | `team:manage` / `team:view` |

### Users & Roles [MVP]

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/api/users` | List org members | `team:view` |
| GET | `/api/users/:id` | Member profile | `team:view` / self |
| PATCH | `/api/users/:id/role` | Change role | `user:manage_roles` |
| GET | `/api/roles` | List roles + permissions | `org:manage` |

### Projects & Tasks [MVP]

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/api/projects` | List projects (scoped) | `project:view` |
| GET | `/api/projects/:id` | Project detail | `project:view` |
| GET | `/api/tasks?assignee=me&status=…` | List tasks (scoped/filtered) | `task:view` |
| POST | `/api/tasks` | Create task | `task:assign` |
| PATCH | `/api/tasks/:id` | Update task (writes back to source) | `task:update_status` |
| POST | `/api/tasks/:id/assign` | Assign task | `task:assign` |

### Meetings & Calendar [MVP]

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/api/meetings` | List meetings (scoped) | `meeting:view` |
| GET | `/api/meetings/:id` | Meeting detail + action items | `meeting:view` |
| POST | `/api/meetings/:id/action-items` | Add action item (→ task) | `note:create` |
| GET | `/api/calendar?from=&to=` | Unified calendar | `meeting:view` |
| POST | `/api/calendar/focus-blocks` | Create/protect focus time | self |

### Notifications [MVP]

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/notifications` | List for current user |
| POST | `/api/notifications/:id/read` | Mark read |
| GET/PUT | `/api/notifications/preferences` | Get/update preferences |

### Documents [Phase 2]

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/api/documents?query=` | Search doc metadata | `project:view` |
| GET | `/api/documents/:id` | Metadata + source link | `project:view` |

### Analytics [Phase 2]

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/api/analytics/org` | Admin dashboard data | `org:view_health` |
| GET | `/api/analytics/team/:teamId` | Manager dashboard data | `analytics:view` (team) |
| GET | `/api/analytics/me` | Employee metrics | `analytics:view` (own) |

### AI Coordinator & Voice [Phase 3]

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/ai/recommendations` | List active recommendations |
| POST | `/api/ai/recommendations/:id/act` | accept / snooze / dismiss |
| POST | `/api/ai/chat` | Text intent → routed response |
| WS | `/api/ai/voice` | Realtime voice session (OpenAI Realtime API) |
| WS | `/api/realtime` | Live notifications + recommendation pushes |

### Integrations [Phase 4]

| Method | Path | Purpose | Permission |
|--------|------|---------|------------|
| GET | `/api/integrations` | List connectors + status | `org:view_health` |
| POST | `/api/integrations/:provider/connect` | Start OAuth | `integration:connect` |
| POST | `/api/integrations/:provider/disconnect` | Revoke + purge | `integration:connect` |
| POST | `/api/integrations/:provider/sync` | Trigger manual sync | `integration:connect` |
| POST | `/api/webhooks/:provider` | Inbound provider webhook | (signature-verified) |

## Realtime channels

| Channel | Payload | Used by |
|---------|---------|---------|
| `voice` | audio in/out, transcripts | Voice Assistant |
| `recommendations` | new/updated Recommendation | Dashboard, Coordinator |
| `notifications` | new Notification | TopBar, Notifications page |

## Frontend integration notes

- Use **TanStack Query** keys per resource (`['tasks', filters]`) with optimistic updates for status changes.
- Mutations that write back to source systems should reflect eventual consistency (show pending state until the connector confirms).
- Auth tokens stored per app convention; 401 triggers a refresh-then-retry flow.

---

*Previous: [11 — Data Model](./11-data-model.md) · Next: [13 — UI/UX Design System](./13-ui-ux-design-system.md)*
