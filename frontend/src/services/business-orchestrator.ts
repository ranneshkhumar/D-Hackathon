import { ApiClient } from './api-client';
import { OpenRouterService } from './openrouter';
import { OrchestratorPayload } from '@/types';

export const BusinessOrchestrator = {
  /**
   * Processes user requests through the Business OS orchestration layer.
   * Redirects user queries to the OpenRouter backend via backend API,
   * falling back to client-side demonstration/fallback mode if backend fails.
   */
  async ask({ organization, messages, prompt }: OrchestratorPayload): Promise<string> {
    console.log(`[BusinessOrchestrator] Routing request for workspace: ${organization.name} through backend API to OpenRouter`);
    
    try {
      const result = await ApiClient.sendChatMessage(organization.id, prompt);
      if (result && result.response) {
        return result.response;
      }
    } catch (error) {
      console.warn('[BusinessOrchestrator] Backend chat API failed. Falling back to client-side OpenRouter fallback mode.', error);
    }
    
    // Fallback if backend is unavailable
    return OpenRouterService.ask(prompt, messages);
  }
};
