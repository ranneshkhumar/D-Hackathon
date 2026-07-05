import { Agent, BusinessContext, AgentResult } from '../../types';
import { runGeminiAgent } from '../../services/agent-helper';

export const salesAgent: Agent = {
  /**
   * Sales Agent: Evaluates pipeline velocity, closure rates, and deal follow-up actions.
   */
  async analyze(context: BusinessContext, memory?: Record<string, any>): Promise<AgentResult> {
    console.log(`[Sales Agent] Running analysis for organization: ${context.organization.name}`);

    const systemInstruction = `You are the Sales Agent of Aegis AI Business Growth OS.
Analyze the following business parameters (products, average selling price, target audience) and generate a structured JSON sales plan including:
- 1 outbound cold email script template customized for this product.
- An objection handling matrix (price objection, competitor comparison, delay objection).
- Funnel conversion map percentages.
You must return a JSON object matching this structure EXACTLY:
{
  "summary": "Short 2-sentence sales overview.",
  "issues": ["Issue 1 (e.g. low sales conversion on website checkouts)", "Issue 2"],
  "recommendations": ["Action item 1", "Action item 2"],
  "confidence": 0.95,
  "rawJson": {
    "summary": "Short executive sales summary.",
    "outboundEmailScript": "Subject: Smarter team wellness for {{company_name}}\n\nHi {{first_name}},\n\nI noticed you manage operations at {{company_name}}...",
    "objectionHandlingMatrix": {
      "Price objection": "Focus on the ROI: premium energy drinks reduce mid-day employee fatigue and improve workspace productivity by 15%.",
      "Competitor comparison": "Unlike cheap synthetic energy drinks, our organic infusions have zero sugar crashes and are fully organic certified."
    },
    "salesFunnelConversionMap": {
      "trafficToCart": "4.2%",
      "cartToCheckout": "32%",
      "checkoutToPurchase": "84%"
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
      agentName: 'Sales',
      summary: 'Corporate sales showing strong potential but conversion tracking on the Shopify site needs optimization.',
      issues: ['High cart abandonment rates on the retail store.', 'Outbound corporate sales templates are generic.'],
      recommendations: ['Deploy discount popups targeting cart exit intent.', 'Refine outbound copy templates using ROI-driven hooks.'],
      confidence: 0.9,
      rawJson: {
        summary: 'Outbound sales channel has promising conversion markers but needs a defined CRM funnel.',
        outboundEmailScript: 'Subject: Better energy for {{company_name}} teams?\n\nHi {{first_name}},\n\nI love your workspace updates. I wanted to see how you support team fatigue in the afternoon. Our organic Matcha energy packs are certified and natural booster alternatives...',
        objectionHandlingMatrix: {
          'Too Expensive': 'Showcase cost comparison: ₹120 per bottle vs ₹300 for premium coffee shop runs, with double the productivity benefits.',
          'Happy with Coffee': 'Highlight that Matcha releases clean caffeine over 6 hours without the coffee jitter or acid reflux.'
        },
        salesFunnelConversionMap: {
          trafficToCart: '5.1%',
          cartToCheckout: '28%',
          checkoutToPurchase: '78%'
        }
      }
    };

    return runGeminiAgent('Sales', systemInstruction, prompt, fallback, context);
  }
};
