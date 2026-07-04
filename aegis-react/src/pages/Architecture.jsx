import React, { useState } from 'react';

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
    name: 'FRONTEND LAYER', icon: '🖥️', title: 'Frontend App Layer (React + Vite)',
    desc: 'Orchestrates multi-page layouts, manages CSS theme tokens, and binds inputs to context state variables.',
    components: ['React Router', 'CSS Theme Engine', 'Context State Manager'], color: '#3b82f6',
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

export default function Architecture() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">System Architecture</div>
        <div className="page-title">Architecture & Flows</div>
        <div className="page-sub">Visual blueprint of the Aegis multi-agent platform architecture.</div>
      </div>

      <div className="page-body">
        <div className="tabs">
          {ARCH_TABS.map((t, i) => (
            <button key={i} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>{t}</button>
          ))}
        </div>

        {/* Tab 1: 5D Flow */}
        {activeTab === 0 && (
          <div>
            <div className="section-eyebrow" style={{ marginBottom: 16 }}>5D Framework End-to-End Execution Sequence</div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                🔄 Business Growth Flow — 7-Stage Pipeline
              </div>
              <div className="flow-grid">
                {FLOW_STEPS.map((step) => (
                  <div key={step.num} className="flow-step" style={{ borderLeft: `3px solid ${step.color}` }}>
                    <div className="flow-step-header">
                      <div className="flow-step-icon" style={{ background: `${step.color}12`, border: `1px solid ${step.color}33` }}>
                        {step.icon}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 800, background: `${step.color}12`, color: step.color, border: `1px solid ${step.color}22`, padding: '2px 8px', borderRadius: 100 }}>
                        STEP {step.num}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{step.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>{step.desc}</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: step.color, letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}>
                      ⚡ Pipeline Active
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5D Framework Pillars */}
            <div className="section-eyebrow" style={{ marginBottom: 16 }}>5D Framework Mapping</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {[
                { d: 'Discover', icon: '🔍', color: '#3b82f6', desc: 'Business context ingestion & vertical intelligence' },
                { d: 'Design', icon: '🧭', color: '#8b5cf6', desc: 'Strategy formation, roadmap & KPI architecture' },
                { d: 'Deliver', icon: '📣', color: '#06b6d4', desc: 'Campaign assets, sales scripts & channel mix' },
                { d: 'Develop', icon: '⚡', color: '#10b981', desc: 'Financial modeling, risk analysis & feedback loops' },
                { d: 'Dominate', icon: '👑', color: '#a855f7', desc: 'Category leadership & continuous optimization' },
              ].map((d, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderTop: `3px solid ${d.color}`, borderRadius: 12, padding: '14px 14px' }}>
                  <span style={{ fontSize: 22 }}>{d.icon}</span>
                  <div style={{ fontSize: 13, fontWeight: 800, color: d.color, marginTop: 8 }}>{d.d}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.4 }}>{d.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Technical Blueprint */}
        {activeTab === 1 && (
          <div>
            <div className="section-eyebrow" style={{ marginBottom: 16 }}>Technical System Architecture</div>
            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                🏗️ Aegis Platform Blueprint Architecture
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {ARCH_LAYERS.map((layer, i) => (
                  <React.Fragment key={i}>
                    <div className="arch-layer" style={{ borderLeft: `4px solid ${layer.color}`, background: '#f5f5f7' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: 20 }}>{layer.icon}</span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: layer.color, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                              {layer.name}
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>— {layer.title}</span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{layer.desc}</div>
                        </div>
                      </div>
                      <div className="arch-chips" style={{ flexShrink: 0 }}>
                        {layer.components.map((c, j) => (
                          <span key={j} className="arch-chip">{c}</span>
                        ))}
                      </div>
                    </div>
                    {i < ARCH_LAYERS.length - 1 && (
                      <div className="arch-connector">
                        <div style={{ width: 1, height: 16, borderLeft: '1px dashed #d2d2d7' }} />
                        <span style={{ marginLeft: 8, marginRight: 8 }}>↑ DATA SYNC ↑</span>
                        <div style={{ width: 1, height: 16, borderLeft: '1px dashed #d2d2d7' }} />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Data Flow */}
        {activeTab === 2 && (
          <div>
            <div className="section-eyebrow" style={{ marginBottom: 16 }}>Inter-Agent Data Flow Sequence</div>
            <div className="card">
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                📡 Agent Communication Protocol
              </div>
              {DATA_FLOW.map(([src, dst, desc], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < DATA_FLOW.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ minWidth: 110, fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>{src}</div>
                  <div style={{ color: '#0071e3', fontSize: 20, flexShrink: 0 }}>→</div>
                  <div style={{ minWidth: 90, fontSize: 12, fontWeight: 700, color: '#34c759' }}>{dst}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
