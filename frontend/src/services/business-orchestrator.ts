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
    
    let businessData: any = null;
    if (typeof window !== 'undefined') {
      const savedDataRaw = localStorage.getItem(`aegis_business_data_${organization.id}`);
      if (savedDataRaw) {
        try {
          businessData = JSON.parse(savedDataRaw);
        } catch (e) {}
      }
    }

    try {
      const result = await ApiClient.sendChatMessage(organization.id, prompt, undefined, businessData);
      if (result && result.response) {
        return result.response;
      }
    } catch (error) {
      console.warn('[BusinessOrchestrator] Backend chat API failed. Falling back to client-side OpenRouter fallback mode.', error);
    }
    
    // Fallback if backend is unavailable
    return OpenRouterService.ask(prompt, messages);
  },

  async askWithAgents({ organization, messages, prompt }: OrchestratorPayload): Promise<{ response: string; agents?: any[] }> {
    console.log(`[BusinessOrchestrator] Routing agent request for workspace: ${organization.name} through backend API to OpenRouter`);
    
    let businessData: any = null;
    if (typeof window !== 'undefined') {
      const savedDataRaw = localStorage.getItem(`aegis_business_data_${organization.id}`);
      if (savedDataRaw) {
        try {
          businessData = JSON.parse(savedDataRaw);
        } catch (e) {}
      }
    }

    try {
      const result = await ApiClient.sendChatMessage(organization.id, prompt, undefined, businessData);
      if (result && result.response) {
        return {
          response: result.response,
          agents: result.rawJson?.agents || []
        };
      }
    } catch (error) {
      console.warn('[BusinessOrchestrator] Backend chat API failed. Falling back to client-side OpenRouter fallback mode.', error);
    }
    
    // Fallback if backend is unavailable
    const fallbackText = await OpenRouterService.ask(prompt, messages);
    return { response: fallbackText };
  }
};
