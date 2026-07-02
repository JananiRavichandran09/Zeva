import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async findCurrent(orgId: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        _count: {
          select: {
            memberships: true,
            departments: true,
            teams: true,
            projects: true,
            integrations: true,
          },
        },
      },
    });
    if (!org) throw new NotFoundException('Organization not found');

    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      domain: org.domain,
      counts: {
        members: org._count.memberships,
        departments: org._count.departments,
        teams: org._count.teams,
        projects: org._count.projects,
        integrations: org._count.integrations,
      },
    };
  }

  async getDepartments(orgId: string) {
    return this.prisma.department.findMany({
      where: { organizationId: orgId },
      include: { _count: { select: { memberships: true, teams: true } } },
    });
  }

  async getTeams(orgId: string) {
    return this.prisma.team.findMany({
      where: { organizationId: orgId },
      include: {
        department: { select: { name: true } },
        _count: { select: { members: true } },
      },
    });
  }
}
