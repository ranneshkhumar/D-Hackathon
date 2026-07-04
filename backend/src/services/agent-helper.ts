import { LLMService } from './llm.service';
import { AgentResult } from '../types';

export async function runGeminiAgent(
  agentName: string,
  systemInstruction: string,
  prompt: string,
  fallbackResult: AgentResult
): Promise<AgentResult> {
  console.log(`[Agent ${agentName}] Contacting Google Gemini LLM API...`);
  try {
    const result = await LLMService.askJson<any>(prompt, systemInstruction);
    
    if (result && result.summary && Array.isArray(result.issues)) {
      return {
        agentName,
        summary: result.summary,
        issues: result.issues,
        recommendations: result.recommendations || [],
        confidence: result.confidence || 0.9,
        rawJson: result.rawJson || result
      };
    }
  } catch (error) {
    console.warn(`[Agent ${agentName}] Gemini API check failed or offline. Reverting to sandbox simulation:`, error instanceof Error ? error.message : String(error));
  }
  
  return fallbackResult;
}
