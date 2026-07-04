import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { runAgentOrchestrator, DEFAULT_BUSINESS } from '../engine/agents';

const AegisContext = createContext(null);

const initialState = {
  businessData: null,
  agentOutputs: null,
  agentLog: [],
  onboarded: false,
  runComplete: false,
  isRunning: false,
};

function aegisReducer(state, action) {
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

export function AegisProvider({ children }) {
  const [state, dispatch] = useReducer(aegisReducer, initialState);

  useEffect(() => {
    // Pre-onboard with default company on mount
    const { outputs, log } = runAgentOrchestrator(DEFAULT_BUSINESS);
    dispatch({
      type: 'INIT_DEFAULT',
      businessData: DEFAULT_BUSINESS,
      agentOutputs: outputs,
      agentLog: log,
    });
  }, []);

  const runOrchestrator = (businessData) => {
    dispatch({ type: 'SET_RUNNING' });
    // Small async tick to allow UI to show loading state
    setTimeout(() => {
      const { outputs, log } = runAgentOrchestrator(businessData);
      dispatch({ type: 'RUN_COMPLETE', businessData, agentOutputs: outputs, agentLog: log });
    }, 50);
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
