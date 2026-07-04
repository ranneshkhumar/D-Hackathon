import { Agent, BusinessContext, AgentResult } from '../../types';
import { runGeminiAgent } from '../../services/agent-helper';

export const strategyAgent: Agent = {
  /**
   * Strategy Agent: Compiles intermediate findings from all agents and designs the Growth Strategy plan.
   */
  async analyze(context: BusinessContext, memory?: Record<string, any>): Promise<AgentResult> {
    console.log(`[Strategy Agent] Compiling growth strategy based on intermediate findings...`);

    const systemInstruction = `You are the Strategy Agent of Aegis AI Business Growth OS.
Your role is to aggregate findings from the Finance, Marketing, Sales, and CustomerSuccess agents and formulate a cohesive, actionable 12-month growth strategy blueprint.
You must compute:
- A Core Growth Score (from 1 to 100).
- An Opportunity Value (e.g. estimate how much revenue is unlocked, return a number in INR).
- 12-month strategic timeline milestones.
You must return a JSON object matching this structure EXACTLY:
{
  "summary": "Short 2-sentence strategy plan summary.",
  "issues": ["Key issue 1 identified from other agents", "Key issue 2"],
  "recommendations": ["Core strategy recommendation 1", "Core strategy recommendation 2"],
  "confidence": 0.95,
  "rawJson": {
    "strategicObjectives": [
      "Objective 1: Establish corporate social commerce channels.",
      "Objective 2: Renegotiate supplier contracts to capture higher profit margin."
    ],
    "twelveMonthTimeline": {
      "Month 1-3 (Setup)": ["Setup corporate outreach landing page variants.", "Configure cart exit discount popups."],
      "Month 4-6 (Launch)": ["Roll out corporate wellness subscription packages.", "Launch employee gift basket initiatives."],
      "Month 7-12 (Scale)": ["Optimize Google Search SEO for workplace wellness keywords.", "Scale regional branches to meet bulk enterprise contracts."]
    },
    "coreGrowthScore": 72,
    "opportunityValue": 85000
  }
}`;

    const prompt = `
Organization: ${context.organization.name}
Industry: ${context.organization.industry}
Intermediate Agent Memories: ${JSON.stringify(context.agentMemory)}
Metrics Logged: ${JSON.stringify(context.metrics)}
Profile inputs: ${JSON.stringify(context.profile)}
    `;

    const fallback: AgentResult = {
      agentName: 'Strategy',
      summary: 'Formulated a comprehensive corporate wellness growth strategy. Placed primary focus on enterprise bulk subscriptions and logistics optimizations.',
      issues: ['Attribution tracking gaps squeeze ROI calculations.', 'Supply chain shipping constraints slow down scaling velocity.'],
      recommendations: ['Deploy enterprise-focused landing page templates.', 'Scale local logistics distribution network.'],
      confidence: 0.9,
      rawJson: {
        strategicObjectives: [
          'Objective 1: Expand into B2B enterprise workspace subscription boxes.',
          'Objective 2: Lower logistics delivery cycles and packaging overheads.'
        ],
        twelveMonthTimeline: {
          'Month 1-3 (Setup)': ['Build corporate sales pipeline templates.', 'Configure logistics SMS tracking loops.'],
          'Month 4-6 (Launch)': ['Onboard local distributor partners.', 'Deploy target ad spends targeting HR managers.'],
          'Month 7-12 (Scale)': ['Expand bulk product catalog sizes.', 'Scale enterprise sales contracts nationwide.']
        },
        coreGrowthScore: 78,
        opportunityValue: 125000
      }
    };

    return runGeminiAgent('Strategy', systemInstruction, prompt, fallback);
  }
};
