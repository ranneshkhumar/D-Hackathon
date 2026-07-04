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
  | { type: 'RUN_COMPLETE'; businessData: BusinessData; agentOutputs: AgentOutputs; agentLog: LogEntry[] };

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
}

const AegisContext = createContext<ContextProps | null>(null);

export function AegisProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(aegisReducer, initialState);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([]);

  // Sync / initialize on client mount
  useEffect(() => {
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
        text: 'Greetings. I am the Master Executive Copilot. Ask me to coordinate any strategic objective down to the Strategy, Marketing, Lead Gen, Sales, Analytics, and Customer Success units.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      }
    ]);
  }, []);

  const runOrchestrator = (businessData: BusinessData) => {
    dispatch({ type: 'SET_RUNNING' });
    setTimeout(() => {
      const { outputs, log } = runAgentOrchestrator(businessData);
      dispatch({ type: 'RUN_COMPLETE', businessData, agentOutputs: outputs, agentLog: log });
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

    setTimeout(() => {
      const { outputs, log } = runAgentOrchestrator(state.businessData!, prompt);
      dispatch({ type: 'RUN_COMPLETE', businessData: state.businessData!, agentOutputs: outputs, agentLog: log });

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
