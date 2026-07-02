import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns role-aware dashboard data.
   * - admin → org health (members, departments, integrations, projects, tasks summary)
   * - manager → team stats (members, tasks by status, blockers, late tasks)
   * - developer/qa/hr → personal briefing (my tasks, today's meetings, recommendations)
   */
  async getDashboard(userId: string, orgId: string, roleKey: string) {
    if (roleKey === 'admin') {
      return this.getAdminDashboard(orgId);
    } else if (roleKey === 'manager' || roleKey === 'lead') {
      return this.getManagerDashboard(userId, orgId);
    } else {
      return this.getEmployeeDashboard(userId, orgId);
    }
  }

  private async getAdminDashboard(orgId: string) {
    const [members, departments, teams, projects, integrations, taskStats] =
      await Promise.all([
        this.prisma.membership.count({
          where: { organizationId: orgId, status: 'active' },
        }),
        this.prisma.department.count({ where: { organizationId: orgId } }),
        this.prisma.team.count({ where: { organizationId: orgId } }),
        this.prisma.project.count({ where: { organizationId: orgId } }),
        this.prisma.integration.count({ where: { organizationId: orgId } }),
        this.getTaskStats(orgId),
      ]);

    return {
      type: 'admin',
      org: { members, departments, teams, projects, integrations },
      tasks: taskStats,
    };
  }

  private async getManagerDashboard(userId: string, orgId: string) {
    // Get team members (direct reports)
    const teamMembers = await this.prisma.user.findMany({
      where: { managerId: userId },
      select: { id: true, name: true, photoUrl: true, jobTitle: true },
    });

    const teamMemberIds = teamMembers.map((m) => m.id);

    // Get task stats for the team
    const [teamTasks, blockers, lateTasks] = await Promise.all([
      this.prisma.task.groupBy({
        by: ['status'],
        where: { organizationId: orgId, assigneeId: { in: teamMemberIds } },
        _count: true,
      }),
      this.prisma.task.count({
        where: {
          organizationId: orgId,
          assigneeId: { in: teamMemberIds },
          status: 'todo',
          priority: { in: ['high', 'critical'] },
        },
      }),
      this.prisma.task.count({
        where: {
          organizationId: orgId,
          assigneeId: { in: teamMemberIds },
          dueDate: { lt: new Date() },
          status: { not: 'done' },
        },
      }),
    ]);

    const todayMeetings = await this.getTodayMeetings(orgId);

    return {
      type: 'manager',
      team: {
        members: teamMembers,
        memberCount: teamMembers.length,
      },
      tasks: {
        byStatus: Object.fromEntries(
          teamTasks.map((t) => [t.status, t._count]),
        ),
        blockers,
        lateTasks,
      },
      meetings: todayMeetings,
    };
  }

  private async getEmployeeDashboard(userId: string, orgId: string) {
    const [myTasks, todayMeetings, recommendations] = await Promise.all([
      this.prisma.task.findMany({
        where: {
          organizationId: orgId,
          assigneeId: userId,
          status: { not: 'done' },
        },
        include: { project: { select: { name: true, key: true } } },
        orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
        take: 10,
      }),
      this.getTodayMeetings(orgId),
      this.prisma.recommendation.findMany({
        where: { organizationId: orgId, userId, status: 'shown' },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return {
      type: 'employee',
      tasks: myTasks,
      meetings: todayMeetings,
      recommendations,
    };
  }

  private async getTaskStats(orgId: string) {
    const stats = await this.prisma.task.groupBy({
      by: ['status'],
      where: { organizationId: orgId },
      _count: true,
    });
    return Object.fromEntries(stats.map((s) => [s.status, s._count]));
  }

  private async getTodayMeetings(orgId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.meeting.findMany({
      where: {
        organizationId: orgId,
        startsAt: { gte: today, lt: tomorrow },
      },
      include: {
        organizer: { select: { id: true, name: true, photoUrl: true } },
      },
      orderBy: { startsAt: 'asc' },
    });
  }
}
