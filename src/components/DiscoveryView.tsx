'use client';

import React, { useState } from 'react';
import { useAegis } from '../context/AegisContext';
import { Play, Sparkles, Building2, HelpCircle, Info, Zap } from 'lucide-react';

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Retail / E-Commerce', 'Financial Services',
  'Education', 'Manufacturing', 'Real Estate', 'Consulting / Professional Services',
];
const GOALS = [
  'Increase Revenue & ARR', 'Enter New Markets', 'Reduce Customer Churn',
  'Build Brand Authority', 'Launch New Product', 'Raise Funding / Series A',
  'Achieve Profitability', 'Scale Operations',
];
const TEAM_SIZES = [
  '1–10 (Startup)', '11–50 (Early Stage)', '51–200 (Scale-up)',
  '201–500 (Mid-market)', '500+ (Enterprise)',
];

interface DiscoveryViewProps {
  onSuccessRedirect: () => void;
}

export default function DiscoveryView({ onSuccessRedirect }: DiscoveryViewProps) {
  const { runOrchestrator, isRunning, businessData } = useAegis();

  const [form, setForm] = useState({
    company_name: businessData?.company_name || '',
    industry: businessData?.industry || 'Technology',
    annual_revenue: businessData?.annual_revenue || 500000,
    target_audience: businessData?.target_audience || '',
    primary_goal: businessData?.primary_goal || 'Increase Revenue & ARR',
    team_size: businessData?.team_size || '1–10 (Startup)',
    doc_text: businessData?.doc_text || '',
  });

  const update = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name.trim()) return;
    runOrchestrator({ ...form, annual_revenue: Number(form.annual_revenue) });
    onSuccessRedirect();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto max-h-screen custom-scrollbar pb-16">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">5D Framework · Discover Phase</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 mt-1">Discovery & Onboarding</h1>
        <p className="text-xs text-neutral-400 mt-1">Enter your organization context to orchestrate the 5-agent intelligence boardroom.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Form panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider pb-3 border-b border-neutral-100 flex items-center gap-2">
              <Building2 size={14} className="text-neutral-500" />
              Company Intelligence Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Wellness"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={form.company_name}
                  onChange={e => update('company_name', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Industry Vertical</label>
                <select
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={form.industry}
                  onChange={e => update('industry', e.target.value)}
                >
                  {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Annual Revenue (USD)</label>
                <input
                  type="number"
                  min="10000"
                  max="100000000"
                  step="10000"
                  placeholder="e.g. 1200000"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={form.annual_revenue}
                  onChange={e => update('annual_revenue', e.target.value)}
                />
                <div className="text-[10px] text-neutral-400 font-mono">
                  Current: ${Number(form.annual_revenue || 0).toLocaleString()}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Team Size</label>
                <select
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={form.team_size}
                  onChange={e => update('team_size', e.target.value)}
                >
                  {TEAM_SIZES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Target Audience</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-market B2B SaaS"
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={form.target_audience}
                  onChange={e => update('target_audience', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-600">Primary Goal</label>
                <select
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  value={form.primary_goal}
                  onChange={e => update('primary_goal', e.target.value)}
                >
                  {GOALS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider pb-3 border-b border-neutral-100 flex items-center gap-2">
              <Info size={14} className="text-neutral-500" />
              Business Intelligence Documentation
            </h3>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              Paste pitch deck excerpts, strategy documents, target markets context, and core bottlenecks. The orchestrator will parse this context.
            </p>
            <textarea
              placeholder="COMPANY OVERVIEW: We build workflow automation...\nCURRENT CHALLENGES: CAC is too high..."
              className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
              rows={8}
              value={form.doc_text}
              onChange={e => update('doc_text', e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isRunning || !form.company_name}
            className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl py-3.5 shadow-md active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isRunning ? (
              <>
                <Zap size={14} className="animate-bounce text-orange-400" />
                Boardroom Executing...
              </>
            ) : (
              <>
                <Play size={12} className="fill-white" />
                ⚡ Run Agent Boardroom
              </>
            )}
          </button>
        </form>

        {/* Sidebar panel */}
        <div className="space-y-5">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-neutral-700 tracking-wider uppercase pb-2 border-b border-neutral-100 flex items-center gap-2">
              <Sparkles size={14} className="text-neutral-500" />
              Boardroom Sequential Process
            </h4>
            <div className="space-y-3.5">
              {[
                { icon: '🧭', name: 'Strategy Engine', role: 'Brand positioning & frameworks' },
                { icon: '📣', name: 'Marketing Engine', role: '360 marketing strategies' },
                { icon: '⚡', name: 'Lead Gen Engine', role: 'whatsapp & digital outreach' },
                { icon: '🎯', name: 'Sales Engine', role: 'Funnel closing & scripting' },
                { icon: '📊', name: 'Analytics Engine', color: '#3b82f6', role: 'Forecasting & opportunity audits' },
                { icon: '👑', name: 'Customer Success Engine', role: 'CRM databases & support chatbot' },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="text-lg shrink-0">{step.icon}</span>
                  <div>
                    <h5 className="text-[12px] font-bold text-neutral-800">{step.name}</h5>
                    <p className="text-[10px] text-neutral-400">{step.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-100 border border-neutral-200/50 rounded-2xl p-5 space-y-3.5">
            <h4 className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Architecture Safeguard</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              <strong className="text-neutral-700">Aegis is NOT a CRM.</strong> It does not host lead pipelines or customer accounts.<br /><br />
              <strong className="text-neutral-700">Aegis is NOT a chatbot.</strong> It runs an autonomous, structured 5-agent boardroom blueprint to map category leadership.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
