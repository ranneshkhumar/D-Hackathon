'use client';

import React from 'react';
import { useAegis } from '../context/AegisContext';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar,
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { TrendingUp, Award, Zap, AlertTriangle, AlertCircle, DollarSign, Activity, Target, Landmark, Percent, RefreshCw, Users, ShieldAlert } from 'lucide-react';

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
        Initializing Executive Goal Tracker...
      </div>
    );
  }

  const { ceo, strategy, marketing, sales, finance } = agentOutputs;

  // Format charts data
  const revenueData = Object.entries(strategy.strategy.kpis).map(([k, v]) => ({
    name: k,
    value: parseFloat(v.replace(/[^0-9.]/g, '')) || 0,
  }));

  const radarData = [
    { subject: 'Market Fit', value: ceo.health_score },
    { subject: 'Brand Auth', value: Math.round(ceo.health_score * 0.88) },
    { subject: 'Sales Vel', value: Math.round(ceo.growth_score * 0.95) },
    { subject: 'Retention', value: Math.round(finance.feasibility_score * 0.9) },
    { subject: 'Readiness', value: Math.round(finance.feasibility_score * 0.95) },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto max-h-screen custom-scrollbar pb-16">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">5D Framework · Executive Tracking</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 mt-1">Executive Goal Tracker</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Live business intelligence & simulated targets for <strong className="text-neutral-600">{businessData.company_name}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full shrink-0 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          LIVE GOAL STATE TRACKER ACTIVE
        </div>
      </div>

      {/* 🎯 LIVE TARGET TRACKER CARD */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎯</span>
            <div>
              <h3 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">Live Target Tracker</h3>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5 leading-none">Simulation Revenue Velocity Matrix</p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
          <div className="md:col-span-3 space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-neutral-500">Current Simulated Revenue: <strong className="text-neutral-800">${simulatedRevenue.toLocaleString()}</strong></span>
              <span className="text-neutral-500">Target Revenue Goal: <strong className="text-neutral-800">${targetRevenue.toLocaleString()}</strong></span>
            </div>
            <div className="h-3 w-full bg-neutral-100 rounded-full overflow-hidden relative shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isLagging ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                }`}
                style={{ width: `${Math.min(100, (simulatedRevenue / targetRevenue) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-neutral-400 font-semibold flex justify-between">
              <span>Required Trajectory Run-rate: ${(targetRevenue / timeframeDays).toFixed(0)}/day</span>
              <span>Completion: {((simulatedRevenue / targetRevenue) * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* CRITICAL ALERTS WINDOW */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-100 min-h-[75px] text-center bg-neutral-50/50">
            {isLagging ? (
              <div className="text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-xl text-[11px] font-bold animate-pulse space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <ShieldAlert size={12} className="text-red-500 shrink-0" />
                  <span>🔴 Lagging - Pivot Needed</span>
                </div>
                <div className="text-[9px] font-medium text-neutral-400 lowercase leading-tight">
                  Triggered by CEO & Finance Agents
                </div>
              </div>
            ) : (
              <div className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-[11px] font-bold">
                🟢 Trajectory Normal <br /> Target within reach
              </div>
            )}
          </div>
        </div>

        {/* Live Automated Sales Counter List */}
        <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-3.5 space-y-2">
          <div className="text-[9px] font-bold text-neutral-400 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Simulated Incoming Sales Ticks (Updates Live every 3s)
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

      {/* RENDER METRIC CARDS (exactly 6 grid cards as requested) */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Operational Performance Scores</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <MetricCard
            title="Business Health Score"
            value={`${ceo.health_score}/100`}
            sub="Simulated corporate strength index"
            color={ceo.health_score >= 80 ? 'text-green-600' : 'text-amber-500'}
            icon={<Activity size={16} />}
          />
          <MetricCard
            title="Growth Score"
            value={`${ceo.growth_score}/100`}
            sub="Simulated business scale trajectory"
            color="text-blue-600"
            icon={<TrendingUp size={16} />}
          />
          <MetricCard
            title="Current Revenue Opportunity"
            value={`$${(finance.revenue_opportunity / 1000).toFixed(0)}K`}
            sub="Identified under active positioning"
            color="text-emerald-600"
            icon={<DollarSign size={16} />}
          />
          <MetricCard
            title="Lead Score"
            value={`${sales.lead_score}/100`}
            sub="Simulated outbound ICP qualify index"
            color="text-violet-600"
            icon={<Target size={16} />}
          />
          <MetricCard
            title="Customer Health"
            value={`${finance.feasibility_score}/100`}
            sub="Audit score mapped by CS/Finance"
            color="text-orange-500"
            icon={<Award size={16} />}
          />
          <MetricCard
            title="Market Readiness"
            value={`${Math.min(100, finance.feasibility_score + 2)}/100`}
            sub="Category placement readiness index"
            color="text-cyan-600"
            icon={<RefreshCw size={16} />}
          />
        </div>
      </div>

      {/* Radar Competitors Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">Core Positioning Benchmarks</h4>
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

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-center">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase pb-2 border-b border-neutral-100">
            CEO Strategic Directive
          </h4>
          <div className="space-y-3">
            <div className={`text-xs font-bold italic p-3 border border-l-4 rounded-xl ${
              isLagging
                ? 'text-red-700 bg-red-50/50 border-red-200 border-l-red-500'
                : 'text-emerald-700 bg-emerald-50/50 border-emerald-200 border-l-emerald-500'
            }`}>
              &quot;{ceo.mandate}&quot;
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed font-medium">
              {ceo.summary} Based on daily target computations, the Strategy Agent calculates the milestone velocity to ensure goal realization within target timeframes.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
