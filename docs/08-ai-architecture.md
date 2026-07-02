# 08 — AI Architecture

AI is Zeva's **competitive advantage**. It is not a bolted-on chatbot; it is a set of domain services orchestrated behind an intent router, with a voice-first entry point.

## High-level AI pipeline

```
OpenAI
   ↓
Realtime API
   ↓
Intent Router
   ↓
Meeting AI
   ↓
Task AI
   ↓
Calendar AI
   ↓
Notification AI
   ↓
Analytics AI
   ↓
Voice Navigation
```

**Every AI feature belongs to a service.** There is no single monolithic "AI" — requests are routed to the service that owns the relevant domain, which has access to the right context and the right write-back actions.

## Components

### 1. OpenAI + Realtime API

- The Realtime API powers low-latency **voice** interaction (speech-in, speech-out) and streaming text.
- Used for the Voice Assistant and for streaming recommendation/summary output in the UI.
- Target latency: first token/voice response < 1.5s (see [03 — KPIs](./03-product-goals-and-kpis.md)).

### 2. Intent Router

The router is the brain of the pipeline. It:

- Classifies an incoming request (voice or text) into an **intent** and target **domain service**.
- Extracts **entities** (task IDs, dates, people, meeting references).
- Applies the user's **permissions and org scope** before dispatching (a user can only act within their RBAC scope — see [07](./07-organization-and-permissions.md)).
- Dispatches to the correct domain AI service and composes the response.

Example routing:

| User says | Intent | Routed to |
|-----------|--------|-----------|
| "What's on my plate today?" | daily_briefing | Task AI + Calendar AI |
| "Prep me for my 11am" | meeting_prep | Meeting AI |
| "Reschedule my 3pm to tomorrow" | reschedule | Calendar AI |
| "Mark TASK-42 done" | update_task | Task AI |
| "Who's overloaded on my team?" | workload_query | Analytics AI |
| "Mute notifications until 2pm" | notification_control | Notification AI |

### 3. Domain AI services

Each service owns context + actions for one domain:

| Service | Reads | Produces / Acts |
|---------|-------|-----------------|
| **Meeting AI** | Meetings, related tasks, docs, prior notes | Meeting prep, summaries, action items → tasks |
| **Task AI** | Tasks, projects, assignees | Next-best-action, status updates (write-back to Jira) |
| **Calendar AI** | Calendar events, focus blocks | Conflict detection, focus-time protection, reschedules |
| **Notification AI** | Notifications, preferences | Smart digests, priority ranking, muting |
| **Analytics AI** | Aggregate workload/sprint/focus signals | Answers to workload/risk queries (aggregate only) |
| **Voice Navigation** | Current UI + user context | Navigate the app and trigger actions by voice |

### 4. Voice Navigation

- The Voice Assistant is reachable from the TopBar on every screen (see [06 — IA](./06-information-architecture.md)).
- It can both **navigate** ("open my tasks") and **act** ("mark this done"), routing through the Intent Router like any other request.

## Context & retrieval

- The Intent Router assembles a **context bundle** for the target service from Zeva's unified work model (tasks, meetings, docs metadata, people), filtered by the user's RBAC scope.
- For document/knowledge queries, use retrieval over **metadata and links** (Zeva stores metadata, not full Confluence content — see [09 — Integration Architecture](./09-integration-architecture.md)).
- Context is always org-scoped; no cross-tenant data ever enters a prompt.

## Recommendation feedback loop

AI recommendations are first-class objects, not ephemeral text:

```
Signals (tasks, meetings, calendar, PRs)
   → AI Coordinator generates Recommendation
   → User accepts / snoozes / dismisses
   → Feedback stored → improves ranking
```

- Acceptance rate is the **North Star metric** ([03](./03-product-goals-and-kpis.md)).
- Dismissal rate is a guardrail against noisy AI.

## Safety, privacy, and guardrails

- **Permission-aware:** the router enforces RBAC before any read or write. AI can never do what the user couldn't do manually.
- **Org isolation:** prompts and retrieval are scoped to a single organization.
- **No content surveillance:** Analytics AI answers from aggregate signals; it does not read individuals' message/email/doc content ([07](./07-organization-and-permissions.md), [15](./15-risk-register.md)).
- **Write-back confirmation:** state-changing actions (reschedule, reassign, mark done) surface a confirmation (voice or UI) before committing to source systems.
- **Auditability:** AI-initiated writes are logged with the initiating user, intent, and target system.
- **Graceful degradation:** if the model or a connector is unavailable, Zeva falls back to non-AI views rather than blocking work.

## Build phasing

- **[Phase 3]** delivers the AI Coordinator, Intent Router, domain services, and Voice Assistant on the OpenAI Realtime API (see [14 — Roadmap](./14-roadmap.md)).
- Earlier phases instrument the signals (tasks, meetings, calendar) the AI will later consume.

---

*Previous: [07 — Organization Architecture & RBAC](./07-organization-and-permissions.md) · Next: [09 — Integration Architecture](./09-integration-architecture.md)*
