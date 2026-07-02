# 01 — Product Vision

## Vision

> **Zeva is an AI Work Coordination Platform that proactively coordinates work across people, meetings, tasks, documents, and enterprise systems using AI and voice interaction.**

Zeva's long-term mission is to become the coordination layer for knowledge work — the place where an employee starts their day, understands what matters, and lets AI handle the mechanics of scheduling, follow-ups, and context-gathering that currently eat their time.

## Positioning

What Zeva **is**:

- An **AI Work Coordination Platform**

What Zeva is **not**:

- ❌ A Task Management Tool
- ❌ A Project Management Tool
- ❌ An AI Chatbot

This distinction is the entire strategy. Task managers, project managers, and chatbots all *add another tool* to an employee's day. Zeva *reduces* the number of tools an employee has to think about by coordinating the ones they already use.

## Problem Statement

**What problem are we solving?**

Today's knowledge employees live across many disconnected systems:

- Jira (tasks, sprints)
- Microsoft Teams / Slack (chat, meetings)
- Outlook (email, calendar)
- GitHub (code, pull requests)
- Google Calendar (scheduling)
- Confluence (documents)

The problem is **not** that these tools are bad. They are best-in-class at what they do.

**The problem is that work is fragmented.**

A single unit of work is scattered across tools:

```
Meeting   → Teams
Task      → Jira
Email     → Outlook
Document  → Confluence
Code      → GitHub
```

The result is constant **context switching**. Employees jump between six applications to answer one simple question — *"what should I be doing right now, and what do I need to know before my next meeting?"* Nobody owns the answer, because no single tool has the whole picture.

### The cost of fragmentation

- **Lost focus** — every context switch has a recovery cost measured in minutes.
- **Missed follow-ups** — action items decided in a meeting live in someone's memory, not in a system.
- **Meeting overload** — no tool protects focus time or flags conflicts across calendars.
- **Poor visibility** — managers can't see workload, blockers, or sprint risk without manually stitching data together.

## Zeva's Solution

Zeva **does not replace** these tools. It **coordinates** them.

```
Outlook
   ↓
Teams
   ↓
Jira
   ↓
GitHub
   ↓
Zeva
   ↓
AI Recommendation
```

Zeva ingests signals from the systems a company already uses, builds a unified model of *people, work, meetings, and documents*, and then uses AI to proactively recommend what each person should focus on — surfaced through a dashboard and a voice-first assistant.

### The core loop

1. **Connect** — link Outlook, Teams, Jira, GitHub, and more via connectors.
2. **Coordinate** — Zeva normalizes tasks, meetings, PRs, and documents into one model.
3. **Recommend** — AI proposes the next best action: prep for a meeting, unblock a task, protect focus time.
4. **Act** — the employee acts by voice or click; Zeva writes changes back to the source systems.

## Why now

- Enterprise AI (LLMs + realtime voice) is finally good enough to route intent and summarize cross-system context reliably.
- Companies have consolidated on a small set of APIs (Microsoft Graph, Atlassian, GitHub, Google) that expose the data Zeva needs.
- Remote and hybrid work has multiplied the number of tools and the cost of fragmentation.

## One-line summaries by audience

- **Investor:** Zeva is the AI coordination layer that sits on top of the enterprise tool stack and gives every employee an AI chief of staff.
- **CTO:** Zeva is a multi-tenant platform that syncs enterprise systems into a unified work model and exposes it through AI services and a voice assistant.
- **Employee:** Zeva tells you what to work on next and handles the busywork of coordinating meetings, tasks, and follow-ups.

---

*Next: [02 — Target Users & Personas](./02-target-users-and-personas.md)*
