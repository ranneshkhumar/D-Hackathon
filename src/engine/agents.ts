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

    let mandate = `Directing strategy & implementation units to coordinate and achieve the milestone target goal of $${target.toLocaleString()} over a timeframe of ${timeframe} days.`;
    if (isLagging) {
      mandate = `🔴 Lagging Behind Goal - Strategy Pivot Needed: Ordering immediate pricing bundle adjustments and flash marketing campaigns to recover trajectory!`;
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
