# 09 — Integration Architecture

Zeva coordinates the tools a company already uses. The integration layer is therefore core, not optional. Think in **connectors**.

## Connector model

```
Connectors
   ↓
Entra ID / Google Workspace   ← identity FIRST (users, managers, departments)
   ↓
Jira                          ← work items (projects, tasks, sprints)
   ↓
Outlook / Google Calendar     ← meetings, calendar
   ↓
GitHub                        ← PRs, commits, reviews
   ↓
Teams / Slack                 ← communication, presence, notifications
   ↓
OpenAI                        ← AI reasoning, voice, recommendations
```

**Each connector syncs data** from a source system into Zeva's unified work model, and (where applicable) writes changes back.

## Integration priority — identity first

The order above is deliberate and mirrors how large enterprises operate. **Identity is the foundation**: every task, meeting, and AI recommendation must attach to the correct employee, manager, department, and organization. So the first enterprise integration Zeva builds is the **identity provider**, not a work tool.

1. **Microsoft Entra ID / Google Workspace** → users, roles, managers, departments, org hierarchy.
2. **Jira** → projects, tasks, sprints, blockers.
3. **Outlook / Google Calendar** → meetings and calendar events.
4. **GitHub** → pull requests, commits, reviews.
5. **Teams / Slack** → communication, presence, notifications.
6. **OpenAI** → AI reasoning, voice, recommendations.

Identity comes from an identity provider, work items come from project tools, communication comes from messaging platforms — and Zeva sits above them as the AI coordination layer. The Microsoft Entra ID / Graph details (endpoints, permissions, sync, provider pattern) are in **[16 — Identity & Microsoft Graph](./16-identity-and-microsoft-graph.md)**.

> **Entra ID is the source of organizational hierarchy — not Teams.** Teams provides collaboration data (channels, presence, meetings); the manager/department/direct-report graph comes from Entra ID via Microsoft Graph.

## Connector responsibilities

Every connector implements a common interface so the rest of Zeva doesn't care which source a task or meeting came from:

- **Authenticate** — OAuth 2.0 with the provider; store tokens encrypted per organization.
- **Sync in** — pull entities (tasks, meetings, PRs, docs) into normalized Zeva models.
- **Map** — translate source fields to Zeva's schema (e.g., Jira issue → Task).
- **Write back** — push user actions (status change, reschedule) to the source.
- **Report health** — expose sync status/errors for the Admin Dashboard and the sync-success KPI.

## Pluggable provider interface (mock ↔ real)

Every connector — starting with identity — is defined by an interface, so the rest of Zeva never depends on a specific vendor and a **mock implementation** can stand in during development and demos (important for the hackathon, where a real corporate tenant isn't available).

```ts
// Identity is the first and most important connector.
interface IdentityProvider {
  syncUsers(): Promise<User[]>
  syncManagers(): Promise<Manager[]>
  syncDepartments(): Promise<Department[]>
}

// Two interchangeable implementations behind the same interface:
class MockMicrosoftProvider implements IdentityProvider { /* sample org data */ }
class MicrosoftGraphProvider implements IdentityProvider { /* real Graph API */ }
```

- `MockMicrosoftProvider` returns realistic sample users/managers/departments so the whole app works end-to-end with no external tenant.
- `MicrosoftGraphProvider` calls the real Microsoft Graph API.
- Selected by config (`IDENTITY_PROVIDER=mock|microsoft`) — no other code changes when switching. Same pattern applies to Jira, GitHub, etc. This demonstrates enterprise-grade architecture while keeping the MVP practical to showcase. See [16 — Identity & Microsoft Graph](./16-identity-and-microsoft-graph.md).

## Sync strategy

| Aspect | Approach |
|--------|----------|
| Direction | Two-way for tasks/meetings; read-only for code/docs metadata |
| Trigger | Webhooks where available (GitHub, Jira, Graph); polling fallback |
| Freshness | Near-real-time via webhooks; scheduled reconcile sweeps for drift |
| Conflict handling | Last-writer-wins with source-of-truth precedence per entity |
| Isolation | Tokens and synced data scoped by `organizationId` |
| Observability | Per-connector sync logs, error rates, last-sync timestamps |

## Per-connector summary

| Connector | Primary data | Direction | Auth | Priority |
|-----------|--------------|-----------|------|----------|
| **Entra ID / Google Workspace** | Users, managers, departments, roles | Read (identity) | OAuth 2.0 / OIDC (MS Graph / Google) | **1st — foundation** |
| Jira | Projects, tasks/issues, sprints | Two-way | OAuth 2.0 (Atlassian) / MCP | 2nd |
| Outlook / Google Calendar | Meetings, calendar, email metadata | Two-way (calendar), read (email meta) | OAuth 2.0 (MS Graph / Google) | 3rd |
| GitHub | Pull requests, commits, reviews | Read | OAuth 2.0 / App / MCP | 4th |
| Teams / Slack | Presence, channels, notifications | Read + notify | OAuth 2.0 (MS Graph / Slack) | 5th |
| Confluence | Documents | Read metadata + links | OAuth 2.0 (Atlassian) | Future |

> MVP does not require live connectors; modules are built against Zeva's own models (and the mock identity provider) first, then connectors backfill them. Identity (Entra ID) is the first connector wired to real data. See [14 — Roadmap](./14-roadmap.md).

## Data Ownership

This is something PMs must define explicitly: **where does each piece of data come from, and what does Zeva store?**

| Data | Source | Stored in Zeva |
|------|--------|----------------|
| Users | **Entra ID / Google Workspace** (Graph) | ✅ Full |
| Managers / reporting lines | **Entra ID** (Graph) | ✅ Full |
| Departments / org hierarchy | **Entra ID** (Graph) | ✅ Full |
| Projects | Jira | ✅ Full |
| Tasks | Jira | ✅ Full |
| Meetings | Outlook / Google Calendar | ✅ Full |
| Emails | Outlook | ⚠️ Metadata only |
| PRs | GitHub | ✅ Full |
| Presence | Teams / Slack | ⚠️ Ephemeral (cache) |
| Documents | Confluence | ⚠️ Metadata only |

### Data ownership principles

- **Store what we coordinate, reference what we don't.** Tasks, projects, meetings, and PRs are coordinated (and written back), so Zeva stores them fully. Emails and documents are referenced by **metadata + link** — Zeva never becomes a shadow copy of a company's email or wiki content.
- **Source of truth stays upstream.** For synced entities, the source system remains authoritative; Zeva reconciles to it.
- **Privacy by minimization.** Metadata-only for email/docs limits blast radius and supports the no-content-surveillance rule ([07](./07-organization-and-permissions.md), [15](./15-risk-register.md)).
- **Deletion honors the source.** If an item is deleted upstream (or a connector disconnected), Zeva removes or tombstones its copy.

## Security of integrations

- OAuth tokens encrypted at rest, scoped per organization, never logged.
- Least-privilege scopes requested from each provider.
- Disconnecting a connector revokes tokens and purges/tombstones synced data per policy.
- All connector traffic is server-to-server; secrets never reach the browser.

---

*Previous: [08 — AI Architecture](./08-ai-architecture.md) · Next: [10 — Technical / System Architecture](./10-technical-architecture.md)*
