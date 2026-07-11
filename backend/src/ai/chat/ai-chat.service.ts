import { Injectable } from '@nestjs/common';
import { AiProviderFactory } from '../providers/ai-provider.factory';
import { IntentRouterService } from '../intent-router/intent-router.service';
import { PrismaService } from '../../platform/prisma';

export interface ChatResponse {
  message: string;
  intent: string;
  suggestions: string[];
}

@Injectable()
export class AiChatService {
  constructor(
    private readonly providerFactory: AiProviderFactory,
    private readonly intentRouter: IntentRouterService,
    private readonly prisma: PrismaService,
  ) {}

  async chat(userId: string, orgId: string, userMessage: string): Promise<ChatResponse> {
    // 1. Route the intent
    const routed = this.intentRouter.route(userMessage);

    // 2. Build context based on domain (RBAC-scoped)
    const systemPrompt = await this.buildContext(userId, orgId, routed.domain);

    // 3. Generate response from the AI provider
    const provider = this.providerFactory.getProvider();
    const message = await provider.generateText(systemPrompt, userMessage);

    // 4. Generate follow-up suggestions
    const suggestions = this.getSuggestions(routed.domain);

    return { message, intent: routed.domain, suggestions };
  }

  private async buildContext(userId: string, orgId: string, domain: string): Promise<string> {
    let context = `You are Zeva, an AI Work Coordinator. You help employees manage their work day.\n`;
    context += `User is in organization: ${orgId}\n`;

    // Add domain-specific context
    switch (domain) {
      case 'daily_briefing':
      case 'task_query': {
        const tasks = await this.prisma.task.findMany({
          where: { organizationId: orgId, assigneeId: userId, status: { not: 'done' } },
          take: 10,
          orderBy: { priority: 'desc' },
        });
        context += `Active tasks: ${JSON.stringify(tasks.map(t => ({ title: t.title, status: t.status, priority: t.priority, due: t.dueDate })))}\n`;
        break;
      }
      case 'meeting_prep': {
        const meetings = await this.prisma.meeting.findMany({
          where: { organizationId: orgId },
          take: 5,
          orderBy: { startsAt: 'asc' },
        });
        context += `Upcoming meetings: ${JSON.stringify(meetings.map(m => ({ title: m.title, start: m.startsAt, agenda: m.agenda })))}\n`;
        break;
      }
      case 'workload_query': {
        const teamMembers = await this.prisma.user.findMany({
          where: { managerId: userId },
          select: { id: true, name: true },
        });
        context += `Direct reports: ${JSON.stringify(teamMembers)}\n`;
        break;
      }
    }

    return context;
  }

  private getSuggestions(domain: string): string[] {
    switch (domain) {
      case 'daily_briefing':
        return ['Show my tasks', 'Prep me for my next meeting', 'Who needs help on my team?'];
      case 'meeting_prep':
        return ['Show related tasks', 'What did we discuss last time?', 'Block focus time after'];
      case 'task_query':
        return ['Mark highest priority done', "What's blocking me?", 'Show my calendar'];
      case 'workload_query':
        return ['Reassign a task', 'Show sprint progress', 'Who has capacity?'];
      default:
        return ["What's on my plate today?", 'Prep me for my next meeting', 'Show my tasks'];
    }
  }
}
