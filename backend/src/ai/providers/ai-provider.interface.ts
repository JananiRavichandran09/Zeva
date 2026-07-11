/**
 * The AiProvider interface — every AI provider (mock, OpenAI, etc.)
 * implements this so the rest of the system doesn't care which is active.
 */
export interface AiProvider {
  /**
   * Generate a text response given a system prompt and user message.
   */
  generateText(systemPrompt: string, userMessage: string): Promise<string>;

  /**
   * Generate a structured response (JSON) given context.
   */
  generateJson<T>(systemPrompt: string, userMessage: string): Promise<T>;
}
