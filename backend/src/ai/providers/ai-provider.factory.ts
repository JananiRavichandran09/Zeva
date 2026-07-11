import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MockAiProvider } from './mock-ai.provider';
import type { AiProvider } from './ai-provider.interface';

/**
 * Factory that returns the correct AI provider based on config.
 * AI_PROVIDER=mock → MockAiProvider (no API key needed)
 * AI_PROVIDER=openai → OpenAiProvider (future, needs OPENAI_API_KEY)
 */
@Injectable()
export class AiProviderFactory {
  constructor(
    private readonly config: ConfigService,
    private readonly mockProvider: MockAiProvider,
  ) {}

  getProvider(): AiProvider {
    const provider = this.config.get<string>('AI_PROVIDER', 'mock');

    switch (provider) {
      case 'openai':
        // TODO: return OpenAiProvider once OPENAI_API_KEY is configured
        // For now, fall through to mock
        return this.mockProvider;
      case 'mock':
      default:
        return this.mockProvider;
    }
  }
}
