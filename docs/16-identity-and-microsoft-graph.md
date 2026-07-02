# 16 — Identity & Microsoft Graph (Entra ID)

**Microsoft Entra ID (formerly Azure Active Directory) is Zeva's primary identity source.** It tells Zeva who the users are and how they're organized — roles, managers, departments, and the full org hierarchy. This is the **first enterprise integration** to build, because every task, meeting, and AI recommendation attaches to the correct employee, manager, department, and organization. See ordering in [09 — Integration Architecture](./09-integration-architecture.md).

## Why identity first

Without an identity provider, an Admin has to create every user, then assign manager, department, and role by hand:

```
Admin → Create User → Assign Manager → Assign Department → Assign Role   (manual, repeated)
```

With Entra ID, it's one connect + sync:

```
Connect Microsoft → Zeva Sync → Users, Managers, Departments, Groups imported automatically
```

Once identity is connected, the rest of the product gets simpler: Jira tasks, Outlook meetings, and AI recommendations all link to a known person, manager, department, and org.

## Three Microsoft services (don't confuse them)

All three are reached through **one API — Microsoft Graph** — but they answer different questions:

| Service | Provides | Zeva uses it for |
|---------|----------|------------------|
| **Microsoft Entra ID** | Users, managers, departments, org structure | ✅ **Primary** — organizational hierarchy |
| **Microsoft Teams** | Teams, channels, presence, meetings, chat | ✅ Collaboration + presence |
| **Microsoft Outlook** (Graph Calendar/Mail) | Calendar, meetings, email metadata | ✅ Meetings & calendar |

> **Key point: Teams is NOT the source of org hierarchy.** The manager/department/direct-report graph comes from **Entra ID**. Teams adds collaboration signals (e.g., "Rahul is in a meeting" via presence).

```
                    Microsoft Graph API
        ┌────────────┬─────────────┬─────────────┐
        │            │             │             │
     Entra ID      Teams        Outlook      OneDrive
```

## What Zeva reads from Graph

### User information

```
GET /users        →  list org users
GET /me           →  signed-in user
```

Each user carries the fields Zeva needs:

```json
{
  "id": "123",
  "displayName": "Janani",
  "mail": "janani@company.com",
  "jobTitle": "Software Engineer",
  "department": "Engineering"
}
```

Also available: employee ID, office location, phone, photo.

### Manager (reporting line)

```
GET /users/{id}/manager
```

```json
{ "displayName": "Karthik", "jobTitle": "Engineering Manager" }
```

### Direct reports (a manager's team)

```
GET /users/{managerId}/directReports
```

Returns the members reporting to that manager — this is exactly how Zeva determines who reports to whom:

```
Karthik
 ├── Janani
 ├── Rahul
 └── Priya
```

### Groups / departments

```
GET /groups
GET /groups/{id}/members
```

Departments also come through each user's `department` field (Engineering, QA, HR, Product).

### Endpoint summary

| Feature | Graph endpoint |
|---------|----------------|
| Signed-in user | `GET /me` |
| All users | `GET /users` |
| Manager | `GET /users/{id}/manager` |
| Direct reports | `GET /users/{id}/directReports` |
| Groups | `GET /groups` |
| Group members | `GET /groups/{id}/members` |
| User photo | `GET /users/{id}/photo/$value` |
| Calendar events | `GET /me/events` or `GET /users/{id}/events` |
| Presence (Teams) | `GET /users/{id}/presence` |

## Required Graph permissions

Requested by the Zeva Azure app registration. Directory-wide reads require **admin consent**.

| Permission | Purpose |
|------------|---------|
| `User.Read` | Read the signed-in user's profile |
| `User.Read.All` | Read all users in the organization |
| `Directory.Read.All` | Read org hierarchy / directory data (admin consent) |
| `Group.Read.All` | Read groups and teams |
| `Organization.Read.All` | Read organization (tenant) info |
| `Calendars.Read` | Read calendars and events |
| `Mail.Read` | Read email metadata (only if needed) |
| `Presence.Read.All` | Read user presence (Teams) |
| `TeamMember.Read.All` / `Team.ReadBasic.All` | Read Teams membership/basics |

Request **least privilege** — only the scopes a given feature needs.

## Integration & sync flow

```
Admin → Settings → Connect Microsoft
        │
        ▼
   OAuth 2.0 / OIDC (Entra ID)  →  Grant permissions  →  Access + refresh token
        │                                                   (stored encrypted per org)
        ▼
   BullMQ job "sync:identity"
        │
        ▼
   Microsoft Graph API
        │
   ┌────┼──────────────┬───────────────┐
   ▼    ▼              ▼               ▼
 Users  Managers   Departments      Groups
   │    │              │               │
   └────┴──────────────┴───────────────┘
        ▼
   Map → Zeva schema (entraUserId, managerId, departmentId, tenantId)
        ▼
   Prisma upsert → PostgreSQL
        ▼
   Zeva dashboards + AI now have the full org graph
```

After identity, the same connect-and-sync pattern runs for **Jira → Outlook/Calendar → GitHub → Teams/Slack** (see [09](./09-integration-architecture.md)).

## Mapping Graph → Zeva data model

Store synced identity locally (source of truth stays in Entra ID; Zeva reconciles). Relevant fields (full schema in [11 — Data Model](./11-data-model.md)):

```
Organization
  id, name, tenantId (Entra tenant), domain

User
  id, entraUserId, organizationId, name, email,
  jobTitle, department, managerId, photoUrl, status
```

- `tenantId` → maps an Entra tenant to a Zeva Organization (multi-tenant boundary).
- `entraUserId` → stable external key for idempotent upserts (`@@unique`).
- `managerId` → self-referential FK built from `/manager` + `/directReports`.
- `department` / `departmentId` → from the user's `department` field / groups.

## Provider pattern — mock for the hackathon, real for production

A real corporate tenant usually isn't available during a hackathon, so build the **architecture** and swap the implementation:

```ts
interface IdentityProvider {
  syncUsers(): Promise<User[]>
  syncManagers(): Promise<Manager[]>
  syncDepartments(): Promise<Department[]>
}

class MockMicrosoftProvider implements IdentityProvider { /* sample org data */ }
class MicrosoftGraphProvider implements IdentityProvider { /* real Graph API */ }
```

- Selected by config: `IDENTITY_PROVIDER=mock` (demo/dev) or `microsoft` (real tenant).
- The mock returns a realistic org (a CEO, managers like Karthik, reports like Janani/Rahul/Priya, departments) so dashboards and AI work end-to-end with **no external dependency**.
- Switching to real Graph requires **no changes** elsewhere in Zeva — only the provider and its OAuth config. This is enterprise-grade design that still demos cleanly.

## Frontend (MSAL)

The React app uses **MSAL React** for the Microsoft sign-in / consent flow (OAuth 2.0 / OpenID Connect). After Entra authenticates, Zeva exchanges the identity for its own JWT session ([10 — Technical Architecture](./10-technical-architecture.md)). Until the backend exists, the frontend runs a temporary client-side mock login.

## Google Workspace (equivalent path)

For non-Microsoft orgs, Google Workspace is the equivalent identity provider (Directory API for users/orgUnits/managers). The same `IdentityProvider` interface covers it with a `GoogleWorkspaceProvider`.

---

*Previous: [15 — Risk Register](./15-risk-register.md) · Next: [17 — Setup & Installation](./17-setup-and-installation.md)*
