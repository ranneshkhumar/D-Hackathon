'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAegis } from '../context/AegisContext';
import { Terminal, Play, RotateCcw, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

interface AgentBlock {
  badge: string;
  badgeColor: string;
  textColor: string;
  name: string;
  role: string;
  responsibility: string;
  input: string;
  output: string;
  message: string;
}

export default function BoardroomView() {
  const { agentOutputs, businessData, onboarded, targetRevenue, timeframeDays, startingCapital } = useAegis();
  const [meetingLogs, setMeetingLogs] = useState<AgentBlock[]>([]);
  const [currentRunningIndex, setCurrentRunningIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const getAgentsChain = (): AgentBlock[] => {
    if (!agentOutputs || !businessData) return [];

    const { strategy, marketing, sales, cs, analytics } = agentOutputs;

    return [
      {
        badge: '🤖 MASTER COPILOT',
        badgeColor: 'bg-neutral-800 text-neutral-200 border-neutral-700',
        textColor: 'text-neutral-400',
        name: 'Master Executive Copilot',
        role: 'Central Strategy Dispatcher',
        responsibility: 'Receives user inputs and sets the Target Revenue Goal framework.',
        input: `Business: ${businessData.company_name} | Goal: $${targetRevenue.toLocaleString()} in ${timeframeDays} Days`,
        output: 'Structured strategic objectives dispatched to agent units.',
        message: `System target initialized: $${targetRevenue.toLocaleString()} revenue over ${timeframeDays} days. Starting capital: $${startingCapital.toLocaleString()}. Dispatching framework parameters to the Boardroom...`,
      },
      {
        badge: '👔 CEO AGENT',
        badgeColor: 'bg-emerald-500 text-white border-emerald-600',
        textColor: 'text-emerald-400',
        name: 'CEO Agent',
        role: 'Chief Executive Officer',
        responsibility: 'Opens meeting, references target goal, and commands action.',
        input: 'User Target Revenue Goal and capital parameters.',
        output: 'Mandate instruction to Strategy and Marketing units.',
        message: `Board meeting convened. Our primary mandate is to hit $${targetRevenue.toLocaleString()} in ${timeframeDays} days. I am ordering the Strategy team to map the exact trajectory, and Marketing to build immediate campaign support. Let's make this happen.`,
      },
      {
        badge: '🧠 STRATEGY AGENT',
        badgeColor: 'bg-blue-500 text-white border-blue-600',
        textColor: 'text-blue-400',
        name: 'Strategy Agent',
        role: 'Chief Strategy Architect',
        responsibility: 'Calculates milestone velocities and designs growth models.',
        input: 'Industry context and target revenue parameters.',
        output: 'Calculated growth pillars and milestone targets.',
        message: `Ingested ${businessData.industry} baseline parameters. Calculated expected velocity: $${(targetRevenue / timeframeDays).toFixed(0)}/day. Focus strategy model: "${strategy.strategy.primary}". Moat is set to: ${strategy.strategy.competitive_moat}.`,
      },
      {
        badge: '📢 MARKETING AGENT',
        badgeColor: 'bg-amber-500 text-white border-amber-600',
        textColor: 'text-amber-400',
        name: 'Marketing Agent',
        role: 'Chief Marketing Officer',
        responsibility: 'Suggests and designs 360 marketing strategies to promote the product.',
        input: 'Strategy growth pillars and milestone goals.',
        output: 'Ad copy captions, email funnels, and channel mixes.',
        message: `Campaign hook created: "${marketing.campaigns.hook}". Hero Ad Copy generated: "${marketing.campaigns.hero_ad}". Content calendar initialized for channels: ${marketing.campaigns.channels.join(', ')}.`,
      },
      {
        badge: '🎯 SALES AGENT',
        badgeColor: 'bg-orange-500 text-white border-orange-600',
        textColor: 'text-orange-400',
        name: 'Sales Agent',
        role: 'Chief Revenue Officer',
        responsibility: 'Builds sales funnel stages and sets outbound sequences.',
        input: 'Marketing channels and target milestones.',
        output: 'Cold outreach templates and objection handlers.',
        message: `Sales script mapped: "${sales.discovery_script.slice(0, 100)}...". Sequence launched. Outbound LinkedIn/Email touch points synchronized. Target ICP qualification score set to ${sales.lead_score}/100.`,
      },
      {
        badge: '💵 FINANCE AGENT',
        badgeColor: 'bg-red-500 text-white border-red-600',
        textColor: 'text-red-400',
        name: 'Finance Agent',
        role: 'Chief Financial Officer',
        responsibility: 'Audits budgets, flags cash-flow risks, and determines feasibility.',
        input: 'Budget capital and sales funnel numbers.',
        output: 'Risk audit signals and target feasibility checks.',
        message: `Starting budget of $${startingCapital.toLocaleString()} audited. Flags active: ${cs.support_tickets.length} tickets. Risk check complete. Dynamic target feasibility rated at: ${cs.client_health}/100. CRM state: "${cs.crm_notes || cs.crm_status}".`,
      },
    ];
  };

  const startMeetingSimulation = () => {
    setMeetingLogs([]);
    setCurrentRunningIndex(0);
  };

  // Auto start simulation on load if onboarded
  useEffect(() => {
    if (onboarded && agentOutputs) {
      startMeetingSimulation();
    }
  }, [onboarded, agentOutputs]);

  // Scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [meetingLogs, currentRunningIndex]);

  // Handle typing sequence delays
  useEffect(() => {
    const chain = getAgentsChain();
    if (currentRunningIndex === -1 || currentRunningIndex >= chain.length) {
      if (currentRunningIndex >= chain.length) {
        setCurrentRunningIndex(-1); // Completed
      }
      return;
    }

    const timer = setTimeout(() => {
      setMeetingLogs(prev => [...prev, chain[currentRunningIndex]]);
      setCurrentRunningIndex(prev => prev + 1);
    }, 1500); // 1.5 seconds typing/streaming delay

    return () => clearTimeout(timer);
  }, [currentRunningIndex]);

  if (!onboarded || !agentOutputs || !businessData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-neutral-400 font-medium">
        <Activity className="animate-spin text-neutral-400" size={24} />
        Loading Boardroom meeting...
      </div>
    );
  }

  const chain = getAgentsChain();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto max-h-screen custom-scrollbar pb-16">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">5D Framework · Boardroom Phase</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 mt-1">Agent Boardroom (Live Meeting)</h1>
          <p className="text-xs text-neutral-400 mt-1">Live sequence matching goal trajectory checks for {businessData.company_name}.</p>
        </div>
        <button
          onClick={startMeetingSimulation}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
        >
          <RotateCcw size={13} />
          <span>Restart Meeting</span>
        </button>
      </div>

      {/* Terminal Slate Log */}
      <div className="bg-[#0f172a] border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[400px]">
        {/* Terminal Header */}
        <div className="flex justify-between items-center bg-[#1e293b] px-4 py-2.5 border-b border-neutral-800">
          <div className="flex items-center gap-1.5">
            <Terminal size={14} className="text-neutral-400" />
            <span className="font-mono text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Aegis OS Boardroom Terminal Log</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Terminal Output Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 font-mono text-xs custom-scrollbar">
          {meetingLogs.map((log, idx) => (
            <div key={idx} className="space-y-2 border-b border-neutral-800/40 pb-4 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${log.badgeColor}`}>
                  {log.badge}
                </span>
                <span className="text-[10px] text-neutral-500">[{log.role}]</span>
              </div>

              {/* Explicit Agent Metrics State Box */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#1e293b]/40 border border-neutral-800/80 rounded-lg p-2.5 text-[10px] text-neutral-400">
                <div>
                  <span className="font-semibold block text-neutral-500">ROLE:</span>
                  <span className="truncate block font-bold text-neutral-300">{log.role}</span>
                </div>
                <div>
                  <span className="font-semibold block text-neutral-500">RESPONSIBILITY:</span>
                  <span className="truncate block text-neutral-300">{log.responsibility}</span>
                </div>
                <div>
                  <span className="font-semibold block text-neutral-500">INPUT STATE:</span>
                  <span className="truncate block text-neutral-300 font-sans">{log.input}</span>
                </div>
                <div>
                  <span className="font-semibold block text-neutral-500">OUTPUT STATE:</span>
                  <span className="truncate block text-neutral-300 font-sans">{log.output}</span>
                </div>
              </div>

              {/* Agent body log */}
              <p className={`leading-relaxed pl-1 whitespace-pre-wrap ${log.textColor}`}>
                &gt; {log.message}
              </p>
            </div>
          ))}

          {/* Active Typing Loader */}
          {currentRunningIndex !== -1 && currentRunningIndex < chain.length && (
            <div className="flex items-center gap-2 text-neutral-500">
              <Cpu size={12} className="animate-spin text-orange-500" />
              <span>[{chain[currentRunningIndex].badge.split(' ')[0]}] preparing outputs...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Agents Breakdown Grid cards */}
      <div className="space-y-4">
        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Boardroom AI Agent Specifications</span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {chain.slice(1).map((agent, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <span className="text-xs font-bold text-neutral-700 tracking-wide uppercase">{agent.name}</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${agent.badgeColor}`}>
                  Active
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase block">Role</span>
                  <span className="text-neutral-700 font-semibold">{agent.role}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase block">Responsibility</span>
                  <p className="text-neutral-500 leading-snug">{agent.responsibility}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
