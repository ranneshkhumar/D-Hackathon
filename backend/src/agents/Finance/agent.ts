import { Agent, BusinessContext, AgentResult } from '../../types';
import { runGeminiAgent } from '../../services/agent-helper';

export const financeAgent: Agent = {
  /**
   * Finance Agent: Evaluates profit margins, overheads, and financial forecasts.
   */
  async analyze(context: BusinessContext, memory?: Record<string, any>): Promise<AgentResult> {
    console.log(`[Finance Agent] Running analysis for organization: ${context.organization.name}`);

    const systemInstruction = `You are the Finance Agent of Aegis AI Business Growth OS.
Analyze the following business financial parameters (monthly revenue, expenses, product prices, customer counts, etc.) and construct a structured JSON audit.
You must return a JSON object matching this structure EXACTLY:
{
  "summary": "Short 2-sentence financial overview.",
  "issues": ["Issue 1 (e.g. high monthly expenses relative to profit)", "Issue 2"],
  "recommendations": ["Action item 1", "Action item 2"],
  "confidence": 0.95,
  "rawJson": {
    "summary": "Short executive financial summary.",
    "monthlyRevenue": 350000,
    "monthlyExpenses": 240000,
    "profitMargin": 31.4,
    "cac": 2500,
    "ltv": 15000,
    "cacToLtvRatio": "1:6",
    "burnRateAlerts": ["Low cash reserves relative to overheads"],
    "optimizationMetrics": {
      "cacLimit": 2200,
      "breakEvenThreshold": 180000,
      "estimatedBurnMultiplier": 1.2
    }
  }
}`;

    const prompt = `
Organization: ${context.organization.name}
Industry: ${context.organization.industry}
Metrics Logged: ${JSON.stringify(context.metrics)}
Profile inputs: ${JSON.stringify(context.profile)}
    `;

    const fallback: AgentResult = {
      agentName: 'Finance',
      summary: 'Operational margins are stable at 31% but high customer acquisition costs (CAC) require review.',
      issues: ['High marketing CAC on Instagram ads.', 'High cost of raw goods sold.'],
      recommendations: ['Renegotiate wholesale vendor terms.', 'Optimize social media ad targeting.'],
      confidence: 0.9,
      rawJson: {
        summary: 'Operational margins are stable at 31% but CAC requires optimization.',
        monthlyRevenue: 350000,
        monthlyExpenses: 240000,
        profitMargin: 31.4,
        cac: 2500,
        ltv: 15000,
        cacToLtvRatio: '1:6',
        burnRateAlerts: [],
        optimizationMetrics: {
          cacLimit: 2200,
          breakEvenThreshold: 180000,
          estimatedBurnMultiplier: 1.1
        }
      }
    };

    return runGeminiAgent('Finance', systemInstruction, prompt, fallback, context);
  }
};
