import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import '../../core/auth/types';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Get()
  getCurrent(@Req() req: Request) {
    return this.orgService.findCurrent(req.user!.orgId);
  }

  @Get('departments')
  getDepartments(@Req() req: Request) {
    return this.orgService.getDepartments(req.user!.orgId);
  }

  @Get('teams')
  getTeams(@Req() req: Request) {
    return this.orgService.getTeams(req.user!.orgId);
  }
}
