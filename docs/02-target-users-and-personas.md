# 02 — Target Users & Personas

## Ideal Customer Profile (ICP)

Zeva is **not for everyone**. Defining the ICP keeps the product, sales, and roadmap focused.

### Primary ICP

- **Software companies, 50–5,000 employees.**

This is the sweet spot: large enough to feel tool fragmentation acutely (multiple teams, sprints, cross-team dependencies), small enough to adopt a new platform without a multi-year procurement cycle. These companies already run Jira + Teams/Slack + GitHub + Outlook — exactly the stack Zeva coordinates.

### Secondary ICP

- Product companies
- Consulting companies
- IT services companies
- Startups (scaling past ~50 people)

These share the same core pain — fragmented work across many tools — but have slightly different module priorities (e.g., consulting cares more about client projects and utilization; startups care more about speed and fewer seats).

### Who Zeva is *not* for (for now)

- Solo users and micro-teams (< 10 people) — fragmentation pain is low, integration ROI is low.
- Non-knowledge work (e.g., field/manufacturing-only orgs) where the tool stack Zeva coordinates isn't present.

---

## User Personas

Personas describe *who* uses Zeva, *what* they are trying to achieve, and *what pain* they feel today. Every feature should trace back to relieving a real persona pain.

### 1. Admin

- **Role in org:** IT admin / operations / org owner.
- **Goal:** Manage the organization — set up departments, teams, users, and integrations; keep the org healthy.
- **Primary pain:** Managing employees and access manually across many tools; no single source of truth for who belongs to what.
- **What Zeva gives them:** One place to provision the org, invite users, assign roles, and connect integrations. An Admin Dashboard showing org health (employees, departments, integrations, projects, licenses).
- **Key modules:** Organization, Users, Teams, Departments, Integrations, Admin, Settings.

### 2. Engineering Manager

- **Role in org:** Manages one or more engineering teams.
- **Goal:** Deliver projects on time.
- **Primary pain:** No visibility into team workload — who's overloaded, what's blocked, which sprint is slipping.
- **What Zeva gives them:** A Manager Dashboard with sprint status, team capacity, blockers, late tasks, and AI recommendations to rebalance work.
- **Key modules:** Projects, Tasks, Meetings, Analytics, AI Coordinator, Team.

### 3. Developer

- **Role in org:** Individual contributor writing code.
- **Goal:** Finish their work with as few interruptions as possible.
- **Primary pain:**
  - Too many meetings.
  - Forgotten tasks and follow-ups.
  - Constant context switching between Jira, GitHub, Teams, and Outlook.
- **What Zeva gives them:** An Employee Dashboard (daily briefing) with today's meetings, tasks, and calendar; AI meeting prep; protected focus time; and a voice assistant to act without switching apps.
- **Key modules:** Dashboard, Tasks, Meetings, Calendar, AI Coordinator, Voice Assistant, Documents.

### 4. QA (Quality Assurance)

- **Role in org:** Tests features, tracks defects.
- **Goal:** Track testing progress and coverage.
- **Primary pain:** Constantly waiting on developers; unclear when work is ready to test; testing status scattered across tools.
- **What Zeva gives them:** Task and project views filtered to testing state, notifications when items move to "ready for QA," and AI summaries of what changed.
- **Key modules:** Tasks, Projects, Notifications, Analytics.

### 5. HR

- **Role in org:** People operations, engagement, well-being.
- **Goal:** Employee engagement and healthy productivity.
- **Primary pain:** Low visibility into productivity and well-being; can't tell who is overloaded or at risk of burnout.
- **What Zeva gives them:** Aggregate, privacy-respecting analytics on workload distribution, meeting load, and focus time — signals for engagement and burnout risk (never surveillance of individuals' content).
- **Key modules:** Analytics, Organization, Notifications.

---

## Persona summary matrix

| Persona | Primary goal | Core pain | Most-used modules | Dashboard |
|---------|--------------|-----------|-------------------|-----------|
| Admin | Manage the organization | Manual employee/access management | Organization, Users, Integrations, Admin | Admin |
| Engineering Manager | Deliver projects | No workload visibility | Projects, Tasks, Analytics, AI | Manager |
| Developer | Finish work | Too many meetings, forgotten tasks, context switching | Dashboard, Tasks, Meetings, Calendar, Voice | Employee |
| QA | Track testing | Waiting on developers | Tasks, Projects, Notifications | Employee |
| HR | Employee engagement | Low productivity/well-being visibility | Analytics, Organization | Manager (scoped) |

> **Privacy principle for HR/manager analytics:** Zeva exposes *aggregate* signals (load, focus time, meeting volume), never the content of an individual's messages, emails, or documents. See [15 — Risk Register](./15-risk-register.md).

---

*Previous: [01 — Product Vision](./01-product-vision.md) · Next: [03 — Product Goals & KPIs](./03-product-goals-and-kpis.md)*
