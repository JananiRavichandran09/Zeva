import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { JwtAuthGuard } from '../../core/auth/guards/jwt-auth.guard';
import '../../core/auth/types';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post('chat')
  chat(@Body() body: { message: string }, @Req() req: Request) {
    return this.aiChatService.chat(req.user!.userId, req.user!.orgId, body.message);
  }
}
