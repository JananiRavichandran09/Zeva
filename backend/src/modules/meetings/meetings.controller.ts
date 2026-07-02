import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import '../../core/auth/types';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('meetings')
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Get()
  findAll(@Req() req: Request) {
    return this.meetingsService.findAll(req.user!.orgId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.meetingsService.findOne(id, req.user!.orgId);
  }

  @Post()
  create(
    @Body()
    dto: {
      title: string;
      startsAt: string;
      endsAt: string;
      location?: string;
      agenda?: string;
      organizerId?: string;
    },
    @Req() req: Request,
  ) {
    return this.meetingsService.create(req.user!.orgId, dto);
  }
}
