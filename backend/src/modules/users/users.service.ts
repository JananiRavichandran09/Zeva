import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(orgId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: { organizationId: orgId, status: 'active' },
      include: {
        user: true,
        role: true,
        departmentR: true,
      },
    });

    return memberships.map((m) => ({
      id: m.user.id,
      name: m.user.name,
      email: m.user.email,
      jobTitle: m.user.jobTitle,
      department: m.departmentR?.name ?? m.user.department,
      photoUrl: m.user.photoUrl,
      role: m.role.key,
      roleName: m.role.name,
      managerId: m.user.managerId,
      status: m.user.status,
    }));
  }

  async findOne(userId: string, orgId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { userId_organizationId: { userId, organizationId: orgId } },
      include: {
        user: {
          include: {
            reports: { select: { id: true, name: true, email: true } },
          },
        },
        role: true,
        departmentR: true,
      },
    });

    if (!membership) return null;

    return {
      id: membership.user.id,
      name: membership.user.name,
      email: membership.user.email,
      jobTitle: membership.user.jobTitle,
      department: membership.departmentR?.name ?? membership.user.department,
      photoUrl: membership.user.photoUrl,
      role: membership.role.key,
      managerId: membership.user.managerId,
      directReports: membership.user.reports,
      status: membership.user.status,
    };
  }
}
