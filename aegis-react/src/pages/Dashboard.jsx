import React from 'react';
import { useAegis } from '../context/AegisContext';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar,
  AreaChart, Area,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #e8e8ed', borderRadius: 8, padding: '8px 12px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700, color: '#1d1d1f', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || '#86868b' }}>
          {p.name}: <strong>${p.value?.toLocaleString?.() ?? p.value}</strong>
        </div>
      ))}
    </div>
  );
};

function MetricCard({ title, value, sub, color = '#1d1d1f', icon }) {
  return (
    <div className="card card-sm">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div className="card-title">{title}</div>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
      </div>
      <div className="card-value" style={{ color, fontSize: 26 }}>{value}</div>
      {sub && <div className="card-sub">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { agentOutputs, businessData, onboarded } = useAegis();

  if (!onboarded || !agentOutputs) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        Initializing Aegis Growth OS...
      </div>
    );
  }

  const { ceo, strategy, finance, sales } = agentOutputs;

  // Revenue growth chart data
  const revenueData = Object.entries(strategy.growth_projection).map(([q, v]) => ({
    quarter: q,
    revenue: v,
    baseline: businessData.annual_revenue,
  }));

  // Radar chart data
  const radarData = [
    { subject: 'Market Fit', value: ceo.health_score },
    { subject: 'Brand Auth', value: Math.round(ceo.health_score * 0.88) },
    { subject: 'Sales Vel', value: Math.round(ceo.growth_score * 0.95) },
    { subject: 'Revenue', value: Math.round(ceo.growth_score * 0.9) },
    { subject: 'Retention', value: Math.round(ceo.health_score * 0.82) },
    { subject: 'Ops Scale', value: Math.round(ceo.growth_score * 0.85) },
  ];

  // Funnel data from pipeline
  const funnelData = sales.pipeline.map(p => ({
    name: p.stage,
    value: parseInt(p.conversion),
  }));

  const riskCount = finance.risk_alerts.filter(r => r.level !== 'green').length;

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-eyebrow">5D Framework · Dominate Phase</div>
        <div className="page-title">Executive Dashboard</div>
        <div className="page-sub">
          Live intelligence for <strong>{businessData.company_name}</strong> — {businessData.industry} · {businessData.primary_goal}
        </div>
      </div>

      <div className="page-body">

        {/* KPI Metric Cards */}
        <div className="metrics-grid">
          <MetricCard
            icon="❤️"
            title="Business Health Score"
            value={`${ceo.health_score}/100`}
            sub="Composite AI assessment"
            color={ceo.health_score >= 75 ? '#34c759' : '#ff9f0a'}
          />
          <MetricCard
            icon="📈"
            title="Projected Q4 Revenue"
            value={`$${(strategy.growth_projection.Q4 / 1000).toFixed(0)}K`}
            sub={`+47% vs baseline $${(businessData.annual_revenue / 1000).toFixed(0)}K`}
            color="#0071e3"
          />
          <MetricCard
            icon="🎯"
            title="Lead Score"
            value={`${sales.lead_score}/100`}
            sub="ICP qualification index"
            color="#8b5cf6"
          />
          <MetricCard
            icon="⚠️"
            title="Risk Signals"
            value={riskCount}
            sub={`${finance.risk_alerts.length} total alerts flagged`}
            color={riskCount > 2 ? '#ff3b30' : '#ff9f0a'}
          />
          <MetricCard
            icon="💰"
            title="Revenue Opportunity"
            value={`$${(sales.revenue_opportunity / 1000).toFixed(0)}K`}
            sub="Identified by Sales Agent"
            color="#10b981"
          />
          <MetricCard
            icon="🏆"
            title="Growth Score"
            value={`${ceo.growth_score}/100`}
            sub="Market momentum index"
            color="#f59e0b"
          />
        </div>

        {/* Executive Summary */}
        <div className="section">
          <div className="section-eyebrow">CEO Agent · Executive Brief</div>
          <div className="card">
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>👔</div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 14 }}>Strategic Mandate</div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-base)',
                  padding: '8px 12px',
                  borderRadius: 8,
                  marginBottom: 10,
                  fontStyle: 'italic',
                  borderLeft: '3px solid #0071e3',
                }}>
                  "{ceo.mandate}"
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {ceo.summary}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue + Radar */}
        <div className="charts-grid">
          <div className="card">
            <div className="card-title">Revenue Growth Projection</div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071e3" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0071e3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#86868b' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0071e3" fill="url(#revGrad)" strokeWidth={2} dot={{ fill: '#0071e3', r: 4 }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#e8e8ed" strokeDasharray="4 4" strokeWidth={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">Competitive Intelligence Radar</div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f0f0f5" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#86868b' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel + Cash Flow */}
        <div className="charts-grid">
          <div className="card">
            <div className="card-title">Cash Flow Projection (12 Months)</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={finance.cash_flow} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" name="Cash Flow" stroke="#10b981" fill="url(#cfGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-title">Sales Pipeline Funnel</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={v => [`${v}%`]} />
                <Bar dataKey="value" name="Conversion" fill="#0071e3" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Unit Economics + Risk Alerts */}
        <div className="charts-grid">
          <div className="card">
            <div className="card-title">Unit Economics</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
              {Object.entries(finance.unit_economics).map(([k, v]) => (
                <div key={k} style={{ background: 'var(--bg-base)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 4 }}>{k}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title">Risk Alerts — Finance Agent</div>
            <div className="risk-list" style={{ marginTop: 8 }}>
              {finance.risk_alerts.map((alert, i) => {
                const colors = { red: '#ff3b30', amber: '#ff9f0a', green: '#34c759' };
                const bgs = { red: 'rgba(255,59,48,0.06)', amber: 'rgba(255,159,10,0.06)', green: 'rgba(52,199,89,0.06)' };
                return (
                  <div key={i} className="risk-item" style={{ background: bgs[alert.level], borderColor: `${colors[alert.level]}22` }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[alert.level], marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{alert.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{alert.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
