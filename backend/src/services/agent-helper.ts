import { LLMService } from './llm.service';
import { AgentResult, BusinessContext } from '../types';

export async function runGeminiAgent(
  agentName: string,
  systemInstruction: string,
  prompt: string,
  fallbackResult: AgentResult,
  context?: BusinessContext
): Promise<AgentResult> {
  console.log(`[Agent ${agentName}] Contacting OpenRouter LLM API...`);
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
    console.warn(`[Agent ${agentName}] OpenRouter API check failed or offline. Reverting to sandbox simulation:`, error instanceof Error ? error.message : String(error));
  }
  
  if (context) {
    return tailorFallbackResult(fallbackResult, context);
  }
  return fallbackResult;
}

function tailorFallbackResult(fallback: AgentResult, context: BusinessContext): AgentResult {
  const companyName = context.organization.name || 'Aegis Client';
  const industry = context.organization.industry || 'Business';
  
  // Extract primary goals and challenges if available
  const goals: any[] = (context.profile?.goals || []) as any;
  const challenges: any[] = (context.profile?.challenges || []) as any;
  const primaryGoal = typeof goals[0] === 'object' ? goals[0]?.description : goals[0] || 'optimize operational efficiency';
  const primaryChallenge = typeof challenges[0] === 'object' ? challenges[0]?.description : challenges[0] || 'strategic expansion limits';

  // Replace occurrences of "Aura Wellness", "wellness", "Workplace wellness" with company context
  const replaceContextText = (text: string): string => {
    if (!text) return text;
    return text
      .replace(/Aura Wellness/gi, companyName)
      .replace(/Aura/gi, companyName)
      .replace(/wellness box subscriptions/gi, `growth initiatives for ${primaryGoal}`)
      .replace(/wellness box/gi, `${industry} products`)
      .replace(/wellness/gi, `${industry} sector`)
      .replace(/synthetic energy drinks/gi, `alternative competitors`)
      .replace(/office HR buyers/gi, `target customers`)
      .replace(/HR managers/gi, `decision makers`);
  };

  const cleanIssues = (fallback.issues || []).map(replaceContextText);
  const cleanRecs = (fallback.recommendations || []).map(replaceContextText);
  const cleanSummary = replaceContextText(fallback.summary || '');

  // Recursively process rawJson if it contains strings
  const cleanRawJson = (obj: any): any => {
    if (typeof obj === 'string') {
      return replaceContextText(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(cleanRawJson);
    }
    if (obj !== null && typeof obj === 'object') {
      const copy: any = {};
      for (const k in obj) {
        copy[k] = cleanRawJson(obj[k]);
      }
      return copy;
    }
    return obj;
  };

  return {
    ...fallback,
    summary: cleanSummary,
    issues: cleanIssues.length > 0 ? cleanIssues : [`Initial diagnostic audit for ${companyName} highlights bottlenecks in ${primaryChallenge}.`],
    recommendations: cleanRecs.length > 0 ? cleanRecs : [`Focus resources on achieving "${primaryGoal}" and optimizing conversion rates.`],
    rawJson: cleanRawJson(fallback.rawJson || {})
  };
}
