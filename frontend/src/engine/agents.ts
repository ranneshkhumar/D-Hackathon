/**
 * Aegis Multi-Agent Engine — 5 AI Agents Boardroom
 */

// Secure independent placeholder setup for API keys
export const CEO_AGENT_API_KEY = process.env.NEXT_PUBLIC_CEO_AGENT_API_KEY || "aegis_key_ceo_sec_v2_placeholder";
export const STRATEGY_AGENT_API_KEY = process.env.NEXT_PUBLIC_STRATEGY_AGENT_API_KEY || "aegis_key_strategy_sec_v2_placeholder";
export const MARKETING_AGENT_API_KEY = process.env.NEXT_PUBLIC_MARKETING_AGENT_API_KEY || "aegis_key_marketing_sec_v2_placeholder";
export const SALES_AGENT_API_KEY = process.env.NEXT_PUBLIC_SALES_AGENT_API_KEY || "aegis_key_sales_sec_v2_placeholder";
export const FINANCE_AGENT_API_KEY = process.env.NEXT_PUBLIC_FINANCE_AGENT_API_KEY || "aegis_key_finance_sec_v2_placeholder";

export interface CEOOutput {
  health_score: number;
  growth_score: number;
  mandate: string;
  summary: string;
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
  milestone_velocity: string;
  timestamp: string;
}

export interface MarketingOutput {
  campaigns: {
    hero_ad: string;
    email_subject: string;
    email_body: string;
    channels: string[];
    hook: string;
    instagram_post?: {
      visualDirections: string;
      caption: string;
      hashtags: string[];
    };
    influencer_script?: {
      targetingProfile: string;
      hook: string;
      scriptBody: string;
      cta: string;
      visualNotes: string;
    };
  };
  content_calendar: Array<{
    week: string;
    content: string;
    channel: string;
  }>;
  timestamp: string;
}

export interface SalesOutput {
  pipeline: Array<{
    stage: string;
    conversion: string;
    avg_days: number;
    action: string;
  }>;
  outbound_sequence: Array<{
    day: string;
    touch: string;
    goal: string;
  }>;
  discovery_script: string;
  lead_score: number;
  timestamp: string;
}

export interface FinanceOutput {
  cash_flow: Array<{
    month: string;
    value: number;
  }>;
  risk_alerts: Array<{
    title: string;
    desc: string;
    level: 'red' | 'amber' | 'green';
  }>;
  revenue_opportunity: number;
  feasibility_score: number;
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
  // Goal tracking states
  target_revenue?: number;
  timeframe_days?: number;
  starting_capital?: number;
  simulated_revenue?: number;
}

const rand = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number): number => (Math.random() * (max - min) + min);
const now = (): string => new Date().toLocaleTimeString('en-US', { hour12: false });

function checkLag(businessData: BusinessData): boolean {
  const target = businessData.target_revenue || 10000;
  const timeframe = businessData.timeframe_days || 30;
  const current = businessData.simulated_revenue || 2500;
  
  const elapsed = timeframe - 20; // mid-horizon elapsed days assumed = 10
  const expectedRevenue = (target / timeframe) * elapsed;
  return current < expectedRevenue;
}

// ─────────────────────────────────────────────
// 1. CEO AGENT
// ─────────────────────────────────────────────
export const CEO_Agent = {
  name: 'CEO Agent',
  icon: '👔',
  color: '#10b981',
  role: 'Chief Executive Officer',
  responsibility: 'Sets strategic mandates & business goal calibrations.',

  run(businessData: BusinessData, customPrompt?: string): CEOOutput {
    const target = businessData.target_revenue || 10000;
    const timeframe = businessData.timeframe_days || 30;
    const isLagging = checkLag(businessData);

<<<<<<< HEAD:src/engine/agents.ts
    let mandate = `Directing strategy & implementation units to coordinate and achieve the milestone target goal of $${target.toLocaleString()} over a timeframe of ${timeframe} days.`;
    if (isLagging) {
      mandate = `🔴 Lagging Behind Goal - Strategy Pivot Needed: Ordering immediate pricing bundle adjustments and flash marketing campaigns to recover trajectory!`;
=======
    const ctx = industryContextMap[industry] || ['market expansion', 'customer acquisition', 'revenue diversification'];

    let summary = `${company} is positioned at a critical inflection point within the ${industry} sector. ` +
      `With an annual revenue baseline of ₹${revenue.toLocaleString()}, the immediate mandate is to accelerate ` +
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
>>>>>>> Rann:frontend/src/engine/agents.ts
    }

    return {
      health_score: isLagging ? rand(68, 76) : rand(84, 96),
      growth_score: isLagging ? rand(62, 70) : rand(82, 95),
      mandate,
      summary: `CEO mandate initiated to establish and scale ${businessData.company_name} target metrics in the ${businessData.industry} sector.`,
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// 2. STRATEGY AGENT
// ─────────────────────────────────────────────
export const Strategy_Agent = {
  name: 'Strategy Agent',
  icon: '🧠',
  color: '#3b82f6',
  role: 'Chief Strategy Architect',
  responsibility: 'Calculates milestone velocities and designs growth models.',

  run(businessData: BusinessData, customPrompt?: string): StrategyOutput {
    const isLagging = checkLag(businessData);
    const target = businessData.target_revenue || 10000;
    const timeframe = businessData.timeframe_days || 30;
    const dailyRate = (target / timeframe).toFixed(0);

    const strategy = {
      primary: isLagging
        ? '🔴 Pivot Active: Emergency pricing adjustments and promotional incentives enabled.'
        : 'Enterprise land-and-expand motion with PLG customer loops',
      pillars: ['Usage-based pricing packages', 'Direct executive referral program'],
      kpis: { 'Daily Velocity Target': `$${dailyRate}/day` },
      markets: ['Mid-market TAM', 'Key accounts vertical'],
      competitive_moat: 'High switching costs via deep product integrations',
    };

    return {
      strategy,
      milestone_velocity: `Required rate: $${dailyRate} per day to hit target goal within ${timeframe} days.`,
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// 3. MARKETING AGENT
// ─────────────────────────────────────────────
export const Marketing_Agent = {
  name: 'Marketing Agent',
  icon: '📢',
  color: '#eab308',
  role: 'Chief Marketing Officer',
  responsibility: 'Suggests and designs 360 marketing strategies.',

  run(businessData: BusinessData, customPrompt?: string): MarketingOutput {
    const isLagging = checkLag(businessData);
    const company = businessData.company_name || 'Your Company';

    const campaigns = {
      hero_ad: isLagging
        ? `⚠️ FLASH SALE: Discounting all B2B subscription setups by 35% for the next 48 hours to boost pipeline velocity. Claim your slot now!`
        : `Ready to supercharge your business? ${company} gives you the ultimate AI advantage to scale fast.`,
      email_subject: isLagging ? '⚠️ Trajectory override: 35% flash coupon active' : 'The AI operating system for growth',
      email_body: `Hello,\n\nWe are launching a special cohort for B2B clients.\n\nLet\'s talk demo next week.`,
      channels: ['LinkedIn Ads', 'Google Search', 'WhatsApp Blast'],
      hook: isLagging ? '⚠️ Strategy Pivot: Flash promotion activated!' : 'Next-gen tools for business acceleration.',
    };

    const content_calendar = [
      { week: 'Week 1', content: 'Inbound positioning & ad setups', channel: 'LinkedIn' },
      { week: 'Week 2', content: 'Strategic content magnets', channel: 'Email' },
    ];

    return { campaigns, content_calendar, timestamp: now() };
  },
};

// ─────────────────────────────────────────────
// 4. SALES AGENT
// ─────────────────────────────────────────────
export const Sales_Agent = {
  name: 'Sales Agent',
  icon: '🎯',
  color: '#f97316',
  role: 'Chief Revenue Officer',
  responsibility: 'Sets funnel conversion pathways and outreach sequences.',

  run(businessData: BusinessData, customPrompt?: string): SalesOutput {
    const isLagging = checkLag(businessData);
    const company = businessData.company_name || 'Your Company';

    const pipeline = [
      { stage: 'ICP Discovery', conversion: '100%', avg_days: 0, action: 'Lead scoring pipeline' },
      { stage: 'Closed Won', conversion: isLagging ? '45%' : '65%', avg_days: 14, action: 'Agreement executed' },
    ];

    const outbound_sequence = [
      { day: 'Day 1', touch: 'LinkedIn outreach + value summary', goal: 'Initial conversation' },
    ];

    let discovery_script = `OPENING:\n"Hi [Name], this is [Rep] from ${company}. We help companies double conversion rates."`;
    if (isLagging) {
      discovery_script += `\n\n[🔴 Pivot active script override]:\n"Since we are running an end-of-week implementation pilot, we can waive our B2B onboarding fee. Can I secure this pilot slot for you today?"`;
    }

    return {
      pipeline,
      outbound_sequence,
      discovery_script,
      lead_score: isLagging ? rand(60, 80) : rand(75, 96),
      timestamp: now(),
    };
  },
};

// ─────────────────────────────────────────────
// 5. FINANCE AGENT
// ─────────────────────────────────────────────
export const Finance_Agent = {
  name: 'Finance Agent',
  icon: '💵',
  color: '#ef4444',
  role: 'Chief Financial Officer',
  responsibility: 'Audits starting capital, maps cash burn risks, and calculates feasibility.',

  run(businessData: BusinessData, customPrompt?: string): FinanceOutput {
    const target = businessData.target_revenue || 10000;
    const capital = businessData.starting_capital || 5000;
    const current = businessData.simulated_revenue || 2500;
    const isLagging = checkLag(businessData);

<<<<<<< HEAD:src/engine/agents.ts
    const cash_flow = Array.from({ length: 6 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i],
      value: Math.round((capital / 6) * (1 + randFloat(-0.05, 0.15))),
    }));

    const risk_alerts = [
      {
        title: isLagging ? '🔴 Cash flow trajectory warning' : '🟢 Budget within parameters',
        desc: isLagging
          ? `Current simulated revenue of $${current.toLocaleString()} lags behind target baseline rate.`
          : `Budget allocation of $${capital.toLocaleString()} is stable.`,
        level: isLagging ? 'red' as const : 'green' as const,
      },
    ];
=======
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

    let risk_alerts: RiskAlert[] = [...(riskTemplates[industry] || [
      { level: 'amber', title: 'Revenue Concentration Risk', desc: 'Top 3 clients represent 62% of revenue. Diversification strategy needed.' },
      { level: 'amber', title: 'Operational Cost Pressure', desc: 'OpEx growing 3x faster than revenue. Process automation audit recommended.' },
      { level: 'green', title: 'Gross Margin Stable', desc: 'Margins holding at 58% — within target range. Monitor for Q4 expansion.' },
    ] as RiskAlert[])];

    if (customPrompt) {
      risk_alerts = ([
        { level: 'red', title: 'Copilot Focus Risk', desc: `Analyzing implications of custom query: "${customPrompt}". Reviewing cash reserves and potential margin leakage.` },
        ...risk_alerts
      ] as RiskAlert[]).slice(0, 4);
    }

    const monthly_revenue = revenue / 12;
    const cash_flow = Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      value: Math.round(monthly_revenue * (1 + randFloat(-0.05, 0.15))),
    }));

    const unit_economics = {
      CAC: `₹${(customPrompt ? rand(240, 510) : rand(180, 420)).toLocaleString()}`,
      LTV: `₹${(customPrompt ? rand(2100, 6200) : rand(1800, 5400)).toLocaleString()}`,
      'LTV:CAC Ratio': `${(customPrompt ? randFloat(2.8, 5.9) : randFloat(3.2, 7.1)).toFixed(1)}x`,
      'Payback Period': `${customPrompt ? rand(9, 16) : rand(7, 14)} months`,
      'Gross Margin': `${rand(55, 78)}%`,
      'Burn Multiple': `${randFloat(0.8, 2.4).toFixed(1)}x`,
    };
>>>>>>> Rann:frontend/src/engine/agents.ts

    return {
      cash_flow,
      risk_alerts,
      revenue_opportunity: Math.round(target * (isLagging ? 0.75 : 1.35)),
      feasibility_score: isLagging ? rand(58, 68) : rand(80, 96),
      timestamp: now(),
    };
  },
};

export const AGENTS_META = [
  CEO_Agent,
  Strategy_Agent,
  Marketing_Agent,
  Sales_Agent,
  Finance_Agent,
];

export function runAgentOrchestrator(businessData: BusinessData, customPrompt?: string): { outputs: AgentOutputs; log: LogEntry[] } {
  const log: LogEntry[] = [];
  const outputs: Partial<AgentOutputs> = {};

  const addLog = (agent: string, message: string, color: string) => {
    log.push({ time: now(), agent, message, color });
  };

  const isLagging = checkLag(businessData);

  if (customPrompt) {
    addLog(
      '🤖 MASTER COPILOT',
      `User request received. Dispatched objective: "${customPrompt}"`,
      '#737373'
    );
  }

  // 1. CEO Agent
  addLog('CEO Agent', 'Meeting opened. Ordering Strategy & Marketing to align on targets.', '#10b981');
  const ceo = CEO_Agent.run(businessData, customPrompt);
  outputs.ceo = ceo;

  // 2. Strategy Agent
  addLog('Strategy Agent', 'Ingesting business industry type to calculate expected daily milestone rate.', '#3b82f6');
  const strategy = Strategy_Agent.run(businessData, customPrompt);
  outputs.strategy = strategy;

  // 3. Marketing Agent
  addLog('Marketing Agent', 'Constructing 360-degree promotional campaign and brand copywriting calendar.', '#eab308');
  const marketing = Marketing_Engine_Proxy.run(businessData, customPrompt);
  outputs.marketing = marketing;

  // 4. Sales Agent
  addLog('Sales Agent', 'Drafting sales scripts, outbound touchpoints, and cold email templates.', '#f97316');
  const sales = Sales_Engine_Proxy.run(businessData, customPrompt);
  outputs.sales = sales;
<<<<<<< HEAD:src/engine/agents.ts
=======
  addLog('Sales Agent', `✅ Revenue opportunity identified: ₹${sales.revenue_opportunity.toLocaleString()}`, '#10b981');
>>>>>>> Rann:frontend/src/engine/agents.ts

  // 5. Finance Agent
  addLog('Finance Agent', 'CFO budget audit. Mapping operational cash flows and feasibility metrics.', '#ef4444');
  const finance = Finance_Agent.run(businessData, customPrompt);
  outputs.finance = finance;

  addLog('CEO Agent', 'All 5 AI agent outputs successfully compiled. Boardroom complete.', '#10b981');

  return { outputs: outputs as AgentOutputs, log };
}

// Proxies to adapt types
const Marketing_Engine_Proxy = {
  run(businessData: BusinessData, customPrompt?: string): MarketingOutput {
    return Marketing_Agent.run(businessData, customPrompt);
  }
};

const Sales_Engine_Proxy = {
  run(businessData: BusinessData, customPrompt?: string): SalesOutput {
    return Sales_Agent.run(businessData, customPrompt);
  }
};

export const DEFAULT_BUSINESS: BusinessData = {
  company_name: 'Aura Wellness',
  industry: 'Technology',
  annual_revenue: 1200000,
  target_audience: 'Mid-market B2B SaaS',
  primary_goal: 'Increase Revenue & ARR',
  team_size: '1–10 (Startup)',
  doc_text: `COMPANY OVERVIEW\nWe build workflow automation tools...`,
};
