import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import '../../core/auth/types';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /**
   * GET /api/calendar?from=2026-07-01&to=2026-07-07
   * Returns unified calendar events from all sources.
   */
  @Get()
  getCalendar(
    @Req() req: Request,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    // Default to current week if not specified
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Sunday
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    return this.calendarService.getUnifiedCalendar(
      req.user!.userId,
      req.user!.orgId,
      from ?? weekStart.toISOString(),
      to ?? weekEnd.toISOString(),
    );
  }
}
