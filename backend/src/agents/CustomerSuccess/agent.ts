import { Agent, BusinessContext, AgentResult } from '../../types';
import { runGeminiAgent } from '../../services/agent-helper';

export const customerSuccessAgent: Agent = {
  /**
   * Customer Success Agent: Assesses retention risk, churn rates, and user satisfaction details.
   */
  async analyze(context: BusinessContext, memory?: Record<string, any>): Promise<AgentResult> {
    console.log(`[CustomerSuccess Agent] Running analysis for organization: ${context.organization.name}`);

    const systemInstruction = `You are the Customer Success Agent of Aegis AI Business Growth OS.
Analyze the customer indicators (customer count, customer descriptions, target audience) and generate a structured JSON health and retention audit.
You must return a JSON object matching this structure EXACTLY:
{
  "summary": "Short 2-sentence customer success overview.",
  "issues": ["Issue 1 (e.g. rising subscription churn on core tiers)", "Issue 2"],
  "recommendations": ["Action item 1", "Action item 2"],
  "confidence": 0.95,
  "rawJson": {
    "summary": "Short executive CS summary.",
    "churnRiskScore": 24,
    "userSatisfactionScore": 88,
    "riskMitigationPlan": [
      "Launch a feedback loop campaign targeting inactive retail customers.",
      "Provide exclusive corporate loyalty subscription discounts."
    ],
    "csatMilestones": [
      "CSAT Target: 92% by introducing automated delivery confirmation texts.",
      "Reduce customer support response times below 15 minutes."
    ]
  }
}`;

    const prompt = `
Organization: ${context.organization.name}
Industry: ${context.organization.industry}
Metrics Logged: ${JSON.stringify(context.metrics)}
Profile inputs: ${JSON.stringify(context.profile)}
    `;

    const fallback: AgentResult = {
      agentName: 'CustomerSuccess',
      summary: 'Retention metrics are solid, churn risk is low at 18%, but satisfaction benchmarks are tracking slightly below target due to shipping logistics delay alerts.',
      issues: ['Post-purchase shipping delays causing support ticket spikes.', 'Loyalty retention workflows have not been set up.'],
      recommendations: ['Integrate automated SMS notifications with tracking links.', 'Introduce recurring monthly subscription discounts.'],
      confidence: 0.9,
      rawJson: {
        summary: 'Retention metrics are solid, but shipping delays are impacting user satisfaction scores.',
        churnRiskScore: 18,
        userSatisfactionScore: 84,
        riskMitigationPlan: [
          'Pre-notify customers about regional carrier shipping delays immediately.',
          'Issue apology coupon codes to customers experiencing transit times longer than 4 days.'
        ],
        csatMilestones: [
          'Improve delivery CSAT score to 90% in Q3.',
          'Launch a subscription referral program to increase baseline customer LTV.'
        ]
      }
    };

    return runGeminiAgent('CustomerSuccess', systemInstruction, prompt, fallback);
  }
};
