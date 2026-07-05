import { Agent, BusinessContext, AgentResult } from '../../types';
import { runGeminiAgent } from '../../services/agent-helper';

export const marketingAgent: Agent = {
  /**
   * Marketing Agent: Evaluates customer acquisition strategies, positioning, and funnel metrics.
   */
  async analyze(context: BusinessContext, memory?: Record<string, any>): Promise<AgentResult> {
    console.log(`[Marketing Agent] Running analysis for organization: ${context.organization.name}`);

    const systemInstruction = `You are the Marketing Agent of Aegis AI Business Growth OS.
Analyze the following business profile parameters (industry, category, primary product, acquisition channels) and construct a structured JSON audit.
You must return a JSON object matching this structure EXACTLY:
{
  "summary": "Short 2-sentence marketing overview.",
  "issues": ["Issue 1 (e.g. over-reliance on single paid marketing channel)", "Issue 2"],
  "recommendations": ["Action item 1", "Action item 2"],
  "confidence": 0.95,
  "rawJson": {
    "summary": "Short executive marketing summary.",
    "adSpendOptimizations": {
      "instagramAlloc": "50%",
      "googleAdsAlloc": "30%",
      "seoContentAlloc": "20%",
      "recommendedReallocation": "Reallocate 15% from Instagram to Google SEO keywords."
    },
    "landingPageHooks": [
      "Say goodbye to fatigue. Try our organic infusions.",
      "Premium wellness energy boosters for office teams."
    ],
    "channelBreakdown": {
      "Primary": "Instagram Social Commerce",
      "Secondary": "Outbound Email & Referrals",
      "Tertiary": "Offline corporate popups"
    },
    "marketingRoiProjection": "Estimated 2.8x ROI over the next quarter by executing target demographic exclusions.",
    "instagramPostCopy": {
      "visualDirections": "Visual details/guidelines for the image/carousel based on the product",
      "caption": "Engaging copy for the post caption tailored to the business goal",
      "hashtags": ["#marketing", "#wellness"]
    },
    "influencerMarketing": {
      "targetingProfile": "Creators category/demographics matching product and budget size (e.g. corporate micro-influencers)",
      "hook": "0-3s hook sentence",
      "scriptBody": "Video outline or script body based on the primary product benefits",
      "cta": "Call to action",
      "visualNotes": "Visual directions for the creator"
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
      agentName: 'Marketing',
      summary: 'Brand positioning is aligned with wellness trends. Focus is shifting from paid socials to corporate outbound channels.',
      issues: ['High ad spend CAC on Instagram.', 'Attribution tracking models are not structured.'],
      recommendations: ['Build landing page variants targeting office HR buyers.', 'Integrate WhatsApp customer broadcast groups.'],
      confidence: 0.9,
      rawJson: {
        summary: 'Attribution tracking is missing but social commerce showing solid initial traction.',
        adSpendOptimizations: {
          instagramAlloc: '65%',
          googleAdsAlloc: '15%',
          seoContentAlloc: '20%',
          recommendedReallocation: 'Reallocate 10% from Instagram to email newsletters.'
        },
        landingPageHooks: [
          'Unleash workday potential. 100% Organic Energy.',
          'Smarter team breaks. Wellness in every cup.'
        ],
        channelBreakdown: {
          Primary: 'Instagram Commerce',
          Secondary: 'Shopify Website Search',
          Tertiary: 'WhatsApp Marketing'
        },
        marketingRoiProjection: '3.1x target ROI on new email flows.',
        instagramPostCopy: {
          visualDirections: 'Premium product mockup placed beside a laptop with soft morning desk light.',
          caption: 'Ready to upgrade your team breaks? ☕️ Natural, sustained focus without the coffee jitters or sugar crashes. Elevate your workday focus with Aegis-approved organic boosters.',
          hashtags: ['#workdayfocus', '#productivityhacks', '#officehealth']
        },
        influencerMarketing: {
          targetingProfile: 'Tech-hub micro-influencers and productivity coach accounts (aligns with startup-level budgets).',
          hook: 'I stopped drinking synthetic energy drinks that crash my focus after lunch...',
          scriptBody: 'As a startup founder, I used to rely on double espressos and energy cans just to get through slide decks. Then I discovered natural plant infusions. No jitters, no crash, just steady, clean focus. You feel awake, but calm.',
          cta: 'Check out the link in my bio to get 15% off the Workplace Starter Kit today!',
          visualNotes: 'Influencer starts in a chaotic workspace, holds head in hands. Cuts to clean prep shot, taking a sip with a relaxed smile, then showing a clean keyboard workspace.'
        }
      }
    };

    return runGeminiAgent('Marketing', systemInstruction, prompt, fallback, context);
  }
};
