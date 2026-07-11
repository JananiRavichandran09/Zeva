import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'

export interface RealtimeNotification {
  id: string
  type: string
  title: string
  body?: string
  userId: string
  organizationId: string
  createdAt: string
}

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/realtime',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server

  private readonly logger = new Logger(NotificationsGateway.name)

  handleConnection(client: Socket) {
    const userId = client.handshake.query['userId'] as string | undefined
    if (userId) {
      void client.join(`user:${userId}`)
      this.logger.log(`Client connected: ${client.id} (user: ${userId})`)
    } else {
      this.logger.log(`Client connected: ${client.id} (anonymous)`)
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`)
  }

  /** Send a notification to a specific user */
  sendToUser(userId: string, notification: RealtimeNotification) {
    this.server.to(`user:${userId}`).emit('notification', notification)
  }

  /** Send to all users in an organization */
  sendToOrg(orgId: string, event: string, payload: unknown) {
    this.server.to(`org:${orgId}`).emit(event, payload)
  }

  /** Send a dashboard refresh signal (e.g., after a task status change) */
  sendDashboardRefresh(userId: string) {
    this.server.to(`user:${userId}`).emit('dashboard:refresh')
  }
}
