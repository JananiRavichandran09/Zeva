import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import '../../core/auth/types';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Req() req: Request) {
    return this.dashboardService.getDashboard(
      req.user!.userId,
      req.user!.orgId,
      req.user!.roleKey,
    );
  }
}
