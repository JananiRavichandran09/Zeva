import { Injectable } from '@nestjs/common';

export type IntentDomain =
  | 'daily_briefing'
  | 'meeting_prep'
  | 'task_query'
  | 'workload_query'
  | 'calendar_action'
  | 'general';

export interface RoutedIntent {
  domain: IntentDomain;
  entities: Record<string, string>;
  originalMessage: string;
}

/**
 * Intent Router — classifies user input into a domain + extracts entities.
 * This is the brain of the AI pipeline (see docs/08-ai-architecture.md).
 */
@Injectable()
export class IntentRouterService {
  route(message: string): RoutedIntent {
    const lower = message.toLowerCase();

    if (
      lower.includes('plate') ||
      lower.includes('briefing') ||
      lower.includes('today') ||
      lower.includes('morning')
    ) {
      return {
        domain: 'daily_briefing',
        entities: {},
        originalMessage: message,
      };
    }

    if (
      lower.includes('prep') ||
      lower.includes('meeting') ||
      lower.includes('sprint') ||
      lower.includes('standup')
    ) {
      return { domain: 'meeting_prep', entities: {}, originalMessage: message };
    }

    if (
      lower.includes('task') ||
      lower.includes('overdue') ||
      lower.includes('blocker') ||
      lower.includes('done') ||
      lower.includes('mark')
    ) {
      return { domain: 'task_query', entities: {}, originalMessage: message };
    }

    if (
      lower.includes('team') ||
      lower.includes('overloaded') ||
      lower.includes('capacity') ||
      lower.includes('workload')
    ) {
      return {
        domain: 'workload_query',
        entities: {},
        originalMessage: message,
      };
    }

    if (
      lower.includes('reschedule') ||
      lower.includes('move') ||
      lower.includes('cancel') ||
      lower.includes('focus time')
    ) {
      return {
        domain: 'calendar_action',
        entities: {},
        originalMessage: message,
      };
    }

    return { domain: 'general', entities: {}, originalMessage: message };
  }
}
