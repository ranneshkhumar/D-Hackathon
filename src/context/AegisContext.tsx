'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { runAgentOrchestrator, DEFAULT_BUSINESS, BusinessData, AgentOutputs, LogEntry } from '../engine/agents';

export interface AegisState {
  businessData: BusinessData | null;
  agentOutputs: AgentOutputs | null;
  agentLog: LogEntry[];
  onboarded: boolean;
  runComplete: boolean;
  isRunning: boolean;
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
}

const AegisContext = createContext<ContextProps | null>(null);

export function AegisProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(aegisReducer, initialState);

  // Sync / initialize on client mount
  useEffect(() => {
    const { outputs, log } = runAgentOrchestrator(DEFAULT_BUSINESS);
    dispatch({
      type: 'INIT_DEFAULT',
      businessData: DEFAULT_BUSINESS,
      agentOutputs: outputs,
      agentLog: log,
    });
  }, []);

  const runOrchestrator = (businessData: BusinessData) => {
    dispatch({ type: 'SET_RUNNING' });
    setTimeout(() => {
      const { outputs, log } = runAgentOrchestrator(businessData);
      dispatch({ type: 'RUN_COMPLETE', businessData, agentOutputs: outputs, agentLog: log });
    }, 100);
  };

  return (
    <AegisContext.Provider value={{ ...state, runOrchestrator }}>
      {children}
    </AegisContext.Provider>
  );
}

export function useAegis() {
  const ctx = useContext(AegisContext);
  if (!ctx) throw new Error('useAegis must be used within AegisProvider');
  return ctx;
}
