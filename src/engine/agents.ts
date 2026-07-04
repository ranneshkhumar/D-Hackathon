/**
 * Aegis Multi-Agent Engine — TypeScript port of agents.js
 * All 5 agents + AgentOrchestrator, pure client-side simulation
 */

// Secure independent placeholder setup for API keys
export const CEO_AGENT_API_KEY = process.env.NEXT_PUBLIC_CEO_AGENT_API_KEY || "aegis_key_ceo_sec_v1_placeholder";
export const STRATEGY_AGENT_API_KEY = process.env.NEXT_PUBLIC_STRATEGY_AGENT_API_KEY || "aegis_key_strategy_sec_v1_placeholder";
export const MARKETING_AGENT_API_KEY = process.env.NEXT_PUBLIC_MARKETING_AGENT_API_KEY || "aegis_key_marketing_sec_v1_placeholder";
export const SALES_AGENT_API_KEY = process.env.NEXT_PUBLIC_SALES_AGENT_API_KEY || "aegis_key_sales_sec_v1_placeholder";
export const FINANCE_AGENT_API_KEY = process.env.NEXT_PUBLIC_FINANCE_AGENT_API_KEY || "aegis_key_finance_sec_v1_placeholder";

export interface CEOOutput {
  summary: string;
  health_score: number;
  growth_score: number;
  mandate: string;
  timestamp: string;
}

export interface StrategyPillars {
  primary: string;
  pillars: string[];
  kpis: Record<string, string>;
  markets: string[];
  competitive_moat: string;
}

export interface StrategyOutput {
  strategy: StrategyPillars;
  growth_projection: {
    Q1: number;
    Q2: number;
    Q3: number;
    Q4: number;
  };
  mandate: string;
  timestamp: string;
}

export interface MarketingOutput {
  campaigns: {
    hero_ad: string;
    email_subject: string;
    email_body: string;
    channels: string[];
    hook: string;
  };
  content_calendar: Array<{
    week: string;
    content: string;
    channel: string;
  }>;
  timestamp: string;
}

export interface PipelineStage {
  stage: string;
  conversion: string;
  avg_days: number;
  action: string;
}

export interface OutboundStep {
  day: string;
  touch: string;
  goal: string;
}

export interface SalesOutput {
  pipeline: PipelineStage[];
  outbound_sequence: OutboundStep[];
  discovery_script: string;
  lead_score_criteria: Array<{
    factor: string;
    weight: string;
    score_range: string;
  }>;
  revenue_opportunity: number;
  lead_score: number;
  timestamp: string;
}

export interface RiskAlert {
  level: 'red' | 'amber' | 'green';
  title: string;
  desc: string;
}

export interface UnitEconomics {
  CAC: string;
  LTV: string;
  'LTV:CAC Ratio': string;
  'Payback Period': string;
  'Gross Margin': string;
  'Burn Multiple': string;
}

export interface FinanceOutput {
  risk_alerts: RiskAlert[];
  cash_flow: Array<{
    month: string;
    value: number;
  }>;
  customer_health: number;
  market_readiness: number;
  unit_economics: UnitEconomics;
  timestamp: string;
}

export interface AgentOutputs {
  ceo: CEOOutput;
  strategy: StrategyOutput;
  marketing: MarketingOutput;
  sales: SalesOutput;
  finance: FinanceOutput;
}

export interface LogEntry {
  time: string;
  agent: string;
  message: string;
  color: string;
}

export interface BusinessData {
  company_name: string;
  industry: string;
  annual_revenue: number;
  target_audience: string;
  primary_goal: string;
  team_size: string;
  doc_text: string;
}

const industryContextMap: Record<string, string[]> = {
  Technology: ['SaaS expansion', 'developer-led growth', 'ARR acceleration'],
  Healthcare: ['patient acquisition', 'compliance-first growth', 'value-based care'],
  'Retail / E-Commerce': ['omnichannel dominance', 'AOV optimization', 'retention flywheel'],
  'Financial Services': ['AUM growth', 'regulatory arbitrage', 'fintech disruption'],
  Education: ['learner acquisition', 'outcome-based positioning', 'cohort monetization'],
  Manufacturing: ['operational efficiency', 'supply chain resilience', 'B2B pipeline'],
  'Real Estate': ['deal velocity', 'portfolio diversification', 'proptech integration'],
  'Consulting / Professional Services': ['thought leadership', 'retainer growth', 'IP monetization'],
};

const rand = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number): number => (Math.random() * (max - min) + min);
const now = (): string => new Date().toLocaleTimeString('en-US', { hour12: false });

// ─────────────────────────────────────────────
// CEO AGENT
// ─────────────────────────────────────────────
export const CEO_Agent = {
  name: 'CEO Agent',
  icon: '👔',
  color: '#3b82f6',
  bg: 'rgba(59,130,246,0.15)',
  role: 'Chief Intelligence Officer',
  responsibility: 'Synthesizes all agent outputs into executive-level insights, sets strategic priorities, and communicates board-ready summaries.',
  input_desc: 'Business onboarding data (company profile, industry, revenue, goals)',
  output_desc: 'Executive Summary, Board Briefing, Business Health Score, Strategic Mandate',

  run(businessData: BusinessData, customPrompt?: string): CEOOutput {
    const industry = businessData.industry || 'Technology';
    const company = businessData.company_name || 'Your Company';
    const revenue = businessData.annual_revenue || 1_000_000;
    const audience = businessData.target_audience || 'SMBs';

    const ctx = industryContextMap[industry] || ['market expansion', 'customer acquisition', 'revenue diversification'];

    let summary = `${company} is positioned at a critical inflection point within the ${industry} sector. ` +
      `With an annual revenue baseline of $${revenue.toLocaleString()}, the immediate mandate is to accelerate ` +
      `${ctx[0]} through a disciplined ${ctx[1]} approach, ` +
      `targeting ${audience} as the primary growth vector. ` +
      `Our multi-agent analysis has identified three strategic horizons: ` +
      `(1) 0–90 day quick wins focused on conversion optimization and pipeline velocity, ` +
      `(2) 90–180 day structural investments in brand authority and ${ctx[2]}, ` +
      `and (3) 12-month market dominance through category leadership. ` +
      `The Aegis Growth OS has computed a composite Business Health Score reflecting ` +
      `market readiness, operational capacity, and competitive positioning.`;

    if (customPrompt) {
      summary += `\n\n[Master Copilot Strategic Directive]: Resolving user analysis request: "${customPrompt}". CEO mandate has been configured to prioritize this objective.`;
    }

    return {
      summary,
      health_score: customPrompt ? rand(58, 85) : rand(62, 91),
      growth_score: customPrompt ? rand(60, 92) : rand(55, 88),
      mandate: customPrompt ? `Resolve: ${customPrompt.slice(0, 50)}...` : `Achieve ${ctx[2]} within 12 months via ${ctx[1]}`,
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// STRATEGY AGENT
// ─────────────────────────────────────────────
export const Strategy_Agent = {
  name: 'Strategy Agent',
  icon: '🧭',
  color: '#8b5cf6',
  bg: 'rgba(139,92,246,0.15)',
  role: 'Chief Strategy Architect',
  responsibility: 'Constructs comprehensive growth strategies using market intelligence, competitive analysis, and 5D framework alignment.',
  input_desc: 'CEO mandate, business profile, market benchmarks, industry vertical data',
  output_desc: 'Growth Strategy Document, SWOT Analysis, Competitive Positioning, KPI Targets',

  run(businessData: BusinessData, ceoOutput: CEOOutput, customPrompt?: string): StrategyOutput {
    const industry = businessData.industry || 'Technology';
    const revenue = businessData.annual_revenue || 1_000_000;

    const strategiesMap: Record<string, StrategyPillars> = {
      Technology: {
        primary: 'Product-Led Growth (PLG) with enterprise upsell motion',
        pillars: ['Freemium to paid conversion funnel', 'Developer community building', 'API-first integrations', 'Usage-based pricing tiers'],
        kpis: { 'MRR Growth': '15% MoM', 'CAC Payback': '< 9 months', NRR: '> 120%', 'Trial-to-Paid': '> 25%' },
        markets: ['Mid-market SaaS', 'Enterprise IT', 'Startup ecosystem'],
        competitive_moat: 'Deep API ecosystem + switching cost via data gravity',
      },
      Healthcare: {
        primary: 'Trust-Led Acquisition with referral network amplification',
        pillars: ['HIPAA-compliant digital touchpoints', 'Physician referral programs', 'Outcome-based case studies', 'Telehealth channel expansion'],
        kpis: { 'Patient Acquisition Cost': '< $120', 'Retention Rate': '> 78%', NPS: '> 55', 'Digital Appointments': '> 40%' },
        markets: ['Urban outpatient clinics', 'Insurance networks', 'Corporate wellness'],
        competitive_moat: 'Regulatory compliance expertise + established trust scores',
      },
      'Retail / E-Commerce': {
        primary: 'Retention-First Flywheel with DTC channel dominance',
        pillars: ['Loyalty program with tiered rewards', 'Personalization engine', 'Social commerce expansion', 'Subscription bundles'],
        kpis: { ROAS: '> 4.5x', 'LTV:CAC': '> 3:1', 'Cart Abandonment': '< 62%', 'Repeat Purchase Rate': '> 35%' },
        markets: ['Millennial shoppers 25–40', 'Mobile-first buyers', 'Sustainability-conscious consumers'],
        competitive_moat: 'Brand community + first-party data advantage',
      },
    };

    const strategy = { ...(strategiesMap[industry] || {
      primary: 'Market Penetration with authority-led positioning',
      pillars: ['Content moat construction', 'Strategic partnership matrix', 'Direct sales acceleration', 'Digital channel optimization'],
      kpis: { 'Revenue Growth': '25% YoY', 'Market Share': '+3–5%', 'Lead Velocity Rate': '+20% MoM', 'CAC Reduction': '15%' },
      markets: ['Primary TAM segments', 'Adjacent verticals', 'International expansion'],
      competitive_moat: 'Domain expertise + network effects',
    }) };

    if (customPrompt) {
      strategy.primary = `Action Plan: ${customPrompt}`;
      strategy.pillars = [...strategy.pillars, `Deploy specialized workflows targeting custom prompt variables`].slice(-4);
    }

    const growth_projection = {
      Q1: Math.round(revenue * 1.08),
      Q2: Math.round(revenue * 1.18),
      Q3: Math.round(revenue * 1.31),
      Q4: Math.round(revenue * 1.47),
    };

    return {
      strategy,
      growth_projection,
      mandate: ceoOutput.mandate || '',
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// MARKETING AGENT
// ─────────────────────────────────────────────
export const Marketing_Agent = {
  name: 'Marketing Agent',
  icon: '📣',
  color: '#06b6d4',
  bg: 'rgba(6,182,212,0.15)',
  role: 'Chief Growth Marketer',
  responsibility: 'Generates multi-channel campaign strategies, ad copy, email funnels, and brand positioning assets from the strategy blueprint.',
  input_desc: 'Growth strategy, target audience profile, budget parameters, channel preferences',
  output_desc: 'Ad Campaigns, Email Funnels, Channel Mix, Content Calendar, Brand Voice Guidelines',

  run(businessData: BusinessData, customPrompt?: string): MarketingOutput {
    const industry = businessData.industry || 'Technology';
    const audience = businessData.target_audience || 'SMBs';
    const company = businessData.company_name || 'Your Company';

    const campaignsMap: Record<string, { hero_ad: string; email_subject: string; email_body: string; channels: string[]; hook: string }> = {
      Technology: {
        hero_ad: `Stop losing deals to competitors with smarter tools. ${company} gives your team the AI advantage — measurable ROI in 30 days or your money back.`,
        email_subject: 'Your competitors just switched. Here\'s why you should too →',
        email_body: `Hi [First Name],\n\nI noticed your team is scaling fast — and I wanted to reach out at the right time.\n\n${company} has helped 200+ ${audience} companies cut their tool spend by 40% while tripling output.\n\nCan I show you a 12-minute demo this week?\n\n[CTA: Book Your Slot]`,
        channels: ['LinkedIn Ads', 'Google Search', 'Product Hunt', 'Dev Communities', 'Webinars'],
        hook: "The AI stack your competitors don't want you to know about.",
      },
      Healthcare: {
        hero_ad: `Your patients deserve faster, smarter care. ${company} modernizes your practice without disrupting your workflow — HIPAA compliant, zero downtime.`,
        email_subject: 'How [Similar Practice] saw 40% more appointments in 60 days →',
        email_body: `Dear Dr. [Last Name],\n\nPatient acquisition is getting harder and more expensive. We get it.\n\n${company} helped practices like yours attract and retain 40% more patients through evidence-based digital outreach — fully compliant.\n\n[CTA: See Case Study]`,
        channels: ['Medical Journals', 'LinkedIn', 'Healthcare Conferences', 'Referral Programs', 'Local SEO'],
        hook: 'Modern care starts with a modern practice.',
      },
      'Retail / E-Commerce': {
        hero_ad: `Your store. Supercharged. ${company} turns browsers into buyers and one-time shoppers into lifelong fans — with AI-powered personalization.`,
        email_subject: '🛒 Left something behind? Here\'s 15% off to come back →',
        email_body: `Hey [First Name],\n\nWe noticed you were checking out [Product] — great choice, by the way.\n\nFor the next 24 hours, we're offering you an exclusive 15% discount. This is just for you.\n\n[CTA: Complete Your Order] ⏰ Expires soon.\n\nP.S. — 847 people bought this week`,
        channels: ['Meta/Instagram Ads', 'Google Shopping', 'TikTok', 'Email Automations', 'SMS Flows'],
        hook: 'One-click to their new favorite brand.',
      },
    };

    const campaigns = { ...(campaignsMap[industry] || {
      hero_ad: `${company}: The smart choice for ambitious ${audience}. Powered by AI. Proven by results.`,
      email_subject: '3 growth levers you\'re probably not using →',
      email_body: `Hi [First Name],\n\n${company} has helped teams like yours unlock hidden revenue opportunities. Here are 3 strategies working right now...\n\n[CTA: Get the Full Playbook]`,
      channels: ['LinkedIn', 'Google Ads', 'Content Marketing', 'Email', 'Partnerships'],
      hook: 'Smarter strategy. Faster growth.',
    }) };

    if (customPrompt) {
      campaigns.hook = `Resolve Target Directives: ${customPrompt}`;
      campaigns.hero_ad = `Supercharge operations to address: ${customPrompt}. Configured live strategy output.`;
    }

    const content_calendar = [
      { week: 'Week 1', content: 'Brand awareness campaign launch', channel: 'LinkedIn + Google' },
      { week: 'Week 2', content: 'Case study + social proof push', channel: 'Email + Retargeting' },
      { week: 'Week 3', content: 'Lead magnet deployment', channel: 'Content + SEO' },
      { week: 'Week 4', content: 'Conversion campaign + limited offer', channel: 'All Channels' },
    ];

    return { campaigns, content_calendar, timestamp: now() };
  },
};

// ─────────────────────────────────────────────
// SALES AGENT
// ─────────────────────────────────────────────
export const Sales_Agent = {
  name: 'Sales Agent',
  icon: '🎯',
  color: '#10b981',
  bg: 'rgba(16,185,129,0.15)',
  role: 'Chief Revenue Officer',
  responsibility: 'Builds outbound sales sequences, lead scoring models, pipeline stages, and conversion frameworks to maximize revenue generation.',
  input_desc: 'Marketing campaigns, ICP definition, competitive positioning, pricing model',
  output_desc: 'Sales Scripts, Outbound Sequences, Pipeline Stages, Lead Scoring Model, Objection Handling',

  run(businessData: BusinessData, customPrompt?: string): SalesOutput {
    const industry = businessData.industry || 'Technology';
    const audience = businessData.target_audience || 'SMBs';
    const company = businessData.company_name || 'Your Company';

    const pipeline: PipelineStage[] = [
      { stage: 'Lead Capture', conversion: '100%', avg_days: 0, action: 'ICP qualification via AI scoring' },
      { stage: 'Discovery Call', conversion: '35%', avg_days: 3, action: 'Needs analysis + pain mapping' },
      { stage: 'Demo / Proposal', conversion: '60%', avg_days: 7, action: 'ROI presentation + customization' },
      { stage: 'Negotiation', conversion: '70%', avg_days: 14, action: 'Champion-based closing + legal review' },
      { stage: 'Closed Won', conversion: '65%', avg_days: 21, action: 'Contract execution + onboarding trigger' },
    ];

    const outbound_sequence: OutboundStep[] = [
      { day: 'Day 1', touch: 'Personalized LinkedIn connection + voice note', goal: 'Initial awareness' },
      { day: 'Day 3', touch: 'Email: Industry insight + problem framing', goal: 'Establish credibility' },
      { day: 'Day 7', touch: 'Follow-up: Case study relevant to their vertical', goal: 'Build trust' },
      { day: 'Day 12', touch: 'Phone call + voicemail drop', goal: 'Direct engagement' },
      { day: 'Day 18', touch: 'Video email (Loom) with personalized demo preview', goal: 'Create urgency' },
      { day: 'Day 25', touch: 'Final value-add email: ROI calculator', goal: 'Conversion or recycle' },
    ];

    let discovery_script = `OPENING:\n"Hi [Name], this is [Rep] from ${company}. I know your time is valuable — I'll keep this focused.\nWe've helped [2–3 similar companies in ${industry}] solve [core pain point]. I'd love to understand\nif the same challenge resonates with your team. Do you have 8 minutes?"\n\nDISCOVERY QUESTIONS:\n1. "Walk me through how you currently handle [key process]?"\n2. "Where does that process break down most often?"\n3. "What would perfect look like 12 months from now?"\n4. "If we could achieve [outcome], what would that mean for your ${audience} targets?"\n\nOBJECTION HANDLING:\n• "We already have a solution" → "That's great — what's the one thing you wish it did better?"\n• "Not the right time" → "Completely understand — what would make it the right time?"\n• "Too expensive" → "Fair — let's quantify the cost of NOT solving this. Can I share a quick calc?"\n\nCLOSE:\n"Based on what you've shared, I think we can make a real impact. Can we lock in 30 minutes next week\nfor a tailored walkthrough? I'll bring specific metrics from your industry vertical."`;

    if (customPrompt) {
      discovery_script += `\n\n[Copilot Direct Response Objections]:\n• "How do you address: ${customPrompt.slice(0, 30)}?" → "Aegis isolates this immediately by dispatching specialized strategies. Let me show you."`;
    }

    const lead_score_criteria = [
      { factor: 'Industry Match', weight: '25%', score_range: '0–25' },
      { factor: 'Company Size (employees)', weight: '20%', score_range: '0–20' },
      { factor: 'Intent Signal (content downloads)', weight: '20%', score_range: '0–20' },
      { factor: 'Engagement Score (email/web)', weight: '20%', score_range: '0–20' },
      { factor: 'Decision-Maker Contact', weight: '15%', score_range: '0–15' },
    ];

    return {
      pipeline,
      outbound_sequence,
      discovery_script,
      lead_score_criteria,
      revenue_opportunity: Math.round((businessData.annual_revenue || 1_000_000) * (customPrompt ? randFloat(0.12, 0.25) : randFloat(0.18, 0.35))),
      lead_score: customPrompt ? rand(60, 88) : rand(68, 94),
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// FINANCE AGENT
// ─────────────────────────────────────────────
export const Finance_Agent = {
  name: 'Finance Agent',
  icon: '💹',
  color: '#f59e0b',
  bg: 'rgba(245,158,11,0.15)',
  role: 'Chief Financial Intelligence Officer',
  responsibility: 'Runs financial risk assessments, models cash flow projections, identifies margin leakage, and flags compliance risks.',
  input_desc: 'Revenue data, growth projections, cost structure, market benchmarks',
  output_desc: 'Risk Alerts, Financial Health Metrics, Cash Flow Projections, Unit Economics Model',

  run(businessData: BusinessData, customPrompt?: string): FinanceOutput {
    const revenue = businessData.annual_revenue || 1_000_000;
    const industry = businessData.industry || 'Technology';

    const riskTemplates: Record<string, RiskAlert[]> = {
      Technology: [
        { level: 'red', title: 'Churn Rate Threshold', desc: 'Simulated churn rate at 8.2% — above SaaS benchmark of 5%. Immediate retention intervention required.' },
        { level: 'amber', title: 'CAC Trending Up', desc: 'Customer acquisition cost has increased 22% QoQ. Organic channel investment recommended.' },
        { level: 'amber', title: 'Runway Alert', desc: 'At current burn rate, runway is estimated at 11.4 months. Series A timeline should be accelerated.' },
        { level: 'green', title: 'Gross Margin Healthy', desc: 'Gross margin at 74% — above industry median. Strong foundation for R&D reinvestment.' },
      ],
      Healthcare: [
        { level: 'red', title: 'Compliance Risk Elevated', desc: 'Recent HIPAA audit flag detected in documentation review. Immediate legal review recommended.' },
        { level: 'amber', title: 'Revenue Cycle Delay', desc: 'Average claims processing time at 34 days — 9 days above benchmark. Cash flow impact: -$47K/month.' },
        { level: 'green', title: 'Patient LTV Strong', desc: 'Patient lifetime value at $3,200 — 18% above regional average. Retention programs showing ROI.' },
      ],
      'Retail / E-Commerce': [
        { level: 'red', title: 'Inventory Carrying Cost', desc: 'Excess inventory detected in Q3 planning. Liquidation strategy needed to preserve margin.' },
        { level: 'amber', title: 'ROAS Compression', desc: 'Paid channel ROAS dropped to 2.8x from 4.1x. Algorithmic changes require bid strategy revision.' },
        { level: 'amber', title: 'Cash Burn in Q3', desc: 'Seasonal dip projected to compress cash position by 18%. Credit facility activation recommended.' },
        { level: 'green', title: 'AOV Growing', desc: 'Average order value up 12% MoM — bundling strategy working. Continue and expand.' },
      ],
    };

    let risk_alerts = [...(riskTemplates[industry] || [
      { level: 'amber', title: 'Revenue Concentration Risk', desc: 'Top 3 clients represent 62% of revenue. Diversification strategy needed.' },
      { level: 'amber', title: 'Operational Cost Pressure', desc: 'OpEx growing 3x faster than revenue. Process automation audit recommended.' },
      { level: 'green', title: 'Gross Margin Stable', desc: 'Margins holding at 58% — within target range. Monitor for Q4 expansion.' },
    ])];

    if (customPrompt) {
      risk_alerts = [
        { level: 'red', title: 'Copilot Focus Risk', desc: `Analyzing implications of custom query: "${customPrompt}". Reviewing cash reserves and potential margin leakage.` },
        ...risk_alerts
      ].slice(0, 4);
    }

    const monthly_revenue = revenue / 12;
    const cash_flow = Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      value: Math.round(monthly_revenue * (1 + randFloat(-0.05, 0.15))),
    }));

    const unit_economics = {
      CAC: `$${(customPrompt ? rand(240, 510) : rand(180, 420)).toLocaleString()}`,
      LTV: `$${(customPrompt ? rand(2100, 6200) : rand(1800, 5400)).toLocaleString()}`,
      'LTV:CAC Ratio': `${(customPrompt ? randFloat(2.8, 5.9) : randFloat(3.2, 7.1)).toFixed(1)}x`,
      'Payback Period': `${customPrompt ? rand(9, 16) : rand(7, 14)} months`,
      'Gross Margin': `${rand(55, 78)}%`,
      'Burn Multiple': `${randFloat(0.8, 2.4).toFixed(1)}x`,
    };

    return {
      risk_alerts,
      cash_flow,
      customer_health: customPrompt ? rand(62, 85) : rand(70, 90),
      market_readiness: customPrompt ? rand(60, 84) : rand(65, 88),
      unit_economics,
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// ORCHESTRATOR
// ─────────────────────────────────────────────
export const AGENTS_META = [CEO_Agent, Strategy_Agent, Marketing_Agent, Sales_Agent, Finance_Agent];

export function runAgentOrchestrator(businessData: BusinessData, customPrompt?: string): { outputs: AgentOutputs; log: LogEntry[] } {
  const log: LogEntry[] = [];
  const outputs: Partial<AgentOutputs> = {};

  const addLog = (agent: string, message: string, color: string) => {
    log.push({ time: now(), agent, message, color });
  };

  // Prepend Master Copilot log if custom prompt is passed
  if (customPrompt) {
    addLog(
      '🤖 MASTER COPILOT',
      `User request received. Parsing objective... Dispatching parameters to specialized units. Directive: "${customPrompt}"`,
      '#ea580c' // Orange theme for master executive copilot
    );
  }

  // CEO
  addLog('CEO Agent', `[Secure Key: ${CEO_AGENT_API_KEY.slice(0, 12)}...] Initializing intelligence sweep...`, '#3b82f6');
  const ceo = CEO_Agent.run(businessData, customPrompt);
  outputs.ceo = ceo;
  addLog('CEO Agent', `✅ Executive mandate set: ${ceo.mandate.slice(0, 60)}...`, '#10b981');

  // Strategy
  addLog('Strategy Agent', `[Secure Key: ${STRATEGY_AGENT_API_KEY.slice(0, 12)}...] Initiating strategy mapping...`, '#8b5cf6');
  const strategy = Strategy_Agent.run(businessData, ceo, customPrompt);
  outputs.strategy = strategy;
  addLog('Strategy Agent', `✅ Growth strategy compiled: ${strategy.strategy.primary.slice(0, 55)}...`, '#10b981');

  // Marketing
  addLog('Marketing Agent', `[Secure Key: ${MARKETING_AGENT_API_KEY.slice(0, 12)}...] Compiling channels & copy...`, '#06b6d4');
  const marketing = Marketing_Agent.run(businessData, customPrompt);
  outputs.marketing = marketing;
  addLog('Marketing Agent', '✅ Campaign suite ready. 4-week content calendar generated.', '#10b981');

  // Sales
  addLog('Sales Agent', `[Secure Key: ${SALES_AGENT_API_KEY.slice(0, 12)}...] Building outbound structures...`, '#10b981');
  const sales = Sales_Agent.run(businessData, customPrompt);
  outputs.sales = sales;
  addLog('Sales Agent', `✅ Revenue opportunity identified: $${sales.revenue_opportunity.toLocaleString()}`, '#10b981');

  // Finance
  addLog('Finance Agent', `[Secure Key: ${FINANCE_AGENT_API_KEY.slice(0, 12)}...] Executing risk audit & cash projection...`, '#f59e0b');
  const finance = Finance_Agent.run(businessData, customPrompt);
  outputs.finance = finance;
  addLog('Finance Agent', `✅ Risk assessment complete. ${finance.risk_alerts.length} signals flagged.`, '#10b981');

  // Final
  addLog('CEO Agent', 'All agent outputs synthesized. Dashboard updating...', '#3b82f6');
  addLog('CEO Agent', '🚀 Aegis Growth OS is LIVE. All systems operational.', '#10b981');

  return { outputs: outputs as AgentOutputs, log };
}

export const DEFAULT_BUSINESS: BusinessData = {
  company_name: 'Aura Wellness',
  industry: 'Technology',
  annual_revenue: 1200000,
  target_audience: 'Mid-market B2B SaaS',
  primary_goal: 'Increase Revenue & ARR',
  team_size: '1–10 (Startup)',
  doc_text: `COMPANY OVERVIEW\n================\nWe are a fast-growing B2B SaaS company focused on workflow automation for mid-market enterprises.\nFounded in 2021, we have achieved $2.4M ARR with a strong product-market fit signal.\n\nCURRENT CHALLENGES\n==================\n- High customer acquisition cost (~$420 per customer)\n- Churn rate hovering at 8% monthly for SMB segment\n- Limited brand awareness outside our core geography\n- Sales cycle too long (avg. 45 days) for SMB deals\n\nGOALS FOR NEXT 12 MONTHS\n=========================\n- Reach $5M ARR\n- Expand into EMEA market\n- Launch enterprise tier with dedicated CSM support\n- Reduce SMB churn to below 4%\n\nTARGET MARKET\n=============\nMid-market companies (100–500 employees) in operations, finance, and HR verticals.\nPrimary buyer: VP of Operations or CFO.\n\nCOMPETITIVE LANDSCAPE\n=====================\nMain competitors: Zapier (automation), Monday.com (project mgmt), Notion (docs).\nOur differentiator: AI-native, deep integrations, 10x faster setup.`,
};
