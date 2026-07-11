import { Module } from '@nestjs/common';
import { IntentRouterService } from './intent-router/intent-router.service';
import { AiChatController } from './chat/ai-chat.controller';
import { AiChatService } from './chat/ai-chat.service';
import { MockAiProvider } from './providers/mock-ai.provider';
import { AiProviderFactory } from './providers/ai-provider.factory';

@Module({
  controllers: [AiChatController],
  providers: [
    IntentRouterService,
    AiChatService,
    MockAiProvider,
    AiProviderFactory,
  ],
  exports: [AiChatService, IntentRouterService],
})
export class AiModule {}
