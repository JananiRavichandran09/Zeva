import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import '../../core/auth/types';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @Req() req: Request,
    @Query('assignee') assigneeId?: string,
    @Query('status') status?: string,
    @Query('project') projectId?: string,
  ) {
    return this.tasksService.findAll(req.user!.orgId, {
      assigneeId,
      status,
      projectId,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.tasksService.findOne(id, req.user!.orgId);
  }

  @Post()
  create(
    @Body()
    dto: {
      title: string;
      description?: string;
      projectId?: string;
      assigneeId?: string;
      priority?: string;
      dueDate?: string;
    },
    @Req() req: Request,
  ) {
    return this.tasksService.create(req.user!.orgId, dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    dto: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      assigneeId?: string;
      dueDate?: string;
    },
    @Req() req: Request,
  ) {
    return this.tasksService.update(id, req.user!.orgId, dto);
  }
}
