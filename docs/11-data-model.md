# 11 — Data Model

The data model realizes the [organization architecture](./07-organization-and-permissions.md) and [module design](./04-core-features-and-modules.md) in a relational, multi-tenant schema. Target database: **PostgreSQL** via **Prisma**.

## Design principles

- **Organization is the tenant boundary.** Nearly every entity carries `organizationId`; queries are always org-scoped.
- **RBAC is data, not code.** Roles and permissions are tables joined to memberships.
- **Coordinate vs. reference.** Fully-owned entities (Task, Meeting, Project, PR) store rich data; referenced entities (Email, Document) store metadata + a source link (see [09 — Data Ownership](./09-integration-architecture.md)).
- **Source traceability.** Synced entities keep `sourceSystem` + `sourceId` so Zeva can reconcile and write back.
- **Soft delete + audit** on coordination entities to support reconciliation and the audit log.

## Entity overview (ERD)

```
Organization 1─* Department 1─* Team 1─* Membership *─1 User
     │                                   │
     ├─* Membership *─1 Role *─* Permission (via RolePermission)
     ├─* Project 1─* Task *─1 User (assignee)
     ├─* Meeting 1─* ActionItem (─> Task)
     ├─* CalendarEvent *─1 User
     ├─* Document (metadata + link)
     ├─* Notification *─1 User
     ├─* Recommendation *─1 User
     └─* Integration 1─* SyncLog
```

## Core entities

### Tenancy & identity

| Entity | Key fields | Notes |
|--------|-----------|-------|
| **Organization** | id, name, slug, **tenantId** (Entra tenant), **domain**, createdAt | Tenant root; `tenantId` maps an Entra/Workspace tenant to the org |
| **User** | id, **entraUserId?** (unique), name, email (unique), passwordHash?, jobTitle?, department?, **managerId?**, photoUrl, status, resetToken?, resetExpires? | Global identity; synced from Entra ID or created locally; `managerId` is self-referential |
| **Membership** | id, userId, organizationId, roleId, departmentId?, status | Links a user to an org with a role |
| **Department** | id, organizationId, name (Engineering/QA/HR/Product) | Often sourced from Entra ID groups / `department` field |
| **Team** | id, organizationId, departmentId, managerId?, name | Manager's team ≈ their direct reports |
| **TeamMember** | id, teamId, userId | Many-to-many user↔team |

> **Identity fields (`entraUserId`, `managerId`, `tenantId`, `jobTitle`, `department`, `photoUrl`) are populated by the identity provider** (Microsoft Entra ID via Graph, or the mock provider in dev). `passwordHash` is optional — only used for local (non-Entra) accounts. `entraUserId` is the stable external key for idempotent upserts. See [16 — Identity & Microsoft Graph](./16-identity-and-microsoft-graph.md).

### RBAC

| Entity | Key fields | Notes |
|--------|-----------|-------|
| **Role** | id, key (admin/manager/lead/developer/qa/hr), name | Data-driven roles |
| **Permission** | id, key (`resource:action`), description | e.g. `task:assign` |
| **RolePermission** | id, roleId, permissionId, scope (own/team/org) | Matrix from [07](./07-organization-and-permissions.md) |

### Work

| Entity | Key fields | Notes |
|--------|-----------|-------|
| **Project** | id, organizationId, teamId?, name, key, status, sourceSystem?, sourceId? | Often from Jira |
| **Task** | id, organizationId, projectId, title, description, assigneeId?, status, priority, dueDate?, sourceSystem?, sourceId? | Two-way sync |
| **Meeting** | id, organizationId, title, startsAt, endsAt, location?, agenda?, notes?, sourceSystem?, sourceId? | From Outlook/Teams |
| **ActionItem** | id, meetingId, description, taskId?, ownerId? | Converts to Task |
| **CalendarEvent** | id, organizationId, userId, title, startsAt, endsAt, type (meeting/focus/other), sourceSystem?, sourceId? | Unified calendar + focus blocks |
| **Document** | id, organizationId, title, url, owner?, sourceSystem, sourceId, updatedAt | Metadata + link only |

### Engagement & AI

| Entity | Key fields | Notes |
|--------|-----------|-------|
| **Notification** | id, organizationId, userId, type, title, body, readAt?, createdAt | In-app + digest |
| **NotificationPreference** | id, userId, category, channel, enabled | Per-user controls |
| **Recommendation** | id, organizationId, userId, kind, payload(json), status (shown/accepted/snoozed/dismissed), createdAt | AI feedback loop; feeds North Star metric |

### Integrations

| Entity | Key fields | Notes |
|--------|-----------|-------|
| **Integration** | id, organizationId, provider (jira/outlook/…), status, tokensEncrypted, connectedById, lastSyncAt | One per provider per org |
| **SyncLog** | id, integrationId, startedAt, finishedAt, status, itemsSynced, error? | Feeds sync-success KPI |
| **AuditLog** | id, organizationId, actorUserId?, action, target, source (user/ai/system), createdAt | AI + admin actions |

## Illustrative Prisma schema (excerpt)

> This is a documentation sketch to guide the backend rebuild ([10](./10-technical-architecture.md)), not the final migration. The previous single-`User` schema is intentionally replaced.

```prisma
model Organization {
  id          String       @id @default(cuid())
  name        String
  slug        String       @unique
  tenantId    String?      @unique  // Entra ID / Workspace tenant
  domain      String?
  createdAt   DateTime     @default(now())
  memberships Membership[]
  departments Department[]
  teams       Team[]
  projects    Project[]
  meetings    Meeting[]
  integrations Integration[]
}

model User {
  id           String       @id @default(cuid())
  entraUserId  String?      @unique  // stable external key from Entra ID
  name         String
  email        String       @unique
  passwordHash String?               // only for local (non-Entra) accounts
  jobTitle     String?
  department   String?
  photoUrl     String?
  status       String       @default("active")
  managerId    String?               // self-referential reporting line
  manager      User?        @relation("Reports", fields: [managerId], references: [id])
  reports      User[]       @relation("Reports")
  resetToken   String?      @unique
  resetExpires DateTime?
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
  memberships  Membership[]

  @@index([managerId])
}

model Membership {
  id             String       @id @default(cuid())
  userId         String
  organizationId String
  roleId         String
  departmentId   String?
  status         String       @default("active")
  user           User         @relation(fields: [userId], references: [id])
  organization   Organization @relation(fields: [organizationId], references: [id])
  role           Role         @relation(fields: [roleId], references: [id])

  @@unique([userId, organizationId])
  @@index([organizationId])
}

model Role {
  id          String           @id @default(cuid())
  key         String           @unique // admin | manager | lead | developer | qa | hr
  name        String
  memberships Membership[]
  permissions RolePermission[]
}

model Permission {
  id    String           @id @default(cuid())
  key   String           @unique // e.g. "task:assign"
  roles RolePermission[]
}

model RolePermission {
  id           String     @id @default(cuid())
  roleId       String
  permissionId String
  scope        String     // own | team | org
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])

  @@unique([roleId, permissionId])
}

model Task {
  id             String    @id @default(cuid())
  organizationId String
  projectId      String
  title          String
  description    String?
  assigneeId     String?
  status         String    @default("todo")
  priority       String    @default("medium")
  dueDate        DateTime?
  sourceSystem   String?   // e.g. "jira"
  sourceId       String?   // e.g. "PROJ-123"
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([organizationId])
  @@index([projectId])
  @@unique([sourceSystem, sourceId])
}
```

## Multi-tenancy enforcement

- Every org-scoped table has `organizationId` **and an index on it**.
- A tenancy layer injects `where: { organizationId }` on every query (see [10](./10-technical-architecture.md)).
- Composite uniqueness on `(sourceSystem, sourceId)` prevents duplicate imports from connectors.

## Migration note (from the removed backend)

The old backend defined a single `User` model with password reset fields and nothing else. That schema is **superseded** by this model. When the backend is rebuilt, start migrations fresh from the schema above rather than extending the old one — the tenancy and RBAC tables are foundational and hard to retrofit later.

---

*Previous: [10 — Technical / System Architecture](./10-technical-architecture.md) · Next: [12 — API Specifications](./12-api-specifications.md)*
