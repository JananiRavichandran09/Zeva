import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../platform/prisma';
import { NotificationsGateway } from '../../realtime/notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: NotificationsGateway,
  ) {}

  async findAll(userId: string, orgId: string) {
    return this.prisma.notification.findMany({
      where: { userId, organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { readAt: new Date() },
    });
  }

  async markAllRead(userId: string, orgId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, organizationId: orgId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string, orgId: string) {
    return this.prisma.notification.count({
      where: { userId, organizationId: orgId, readAt: null },
    });
  }

  /** Create a notification and push it in real-time */
  async create(data: {
    userId: string;
    organizationId: string;
    type: string;
    title: string;
    body?: string;
  }) {
    const notification = await this.prisma.notification.create({ data });

    // Push via WebSocket
    this.gateway.sendToUser(data.userId, {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body ?? undefined,
      userId: notification.userId,
      organizationId: notification.organizationId,
      createdAt: notification.createdAt.toISOString(),
    });

    return notification;
  }
}
