import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma';

export interface CalendarEvent {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  type: 'meeting' | 'task_due' | 'focus' | 'other';
  source: string; // outlook | jira | zeva | github
  color: string;
  meta?: Record<string, unknown>;
}

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns a unified calendar view combining:
   * - Meetings (source: outlook/teams)
   * - Task due dates (source: jira)
   * - Focus blocks (source: zeva)
   * - Calendar events (source: various)
   *
   * This is the core value of Zeva: one calendar, all sources coordinated.
   */
  async getUnifiedCalendar(userId: string, orgId: string, from: string, to: string): Promise<CalendarEvent[]> {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const [meetings, tasks, calendarEvents] = await Promise.all([
      // Meetings from Outlook/Teams (currently from Zeva DB, later from Graph)
      this.prisma.meeting.findMany({
        where: {
          organizationId: orgId,
          startsAt: { gte: fromDate, lte: toDate },
        },
        include: { organizer: { select: { name: true } } },
        orderBy: { startsAt: 'asc' },
      }),

      // Task due dates from Jira (currently from Zeva DB, later from Jira sync)
      this.prisma.task.findMany({
        where: {
          organizationId: orgId,
          assigneeId: userId,
          dueDate: { gte: fromDate, lte: toDate },
          status: { not: 'done' },
        },
        include: { project: { select: { key: true } } },
        orderBy: { dueDate: 'asc' },
      }),

      // Explicit calendar events (focus blocks, etc.)
      this.prisma.calendarEvent.findMany({
        where: {
          organizationId: orgId,
          userId,
          startsAt: { gte: fromDate, lte: toDate },
        },
        orderBy: { startsAt: 'asc' },
      }),
    ]);

    const events: CalendarEvent[] = [];

    // Map meetings → calendar events
    for (const m of meetings) {
      events.push({
        id: m.id,
        title: m.title,
        startsAt: m.startsAt.toISOString(),
        endsAt: m.endsAt.toISOString(),
        type: 'meeting',
        source: m.sourceSystem ?? 'outlook',
        color: '#6c63ff', // brand purple
        meta: { organizer: m.organizer?.name, agenda: m.agenda },
      });
    }

    // Map task due dates → calendar events (single-point, shown at 9am)
    for (const t of tasks) {
      if (!t.dueDate) continue;
      const due = new Date(t.dueDate);
      due.setHours(9, 0, 0, 0);
      const dueEnd = new Date(due);
      dueEnd.setHours(9, 30);

      events.push({
        id: `task-${t.id}`,
        title: `📋 ${t.project?.key ? `[${t.project.key}] ` : ''}${t.title}`,
        startsAt: due.toISOString(),
        endsAt: dueEnd.toISOString(),
        type: 'task_due',
        source: t.sourceSystem ?? 'jira',
        color: t.priority === 'high' || t.priority === 'critical' ? '#ef4444' : '#f59e0b',
        meta: { taskId: t.id, priority: t.priority, status: t.status },
      });
    }

    // Map explicit calendar events (focus blocks)
    for (const ce of calendarEvents) {
      events.push({
        id: ce.id,
        title: ce.title,
        startsAt: ce.startsAt.toISOString(),
        endsAt: ce.endsAt.toISOString(),
        type: ce.type as CalendarEvent['type'],
        source: ce.sourceSystem ?? 'zeva',
        color: ce.type === 'focus' ? '#3ddc97' : '#64748b',
      });
    }

    // Sort all events by start time
    events.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());

    return events;
  }
}
