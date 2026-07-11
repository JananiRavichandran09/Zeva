import { Injectable } from '@nestjs/common';
import type { AiProvider } from './ai-provider.interface';

@Injectable()
export class MockAiProvider implements AiProvider {
  async generateText(_systemPrompt: string, userMessage: string): Promise<string> {
    const lower = userMessage.toLowerCase();

    if (lower.includes('my plate') || lower.includes('briefing') || lower.includes('today')) {
      return [
        '## Good morning! Here\'s your day at a glance',
        '',
        '### 📋 Active Tasks (3)',
        '| Task | Priority | Due |',
        '|------|----------|-----|',
        '| Implement auth module | **High** | Tomorrow |',
        '| Design RBAC guard | Medium | This week |',
        '| Implement voice assistant | High | Next sprint |',
        '',
        '### 📅 Meetings Today (1)',
        '- **Sprint Planning** — 10:30–11:30 AM with Karthik',
        '',
        '### 🎯 AI Recommendation',
        '> Block **2:00–4:00 PM** as focus time to finish the auth module before tomorrow\'s deadline.',
        '',
        'Want me to **prep you for Sprint Planning** or **show your full task list**?',
      ].join('\n');
    }

    if (lower.includes('prep') || lower.includes('11am') || lower.includes('sprint') || lower.includes('meeting')) {
      return [
        '## Sprint Planning — Meeting Prep',
        '',
        '**Time:** 10:30 – 11:30 AM &nbsp;|&nbsp; **Organizer:** Karthik',
        '',
        '### Agenda',
        '1. Review last sprint velocity',
        '2. Plan next sprint stories',
        '3. Discuss blockers',
        '',
        '### Your Updates to Share',
        '- ✅ **Auth module** — 80% done, JWT refresh flow working',
        '- ✅ **RBAC guard** — merged yesterday, tests passing',
        '- 🔄 **Voice assistant** — in planning, needs API key',
        '',
        '### Blockers to Raise',
        'No blockers currently. You\'re in good shape.',
        '',
        '### Related Backlog Items',
        '| Task | Status |',
        '|------|--------|',
        '| Integrate Entra ID | Todo (High) |',
        '| Connect Jira integration | Todo (Medium) |',
        '| Write E2E tests | Todo (Medium) |',
      ].join('\n');
    }

    if (lower.includes('task') || lower.includes('overdue') || lower.includes('blocker') || lower.includes('show my')) {
      return [
        '## Your Task Summary',
        '',
        '| Task | Status | Priority |',
        '|------|--------|----------|',
        '| Set up NestJS backend | ✅ Done | — |',
        '| Implement auth module | 🔄 In Progress | **High** |',
        '| Design RBAC guard | 🔄 In Progress | Medium |',
        '| Implement voice assistant | 📋 Todo | **High** |',
        '| Connect Jira integration | 📋 Todo | Medium |',
        '',
        '**No overdue tasks.** You\'re on track for this sprint!',
        '',
        '> 💡 Tip: Finish the auth module first — it unblocks the voice assistant work.',
      ].join('\n');
    }

    if (lower.includes('team') || lower.includes('overloaded') || lower.includes('capacity') || lower.includes('workload')) {
      return [
        '## Backend Team — Workload Overview',
        '',
        '| Member | Role | Active Tasks | Status |',
        '|--------|------|-------------|--------|',
        '| Janani | Developer | 3 | 🟢 On track |',
        '| Rahul | Developer | 2 | 🟢 On track |',
        '| Priya | Developer | 2 | 🟢 On track |',
        '',
        '**Team capacity: 75%** — no one is overloaded.',
        '',
        '### Recommendations',
        '- Consider assigning the **E2E tests** task to Rahul or Priya to balance load',
        '- Priya has capacity to pick up the **Jira integration** task this sprint',
      ].join('\n');
    }

    if (lower.includes('reschedule') || lower.includes('move') || lower.includes('cancel') || lower.includes('focus time')) {
      return [
        '## Calendar Action',
        '',
        'I can see your calendar, but **calendar write-back** is not connected yet.',
        '',
        'Once the **Outlook integration** is enabled (Sprint 4), I\'ll be able to:',
        '- Reschedule meetings directly',
        '- Block focus time automatically',
        '- Detect and resolve conflicts',
        '',
        '> For now, I\'d recommend blocking **2:00–4:00 PM** manually in your calendar for deep work.',
        '',
        'Want me to remind you about anything else?',
      ].join('\n');
    }

    if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('what should')) {
      return [
        '## AI Recommendations for Today',
        '',
        '### 🔴 High Priority',
        '1. **Finish auth module** — due tomorrow, currently 80% complete',
        '2. **Prep for Sprint Planning** — meeting at 10:30 AM, review your updates',
        '',
        '### 🟡 Medium Priority',
        '3. **Block focus time** — suggest 2:00–4:00 PM to avoid interruptions',
        '4. **Review RBAC guard PR** — Rahul opened a review request yesterday',
        '',
        '### 🟢 When You Have Time',
        '5. **Start Entra ID integration** — planned for Sprint 4, early research helps',
      ].join('\n');
    }

    return [
      '## Hi! I\'m Zeva, your AI work coordinator.',
      '',
      'Here\'s what I can help you with:',
      '',
      '| Ask me... | I\'ll give you... |',
      '|-----------|-----------------|',
      '| "What\'s on my plate today?" | Daily briefing with tasks & meetings |',
      '| "Prep me for my next meeting" | Agenda, context, and your updates |',
      '| "Show my tasks" | Full task list with status & priority |',
      '| "Who\'s overloaded on my team?" | Team workload breakdown |',
      '| "What should I focus on?" | AI-ranked recommendations |',
      '',
      'What would you like to know?',
    ].join('\n');
  }

  async generateJson<T>(_systemPrompt: string, userMessage: string): Promise<T> {
    const lower = userMessage.toLowerCase();

    if (lower.includes('recommend')) {
      return {
        recommendations: [
          { kind: 'focus_time', title: 'Block 2–4 PM as focus time', priority: 'medium' },
          { kind: 'meeting_prep', title: 'Prep for Sprint Planning at 10:30', priority: 'high' },
          { kind: 'task_action', title: 'Finish auth module (due tomorrow)', priority: 'high' },
        ],
      } as T;
    }

    return { message: 'No structured data available for this query' } as T;
  }
}
