'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { runAgentOrchestrator, DEFAULT_BUSINESS, BusinessData, AgentOutputs, LogEntry } from '../engine/agents';

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
  const [simulatedRevenue, setSimulatedRevenue] = useState<number>(2500); // Starts at $2,500 (lagging at Day 10 of 30)
  const [recentSalesTicks, setRecentSalesTicks] = useState<string[]>([
    '+$75 from inbound organic trial conversion',
    '+$120 from Outbound Email demo sign-up'
  ]);

  // Derived state to check if current revenue lags behind expected daily rate
  const elapsedDays = timeframeDays - daysRemaining;
  const expectedDailyRate = targetRevenue / timeframeDays;
  const expectedRevenue = expectedDailyRate * elapsedDays;
  const isLagging = simulatedRevenue < expectedRevenue;

  // Initialize Aegis defaults on client mount
  useEffect(() => {
    const defaultBusinessWithGoals = {
      ...DEFAULT_BUSINESS,
      target_revenue: targetRevenue,
      timeframe_days: timeframeDays,
      starting_capital: startingCapital,
      simulated_revenue: simulatedRevenue,
    };
    const { outputs, log } = runAgentOrchestrator(defaultBusinessWithGoals);
    dispatch({
      type: 'INIT_DEFAULT',
      businessData: defaultBusinessWithGoals,
      agentOutputs: outputs,
      agentLog: log,
    });
    setCopilotMessages([
      {
        role: 'assistant',
        text: 'Greetings. I am the Master Executive Copilot. Ask me to coordinate any strategic objective down to the Strategy, Marketing, Lead Gen, Sales, Analytics, and Customer Success units.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      }
    ]);
  }, []);

  // Set up live sales tick interval every 3.5 seconds
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
    }, 4500); // 4.5 seconds tick rate for stable dashboard visual flow

    return () => clearInterval(interval);
  }, [state.onboarded, state.businessData, targetRevenue, timeframeDays, startingCapital]);

  const runOrchestrator = (businessData: BusinessData) => {
    dispatch({ type: 'SET_RUNNING' });
    const businessWithGoals = {
      ...businessData,
      target_revenue: targetRevenue,
      timeframe_days: timeframeDays,
      starting_capital: startingCapital,
      simulated_revenue: simulatedRevenue,
    };
    setTimeout(() => {
      const { outputs, log } = runAgentOrchestrator(businessWithGoals);
      dispatch({ type: 'RUN_COMPLETE', businessData: businessWithGoals, agentOutputs: outputs, agentLog: log });
    }, 100);
  };

  const runCopilotPrompt = (prompt: string) => {
    if (!state.businessData) return;
    const userMsg: CopilotMessage = {
      role: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
    };
    setCopilotMessages(prev => [...prev, userMsg]);
    dispatch({ type: 'SET_RUNNING' });

    const businessWithGoals = {
      ...state.businessData!,
      target_revenue: targetRevenue,
      timeframe_days: timeframeDays,
      starting_capital: startingCapital,
      simulated_revenue: simulatedRevenue,
    };

    setTimeout(() => {
      const { outputs, log } = runAgentOrchestrator(businessWithGoals, prompt);
      dispatch({ type: 'RUN_COMPLETE', businessData: businessWithGoals, agentOutputs: outputs, agentLog: log });

      const assistantMsg: CopilotMessage = {
        role: 'assistant',
        text: `### 🤖 Master Copilot Plan Executed\n\nI have parsed your request: **"${prompt}"** and orchestrated the 6 specialized AI engines workflow:\n\n1. **Strategy Engine (🧭)**: Aligned brand positioning & framework.\n2. **Marketing Engine (📣)**: Refined 360 marketing & campaigns copy.\n3. **Lead Gen Engine (⚡)**: Deployed digital, WhatsApp & physical lead workflows.\n4. **Sales Engine (🎯)**: Re-configured sales funnels & script answers.\n5. **Analytics Engine (📊)**: Processed growth forecasting & metrics.\n6. **Customer Success Engine (👑)**: Configured client status metrics & chatbot prompts.\n\nAll dashboard parameters and boardroom logs have been synchronized.`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
      };
      setCopilotMessages(prev => [...prev, assistantMsg]);
    }, 1200);
  };

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

export function useAegis() {
  const ctx = useContext(AegisContext);
  if (!ctx) throw new Error('useAegis must be used within AegisProvider');
  return ctx;
}
