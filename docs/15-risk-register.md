# 15 — Risk Register

A living list of what could go wrong, how likely and impactful it is, and how we mitigate it. Grouped into product, technical, privacy/security, and operational risks. Review each phase against this list ([14 — Roadmap](./14-roadmap.md)).

**Scoring:** Likelihood (L) and Impact (I) on a 1–3 scale (Low / Med / High). Priority ≈ L × I.

## Product risks

| ID | Risk | L | I | Mitigation |
|----|------|---|---|------------|
| P1 | **Positioning confusion** — users see Zeva as "another task tool" and don't grasp coordination value | 3 | 3 | Lead every surface with cross-tool coordination + AI recommendations; onboarding shows value before asking for setup ([01](./01-product-vision.md), [05](./05-user-journeys.md)) |
| P2 | **Low AI trust** — users ignore recommendations | 2 | 3 | Feedback loop + North Star on acceptance; keep recommendations explainable and permission-scoped ([03](./03-product-goals-and-kpis.md), [08](./08-ai-architecture.md)) |
| P3 | **Notification fatigue** — coordination adds noise instead of reducing it | 2 | 2 | Batched digests, priority ranking, per-category preferences; guardrail metric on notification volume |
| P4 | **Empty-product cold start** — no data before integrations | 3 | 2 | Sprint 2 delivers value on Zeva's own model; guided empty states drive setup ([14](./14-roadmap.md)) |
| P5 | **Scope creep** — trying to build all modules at once | 2 | 3 | Strict sprint sequencing; Documents/Analytics deferred to Phase 2 |

## Technical risks

| ID | Risk | L | I | Mitigation |
|----|------|---|---|------------|
| T1 | **Multi-tenancy leak** — data crosses org boundaries | 1 | 3 | `organizationId` on every row + enforced tenancy middleware; tests on scope isolation ([07](./07-organization-and-permissions.md), [11](./11-data-model.md)) |
| T2 | **Connector fragility** — external API changes/rate limits break sync | 3 | 2 | Common connector interface, webhook + polling fallback, retries, sync observability ([09](./09-integration-architecture.md)) |
| T3 | **Sync conflicts / duplicates** | 2 | 2 | `(sourceSystem, sourceId)` uniqueness; last-writer-wins with source precedence |
| T4 | **AI latency/cost** — realtime responses too slow or expensive | 2 | 2 | Latency budget (<1.5s to first token), caching of context bundles, model selection per task ([03](./03-product-goals-and-kpis.md)) |
| T5 | **RBAC retrofit debt** — permissions bolted on late | 1 | 3 | Build RBAC in Sprint 1 as data-driven tables; server-side enforcement from day one |
| T6 | **Write-back errors** — bad state pushed to source systems | 2 | 3 | Confirmation on state-changing actions, audit log, idempotent writes, pending/rollback UX |

## Privacy & security risks

| ID | Risk | L | I | Mitigation |
|----|------|---|---|------------|
| S1 | **Content surveillance concern** — perceived or real reading of private messages/docs | 2 | 3 | Hard rule: analytics is **aggregate only**; store metadata (not content) for email/docs ([02](./02-target-users-and-personas.md), [07](./07-organization-and-permissions.md), [09](./09-integration-architecture.md)) |
| S2 | **OAuth token compromise** | 1 | 3 | Encrypt tokens at rest, per-org scoping, least-privilege scopes, never logged/sent to browser |
| S3 | **AI over-permission** — AI acts beyond user's rights | 1 | 3 | Intent Router enforces RBAC before any read/write; AI can't exceed the user's own permissions |
| S4 | **Unauthenticated endpoints** | 1 | 3 | Auth-by-default policy; any network-exposed endpoint reviewed for authz ([10](./10-technical-architecture.md)) |
| S5 | **PII handling / compliance** (GDPR-style) | 2 | 3 | Data minimization, deletion honors source, disconnect purges synced data, audit logging |

## Operational risks

| ID | Risk | L | I | Mitigation |
|----|------|---|---|------------|
| O1 | **Vendor dependency (OpenAI)** — outage or pricing change | 2 | 2 | Graceful degradation to non-AI views; abstract the model layer to allow substitution |
| O2 | **Onboarding friction** — orgs stall before first value | 2 | 3 | Track time-to-value KPI; guided setup; make Sprint-1/2 usable without connectors |
| O3 | **Observability gaps** — can't see failures in prod | 2 | 2 | Structured logging, tracing, per-connector metrics, technical KPIs dashboard ([03](./03-product-goals-and-kpis.md)) |
| O4 | **Key-person / knowledge risk** | 1 | 2 | This documentation set is the shared source of truth; keep it current |

## Top risks to watch

1. **P1 — Positioning confusion** (9): the whole thesis depends on users understanding coordination, not task management.
2. **T1 / S1 / S3 — Isolation & privacy** (high impact): a single tenancy or privacy breach is existential for an enterprise product.
3. **T6 — Write-back errors** (6): coordinating means changing source systems; getting this wrong erodes trust fast.

## Review cadence

- Re-score this register at the end of each sprint.
- Any new connector or AI capability adds a row before it ships.
- Privacy/security risks require sign-off before the relevant feature goes to production.

---

*Previous: [14 — Roadmap](./14-roadmap.md) · Next: [16 — Identity & Microsoft Graph](./16-identity-and-microsoft-graph.md)*
