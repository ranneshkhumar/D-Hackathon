'use client';

import React, { useState } from 'react';
import { Network, Cpu, Compass, Activity, Database, Server, HelpCircle, Layers, ArrowRight } from 'lucide-react';

const FLOW_STEPS = [
  { num: '1', icon: '📝', label: 'Onboarding', desc: 'Ingestion of company pitch documentation & metrics.', color: '#3b82f6' },
  { num: '2', icon: '🧭', label: 'Strategy', desc: 'Strategy Engine maps brand positioning and growth pillars.', color: '#8b5cf6' },
  { num: '3', icon: '📣', label: 'Marketing', desc: 'Marketing Engine configures 360-degree promotion copies.', color: '#06b6d4' },
  { num: '4', icon: '⚡', label: 'Lead Gen', desc: 'Lead Gen Engine deploys digital and WhatsApp campaign scripts.', color: '#ea580c' },
  { num: '5', icon: '🎯', label: 'Sales Funnel', desc: 'Sales Engine builds closing objection scripts and funnels.', color: '#10b981' },
  { num: '6', icon: '📊', label: 'Analytics', desc: 'Analytics Engine generates cash forecasts & radar grids.', color: '#3b82f6' },
  { num: '7', icon: '👑', label: 'Cust. Success', desc: 'CS Engine deploys support portals & configured AI chatbots.', color: '#ec4899' },
];

const ARCH_LAYERS = [
  {
    name: 'OUTPUT LAYER', icon: '📊', title: 'Output / Dashboard Layer',
    desc: 'Renders real-time business intelligence, CRM support matrices, and inter-agent boardroom transcripts.',
    components: ['Executive Dashboard', 'Boardroom Center', 'Flow Architecture'], color: '#ec4899',
  },
  {
    name: 'FRONTEND LAYER', icon: '🖥️', title: 'Frontend App Layer (React + Next.js)',
    desc: 'Orchestrates multi-page layouts, manages CSS theme tokens, and binds inputs to context state variables.',
    components: ['React context', 'Theme variables', 'Next.js App Router'], color: '#3b82f6',
  },
  {
    name: 'ORCHESTRATION LAYER', icon: '🎯', title: 'Multi-Agent Orchestration Layer',
    desc: 'Binds multi-agent lifecycles, runs sequential pipelines, logs activity milestones, and routes inputs.',
    components: ['runAgentOrchestrator()', 'Inter-Agent Message Bus', 'Execution TimelineLog'], color: '#8b5cf6',
  },
  {
    name: 'AGENT REASONING LAYER', icon: '🤖', title: 'Autonomous AI Agent Layer',
    desc: '6 specialized JS engines reasoning concurrently over Strategy, Marketing, Lead Gen, Sales, Analytics, and Customer Success mandates.',
    components: ['Strategy Engine', 'Marketing Engine', 'Lead Gen Engine', 'Sales Engine', 'Analytics Engine', 'Customer Success Engine'], color: '#06b6d4',
  },
  {
    name: 'KNOWLEDGE LAYER', icon: '🧠', title: 'Vector Benchmark & Knowledge Base',
    desc: 'Serves target industry benchmark parameters, performance indicators, and structural prompt assets.',
    components: ['Industry Benchmarks Store', 'Market Intelligence Corpus', 'Campaign Templates Library'], color: '#10b981',
  },
  {
    name: 'DATA LAYER', icon: '💾', title: 'Business Context & Persistence Layer',
    desc: 'Caches session records, parsed pitch documentations, and historical simulation runs.',
    components: ['React Context Store', 'Business Data Profiles', 'Agent Output Cache'], color: '#ea580c',
  },
];

const DATA_FLOW = [
  ['User Input', 'Business Form', 'Business profile submitted via Onboarding discovery page'],
  ['Frontend', 'Orchestrator', 'Business data object passed to runAgentOrchestrator()'],
  ['Orchestrator', 'Strategy Engine', 'Full business parameters sent for positioning analysis'],
  ['Strategy Engine', 'Marketing Engine', 'Strategy blueprint + market segments forwarded'],
  ['Marketing Engine', 'Lead Gen Engine', 'Marketing hook + channel strategies passed for script prep'],
  ['Lead Gen Engine', 'Sales Engine', 'Target conversion rate + projected lead volumes synchronized'],
  ['Sales Engine', 'Analytics Engine', 'Pipeline stages + conversion data shared for financial modeling'],
  ['Analytics Engine', 'CS Engine', 'Revenue opportunities + radar benchmarks sent to CS portal'],
  ['CS Engine', 'Dashboard', 'Synthesized CRM tickets & dashboard charts rendered to UI'],
];

const ARCH_TABS = ['5D Flow Diagram', 'Technical Blueprint', 'Data Flow Sequence'];

export default function ArchitectureView() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto max-h-screen custom-scrollbar pb-16">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">System Architecture</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 mt-1">Architecture & Flows</h1>
        <p className="text-xs text-neutral-400 mt-1">Visual blueprint of the Aegis 6 AI Engines architecture.</p>
      </div>

      <div className="flex gap-1.5 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/60 overflow-x-auto w-fit max-w-full">
        {ARCH_TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap border border-transparent ${
              activeTab === i
                ? 'bg-white text-neutral-800 shadow-sm border-neutral-200/50'
                : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab 1: 5D Flow Diagram */}
      {activeTab === 0 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">5D Framework End-to-End Execution Sequence</span>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-5">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center gap-2">
                <Network size={14} className="text-neutral-500" />
                Business Growth Flow — 7-Stage Pipeline
              </h4>
              <p className="text-xs text-neutral-400 max-w-xl">
                Aegis models the 5D Framework (Discover, Design, Develop, Deliver, Dominate) by routing data down 7 pipeline milestones.
              </p>
              
              <div className="flex flex-col gap-4 max-w-xl relative pl-4 border-l border-neutral-100">
                {FLOW_STEPS.map((step) => (
                  <div key={step.num} className="flex gap-4 items-start relative">
                    {/* Step Number Dot */}
                    <span
                      className="absolute -left-[27px] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.num}
                    </span>
                    <span className="text-xl shrink-0 mt-0.5">{step.icon}</span>
                    <div>
                      <div className="text-xs font-bold text-neutral-700">{step.label}</div>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-snug">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Technical Blueprint */}
      {activeTab === 1 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Aegis Layered Execution Stack</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {ARCH_LAYERS.map((layer) => (
                <div key={layer.name} className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex justify-between items-start border-b border-neutral-50 pb-2">
                    <div className="flex gap-2 items-center">
                      <span className="text-lg">{layer.icon}</span>
                      <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">{layer.title}</h4>
                    </div>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-lg text-white"
                      style={{ backgroundColor: layer.color }}
                    >
                      {layer.name}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-450 leading-relaxed">{layer.desc}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {layer.components.map((comp) => (
                      <span key={comp} className="bg-neutral-50 border border-neutral-200 text-neutral-500 text-[9px] font-semibold rounded-lg px-2 py-1">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Data Flow Sequence */}
      {activeTab === 2 && (
        <div className="space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Synchronous Data Exchange Map</span>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center gap-2">
                <Compass size={14} className="text-neutral-500" />
                Inter-Engine Message Routing Sequences
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-100 text-neutral-400">
                      <th className="pb-2 font-bold uppercase w-[150px]">Sender</th>
                      <th className="pb-2 font-bold uppercase w-[150px]">Recipient</th>
                      <th className="pb-2 font-bold uppercase">Transaction / Message Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {DATA_FLOW.map((flow, i) => (
                      <tr key={i} className="hover:bg-neutral-50/50">
                        <td className="py-3 font-bold text-neutral-700">{flow[0]}</td>
                        <td className="py-3 font-bold text-neutral-700">
                          <div className="flex items-center gap-2">
                            <ArrowRight size={12} className="text-neutral-300" />
                            <span>{flow[1]}</span>
                          </div>
                        </td>
                        <td className="py-3 text-neutral-450 leading-snug">{flow[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
