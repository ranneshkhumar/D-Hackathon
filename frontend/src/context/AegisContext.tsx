'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { runAgentOrchestrator, DEFAULT_BUSINESS, BusinessData, AgentOutputs, LogEntry } from '../engine/agents';
import { OrgManager } from '@/services/org-manager';
import { ApiClient } from '@/services/api-client';
import { BusinessOrchestrator } from '@/services/business-orchestrator';
import { Message } from '@/types';

export interface AegisState {
  businessData: BusinessData | null;
  agentOutputs: AgentOutputs | null;
  agentLog: LogEntry[];
  onboarded: boolean;
  runComplete: boolean;
  isRunning: boolean;
}

export interface CopilotMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  agents?: Array<{
    agent: string;
    icon: string;
    role: string;
    responsibility: string;
    input: string;
    output: string;
    text: string;
  }>;
}

type Action =
  | { type: 'INIT_DEFAULT'; businessData: BusinessData; agentOutputs: AgentOutputs; agentLog: LogEntry[] }
  | { type: 'SET_RUNNING' }
  | { type: 'RUN_COMPLETE'; businessData: BusinessData; agentOutputs: AgentOutputs; agentLog: LogEntry[] }
  | { type: 'UPDATE_OUTPUTS'; agentOutputs: AgentOutputs; agentLog: LogEntry[] };

const initialState: AegisState = {
  businessData: null,
  agentOutputs: null,
  agentLog: [],
  onboarded: false,
  runComplete: false,
  isRunning: false,
};

function aegisReducer(state: AegisState, action: Action): AegisState {
  switch (action.type) {
    case 'INIT_DEFAULT':
      return {
        ...state,
        businessData: action.businessData,
        agentOutputs: action.agentOutputs,
        agentLog: action.agentLog,
        onboarded: true,
        runComplete: true,
        isRunning: false,
      };
    case 'SET_RUNNING':
      return { ...state, isRunning: true };
    case 'RUN_COMPLETE':
      return {
        ...state,
        businessData: action.businessData,
        agentOutputs: action.agentOutputs,
        agentLog: action.agentLog,
        onboarded: true,
        runComplete: true,
        isRunning: false,
      };
    case 'UPDATE_OUTPUTS':
      return {
        ...state,
        agentOutputs: action.agentOutputs,
        agentLog: action.agentLog,
      };
    default:
      return state;
  }
}

interface ContextProps extends AegisState {
  runOrchestrator: (businessData: BusinessData) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotMessages: CopilotMessage[];
  runCopilotPrompt: (prompt: string) => void;
  // Live Assistant parameters
  targetRevenue: number;
  setTargetRevenue: (val: number) => void;
  timeframeDays: number;
  setTimeframeDays: (val: number) => void;
  daysRemaining: number;
  setDaysRemaining: (val: number) => void;
  startingCapital: number;
  setStartingCapital: (val: number) => void;
  simulatedRevenue: number;
  setSimulatedRevenue: (val: number) => void;
  recentSalesTicks: string[];
  setRecentSalesTicks: React.Dispatch<React.SetStateAction<string[]>>;
  isLagging: boolean;
}

const AegisContext = createContext<ContextProps | null>(null);

export function AegisProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(aegisReducer, initialState);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([]);

  // Live Assistant state definitions
  const [targetRevenue, setTargetRevenue] = useState<number>(10000);
  const [timeframeDays, setTimeframeDays] = useState<number>(30);
  const [daysRemaining, setDaysRemaining] = useState<number>(20);
  const [startingCapital, setStartingCapital] = useState<number>(5000);
  const [simulatedRevenue, setSimulatedRevenue] = useState<number>(2500); // Starts lagging at $2,500
  const [recentSalesTicks, setRecentSalesTicks] = useState<string[]>([
    '+$75 from inbound organic trial conversion',
    '+$120 from Outbound Email demo sign-up'
  ]);

  // Derived state to check if current revenue lags behind expected daily rate
  const elapsedDays = timeframeDays - daysRemaining;
  const expectedDailyRate = targetRevenue / timeframeDays;
  const expectedRevenue = expectedDailyRate * elapsedDays;
  const isLagging = simulatedRevenue < expectedRevenue;

  // Sync / initialize on client mount
  useEffect(() => {
    const initializeAegis = async () => {
      const active = OrgManager.getActiveOrganization();
      if (!active) {
        // Fallback to default templates
        const { outputs, log } = runAgentOrchestrator(DEFAULT_BUSINESS);
        dispatch({
          type: 'INIT_DEFAULT',
          businessData: DEFAULT_BUSINESS,
          agentOutputs: outputs,
          agentLog: log,
        });
        setCopilotMessages([
          {
            role: 'assistant',
            text: 'Greetings. I am your strategic AI Copilot. Ask me any business questions or operational queries.',
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          }
        ]);
        return;
      }

      const savedDataKey = `aegis_business_data_${active.id}`;
      const savedDataRaw = localStorage.getItem(savedDataKey);
      if (savedDataRaw) {
        try {
          const customData = JSON.parse(savedDataRaw);
          
          // 1. Load calculated onboarding metrics/KPIs summary
          let onboardingKpis: any = null;
          try {
            const summaryRes = await ApiClient.getDashboardSummary(active.id);
            if (summaryRes && summaryRes.success) {
              onboardingKpis = summaryRes.summary;
            }
          } catch (e) {}

          // 2. Try loading latest database strategy findings
          try {
            const backendRes = await ApiClient.getLatestStrategy(active.id);
            if (backendRes && backendRes.success) {
              const outputs = formatBackendOutputs(backendRes);
              const log = buildLogsFromBackend(backendRes);
              
              if (onboardingKpis) {
                outputs.ceo.health_score = onboardingKpis.businessHealthScore || outputs.ceo.health_score;
                outputs.ceo.growth_score = onboardingKpis.growthScore || outputs.ceo.growth_score;
              }

              dispatch({
                type: 'INIT_DEFAULT',
                businessData: customData,
                agentOutputs: outputs,
                agentLog: log,
              });
              setCopilotMessages([
                {
                  role: 'assistant',
                  text: 'Welcome back. I am your AI Copilot. Ready to assist with your operational and business growth queries.',
                  timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
                }
              ]);
              return;
            }
          } catch (err) {
            console.warn('[AegisContext] Failed to load strategy from backend, falling back:', err);
          }

          // 3. Fallback to local simulation
          const { outputs, log } = runAgentOrchestrator(customData);
          if (onboardingKpis) {
            outputs.ceo.health_score = onboardingKpis.businessHealthScore || outputs.ceo.health_score;
            outputs.ceo.growth_score = onboardingKpis.growthScore || outputs.ceo.growth_score;
          }

          dispatch({
            type: 'INIT_DEFAULT',
            businessData: customData,
            agentOutputs: outputs,
            agentLog: log,
          });
          setCopilotMessages([
            {
              role: 'assistant',
              text: 'Greetings. I am your strategic AI Copilot. Ask me any business questions or operational queries.',
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
            }
          ]);
        } catch (e) {
          console.error('Failed to parse saved business data:', e);
        }
      }
    };

    initializeAegis();
  }, []);

  const runOrchestrator = async (businessData: BusinessData) => {
    dispatch({ type: 'SET_RUNNING' });
    const active = OrgManager.getActiveOrganization();
    
    if (active) {
      try {
        const backendRes = await ApiClient.executeAgentStrategy(active.id);
        if (backendRes && backendRes.success) {
          const outputs = formatBackendOutputs(backendRes);
          const log = buildLogsFromBackend(backendRes);
          dispatch({ type: 'RUN_COMPLETE', businessData, agentOutputs: outputs, agentLog: log });
          return;
        }
      } catch (e) {
        console.warn('[AegisContext] Backend execution failed, running fallback simulation:', e);
      }
    }

    setTimeout(() => {
      const { outputs, log } = runAgentOrchestrator(businessData);
      dispatch({ type: 'RUN_COMPLETE', businessData, agentOutputs: outputs, agentLog: log });
    }, 100);
  };

  const runCopilotPrompt = async (prompt: string) => {
    if (!state.businessData) return;
    const userMsg: CopilotMessage = {
      role: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
    setCopilotMessages(prev => [...prev, userMsg]);
    dispatch({ type: 'SET_RUNNING' });

    const active = OrgManager.getActiveOrganization();
    if (active) {
      try {
        // Map current copilot messages history for context
        const mappedMessages: Message[] = copilotMessages.map((m, idx) => ({
          id: `msg_copilot_${idx}`,
          role: m.role,
          content: m.text,
          timestamp: new Date().toISOString()
        }));

        // Promise to wait exactly 15 seconds
        const delayPromise = new Promise((resolve) => setTimeout(resolve, 15000));

        // Call BusinessOrchestrator conversational AI
        const apiPromise = BusinessOrchestrator.askWithAgents({
          organization: active,
          messages: [
            ...mappedMessages,
            {
              id: 'msg_copilot_new_user',
              role: 'user',
              content: prompt,
              timestamp: new Date().toISOString()
            }
          ],
          prompt: prompt
        });

        // Wait for both the API response and the 15-second gimmick timer to resolve
        const [resObj] = await Promise.all([apiPromise, delayPromise]);

        const assistantMsg: CopilotMessage = {
          role: 'assistant',
          text: resObj.response,
          agents: resObj.agents,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
        };
        
        setCopilotMessages(prev => [...prev, assistantMsg]);
      } catch (e) {
        console.warn('[AegisContext] Backend copilot call failed, using fallback:', e);
        const assistantMsg: CopilotMessage = {
          role: 'assistant',
          text: `### ⚠️ Connection Error\n\nFailed to reach the AI Copilot. Please verify that your backend service is running correctly.`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
        };
        setCopilotMessages(prev => [...prev, assistantMsg]);
      } finally {
        dispatch({ 
          type: 'RUN_COMPLETE', 
          businessData: state.businessData!, 
          agentOutputs: state.agentOutputs || { ceo: {}, strategy: {}, marketing: {}, sales: {}, finance: {} } as any, 
          agentLog: state.agentLog || [] 
        });
      }
    }
  };

  // Set up live sales tick interval every 3 seconds
  useEffect(() => {
    if (!state.onboarded || !state.businessData) return;

    const interval = setInterval(() => {
      // Simulate a random sales tick
      const randomSale = Math.floor(Math.random() * 120) + 30; // $30 to $150
      setSimulatedRevenue(prev => {
        const nextRevenue = prev + randomSale;
        
        // Append sales tick
        setRecentSalesTicks(ticks => [
          `+$${randomSale} simulated sale via Lead Gen channel`,
          ...ticks.slice(0, 4)
        ]);

        // Dynamically run the orchestrator with the updated revenue values to refresh engine outputs
        const updatedBusiness = {
          ...state.businessData!,
          target_revenue: targetRevenue,
          timeframe_days: timeframeDays,
          starting_capital: startingCapital,
          simulated_revenue: nextRevenue,
        };

        const { outputs, log } = runAgentOrchestrator(updatedBusiness);
        dispatch({ type: 'UPDATE_OUTPUTS', agentOutputs: outputs, agentLog: log });

        return nextRevenue;
      });
    }, 3000); // 3 seconds interval!

    return () => clearInterval(interval);
  }, [state.onboarded, state.businessData, targetRevenue, timeframeDays, startingCapital]);

  return (
    <AegisContext.Provider
      value={{
        ...state,
        runOrchestrator,
        copilotOpen,
        setCopilotOpen,
        copilotMessages,
        runCopilotPrompt,
        targetRevenue,
        setTargetRevenue,
        timeframeDays,
        setTimeframeDays,
        daysRemaining,
        setDaysRemaining,
        startingCapital,
        setStartingCapital,
        simulatedRevenue,
        setSimulatedRevenue,
        recentSalesTicks,
        setRecentSalesTicks,
        isLagging,
      }}
    >
      {children}
    </AegisContext.Provider>
  );
}

function formatBackendOutputs(backendRes: any): AgentOutputs {
  const f = backendRes.findings || {};
  const s = backendRes.strategy || {};
  const e = backendRes.executiveReport || {};

  const fFinance = f.Finance?.rawJson || {};
  const fMarketing = f.Marketing?.rawJson || {};
  const fSales = f.Sales?.rawJson || {};
  const fCS = f.CustomerSuccess?.rawJson || {};

  return {
    ceo: {
      summary: e.executiveSummary || 'Boardroom audit complete.',
      health_score: e.overallHealthScore || 82,
      growth_score: e.businessGrowthScore || 75,
      mandate: (e.strategicPriorities || []).join(' | '),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    },
    strategy: {
      strategy: {
        primary: s.strategicObjectives?.[0] || 'Expand corporate channels',
        pillars: s.strategicObjectives || ['Renegotiate wholesale vendor terms'],
        kpis: {
          'Target ROI': '3.5x',
          'Sales Velocity': '14 days'
        },
        markets: ['Domestic Tier 1', 'Corporate Parks'],
        competitive_moat: 'Organic certified with zero sugar crash formulation'
      },
      growth_projection: {
        Q1: 15,
        Q2: 28,
        Q3: 45,
        Q4: 65
      },
      milestone_velocity: f.Strategy?.summary || 'Roadmap generated.',
      mandate: f.Strategy?.summary || 'Roadmap generated.',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    },
    marketing: {
      campaigns: {
        hero_ad: fMarketing.landingPageHooks?.[0] || 'Say goodbye to fatigue. Try our organic infusions.',
        email_subject: 'Better energy for {{company_name}} teams',
        email_body: 'Hi {{first_name}},\n\nI noticed you manage operations at {{company_name}}...',
        channels: Object.values(fMarketing.channelBreakdown || { p: 'Instagram Social' }) as string[],
        hook: fMarketing.landingPageHooks?.[1] || 'Premium wellness energy boosters for office teams.',
        instagram_post: fMarketing.instagramPostCopy || {
          visualDirections: 'Premium product mockup placed beside a laptop with soft morning desk light.',
          caption: 'Ready to upgrade your team breaks? ☕️ Natural, sustained focus without the coffee jitters or sugar crashes. Elevate your workday focus with Aegis-approved organic boosters.',
          hashtags: ['#workdayfocus', '#productivityhacks', '#officehealth']
        },
        influencer_script: fMarketing.influencerMarketing || {
          targetingProfile: 'Tech-hub micro-influencers and productivity coach accounts (aligns with startup-level budgets).',
          hook: 'I stopped drinking synthetic energy drinks that crash my focus after lunch...',
          scriptBody: 'As a startup founder, I used to rely on double espressos and energy cans just to get through slide decks. Then I discovered natural plant infusions. No jitters, no crash, just steady, clean focus. You feel awake, but calm.',
          cta: 'Check out the link in my bio to get 15% off the Workplace Starter Kit today!',
          visualNotes: 'Influencer starts in a chaotic workspace, holds head in hands. Cuts to clean prep shot, taking a sip with a relaxed smile, then showing a clean keyboard workspace.'
        }
      },
      content_calendar: [
        { week: 'Week 1', content: 'Launch wellness video hook', channel: 'Instagram' },
        { week: 'Week 2', content: 'Email newsletter campaign', channel: 'Newsletter' },
        { week: 'Week 3', content: 'Publish corporate gift blog', channel: 'SEO' }
      ],
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    },
    sales: {
      pipeline: [
        { stage: 'Prospecting', conversion: '100%', avg_days: 3, action: 'Auto email' },
        { stage: 'Proposal', conversion: fSales.salesFunnelConversionMap?.cartToCheckout || '32%', avg_days: 5, action: 'Follow up call' },
        { stage: 'Negotiation', conversion: fSales.salesFunnelConversionMap?.checkoutToPurchase || '84%', avg_days: 4, action: 'Offer discount' }
      ],
      outbound_sequence: [
        { day: 'Day 1', touch: 'Email outreach', goal: 'Introduce brand' },
        { day: 'Day 3', touch: 'LinkedIn message', goal: 'Schedule meeting' },
        { day: 'Day 5', touch: 'Follow-up email', goal: 'Handle objections' }
      ],
      discovery_script: fSales.outboundEmailScript || 'Cold email script template.',
      lead_score_criteria: [
        { factor: 'Industry alignment', weight: '40%', score_range: 'High fit' },
        { factor: 'Annual revenue scale', weight: '30%', score_range: 'MSME' },
        { factor: 'Employee count size', weight: '30%', score_range: 'Growing team' }
      ],
      revenue_opportunity: s.opportunityValue || 85000,
      lead_score: 74,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    },
    finance: {
      risk_alerts: (fFinance.burnRateAlerts || []).map((alert: string) => ({
        level: 'amber',
        title: 'Overhead Alert',
        desc: alert
      })) as RiskAlert[],
      cash_flow: [
        { month: 'Month 1', value: fFinance.monthlyRevenue || 350000 },
        { month: 'Month 2', value: (fFinance.monthlyRevenue || 350000) * 1.15 },
        { month: 'Month 3', value: (fFinance.monthlyRevenue || 350000) * 1.3 }
      ],
      customer_health: fCS.userSatisfactionScore || 88,
      market_readiness: 72,
      feasibility_score: fFinance.feasibilityScore || 82,
      unit_economics: {
        CAC: `₹${fFinance.cac || 2500}`,
        LTV: `₹${fFinance.ltv || 15000}`,
        'LTV:CAC Ratio': fFinance.cacToLtvRatio || '1:6',
        'Payback Period': '1.2 months',
        'Gross Margin': `${fFinance.profitMargin || 31}%`,
        'Burn Multiple': '1.1x'
      },
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
    }
  };
}

interface RiskAlert {
  level: 'red' | 'amber' | 'green';
  title: string;
  desc: string;
}

function buildLogsFromBackend(backendRes: any): LogEntry[] {
  const logs: LogEntry[] = [];
  const findings = backendRes.findings || {};
  
  logs.push({ 
    time: new Date().toLocaleTimeString('en-US', { hour12: false }), 
    agent: 'System', 
    message: 'Orchestrating multi-agent boardroom alignment...',
    color: 'text-neutral-500'
  });
  
  Object.keys(findings).forEach(agentName => {
    logs.push({
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      agent: agentName,
      message: findings[agentName].summary || `Completed domain analysis for ${agentName}.`,
      color: 'text-orange-500'
    });
  });

  logs.push({ 
    time: new Date().toLocaleTimeString('en-US', { hour12: false }), 
    agent: 'System', 
    message: 'Boardroom strategic consolidation complete.',
    color: 'text-emerald-500'
  });
  return logs;
}

export function useAegis() {
  const ctx = useContext(AegisContext);
  if (!ctx) throw new Error('useAegis must be used within AegisProvider');
  return ctx;
}
