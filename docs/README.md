# Zeva — Product Documentation

> **Zeva is an AI Work Coordination Platform** that proactively coordinates work across people, meetings, tasks, documents, and enterprise systems using AI and voice interaction.

This folder contains the complete product planning and architecture documentation for Zeva. It is written to be read top-to-bottom by a new engineer, designer, or stakeholder, and to be presentable to a CTO or investor.

> Positioning note: Zeva is **not** a task manager, project manager, or chatbot. It is a **Work Coordination Platform**. It does not replace Jira, Teams, Outlook, GitHub, or Confluence — it *coordinates* them.

---

## How to read these docs

Read in numeric order. Each document is self-contained but builds on the ones before it. By the end you will know **who every user is, what every screen does, where every piece of data comes from, and how every module fits together.**

| # | Document | Purpose |
|---|----------|---------|
| 01 | [Product Vision](./01-product-vision.md) | Why Zeva exists, positioning, problem statement, and the coordination solution |
| 02 | [Target Users & Personas](./02-target-users-and-personas.md) | Ideal Customer Profile and detailed user personas |
| 03 | [Product Goals & KPIs](./03-product-goals-and-kpis.md) | Measurable product goals and success metrics |
| 04 | [Core Features, Modules & PRD](./04-core-features-and-modules.md) | Product modules, functional requirements, dashboard strategy |
| 05 | [User Journeys](./05-user-journeys.md) | End-to-end journey maps from onboarding to daily use |
| 06 | [Information Architecture](./06-information-architecture.md) | Navigation model and module hierarchy |
| 07 | [Organization Architecture & RBAC](./07-organization-and-permissions.md) | Org hierarchy and the role/permission matrix |
| 08 | [AI Architecture](./08-ai-architecture.md) | Intent routing, AI services, and voice workflows |
| 09 | [Integration Architecture](./09-integration-architecture.md) | Connectors, sync strategy, and data ownership |
| 10 | [Technical / System Architecture](./10-technical-architecture.md) | High-level architecture, tech stack, deployment, security |
| 11 | [Data Model](./11-data-model.md) | Core entities, relationships, and database schema |
| 12 | [API Specifications](./12-api-specifications.md) | Frontend–backend contracts and conventions |
| 13 | [UI/UX Design System](./13-ui-ux-design-system.md) | Design tokens, components, layout, accessibility |
| 14 | [Roadmap](./14-roadmap.md) | MVP scope, phased milestones, future vision |
| 15 | [Risk Register](./15-risk-register.md) | Product, technical, privacy, and operational risks |
| 16 | [Identity & Microsoft Graph](./16-identity-and-microsoft-graph.md) | Entra ID as primary identity, Graph API, sync flow, provider pattern |
| 17 | [Setup & Installation](./17-setup-and-installation.md) | Prerequisites, what to install, step-by-step local setup (mock-first) |

> Docs 16–17 are supporting guides: **16** deep-dives the identity foundation (referenced by 07/09/10/11), and **17** is the hands-on setup/installation guide.

---

## The Zeva Planning Framework

These documents are organized around a 15-part product planning framework. This is how mature product companies plan before writing code.

1. Vision → *01*
2. Problem Statement → *01*
3. Target Users → *02*
4. User Personas → *02*
5. Product Goals → *03*
6. Core Features → *04*
7. User Journey → *05*
8. Information Architecture → *06*
9. Organization Architecture → *07*
10. AI Architecture → *08*
11. Technical Architecture → *10*
12. Data Model → *11*
13. Roadmap → *14*
14. MVP → *14*
15. Future Roadmap → *14*

## Recommended build order

The docs are designed to be executed in this sequence, so that by the time coding starts every decision is already made:

1. Vision & Positioning *(01)*
2. User Personas *(02)*
3. Organization & Permission Model *(07)*
4. Product Architecture *(04, 06)*
5. User Flows *(05)*
6. UI Wireframes *(13)*
7. Database Design *(11)*
8. Backend Module Architecture *(10, 12)*
9. AI & Integration Architecture *(08, 09)*
10. Development Roadmap *(14)*

---

## Current repository status

- **Frontend** (`/frontend`): React 19 + Vite + MUI + Tailwind. Page shells for the Zeva modules exist, plus a temporary **client-side mock login** so the app is usable before the API exists. **Kept.**
- **Backend** (`/backend`): the previous minimal Express + Prisma auth service was **removed**. It will be rebuilt as a **NestJS modular monolith** (Prisma + PostgreSQL + Redis + BullMQ + Socket.IO) against this architecture — see [10 — Technical Architecture](./10-technical-architecture.md), [11 — Data Model](./11-data-model.md), and the step-by-step [17 — Setup & Installation](./17-setup-and-installation.md).

### Finalized stack (see [10](./10-technical-architecture.md))

- **Frontend:** React 19 + TS, Vite, MUI, Tailwind, TanStack Query, MSAL React, OpenAI Realtime.
- **Backend:** NestJS + TS, Prisma, JWT, BullMQ, Socket.IO.
- **Data:** PostgreSQL (primary) + Redis (cache/sessions/queues).
- **AI:** OpenAI Realtime + Responses/Chat, MCP connectors.
- **Identity-first integrations:** Microsoft Entra ID + Graph → Jira → Outlook → GitHub → Teams/Slack.

> Status legend used throughout these docs: **[MVP]** ships first, **[Phase 2]** / **[Phase 3]** are planned, **[Future]** is directional.
