'use client';

import React, { useState } from 'react';
import { useAegis } from '../context/AegisContext';
import { Play, Sparkles, Building2, HelpCircle, Info, Zap, ArrowLeft, ArrowRight } from 'lucide-react';

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Retail / E-Commerce', 'Financial Services',
  'Education', 'Manufacturing', 'Real Estate', 'Consulting / Professional Services',
];

interface DiscoveryViewProps {
  onSuccessRedirect: () => void;
}

export default function DiscoveryView({ onSuccessRedirect }: DiscoveryViewProps) {
  const {
    runOrchestrator,
    isRunning,
    businessData,
    targetRevenue,
    setTargetRevenue,
    timeframeDays,
    setTimeframeDays,
    setDaysRemaining,
    startingCapital,
    setStartingCapital,
    setSimulatedRevenue
  } = useAegis();

  // Onboarding active step wizard state
  const [activeStep, setActiveStep] = useState(1);

  // Form states matching wizard requirements
  const [form, setForm] = useState({
    company_name: businessData?.company_name || '',
    industry: businessData?.industry || 'Technology',
    target_audience: businessData?.target_audience || '',
    doc_text: businessData?.doc_text || '',
  });

  // Goal & capital local states initialized with context defaults
  const [localTargetRevenue, setLocalTargetRevenue] = useState<number>(targetRevenue);
  const [localTimeframeDays, setLocalTimeframeDays] = useState<number>(timeframeDays);
  const [localStartingCapital, setLocalStartingCapital] = useState<number>(startingCapital);

  const update = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  const nextStep = () => {
    if (activeStep < 4) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  const handleLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name.trim()) return;

    // 1. Initialize tracking variables in global state context
    setTargetRevenue(Number(localTargetRevenue));
    setTimeframeDays(Number(localTimeframeDays));
    setDaysRemaining(Number(localTimeframeDays)); // Reset timeframe remaining days
    setStartingCapital(Number(localStartingCapital));
    
    // 2. Start simulated revenue lagging behind (at 25% of target goal) to trigger strategy pivot alerts
    const laggingBaseline = Math.round(Number(localTargetRevenue) * 0.25);
    setSimulatedRevenue(laggingBaseline);

    // 3. Launch Agent Boardroom simulation
    runOrchestrator({
      ...form,
      annual_revenue: Number(localTargetRevenue) * 5, // Simulated baseline annual run rate
      primary_goal: `Reach Target Revenue Goal of $${Number(localTargetRevenue).toLocaleString()} in ${localTimeframeDays} Days`,
      team_size: '1–10 (Startup)',
    });

    onSuccessRedirect();
  };

  const progressPercent = (activeStep / 4) * 100;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto max-h-screen custom-scrollbar pb-16">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">5D Framework · Discover Phase</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 mt-1">Discovery & Onboarding</h1>
        <p className="text-xs text-neutral-400 mt-1">Step-by-step startup questionnaire wizard. Initialize Aegis AI Boardroom.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Wizard Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Top Wizard Progress Tracker */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <span>Wizard Progress</span>
                <span>Step {activeStep} of 4 · {Math.round(progressPercent)}%</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* STEP 1: What is your business name and industry type? */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider pb-3 border-b border-neutral-100 flex items-center gap-2">
                  <Building2 size={14} className="text-neutral-500" />
                  Step 1: Business Identity & Vertical
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">What is your business name? *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aura Wellness"
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.company_name}
                      onChange={e => update('company_name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Select Industry Vertical</label>
                    <select
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.industry}
                      onChange={e => update('industry', e.target.value)}
                    >
                      {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: What are your core products/services and target audience? */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider pb-3 border-b border-neutral-100 flex items-center gap-2">
                  <Info size={14} className="text-neutral-500" />
                  Step 2: Core Offerings & Audience Target
                </h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600">Target Audience Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Mid-market B2B SaaS, tech employees, retail consumers"
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                    value={form.target_audience}
                    onChange={e => update('target_audience', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600">Core Products & Business Details</label>
                  <p className="text-[10px] text-neutral-400 leading-snug">
                    Provide excerpts of your startup positioning, services description, and goals below.
                  </p>
                  <textarea
                    placeholder="e.g. We build workflow automation platforms for operations teams..."
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-mono"
                    rows={6}
                    value={form.doc_text}
                    onChange={e => update('doc_text', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: What is your Target Revenue Goal? */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider pb-3 border-b border-neutral-100 flex items-center gap-2">
                  <Zap size={14} className="text-neutral-500" />
                  Step 3: Revenue Target Goal
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Target Amount Goal ($ / INR)</label>
                    <input
                      type="number"
                      min="500"
                      max="10000000"
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={localTargetRevenue}
                      onChange={e => setLocalTargetRevenue(Math.max(1, Number(e.target.value)))}
                    />
                    <div className="text-[10px] text-neutral-400 font-mono">
                      Target Amount: ${Number(localTargetRevenue).toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Timeframe Goal (Days)</label>
                    <input
                      type="number"
                      min="5"
                      max="365"
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={localTimeframeDays}
                      onChange={e => setLocalTimeframeDays(Math.max(1, Number(e.target.value)))}
                    />
                    <div className="text-[10px] text-neutral-400 font-mono">
                      Target Horizon: {localTimeframeDays} days
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: What is your starting capital or budget? */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider pb-3 border-b border-neutral-100 flex items-center gap-2">
                  <Building2 size={14} className="text-neutral-500" />
                  Step 4: Starting Capital & Launch
                </h3>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600">Starting Capital / Working Budget ($)</label>
                  <input
                    type="number"
                    min="100"
                    max="5000000"
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                    value={localStartingCapital}
                    onChange={e => setLocalStartingCapital(Math.max(1, Number(e.target.value)))}
                  />
                  <div className="text-[10px] text-neutral-400 font-mono">
                    Starting Capital: ${Number(localStartingCapital).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Wizard Action Controls */}
            <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
              <button
                type="button"
                disabled={activeStep === 1 || isRunning}
                onClick={prevStep}
                className="flex items-center gap-1.5 px-4 py-2 border border-neutral-200 rounded-xl text-neutral-500 hover:text-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors"
              >
                <ArrowLeft size={12} />
                <span>Back</span>
              </button>

              {activeStep < 4 ? (
                <button
                  type="button"
                  disabled={activeStep === 1 && !form.company_name}
                  onClick={nextStep}
                  className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wide cursor-pointer disabled:opacity-45 transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight size={12} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunch}
                  disabled={isRunning || !form.company_name}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <Zap size={14} className="animate-spin text-white" />
                      Launching Engine...
                    </>
                  ) : (
                    <>
                      <Play size={10} className="fill-white" />
                      Launch Business Engine
                    </>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>

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
                { icon: '📊', name: 'Analytics Engine', role: 'Forecasting & opportunity audits' },
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
              <strong className="text-neutral-700">Aegis is NOT a chatbot.</strong> It runs an autonomous, structured 6-engine boardroom blueprint to map category leadership.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
