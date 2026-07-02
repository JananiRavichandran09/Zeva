# 05 — User Journeys

Journey maps show the end-to-end experience for each persona, from first touch to daily habit. They connect the [modules](./04-core-features-and-modules.md) into flows a real person walks through.

## The master onboarding flow

Every organization follows this top-level path (see [06 — Information Architecture](./06-information-architecture.md)):

```
Landing → Register → Create Organization → Invite Team → Connect Integrations → Dashboard → Daily Work → AI → Reports
```

---

## Journey 1 — Admin: from zero to a working org

**Trigger:** Admin discovers Zeva and wants to set it up for their company.

| Step | Action | Zeva module | Success signal |
|------|--------|-------------|----------------|
| 1 | Lands on marketing page, clicks "Get started" | Landing | Reaches Register |
| 2 | Registers with name/email/password | Authentication | Account created |
| 3 | Creates the Organization | Organization | Org exists, user is Admin |
| 4 | Creates Departments (Eng, QA, HR, Product) and Teams | Departments, Teams | Structure created |
| 5 | Invites teammates by email, assigns roles | Users, Admin | Invites sent |
| 6 | Connects integrations (Jira, Outlook, Teams, GitHub) | Integrations | At least one connector syncing |
| 7 | Lands on Admin Dashboard | Analytics/Admin | Sees org health at a glance |

**Outcome:** A configured org with members and at least one integration feeding data. **Time-to-value target:** first accepted AI recommendation within days (see [03 — KPIs](./03-product-goals-and-kpis.md)).

**Failure/edge paths:** invite bounces, connector auth fails, no departments created yet → Zeva shows guided empty states nudging the next action.

---

## Journey 2 — Developer: the daily briefing

**Trigger:** Developer starts their workday.

| Step | Action | Zeva module | Value delivered |
|------|--------|-------------|-----------------|
| 1 | Opens Zeva (or asks by voice "what's on my plate today?") | Dashboard, Voice | One screen instead of six tabs |
| 2 | Reviews today's meetings, tasks, and calendar | Dashboard, Calendar, Meetings | Context in one place |
| 3 | Sees AI recommendations: prep for 11am, unblock TASK-42 | AI Coordinator | Next-best-action, not a raw list |
| 4 | Accepts "protect 2–4pm as focus time" | Calendar | Fewer interruptions |
| 5 | Before a meeting, opens AI-generated prep (related tasks/docs/notes) | Meetings, AI | Walks in prepared |
| 6 | After the meeting, action items become tasks automatically | Meetings, Tasks | No lost follow-ups |
| 7 | Marks a task done by voice; Zeva writes back to Jira | Tasks, Voice, Integrations | No context switch |

**Outcome:** The developer moved through the day with fewer switches, no forgotten follow-ups, and protected focus time — directly serving the goals in [03](./03-product-goals-and-kpis.md).

---

## Journey 3 — Engineering Manager: keeping delivery on track

**Trigger:** Manager wants to know if the sprint is healthy.

| Step | Action | Zeva module | Value delivered |
|------|--------|-------------|-----------------|
| 1 | Opens Manager Dashboard | Analytics | Sprint, capacity, blockers, late tasks in one view |
| 2 | Spots an overloaded developer and a blocked task | Analytics, Tasks | Early visibility |
| 3 | Reviews AI recommendation to rebalance work | AI Coordinator | Suggested action, not just data |
| 4 | Reassigns a task; change syncs to Jira | Tasks, Integrations | One action, reflected everywhere |
| 5 | Reviews blockers list before standup | Meetings, Tasks | Standup is shorter and focused |

**Outcome:** The manager intervenes early with visibility they previously had to assemble by hand.

---

## Journey 4 — QA: knowing when to test

**Trigger:** QA wants to pick up work that's ready.

| Step | Action | Zeva module | Value delivered |
|------|--------|-------------|-----------------|
| 1 | Gets a notification: TASK-88 moved to "ready for QA" | Notifications | No polling developers |
| 2 | Opens the task with an AI summary of what changed | Tasks, AI | Faster ramp-up |
| 3 | Tracks testing status across the project | Projects, Tasks | Clear coverage picture |

**Outcome:** Less waiting, less manual chasing.

---

## Journey 5 — HR: engagement & burnout signals

**Trigger:** HR wants to gauge team well-being.

| Step | Action | Zeva module | Value delivered |
|------|--------|-------------|-----------------|
| 1 | Opens aggregate analytics (workload, meeting load, focus time) | Analytics | Well-being signals |
| 2 | Notices a team with rising meeting load and shrinking focus time | Analytics | Early burnout signal |
| 3 | Discusses with the manager (Zeva never exposes message/doc content) | — | Privacy-respecting insight |

**Outcome:** HR gets directional signals without surveilling individuals. See privacy principle in [02](./02-target-users-and-personas.md) and [15 — Risk Register](./15-risk-register.md).

---

## Journey principles

- **Start from a question, not a feature.** Each journey answers a real question the persona has.
- **AI is a step in the flow, not a separate destination.** Recommendations appear where work happens.
- **Every action writes back.** Coordinating means Zeva updates the source systems, so users trust it as the front door.

---

*Previous: [04 — Core Features, Modules & PRD](./04-core-features-and-modules.md) · Next: [06 — Information Architecture](./06-information-architecture.md)*
