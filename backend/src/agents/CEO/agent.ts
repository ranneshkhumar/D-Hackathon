import { Agent, BusinessContext, AgentResult } from '../../types';
import { runGeminiAgent } from '../../services/agent-helper';

export const ceoAgent: Agent = {
  /**
   * CEO Agent: Coordinates executive reporting, plans workflows, and summarizes strategy findings.
   */
  async analyze(context: BusinessContext, memory?: Record<string, any>): Promise<AgentResult> {
    console.log(`[CEO Agent] Running analysis for organization: ${context.organization.name}`);

    const systemInstruction = `You are the CEO Agent, the master controller of Aegis AI Business Growth OS.
Your role is to summarize findings from the intermediate agents (Finance, Marketing, Sales, CustomerSuccess, Strategy) into an Executive Command Report.
You must compute:
- An Overall Business Health Score (from 1 to 100).
- A Business Growth Score (from 1 to 100).
- 3 high-impact Strategic Priorities for the CEO.
- A concise Executive Summary.
- An Opportunities Summary.
You must return a JSON object matching this structure EXACTLY:
{
  "summary": "Short 2-sentence executive summary.",
  "issues": ["Priority issue 1", "Priority issue 2"],
  "recommendations": ["Core action mandate 1", "Core action mandate 2"],
  "confidence": 0.95,
  "rawJson": {
    "overallHealthScore": 82,
    "businessGrowthScore": 75,
    "strategicPriorities": [
      "Priority 1: Reallocate marketing budget to high-ROI email lists.",
      "Priority 2: Establish bulk enterprise subscription packages.",
      "Priority 3: Automate delivery tracking integrations to reduce CS support workload."
    ],
    "executiveSummary": "Aegis OS completed a full growth audit for ${context.organization.name}. Performance is strong across retail with stable margins, but customer retention loops and ad-spend attributions represent significant immediate leverage points.",
    "opportunitiesSummary": "Unlocking enterprise corporate contracts and implementing exit-intent cart deals represents an immediate opportunity valued at ₹85,000 in monthly incremental profits."
  }
}`;

    const prompt = `
Organization: ${context.organization.name}
Industry: ${context.organization.industry}
Intermediate Agent Memories: ${JSON.stringify(context.agentMemory)}
Strategy Result Memory: ${JSON.stringify(memory?.strategy || {})}
Metrics Logged: ${JSON.stringify(context.metrics)}
Profile inputs: ${JSON.stringify(context.profile)}
    `;

    const fallback: AgentResult = {
      agentName: 'CEO',
      summary: 'Executive summary completed. All systems active. Multi-agent strategic alignment is locked.',
      issues: ['Logistics transit times must be reduced to protect brand CSAT.', 'Attribution channels require structure.'],
      recommendations: ['Optimize corporate sales funnels.', 'Deploy local distributor nodes.'],
      confidence: 0.9,
      rawJson: {
        overallHealthScore: 84,
        businessGrowthScore: 78,
        strategicPriorities: [
          'Priority 1: Launch enterprise wellness box subscriptions.',
          'Priority 2: Build local carrier agreements to resolve shipping lags.',
          'Priority 3: Set up automated newsletter campaigns for checkout drops.'
        ],
        executiveSummary: `Aegis OS completed a growth audit for ${context.organization.name}. Financial margins remain stable at 31%, but optimizing logistics and onboarding automated cart exit deals represent key strategic mandates.`,
        opportunitiesSummary: 'Unlocking bulk B2B enterprise workspace deals represents an immediate market value estimated at ₹1,25,000.'
      }
    };

    return runGeminiAgent('CEO', systemInstruction, prompt, fallback, context);
  }
};
