import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { NotificationsService } from './notifications.service'
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard'
import '../../core/auth/types'
import type { Request } from 'express'

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll(@Req() req: Request) {
    return this.notificationsService.findAll(req.user!.userId, req.user!.orgId)
  }

  @Get('unread-count')
  getUnreadCount(@Req() req: Request) {
    return this.notificationsService.getUnreadCount(req.user!.userId, req.user!.orgId)
  }

  @Post(':id/read')
  markRead(@Param('id') id: string, @Req() req: Request) {
    return this.notificationsService.markRead(id, req.user!.userId)
  }

  @Post('read-all')
  markAllRead(@Req() req: Request) {
    return this.notificationsService.markAllRead(req.user!.userId, req.user!.orgId)
  }
}
