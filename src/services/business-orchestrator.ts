import { GeminiService } from './gemini';
import { OrchestratorPayload } from '@/types';

export const BusinessOrchestrator = {
  /**
   * Processes user requests through the Business OS orchestration layer.
   * Currently, it simply forwards the request to GeminiService, but it is structured
   * to accept full organization context and message history to support future specialized agents.
   */
  async ask({ organization, messages, prompt }: OrchestratorPayload): Promise<string> {
    // Forward the request to Gemini, passing along context if needed
    // In the future, this method will query agents/ memory/ and orchestrate multi-agent workflow
    console.log(`[BusinessOrchestrator] Processing request for workspace: ${organization.name}`);
    return GeminiService.ask(prompt, messages);
  }
};
