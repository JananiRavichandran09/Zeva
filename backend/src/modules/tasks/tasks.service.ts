import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma';

interface CreateTaskDto {
  title: string;
  description?: string;
  projectId?: string;
  assigneeId?: string;
  priority?: string;
  dueDate?: string;
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  dueDate?: string;
}

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    orgId: string,
    filters?: { assigneeId?: string; status?: string; projectId?: string },
  ) {
    const where: Record<string, unknown> = { organizationId: orgId };
    if (filters?.assigneeId) where['assigneeId'] = filters.assigneeId;
    if (filters?.status) where['status'] = filters.status;
    if (filters?.projectId) where['projectId'] = filters.projectId;

    return this.prisma.task.findMany({
      where,
      include: {
        assignee: { select: { id: true, name: true, photoUrl: true } },
        project: { select: { id: true, name: true, key: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string, orgId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, organizationId: orgId },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, photoUrl: true },
        },
        project: { select: { id: true, name: true, key: true } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async create(orgId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        organizationId: orgId,
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        assigneeId: dto.assigneeId,
        priority: dto.priority ?? 'medium',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
      include: {
        assignee: { select: { id: true, name: true, photoUrl: true } },
        project: { select: { id: true, name: true, key: true } },
      },
    });
  }

  async update(id: string, orgId: string, dto: UpdateTaskDto) {
    // Verify task belongs to this org
    const existing = await this.prisma.task.findFirst({
      where: { id, organizationId: orgId },
    });
    if (!existing) throw new NotFoundException('Task not found');

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status && { status: dto.status }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.assigneeId !== undefined && { assigneeId: dto.assigneeId }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
      },
      include: {
        assignee: { select: { id: true, name: true, photoUrl: true } },
        project: { select: { id: true, name: true, key: true } },
      },
    });
  }
}
