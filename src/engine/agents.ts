/**
 * Aegis Multi-Agent Engine — TypeScript port of 6 AI Engines
 * All 6 engines + Orchestrator, pure client-side simulation
 */

// Secure independent placeholder setup for API keys
export const STRATEGY_ENGINE_API_KEY = process.env.NEXT_PUBLIC_STRATEGY_ENGINE_API_KEY || "aegis_key_strategy_sec_v2_placeholder";
export const MARKETING_ENGINE_API_KEY = process.env.NEXT_PUBLIC_MARKETING_ENGINE_API_KEY || "aegis_key_marketing_sec_v2_placeholder";
export const LEAD_GEN_ENGINE_API_KEY = process.env.NEXT_PUBLIC_LEAD_GEN_ENGINE_API_KEY || "aegis_key_lead_gen_sec_v2_placeholder";
export const SALES_ENGINE_API_KEY = process.env.NEXT_PUBLIC_SALES_ENGINE_API_KEY || "aegis_key_sales_sec_v2_placeholder";
export const ANALYTICS_ENGINE_API_KEY = process.env.NEXT_PUBLIC_ANALYTICS_ENGINE_API_KEY || "aegis_key_analytics_sec_v2_placeholder";
export const CUSTOMER_SUCCESS_ENGINE_API_KEY = process.env.NEXT_PUBLIC_CUSTOMER_SUCCESS_ENGINE_API_KEY || "aegis_key_cs_sec_v2_placeholder";

export interface StrategyPillars {
  primary: string;
  pillars: string[];
  kpis: Record<string, string>;
  markets: string[];
  competitive_moat: string;
}

export interface StrategyOutput {
  strategy: StrategyPillars;
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

export interface LeadGenOutput {
  digital_strategy: string;
  whatsapp_copy: string;
  physical_ideas: string[];
  conversion_rate: number;
  projected_leads: number;
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
  lead_score: number;
  timestamp: string;
}

export interface AnalyticsOutput {
  growth_projection: {
    Q1: number;
    Q2: number;
    Q3: number;
    Q4: number;
  };
  radar_scores: Array<{
    subject: string;
    value: number;
  }>;
  cash_flow: Array<{
    month: string;
    value: number;
  }>;
  revenue_opportunity: number;
  timestamp: string;
}

export interface CSSTicket {
  id: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved';
}

export interface CustomerSuccessOutput {
  crm_status: string;
  support_tickets: CSSTicket[];
  client_health: number;
  chatbot_notes: string;
  timestamp: string;
}

export interface AgentOutputs {
  strategy: StrategyOutput;
  marketing: MarketingOutput;
  leadgen: LeadGenOutput;
  sales: SalesOutput;
  analytics: AnalyticsOutput;
  cs: CustomerSuccessOutput;
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
// 1. STRATEGY ENGINE
// ─────────────────────────────────────────────
export const Strategy_Engine = {
  name: 'Strategy Engine',
  icon: '🧭',
  color: '#8b5cf6',
  bg: 'rgba(139,92,246,0.15)',
  role: 'Chief Strategy Architect',
  responsibility: 'Does market research, brand positioning, pricing suggestions, and designs sales and marketing strategy frameworks.',
  input_desc: 'Business profile parameters, industry verticals context',
  output_desc: 'Growth Strategy blueprint, SWOT Moats, pricing models',

  run(businessData: BusinessData, customPrompt?: string): StrategyOutput {
    const industry = businessData.industry || 'Technology';

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
      strategy.primary = `Strategic Focus: ${customPrompt}`;
      strategy.pillars = [...strategy.pillars, 'Integrate custom directive workflows'].slice(-4);
    }

    return { strategy, timestamp: now() };
  },
};

// ─────────────────────────────────────────────
// 2. MARKETING ENGINE
// ─────────────────────────────────────────────
export const Marketing_Engine = {
  name: 'Marketing Engine',
  icon: '📣',
  color: '#06b6d4',
  bg: 'rgba(6,182,212,0.15)',
  role: 'Chief Marketing Officer',
  responsibility: 'Suggests and designs 360-degree marketing strategies to promote the product/business.',
  input_desc: 'Primary strategy pillars, target audiences',
  output_desc: 'Ad Copy, Email Funnels, Multi-channel Brand mix',

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
      campaigns.hero_ad = `Promote custom objective: ${customPrompt}. Integrated 360 channels.`;
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
// 3. LEAD GEN ENGINE
// ─────────────────────────────────────────────
export const Lead_Gen_Engine = {
  name: 'Lead Gen Engine',
  icon: '⚡',
  color: '#ea580c',
  bg: 'rgba(234,88,12,0.15)',
  role: 'Chief Lead Generator',
  responsibility: 'Brings in leads and helps to convert them effectively with AI via WhatsApp campaigns, digital marketing, and physical marketing ideas.',
  input_desc: 'Marketing assets, campaign hook, target audience criteria',
  output_desc: 'WhatsApp Campaign copywriting, Digital Ad parameters, Physical Marketing ideas, conversion projection rates',

  run(businessData: BusinessData, customPrompt?: string): LeadGenOutput {
    const company = businessData.company_name || 'Your Company';
    const industry = businessData.industry || 'Technology';

    const whatsapp_copy = `*⚡ SPECIAL BRIEFING FROM ${company.toUpperCase()}* \n\nHello [First Name]! We have analyzed the core bottleneck in the ${industry} vertical.\n\nWe would love to show you how we can help optimize your operations with our AI strategy. Reply with *'YES'* to lock in a 10-minute briefing.`;

    const physical_ideas = [
      'Targeted local executive meetup events',
      'Customized executive analysis reports mailed to key accounts',
      'VIP dinner roundtables in core geographies',
    ];

    return {
      digital_strategy: customPrompt ? `Focus Lead Capture on: ${customPrompt}` : 'Direct outreach + LinkedIn Lead Gen forms',
      whatsapp_copy,
      physical_ideas,
      conversion_rate: rand(12, 35),
      projected_leads: rand(120, 680),
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// 4. SALES ENGINE
// ─────────────────────────────────────────────
export const Sales_Engine = {
  name: 'Sales Engine',
  icon: '🎯',
  color: '#10b981',
  bg: 'rgba(16,185,129,0.15)',
  role: 'Chief Revenue Officer',
  responsibility: 'Helps to convert leads, build sales funnels, and close sales with customized scripts and sequences.',
  input_desc: 'Leads lists, WhatsApp engagement statistics, conversion targets',
  output_desc: 'Sales funnel stages, Objection handling script, Outbound touch sequences',

  run(businessData: BusinessData, customPrompt?: string): SalesOutput {
    const company = businessData.company_name || 'Your Company';
    const audience = businessData.target_audience || 'SMBs';
    const industry = businessData.industry || 'Technology';

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
      discovery_script += `\n\n[Copilot Custom Objection Handler]:\n• "How do you address: ${customPrompt.slice(0, 30)}?" → "Aegis isolates this immediately by dispatching specialized strategies. Let me show you."`;
    }

    return {
      pipeline,
      outbound_sequence,
      discovery_script,
      lead_score: customPrompt ? rand(60, 88) : rand(68, 94),
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// 5. ANALYTICS ENGINE
// ─────────────────────────────────────────────
export const Analytics_Engine = {
  name: 'Analytics Engine',
  icon: '📊',
  color: '#3b82f6',
  bg: 'rgba(59,130,246,0.15)',
  role: 'Chief Analytics Officer',
  responsibility: 'Manages dashboards, cash forecasting, competitive insights, portfolio roadmaps, and opportunity modeling.',
  input_desc: 'Revenue baseline, growth targets, competitor scores',
  output_desc: 'Forecasted quarterly projections, cash flow sequences, competitive radar values, total revenue opportunity scale',

  run(businessData: BusinessData, customPrompt?: string): AnalyticsOutput {
    const revenue = businessData.annual_revenue || 1_000_000;

    const growth_projection = {
      Q1: Math.round(revenue * 1.08),
      Q2: Math.round(revenue * 1.18),
      Q3: Math.round(revenue * 1.31),
      Q4: Math.round(revenue * 1.47),
    };

    const radar_scores = [
      { subject: 'Market Fit', value: customPrompt ? rand(62, 85) : rand(70, 95) },
      { subject: 'Brand Auth', value: rand(60, 90) },
      { subject: 'Sales Vel', value: rand(65, 88) },
      { subject: 'Retention', value: rand(70, 92) },
      { subject: 'Ops Scale', value: rand(58, 85) },
    ];

    const monthly_revenue = revenue / 12;
    const cash_flow = Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      value: Math.round(monthly_revenue * (1 + randFloat(-0.05, 0.15))),
    }));

    return {
      growth_projection,
      radar_scores,
      cash_flow,
      revenue_opportunity: Math.round((businessData.annual_revenue || 1_000_000) * (customPrompt ? randFloat(0.12, 0.25) : randFloat(0.18, 0.35))),
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// 6. CUSTOMER SUCCESS ENGINE
// ─────────────────────────────────────────────
export const Customer_Success_Engine = {
  name: 'Customer Success Engine',
  icon: '👑',
  color: '#ec4899',
  bg: 'rgba(236,72,153,0.15)',
  role: 'Chief Customer Officer',
  responsibility: 'Provides a powerful CRM, support ticket status portal, and AI customer chatbot configuration rules.',
  input_desc: 'Customer retention goals, client satisfaction values',
  output_desc: 'CRM client states, open support ticket matrices, client health scores, chatbot prompt parameters',

  run(businessData: BusinessData, customPrompt?: string): CustomerSuccessOutput {
    const crm_status = 'CRM Status: Active. 43 client records synchronized. AI CS Copilot active.';

    const support_tickets: CSSTicket[] = [
      { id: 'TKT-102', subject: 'Integration API timeout on webhook calls', status: 'open' },
      { id: 'TKT-105', subject: 'Add custom field mapping to CRM contacts page', status: 'pending' },
      { id: 'TKT-108', subject: 'Resolve dashboard chart timezone layout discrepancy', status: 'resolved' },
    ];

    const chatbot_notes = customPrompt
      ? `System chatbot configured to address custom prompt: "${customPrompt}". Customer response templates sync active.`
      : 'AI Chatbot system Instruction: Prompt set to serve help docs and redirect complex queries to support staff.';

    return {
      crm_status,
      support_tickets,
      client_health: rand(78, 96),
      chatbot_notes,
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// ORCHESTRATOR
// ─────────────────────────────────────────────
export const AGENTS_META = [
  Strategy_Engine,
  Marketing_Engine,
  Lead_Gen_Engine,
  Sales_Engine,
  Analytics_Engine,
  Customer_Success_Engine,
];

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
      '#ea580c'
    );
  }

  // 1. Strategy Engine
  addLog('Strategy Engine', `[Secure Key: ${STRATEGY_ENGINE_API_KEY.slice(0, 12)}...] Initiating market positioning analysis...`, '#8b5cf6');
  const strategy = Strategy_Engine.run(businessData, customPrompt);
  outputs.strategy = strategy;
  addLog('Strategy Engine', `✅ Growth strategy compiled: ${strategy.strategy.primary.slice(0, 55)}...`, '#10b981');

  // 2. Marketing Engine
  addLog('Marketing Engine', `[Secure Key: ${MARKETING_ENGINE_API_KEY.slice(0, 12)}...] Generating 360 marketing strategies...`, '#06b6d4');
  const marketing = Marketing_Engine.run(businessData, customPrompt);
  outputs.marketing = marketing;
  addLog('Marketing Engine', '✅ Campaign suite ready. 4-week content calendar generated.', '#10b981');

  // 3. Lead Gen Engine
  addLog('Lead Gen Engine', `[Secure Key: ${LEAD_GEN_ENGINE_API_KEY.slice(0, 12)}...] Building lead capture plans...`, '#ea580c');
  const leadgen = Lead_Gen_Engine.run(businessData, customPrompt);
  outputs.leadgen = leadgen;
  addLog('Lead Gen Engine', `✅ Generated digital strategy & WhatsApp copies. Projected leads: ${leadgen.projected_leads}`, '#10b981');

  // 4. Sales Engine
  addLog('Sales Engine', `[Secure Key: ${SALES_ENGINE_API_KEY.slice(0, 12)}...] Building sales funnel conversion protocol...`, '#10b981');
  const sales = Sales_Engine.run(businessData, customPrompt);
  outputs.sales = sales;
  addLog('Sales Engine', '✅ Funnel configuration and objection handling scripts complete.', '#10b981');

  // 5. Analytics Engine
  addLog('Analytics Engine', `[Secure Key: ${ANALYTICS_ENGINE_API_KEY.slice(0, 12)}...] Running dashboards, forecasting & insights...`, '#3b82f6');
  const analytics = Analytics_Engine.run(businessData, customPrompt);
  outputs.analytics = analytics;
  addLog('Analytics Engine', `✅ Forecasting ready. Revenue opportunity identified: $${analytics.revenue_opportunity.toLocaleString()}`, '#10b981');

  // 6. Customer Success Engine
  addLog('Customer Success Engine', `[Secure Key: ${CUSTOMER_SUCCESS_ENGINE_API_KEY.slice(0, 12)}...] Syncing CRM & CS Chatbot configs...`, '#ec4899');
  const cs = Customer_Success_Engine.run(businessData, customPrompt);
  outputs.cs = cs;
  addLog('Customer Success Engine', `✅ CRM synchronized. Client health rating: ${cs.client_health}/100`, '#10b981');

  // Final
  addLog('Strategy Engine', 'All 6 AI engine outputs successfully compiled. Layout updating...', '#8b5cf6');
  addLog('Strategy Engine', '🚀 Aegis AI OS is LIVE. All 6 systems operational.', '#10b981');

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
