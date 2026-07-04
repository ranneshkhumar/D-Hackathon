'use client';

import React from 'react';
import { useAegis } from '../context/AegisContext';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar,
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { ShieldAlert, TrendingUp, Cpu, Award, Zap, AlertTriangle, AlertCircle, DollarSign, Activity, Target, Landmark, Percent, RefreshCw, MessageSquare, Users } from 'lucide-react';

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
        <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">{title}</span>
        <span className="text-neutral-400 shrink-0">{icon}</span>
      </div>
      <div className={`text-2xl font-black tracking-tight ${color}`}>{value}</div>
      <div className="text-[11px] text-neutral-400 mt-1">{sub}</div>
    </div>
  );
}

export default function DashboardView() {
  const {
    agentOutputs,
    businessData,
    onboarded,
    targetRevenue,
    timeframeDays,
    daysRemaining,
    startingCapital,
    simulatedRevenue,
    recentSalesTicks,
    isLagging
  } = useAegis();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !onboarded || !agentOutputs || !businessData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-neutral-400 font-medium">
        <Activity className="animate-spin text-neutral-400" size={24} />
        Initializing Aegis Dashboard...
      </div>
    );
  }

  const { strategy, marketing, leadgen, sales, analytics, cs } = agentOutputs;

  // Format charts data
  const revenueData = Object.entries(analytics.growth_projection).map(([q, v]) => ({
    quarter: q,
    revenue: v,
    baseline: businessData.annual_revenue,
  }));

  const radarData = analytics.radar_scores;

  const funnelData = sales.pipeline.map(p => ({
    name: p.stage,
    value: parseInt(p.conversion),
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto max-h-screen custom-scrollbar pb-16">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">5D Framework · Dominate Phase</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 mt-1">Executive Dashboard</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Live business intelligence for <strong className="text-neutral-600">{businessData.company_name}</strong> — {businessData.industry} · {businessData.primary_goal}
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          STARTUP ASSISTANT ONLINE
        </div>
      </div>

      {/* 🎯 Live Goal Tracker */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <div>
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">Live Goal Tracker</h3>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">Personal Assistant Live-Tracking Simulator</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="text-[9px] font-bold text-neutral-400 uppercase">Days Remaining</div>
              <div className="text-sm font-black text-neutral-700">{daysRemaining} / {timeframeDays} Days</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-neutral-400 uppercase">Starting Capital</div>
              <div className="text-sm font-black text-neutral-700">${startingCapital.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar & Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-3 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-neutral-500">Current Simulated Revenue: <strong className="text-neutral-800">${simulatedRevenue.toLocaleString()}</strong></span>
              <span className="text-neutral-500">Target Revenue Goal: <strong className="text-neutral-800">${targetRevenue.toLocaleString()}</strong></span>
            </div>
            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isLagging ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${Math.min(100, (simulatedRevenue / targetRevenue) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-400 font-medium flex justify-between">
              <span>Expected Daily Rate: ${(targetRevenue / timeframeDays).toFixed(0)}/day</span>
              <span>Progress: {((simulatedRevenue / targetRevenue) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Lagging alert status */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-100 min-h-[70px] text-center bg-neutral-50/50">
            {isLagging ? (
              <div className="text-red-650 text-red-650 bg-red-50 border border-red-100 px-3 py-2 rounded-xl text-[11px] font-bold animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 animate-ping" />
                <span>🔴 Lagging Behind Goal<br />Strategy Pivot Needed</span>
              </div>
            ) : (
              <div className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl text-[11px] font-bold">
                🟢 Trajectory Healthy <br /> Goal within reach
              </div>
            )}
          </div>
        </div>

        {/* Live Simulated Incoming Sales ticker */}
        <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-3.5 space-y-2">
          <div className="text-[9px] font-bold text-neutral-400 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Simulated Sales Ledger (Live Ticks)
          </div>
          <div className="space-y-1.5 max-h-[85px] overflow-y-auto custom-scrollbar">
            {recentSalesTicks.map((tick, idx) => (
              <div key={idx} className="flex gap-2 items-center text-[10px] font-mono text-neutral-500">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>{tick}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 9 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Row 1 */}
        <MetricCard
          title="Client Health Index"
          value={`${cs.client_health}/100`}
          sub="Customer success analytics"
          color={cs.client_health >= 85 ? 'text-green-600' : 'text-amber-500'}
          icon={<Users size={16} />}
        />
        <MetricCard
          title="Projected Q4 Revenue"
          value={`$${(analytics.growth_projection.Q4 / 1000).toFixed(0)}K`}
          sub={`Baseline $${(businessData.annual_revenue / 1000).toFixed(0)}K`}
          color="text-blue-600"
          icon={<TrendingUp size={16} />}
        />
        <MetricCard
          title="Lead Score Index"
          value={`${sales.lead_score}/100`}
          sub="ICP lead Gen qualification"
          color="text-violet-600"
          icon={<Target size={16} />}
        />

        {/* Row 2 */}
        <MetricCard
          title="Active Support Tickets"
          value={cs.support_tickets.filter(t => t.status !== 'resolved').length}
          sub={`${cs.support_tickets.length} total tickets logged`}
          color="text-amber-500"
          icon={<AlertTriangle size={16} />}
        />
        <MetricCard
          title="Revenue Opportunity"
          value={`$${(analytics.revenue_opportunity / 1000).toFixed(0)}K`}
          sub="Identified by Analytics Engine"
          color="text-emerald-600"
          icon={<DollarSign size={16} />}
        />
        <MetricCard
          title="Lead Gen Conversion"
          value={`${leadgen.conversion_rate}%`}
          sub={`Target leads: ${leadgen.projected_leads}`}
          color="text-orange-500"
          icon={<Award size={16} />}
        />

        {/* Row 3 */}
        <MetricCard
          title="Cust. Acquisition Cost (CAC)"
          value="$340"
          sub="Average lead acquisition cost"
          color="text-neutral-800"
          icon={<Percent size={15} />}
        />
        <MetricCard
          title="Customer Lifetime Value (LTV)"
          value="$4,200"
          sub="Contract lifecycle revenue"
          color="text-neutral-800"
          icon={<Landmark size={15} />}
        />
        <MetricCard
          title="LTV:CAC Ratio"
          value="12.4x"
          sub="Unit economic yield health"
          color="text-neutral-800"
          icon={<RefreshCw size={15} />}
        />
      </div>

      {/* Strategy Engine mandate Panel */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Strategy Engine · Executive Brief</span>
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm flex gap-4 items-start">
          <span className="text-3xl shrink-0">🧭</span>
          <div className="space-y-2 flex-1">
            <h4 className="text-xs font-bold text-neutral-700">Primary Positioning Strategy</h4>
            <div className={`text-xs font-medium italic border rounded-xl px-4 py-3 border-l-4 ${
              isLagging
                ? 'text-red-700 bg-red-50/50 border-red-200 border-l-red-500'
                : 'text-blue-600 bg-blue-50/50 border-blue-100 border-l-blue-500'
            }`}>
              &quot;{strategy.strategy.primary}&quot;
            </div>
            <p className="text-xs leading-relaxed text-neutral-500">
              Target Markets: {strategy.strategy.markets.join(', ')} · Competitive Moat: {strategy.strategy.competitive_moat}
            </p>
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
              <AreaChart data={analytics.cash_flow} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">CRM Portal & Chatbot Status</h4>
          <div className="bg-neutral-50 border border-neutral-200/60 p-4 rounded-xl space-y-2 text-xs font-medium">
            <div className="text-[10px] font-bold text-neutral-400 uppercase">CS Engine CRM Status</div>
            <div className="text-neutral-700 font-bold">{cs.crm_status}</div>
            <div className="text-[10px] font-bold text-neutral-400 uppercase mt-4">AI Chatbot Prompt Instructions</div>
            <p className="text-neutral-500 font-mono leading-relaxed bg-white border border-neutral-100 p-2.5 rounded-lg">{cs.chatbot_notes}</p>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">Support Portal Tickets — CS Engine</h4>
          <div className="space-y-3">
            {cs.support_tickets.map((t, idx) => {
              const isOpen = t.status === 'open';
              const isPending = t.status === 'pending';
              return (
                <div key={t.id} className={`flex justify-between items-center border border-neutral-100 p-3 rounded-xl hover:bg-neutral-50/40`}>
                  <div className="flex gap-2.5 items-center">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${isOpen ? 'bg-red-500 animate-pulse' : isPending ? 'bg-amber-500' : 'bg-green-500'}`} />
                    <span className="text-[10px] font-bold font-mono text-neutral-400">{t.id}</span>
                    <span className="text-xs text-neutral-700 font-semibold">{t.subject}</span>
                  </div>
                  <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-lg border ${
                    isOpen ? 'text-red-500 bg-red-50 border-red-100' : isPending ? 'text-amber-500 bg-amber-50 border-amber-100' : 'text-green-500 bg-green-50 border-green-100'
                  }`}>{t.status}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
