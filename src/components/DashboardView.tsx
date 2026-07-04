'use client';

import React from 'react';
import { useAegis } from '../context/AegisContext';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar,
  AreaChart, Area,
} from 'recharts';
import { ShieldAlert, TrendingUp, Cpu, Award, Zap, AlertTriangle, AlertCircle, DollarSign, Activity, Target } from 'lucide-react';

interface MetricProps {
  title: string;
  value: string | number;
  sub: string;
  color?: string;
  icon?: React.ReactNode;
}

function MetricCard({ title, value, sub, color = 'text-neutral-900', icon }: MetricProps) {
  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">{title}</span>
        <span className="text-neutral-400 shrink-0">{icon}</span>
      </div>
      <div className={`text-2xl font-black tracking-tight ${color}`}>{value}</div>
      <div className="text-[11px] text-neutral-400 mt-1">{sub}</div>
    </div>
  );
}

export default function DashboardView() {
  const { agentOutputs, businessData, onboarded } = useAegis();

  if (!onboarded || !agentOutputs || !businessData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-neutral-400 font-medium">
        <Activity className="animate-spin text-neutral-400" size={24} />
        Initializing Aegis Dashboard...
      </div>
    );
  }

  const { ceo, strategy, finance, sales } = agentOutputs;

  // Format charts data
  const revenueData = Object.entries(strategy.growth_projection).map(([q, v]) => ({
    quarter: q,
    revenue: v,
    baseline: businessData.annual_revenue,
  }));

  const radarData = [
    { subject: 'Market Fit', value: ceo.health_score },
    { subject: 'Brand Auth', value: Math.round(ceo.health_score * 0.88) },
    { subject: 'Sales Vel', value: Math.round(ceo.growth_score * 0.95) },
    { subject: 'Revenue', value: Math.round(ceo.growth_score * 0.9) },
    { subject: 'Retention', value: Math.round(ceo.health_score * 0.82) },
    { subject: 'Ops Scale', value: Math.round(ceo.growth_score * 0.85) },
  ];

  const funnelData = sales.pipeline.map(p => ({
    name: p.stage,
    value: parseInt(p.conversion),
  }));

  const riskCount = finance.risk_alerts.filter(r => r.level !== 'green').length;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto max-h-screen custom-scrollbar pb-16">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">5D Framework · Dominate Phase</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 mt-1">Executive Dashboard</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Live business intelligence for <strong className="text-neutral-600">{businessData.company_name}</strong> — {businessData.industry} · {businessData.primary_goal}
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MetricCard
          title="Business Health Score"
          value={`${ceo.health_score}/100`}
          sub="Composite AI assessment"
          color={ceo.health_score >= 75 ? 'text-green-600' : 'text-amber-500'}
          icon={<Activity size={16} />}
        />
        <MetricCard
          title="Projected Q4 Revenue"
          value={`$${(strategy.growth_projection.Q4 / 1000).toFixed(0)}K`}
          sub={`+47% vs baseline $${(businessData.annual_revenue / 1000).toFixed(0)}K`}
          color="text-blue-600"
          icon={<TrendingUp size={16} />}
        />
        <MetricCard
          title="Lead Score"
          value={`${sales.lead_score}/100`}
          sub="ICP qualification index"
          color="text-violet-600"
          icon={<Target size={16} />}
        />
        <MetricCard
          title="Risk Signals"
          value={riskCount}
          sub={`${finance.risk_alerts.length} total alerts flagged`}
          color={riskCount > 2 ? 'text-red-500' : 'text-amber-500'}
          icon={<ShieldAlert size={16} />}
        />
        <MetricCard
          title="Revenue Opportunity"
          value={`$${(sales.revenue_opportunity / 1000).toFixed(0)}K`}
          sub="Identified by Sales Agent"
          color="text-emerald-600"
          icon={<DollarSign size={16} />}
        />
        <MetricCard
          title="Growth Score"
          value={`${ceo.growth_score}/100`}
          sub="Market momentum index"
          color="text-orange-500"
          icon={<Award size={16} />}
        />
      </div>

      {/* CEO Strategic Mandate Panel */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">CEO Agent · Executive Brief</span>
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm flex gap-4 items-start">
          <span className="text-3xl shrink-0">👔</span>
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-700">Strategic Mandate</h4>
            <div className="text-xs font-medium text-blue-600 italic bg-blue-50/50 border border-blue-100 border-l-4 border-l-blue-500 rounded-xl px-4 py-3">
              &quot;{ceo.mandate}&quot;
            </div>
            <p className="text-xs leading-relaxed text-neutral-500">{ceo.summary}</p>
          </div>
        </div>
      </div>

      {/* Charts Block 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">Revenue Growth Projection</h4>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0071e3" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0071e3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                <XAxis dataKey="quarter" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number | string) => [`$${Number(value).toLocaleString()}`, 'Projected Revenue']} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#0071e3" fill="url(#revGrad)" strokeWidth={2} dot={{ fill: '#0071e3', r: 4 }} />
                <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#e8e8ed" strokeDasharray="4 4" strokeWidth={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">Competitive Intelligence Radar</h4>
          <div className="h-[220px] w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f0f0f5" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#86868b' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Block 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">Cash Flow Projection (12 Months)</h4>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={finance.cash_flow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#86868b' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip formatter={(value: number | string) => [`$${Number(value).toLocaleString()}`, 'Projected Cash Flow']} />
                <Area type="monotone" dataKey="value" name="Cash Flow" stroke="#10b981" fill="url(#cfGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">Sales Pipeline Funnel</h4>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: '#86868b' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9, fill: '#86868b' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(v: number | string) => [`${v}%`, 'Conversion Rate']} />
                <Bar dataKey="value" name="Conversion" fill="#0071e3" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Unit Economics & Risk Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">Unit Economics</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(finance.unit_economics).map(([k, v]) => (
              <div key={k} className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/60">
                <div className="text-[10px] font-bold text-neutral-400 uppercase">{k}</div>
                <div className="text-lg font-black text-neutral-700 mt-1">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">Risk Alerts — Finance Agent</h4>
          <div className="space-y-3">
            {finance.risk_alerts.map((alert, i) => {
              const colors = { red: 'bg-red-500 text-red-700 border-red-100 bg-red-50/50', amber: 'bg-amber-500 text-amber-700 border-amber-100 bg-amber-50/50', green: 'bg-emerald-500 text-emerald-700 border-emerald-100 bg-emerald-50/50' };
              const isRed = alert.level === 'red';
              const isAmber = alert.level === 'amber';
              return (
                <div key={i} className={`flex gap-3 items-start border rounded-xl p-3 ${isRed ? colors.red : isAmber ? colors.amber : colors.green}`}>
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${isRed ? 'bg-red-500 animate-pulse' : isAmber ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <div>
                    <h5 className="text-[12px] font-bold text-neutral-800">{alert.title}</h5>
                    <p className="text-[11px] text-neutral-500 leading-snug mt-1">{alert.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
