# 03 — Product Goals & KPIs

Goals must be **measurable business outcomes**, not feature lists. Every goal below maps to a persona pain from [02 — Personas](./02-target-users-and-personas.md) and to metrics we can instrument.

## Product Goals

| Goal | Target outcome | Serves persona |
|------|----------------|----------------|
| Reduce meeting conflicts | −40% double-booked / overlapping meetings | Developer, Manager |
| Reduce missed follow-ups | Fewer action items lost after meetings | Developer, Manager, QA |
| Reduce context switching | Fewer app-to-app switches per task | Developer, QA |
| Improve task completion | Higher on-time task completion rate | Developer, Manager |
| Improve meeting preparation | More meetings entered with AI prep reviewed | Developer, Manager |
| Increase focus time | More protected, uninterrupted focus blocks/week | Developer |

These are **business outcomes**. Features exist only to move these numbers.

---

## Success Metrics (KPIs)

KPIs are grouped into three layers. Each has an owner and a measurement source.

### Business KPIs (is the product growing?)

| Metric | Definition | Source |
|--------|------------|--------|
| Organizations created | New orgs onboarded | App DB |
| Monthly Active Users (MAU) | Distinct users active in 30 days | Analytics events |
| Retention | % of orgs/users active month over month | Analytics events |
| AI usage | % of active users using AI features weekly | AI service logs |

### User KPIs (is the product delivering value?)

| Metric | Definition | Source |
|--------|------------|--------|
| Tasks completed | Tasks moved to done in Zeva/synced tools | Tasks module + connectors |
| Meetings attended | Meetings with recorded attendance | Calendar/Meetings module |
| AI recommendations accepted | % of AI suggestions acted on | AI Coordinator |
| Voice commands executed | Count of successful voice actions | Voice Assistant |

### Technical KPIs (is the platform healthy?)

| Metric | Definition | Target (initial) |
|--------|------------|------------------|
| API response time | p95 latency for core endpoints | < 300 ms |
| AI latency | Time to first token / voice response | < 1.5 s to first token |
| Sync success rate | % of connector syncs completed without error | > 99% |

---

## North Star Metric

> **Weekly AI recommendations accepted per active user.**

This single metric captures the whole thesis: users are active, AI is producing relevant recommendations, and users trust them enough to act. If this number grows, coordination is working. It combines engagement (active), AI quality (relevant), and trust (accepted).

## Guardrail metrics

Metrics we watch to make sure we don't win the North Star at the expense of health or trust:

- **Recommendation dismissal rate** — high dismissals mean noisy or wrong AI.
- **Sync error rate** — coordination breaks if source data is stale.
- **Notification volume per user** — coordination should reduce noise, not add to it.
- **Time-to-value** — days from org creation to first accepted AI recommendation.

## Measurement approach

- Instrument product events from day one (org created, integration connected, recommendation shown/accepted/dismissed, voice command issued/succeeded).
- Every KPI has a **source of truth** column so dashboards are reproducible.
- KPIs feed the [Analytics module](./04-core-features-and-modules.md) and are reviewed against the [Roadmap](./14-roadmap.md).

---

*Previous: [02 — Target Users & Personas](./02-target-users-and-personas.md) · Next: [04 — Core Features, Modules & PRD](./04-core-features-and-modules.md)*
