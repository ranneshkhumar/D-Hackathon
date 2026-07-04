import React, { useState } from 'react';
import { useAegis } from '../context/AegisContext';
import { AGENTS_META } from '../engine/agents';

const TABS = ['CEO Agent', 'Strategy Agent', 'Marketing Agent', 'Sales Agent', 'Finance Agent'];

export default function Boardroom() {
  const { agentOutputs, agentLog, businessData, onboarded } = useAegis();
  const [activeTab, setActiveTab] = useState(0);

  if (!onboarded || !agentOutputs) {
    return <div className="loading-screen"><div className="spinner" />Loading agent data...</div>;
  }

  const { ceo, strategy, marketing, sales, finance } = agentOutputs;

  const agentColors = {
    'CEO Agent': '#3b82f6',
    'Strategy Agent': '#8b5cf6',
    'Marketing Agent': '#06b6d4',
    'Sales Agent': '#10b981',
    'Finance Agent': '#f59e0b',
  };

  function renderCEO() {
    return (
      <div>
        <div className="agent-card">
          <div className="agent-header">
            <div className="agent-avatar" style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>👔</div>
            <div>
              <div style={{ fontWeight: 700 }}>Chief Intelligence Officer</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Synthesizes all agent outputs into executive-level strategic mandates.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 4 }}>HEALTH SCORE</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#3b82f6' }}>{ceo.health_score}<span style={{ fontSize: 14 }}>/100</span></div>
            </div>
            <div style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 4 }}>GROWTH SCORE</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{ceo.growth_score}<span style={{ fontSize: 14 }}>/100</span></div>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>STRATEGIC MANDATE</div>
            <div style={{ background: 'var(--blue-light)', border: '1px solid rgba(0,113,227,0.2)', borderLeft: '3px solid #0071e3', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontStyle: 'italic', color: 'var(--text-primary)' }}>
              "{ceo.mandate}"
            </div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{ceo.summary}</div>
        </div>
      </div>
    );
  }

  function renderStrategy() {
    const s = strategy.strategy;
    return (
      <div>
        <div className="agent-card">
          <div className="agent-header">
            <div className="agent-avatar" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>🧭</div>
            <div>
              <div style={{ fontWeight: 700 }}>Chief Strategy Architect</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Constructs 12-month growth strategy using market intelligence and 5D alignment.</div>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8b5cf6', marginBottom: 6 }}>PRIMARY STRATEGY</div>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{s.primary}</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>GROWTH PILLARS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {s.pillars.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ width: 18, height: 18, borderRadius: 4, background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#8b5cf6', flexShrink: 0 }}>{i+1}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>KPI TARGETS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(s.kpis).map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '8px 12px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{k}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#8b5cf6', marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>COMPETITIVE MOAT</div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{s.competitive_moat}</div>
          </div>
        </div>

        {/* Revenue Projections */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-title">Quarterly Revenue Projections</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginTop: 12 }}>
            {Object.entries(strategy.growth_projection).map(([q, v]) => (
              <div key={q} style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700 }}>{q}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                  ${(v/1000).toFixed(0)}K
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderMarketing() {
    const c = marketing.campaigns;
    return (
      <div>
        <div className="agent-card">
          <div className="agent-header">
            <div className="agent-avatar" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>📣</div>
            <div>
              <div style={{ fontWeight: 700 }}>Chief Growth Marketer</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Multi-channel campaign strategy, ad copy, email funnels, and content calendar.</div>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#06b6d4', marginBottom: 6 }}>CAMPAIGN HOOK</div>
            <div style={{ fontSize: 14, fontWeight: 600, fontStyle: 'italic', color: 'var(--text-primary)' }}>"{c.hook}"</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>HERO AD COPY</div>
            <div style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, borderLeft: '3px solid #06b6d4' }}>
              {c.hero_ad}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>EMAIL SUBJECT LINE</div>
            <div style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {c.email_subject}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>CHANNEL MIX</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {c.channels.map((ch, i) => (
                <span key={i} className="badge badge-blue">{ch}</span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>EMAIL BODY</div>
            <pre style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '12px 14px', fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.6 }}>
              {c.email_body}
            </pre>
          </div>
        </div>
        {/* Content Calendar */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-title">4-Week Content Calendar</div>
          <table className="data-table" style={{ marginTop: 10 }}>
            <thead><tr><th>Week</th><th>Content</th><th>Channel</th></tr></thead>
            <tbody>
              {marketing.content_calendar.map((w, i) => (
                <tr key={i}>
                  <td><span className="badge badge-gray">{w.week}</span></td>
                  <td style={{ fontWeight: 500 }}>{w.content}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{w.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderSales() {
    return (
      <div>
        <div className="agent-card">
          <div className="agent-header">
            <div className="agent-avatar" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>🎯</div>
            <div>
              <div style={{ fontWeight: 700 }}>Chief Revenue Officer</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Outbound sequences, pipeline stages, and lead scoring to maximize revenue.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 4 }}>LEAD SCORE</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{sales.lead_score}<span style={{ fontSize: 14 }}>/100</span></div>
            </div>
            <div style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 4 }}>REVENUE OPP.</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>${sales.revenue_opportunity.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>PIPELINE STAGES</div>
            <table className="data-table">
              <thead><tr><th>Stage</th><th>Conversion</th><th>Avg Days</th><th>Action</th></tr></thead>
              <tbody>
                {sales.pipeline.map((p, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{p.stage}</td>
                    <td><span className="badge badge-green">{p.conversion}</span></td>
                    <td>{p.avg_days}d</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{p.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>OUTBOUND SEQUENCE</div>
            {sales.outbound_sequence.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '7px 0', borderBottom: i < sales.outbound_sequence.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <span className="badge badge-blue" style={{ flexShrink: 0 }}>{s.day}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{s.touch}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Goal: {s.goal}</div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>DISCOVERY SCRIPT</div>
            <pre style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '12px 14px', fontSize: 11.5, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7 }}>
              {sales.discovery_script}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  function renderFinance() {
    const colors = { red: '#ff3b30', amber: '#ff9f0a', green: '#34c759' };
    return (
      <div>
        <div className="agent-card">
          <div className="agent-header">
            <div className="agent-avatar" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>💹</div>
            <div>
              <div style={{ fontWeight: 700 }}>Chief Financial Intelligence Officer</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Financial risk assessments, cash flow modeling, and unit economics analysis.</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 4 }}>CUSTOMER HEALTH</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>{finance.customer_health}<span style={{ fontSize: 14 }}>/100</span></div>
            </div>
            <div style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 4 }}>MARKET READINESS</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{finance.market_readiness}<span style={{ fontSize: 14 }}>/100</span></div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>RISK ALERTS</div>
            <div className="risk-list">
              {finance.risk_alerts.map((alert, i) => (
                <div key={i} className="risk-item" style={{ background: alert.level === 'red' ? 'rgba(255,59,48,0.05)' : alert.level === 'amber' ? 'rgba(255,159,10,0.05)' : 'rgba(52,199,89,0.05)', borderColor: `${colors[alert.level]}22` }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[alert.level], marginTop: 4, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700 }}>{alert.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: 2 }}>{alert.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>UNIT ECONOMICS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {Object.entries(finance.unit_economics).map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{k}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderers = [renderCEO, renderStrategy, renderMarketing, renderSales, renderFinance];

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">5D Framework · Design & Deliver Phase</div>
        <div className="page-title">Agent Boardroom</div>
        <div className="page-sub">
          Autonomous 5-agent intelligence network — {businessData?.company_name}
        </div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
          {/* Left: Agent Tabs */}
          <div>
            <div className="tabs">
              {AGENTS_META.map((agent, i) => (
                <button key={i} className={`tab${activeTab === i ? ' active' : ''}`} onClick={() => setActiveTab(i)}>
                  {agent.icon} {agent.name}
                </button>
              ))}
            </div>
            {renderers[activeTab]()}
          </div>

          {/* Right: Timeline */}
          <div>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>Execution Timeline</div>
              <div className="timeline" style={{ maxHeight: 600, overflowY: 'auto' }}>
                {agentLog.map((entry, i) => (
                  <div key={i} className="timeline-item">
                    <div className="timeline-dot" style={{ background: entry.color }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 2 }}>
                        <span className="timeline-time">{entry.time}</span>
                        <span className="timeline-agent" style={{ color: entry.color }}>{entry.agent}</span>
                      </div>
                      <div className="timeline-msg">{entry.message}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
