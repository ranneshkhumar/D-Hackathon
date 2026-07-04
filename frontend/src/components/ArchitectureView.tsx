'use client';

import React, { useState } from 'react';
import { Network, Cpu, Compass, Activity, Database, Server, HelpCircle, Layers, ArrowRight } from 'lucide-react';

const FLOW_STEPS = [
  { num: '1', icon: '📝', label: 'Onboarding', desc: 'Ingestion of company pitch documentation & metrics.', color: '#3b82f6' },
  { num: '2', icon: '🔍', label: 'Vertical Parse', desc: 'Discovery Engine extracts baseline market & segment parameters.', color: '#8b5cf6' },
  { num: '3', icon: '👔', label: 'CEO Mandate', desc: 'Chief Agent synthesizes baseline & locks core strategic growth mandates.', color: '#06b6d4' },
  { num: '4', icon: '🧭', label: 'Strategy Design', desc: 'Strategy Agent maps out 12-month horizon roadmap initiatives.', color: '#10b981' },
  { num: '5', icon: '📣', label: 'Campaign Delivery', desc: 'Marketing & Sales Agents build assets, channels, scripts.', color: '#f59e0b' },
  { num: '6', icon: '💹', label: 'Finance Audit', desc: 'Finance Agent models risk vectors & unit economics trends.', color: '#ef4444' },
  { num: '7', icon: '👑', label: 'Category Leader', desc: 'CEO compiles recommendation blueprints to command market.', color: '#a855f7' },
];

const ARCH_LAYERS = [
  {
    name: 'OUTPUT LAYER', icon: '📊', title: 'Output / Dashboard Layer',
    desc: 'Renders real-time business intelligence, unit economics models, and inter-agent boardroom transcripts.',
    components: ['Executive Dashboard', 'Boardroom Center', 'Flow Architecture'], color: '#a855f7',
  },
  {
    name: 'FRONTEND LAYER', icon: '🖥️', title: 'Frontend App Layer (React + Next.js)',
    desc: 'Orchestrates multi-page layouts, manages CSS theme tokens, and binds inputs to context state variables.',
    components: ['React context', 'Theme variables', 'Next.js App Router'], color: '#3b82f6',
  },
  {
    name: 'ORCHESTRATION LAYER', icon: '🎯', title: 'Multi-Agent Orchestration Layer',
    desc: 'Binds multi-agent lifecycles, runs sequential pipelines, logs activity milestones, and routes inputs.',
    components: ['runAgentOrchestrator()', 'Inter-Agent Message Bus', 'Execution Timeline'], color: '#8b5cf6',
  },
  {
    name: 'AGENT REASONING LAYER', icon: '🤖', title: 'Autonomous AI Agent Layer',
    desc: '5 specialized JS engines reasoning concurrently over Strategy, Marketing, Sales, Finance, and CEO mandates.',
    components: ['CEO Agent', 'Strategy Agent', 'Marketing Agent', 'Sales Agent', 'Finance Agent'], color: '#06b6d4',
  },
  {
    name: 'KNOWLEDGE LAYER', icon: '🧠', title: 'Vector Benchmark & Knowledge Base',
    desc: 'Serves target industry benchmark parameters, performance indicators, and structural prompt assets.',
    components: ['Industry Benchmarks Store', 'Market Intelligence Corpus', 'Campaign Templates Library'], color: '#10b981',
  },
  {
    name: 'DATA LAYER', icon: '💾', title: 'Business Context & Persistence Layer',
    desc: 'Caches session records, parsed pitch documentations, and historical simulation runs.',
    components: ['React Context Store', 'Business Data Profiles', 'Agent Output Cache'], color: '#f59e0b',
  },
];

const DATA_FLOW = [
  ['User Input', 'Business Form', 'Business profile submitted via Discovery page'],
  ['Frontend', 'Orchestrator', 'Business data object passed to runAgentOrchestrator()'],
  ['Orchestrator', 'CEO Agent', 'Full business data sent for initial analysis'],
  ['CEO Agent', 'Strategy Agent', 'Mandate + processed data forwarded'],
  ['Strategy Agent', 'Marketing Agent', 'Strategy blueprint + market segments passed'],
  ['Marketing Agent', 'Sales Agent', 'Campaign assets + channel strategy shared'],
  ['Sales Agent', 'Finance Agent', 'Revenue targets + pipeline data sent for risk analysis'],
  ['Finance Agent', 'CEO Agent', 'Risk alerts + financial model returned for synthesis'],
  ['CEO Agent', 'Dashboard', 'Synthesized executive intelligence rendered to UI'],
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
        <p className="text-xs text-neutral-400 mt-1">Visual blueprint of the Aegis multi-agent platform architecture.</p>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {FLOW_STEPS.map((step) => (
                  <div
                    key={step.num}
                    style={{ borderLeftColor: step.color }}
                    className="bg-neutral-50 border border-neutral-200 border-l-4 rounded-xl p-4 flex flex-col justify-between min-h-[140px]"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-base">{step.icon}</span>
                        <span
                          style={{ color: step.color, background: `${step.color}12`, borderColor: `${step.color}22` }}
                          className="text-[9px] font-extrabold px-2 py-0.5 rounded-full border"
                        >
                          STEP {step.num}
                        </span>
                      </div>
                      <h5 className="text-[12px] font-bold text-neutral-800">{step.label}</h5>
                      <p className="text-[10px] text-neutral-400 leading-snug">{step.desc}</p>
                    </div>
                    <div className="text-[9px] font-bold tracking-wide uppercase flex items-center gap-1 mt-3" style={{ color: step.color }}>
                      <span>⚡</span> Pipeline Active
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">5D Framework Pillars</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { d: 'Discover', icon: '🔍', color: 'text-blue-500 border-t-blue-500', desc: 'Business context ingestion & vertical intelligence' },
                { d: 'Design', icon: '🧭', color: 'text-violet-500 border-t-violet-500', desc: 'Strategy formation, roadmap & KPI architecture' },
                { d: 'Deliver', icon: '📣', color: 'text-cyan-500 border-t-cyan-500', desc: 'Campaign assets, sales scripts & channel mix' },
                { d: 'Develop', icon: '⚡', color: 'text-emerald-500 border-t-emerald-500', desc: 'Financial modeling, risk analysis & feedback loops' },
                { d: 'Dominate', icon: '👑', color: 'text-purple-500 border-t-purple-500', desc: 'Category leadership positioning & optimization' },
              ].map((d, i) => (
                <div key={i} className={`bg-white border border-neutral-200/80 border-t-4 rounded-xl p-4 space-y-2 ${d.color.split(' ')[1]}`}>
                  <span className="text-xl">{d.icon}</span>
                  <h5 className={`text-[12px] font-bold ${d.color.split(' ')[0]}`}>{d.d}</h5>
                  <p className="text-[10px] text-neutral-400 leading-normal">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Technical Blueprint */}
      {activeTab === 1 && (
        <div className="space-y-4">
          <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Technical System Architecture</span>
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center gap-2">
              <Layers size={14} className="text-neutral-500" />
              Aegis Platform Blueprint Architecture
            </h4>

            <div className="flex flex-col gap-2 relative">
              {ARCH_LAYERS.map((layer, i) => (
                <React.Fragment key={i}>
                  <div
                    style={{ borderLeftColor: layer.color }}
                    className="bg-neutral-50 border border-neutral-200 border-l-4 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{layer.icon}</span>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span style={{ color: layer.color }} className="text-[10px] font-bold tracking-wider uppercase">{layer.name}</span>
                          <span className="text-[11px] font-semibold text-neutral-800">— {layer.title}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 mt-0.5">{layer.desc}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 shrink-0">
                      {layer.components.map((c, idx) => (
                        <span key={idx} className="bg-white border border-neutral-200/80 text-neutral-400 text-[9px] font-bold px-2 py-0.5 rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>

                  {i < ARCH_LAYERS.length - 1 && (
                    <div className="flex justify-center items-center gap-2 py-1 text-neutral-300">
                      <div className="w-[1px] h-4 border-l border-dashed border-neutral-300" />
                      <span className="text-[8px] font-extrabold uppercase tracking-widest text-neutral-300">↑ DATA SYNC ↑</span>
                      <div className="w-[1px] h-4 border-l border-dashed border-neutral-300" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Data Flow Sequence */}
      {activeTab === 2 && (
        <div className="space-y-4">
          <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Inter-Agent Data Flow Sequence</span>
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wide flex items-center gap-2">
              <Compass size={14} className="text-neutral-500" />
              Agent Communication Protocol
            </h4>

            <div className="space-y-2">
              {DATA_FLOW.map(([src, dst, desc], i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 py-2.5 border-b border-neutral-100 last:border-0">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-neutral-700 w-24 text-left sm:text-right">{src}</span>
                    <ArrowRight size={12} className="text-blue-500" />
                    <span className="text-[11px] font-bold text-emerald-500 w-24 text-left">{dst}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 sm:ml-4">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
