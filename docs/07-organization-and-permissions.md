# 07 — Organization Architecture & Permissions (RBAC)

This is one of the most important designs in Zeva. Everything is **multi-tenant** and scoped to an Organization, and access is governed by **Role-Based Access Control (RBAC)** — never hardcoded roles.

## Organization Architecture

```
Organization
│
├── Departments
│      ├── Engineering
│      ├── QA
│      ├── HR
│      └── Product
│
├── Teams
│
├── Employees
│
├── Projects
│
└── Integrations
```

**Everything belongs to an Organization.** The Organization is the tenant boundary: every row in the database carries an `organizationId`, and no query ever crosses org boundaries. This is the foundation for security and data isolation (see [10 — Technical Architecture](./10-technical-architecture.md) and [11 — Data Model](./11-data-model.md)).

### Hierarchy rules

- An **Organization** has many Departments, Teams, Employees, Projects, and Integrations.
- A **Department** groups Teams and Employees by function (Engineering, QA, HR, Product).
- A **Team** is a working group inside a Department.
- An **Employee (User)** belongs to one Organization, optionally one Department, and one or more Teams.
- A **Manager relationship** links a User to their manager (self-referential `managerId`); a manager's team is derived from their **direct reports**.
- A **Project** belongs to the Organization and maps to a Team/Department; Tasks belong to Projects.
- **Integrations** are configured at the Organization level (see [09 — Integration Architecture](./09-integration-architecture.md)).

> **Source of the hierarchy: Microsoft Entra ID (or Google Workspace).** In production, the org graph — users, `managerId`, departments, direct reports — is imported from the identity provider via Microsoft Graph, not hand-built. Entra `tenantId` maps to a Zeva Organization. See [16 — Identity & Microsoft Graph](./16-identity-and-microsoft-graph.md). During development/hackathon, a mock identity provider supplies the same shape.

## Permission Architecture

> **Don't hardcode roles. Use RBAC.** Roles are data. Permissions are attached to roles. Code checks *permissions*, not role names, so new roles can be added without code changes.

### Role hierarchy

```
Admin
  ↓
Manager
  ↓
Lead
  ↓
Developer
  ↓
QA
  ↓
HR
```

Higher roles generally inherit the visibility of lower roles within their scope (org for Admin, team for Manager/Lead), but each role has an explicit permission set.

### Example permissions by role

**Developer**

- View own tasks
- View own meetings
- Create notes

**Manager**

- View team
- Assign tasks
- Review blockers

**Admin**

- Manage users
- Manage organization
- Connect integrations

## Role & Permission Matrix

Permissions are expressed as `resource:action` with a **scope** (`own`, `team`, `org`). Code checks the permission + scope, not the role label.

| Permission | Admin | Manager | Lead | Developer | QA | HR |
|------------|:-----:|:-------:|:----:|:---------:|:--:|:--:|
| `org:manage` | ✅ | — | — | — | — | — |
| `org:view_health` | ✅ (org) | — | — | — | — | ✅ (org, aggregate) |
| `integration:connect` | ✅ | — | — | — | — | — |
| `user:invite` | ✅ | — | — | — | — | — |
| `user:manage_roles` | ✅ | — | — | — | — | — |
| `department:manage` | ✅ | — | — | — | — | — |
| `team:manage` | ✅ | ✅ (team) | — | — | — | — |
| `team:view` | ✅ (org) | ✅ (team) | ✅ (team) | — | — | ✅ (org, aggregate) |
| `project:view` | ✅ (org) | ✅ (team) | ✅ (team) | ✅ (own) | ✅ (team) | — |
| `task:view` | ✅ (org) | ✅ (team) | ✅ (team) | ✅ (own) | ✅ (team) | — |
| `task:assign` | ✅ | ✅ (team) | ✅ (team) | — | — | — |
| `task:update_status` | ✅ | ✅ (team) | ✅ (team) | ✅ (own) | ✅ (team) | — |
| `meeting:view` | ✅ (org) | ✅ (team) | ✅ (team) | ✅ (own) | ✅ (own) | — |
| `note:create` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `blocker:review` | ✅ | ✅ (team) | ✅ (team) | — | — | — |
| `analytics:view` | ✅ (org) | ✅ (team) | ✅ (team) | ✅ (own) | ✅ (own) | ✅ (org, aggregate) |
| `analytics:view_content` | — | — | — | — | — | — |

Legend: ✅ = allowed (scope in parentheses) · — = not allowed.

> Note the last row: **no role** can view the *content* of individuals' messages/emails/docs through analytics. HR and managers see aggregate signals only. This is a hard privacy rule (see [15 — Risk Register](./15-risk-register.md)).

## Dashboard access by role

| Role | Default dashboard | Scope |
|------|-------------------|-------|
| Admin | Admin Dashboard | Organization |
| Manager / Lead | Manager Dashboard | Their team(s) |
| Developer / QA | Employee Dashboard | Themselves |
| HR | Manager Dashboard (aggregate) | Organization, aggregate only |

## Implementation notes

- Store `Role` and `Permission` as tables; join through `RolePermission`. A `Membership` links a User to an Organization with a Role.
- Enforce permissions in a middleware/guard layer on the API using the authenticated user's memberships, plus a matching row-level `organizationId` filter on every query.
- The frontend hides/disables actions the user lacks permission for, but the **server is the source of truth** — never trust the client for authorization.

---

*Previous: [06 — Information Architecture](./06-information-architecture.md) · Next: [08 — AI Architecture](./08-ai-architecture.md)*
