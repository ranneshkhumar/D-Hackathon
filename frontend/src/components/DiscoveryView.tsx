'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAegis } from '../context/AegisContext';
import { OrgManager } from '@/services/org-manager';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Sparkles, Building2, Info, Zap, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface DiscoveryViewProps {
  onSuccessRedirect: () => void;
}

const INDUSTRIES = [
  'Retail', 'Manufacturing', 'Healthcare', 'Education', 'IT & Software',
  'Finance', 'Food & Beverage', 'Construction', 'Logistics', 'Hospitality', 'Other'
];

const CATEGORIES = ['Startup', 'MSME', 'Enterprise', 'Freelancer'];
const TYPES = ['B2B', 'B2C', 'D2C', 'Hybrid'];

const ACQUISITION_CHANNELS = [
  'Website', 'Instagram', 'Facebook', 'WhatsApp', 'Offline Store',
  'Marketplace', 'Referrals', 'Email Marketing', 'Google Ads'
];

const GOALS = [
  'Increase Revenue', 'Increase Profit', 'Generate More Leads', 'Improve Customer Retention',
  'Reduce Expenses', 'Improve Marketing ROI', 'Expand to New Markets', 'Launch New Products',
  'Improve Operational Efficiency', 'Digital Transformation'
];

const CHALLENGES = [
  'Low Sales', 'High Operational Costs', 'Poor Marketing Performance', 'Low Customer Retention',
  'Inventory Management', 'Cash Flow Issues', 'High Competition', 'Low Online Presence',
  'Hiring Challenges', 'Operational Inefficiency'
];

export default function DiscoveryView({ onSuccessRedirect }: DiscoveryViewProps) {
  const router = useRouter();
  const { runOrchestrator, isRunning, businessData } = useAegis();
  const activeOrg = typeof window !== 'undefined' ? OrgManager.getActiveOrganization() : null;

  const [step, setStep] = useState(1);
  const [otherGoal, setOtherGoal] = useState('');

  // Initial State based on User Requirements
  const [form, setForm] = useState({
    organizationName: activeOrg?.name || businessData?.company_name || 'My Business',
    industry: (businessData?.industry as string) || null,
    businessCategory: null as string | null,
    businessType: null as string | null,
    yearStarted: null as number | null,
    headquarters: null as string | null,
    employees: null as number | null,
    branches: null as number | null,
    
    monthlyRevenue: null as number | null,
    monthlyExpenses: null as number | null,
    monthlyProfit: null as number | null,
    marketingBudget: null as number | null,
    
    primaryProduct: null as string | null,
    businessDescription: null as string | null,
    bestSellingProduct: null as string | null,
    productCount: null as number | null,
    averageSellingPrice: null as number | null,
    
    customerCount: null as number | null,
    targetAudience: businessData?.target_audience || null,
    salesRegion: null as string | null,
    acquisitionChannels: [] as string[],
    
    businessGoals: [] as string[],
    businessChallenges: [] as string[],
    challengeDescription: null as string | null,
  });

  const updateField = (k: string, v: any) => {
    setForm(f => ({ ...f, [k]: v === '' ? null : v }));
  };

  const handleToggle = (field: 'acquisitionChannels' | 'businessGoals' | 'businessChallenges', item: string) => {
    setForm(f => {
      const arr = [...f[field]];
      const idx = arr.indexOf(item);
      if (idx > -1) {
        arr.splice(idx, 1);
      } else {
        arr.push(item);
      }
      return { ...f, [field]: arr };
    });
  };

  const handleSkip = () => {
    // Set fields for current step to null
    if (step === 1) {
      setForm(f => ({
        ...f,
        industry: null,
        businessCategory: null,
        businessType: null,
        yearStarted: null,
        headquarters: null,
        employees: null,
        branches: null,
      }));
    } else if (step === 2) {
      setForm(f => ({
        ...f,
        monthlyRevenue: null,
        monthlyExpenses: null,
        monthlyProfit: null,
        marketingBudget: null,
      }));
    } else if (step === 3) {
      setForm(f => ({
        ...f,
        primaryProduct: null,
        businessDescription: null,
        bestSellingProduct: null,
        productCount: null,
        averageSellingPrice: null,
      }));
    } else if (step === 4) {
      setForm(f => ({
        ...f,
        customerCount: null,
        targetAudience: null,
        salesRegion: null,
        acquisitionChannels: [],
      }));
    } else if (step === 5) {
      setForm(f => ({ ...f, businessGoals: [] }));
      setOtherGoal('');
    } else if (step === 6) {
      setForm(f => ({ ...f, businessChallenges: [], challengeDescription: null }));
    }

    if (step < 6) {
      setStep(step + 1);
    } else {
      submitPayload();
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      submitPayload();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const submitPayload = () => {
    // Format goals: append "Other" goal input if filled
    let finalGoals = [...form.businessGoals];
    if (otherGoal.trim() && !finalGoals.includes(otherGoal.trim())) {
      finalGoals.push(otherGoal.trim());
    }

    const finalPayload = {
      ...form,
      businessGoals: finalGoals,
    };

    console.log('[Discovery Wizard Payload Output]:', JSON.stringify(finalPayload, null, 2));

    // Bridge details to feed client boardroom engine cleanly
    const annualRev = finalPayload.monthlyRevenue ? finalPayload.monthlyRevenue * 12 : 1000000;
    const teamSizeText = finalPayload.employees ? `${finalPayload.employees} Employees` : '1–10 (Startup)';
    const combinedDescText = `Business Description: ${finalPayload.businessDescription || 'Not specified'}\nPrimary Product: ${finalPayload.primaryProduct || 'Not specified'}\nChallenges: ${finalPayload.challengeDescription || 'Not specified'}`;

    const bridgedEngineData = {
      company_name: finalPayload.organizationName || 'Aura Wellness',
      industry: finalPayload.industry || 'Technology',
      annual_revenue: annualRev,
      target_audience: finalPayload.targetAudience || 'Target Market',
      primary_goal: finalGoals[0] || 'Increase Revenue & ARR',
      team_size: teamSizeText,
      doc_text: combinedDescText,
    };

    // Save bridged engine data and payload in localStorage for when activeOrg loads
    if (activeOrg) {
      localStorage.setItem(`aegis_business_data_${activeOrg.id}`, JSON.stringify(bridgedEngineData));
      localStorage.setItem(`aegis_wizard_payload_${activeOrg.id}`, JSON.stringify(finalPayload));
      // Redirect to initializing loader screen with org id and name
      router.push(`/initializing?id=${activeOrg.id}&name=${encodeURIComponent(finalPayload.organizationName)}`);
    }
  };

  const progressPercentage = (step / 6) * 100;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 overflow-y-auto max-h-screen custom-scrollbar pb-16">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">5D Framework · Onboarding Wizard</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 mt-1">Business Discovery</h1>
        <p className="text-xs text-neutral-400 mt-1">Configure your organization environment profile. Every field except Name is optional.</p>
      </div>

      {/* Progress Tracker */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-neutral-400">
          <span>STEP {step} OF 6</span>
          <span className="text-orange-500 font-mono">{Math.round(progressPercentage)}% COMPLETE</span>
        </div>
        <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="bg-orange-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Wizard Form Frame */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-7 shadow-sm relative min-h-[380px] flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* STEP 1: BUSINESS PROFILE */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <Building2 size={16} className="text-orange-500" />
                  Business Profile
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Organization Name *</label>
                    <input
                      type="text"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold"
                      value={form.organizationName}
                      onChange={e => updateField('organizationName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Industry Vertical</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.industry || ''}
                      onChange={e => updateField('industry', e.target.value)}
                    >
                      <option value="">Select Industry...</option>
                      {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Business Category</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.businessCategory || ''}
                      onChange={e => updateField('businessCategory', e.target.value)}
                    >
                      <option value="">Select Category...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Business Type</label>
                    <select
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.businessType || ''}
                      onChange={e => updateField('businessType', e.target.value)}
                    >
                      <option value="">Select Type...</option>
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Year Started</label>
                    <input
                      type="number"
                      placeholder="e.g. 2020"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.yearStarted || ''}
                      onChange={e => updateField('yearStarted', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Headquarters Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.headquarters || ''}
                      onChange={e => updateField('headquarters', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Employees</label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.employees || ''}
                      onChange={e => updateField('employees', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: FINANCIAL OVERVIEW */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <Sparkles size={16} className="text-orange-500" />
                  Financial Overview
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Average Monthly Revenue (₹)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-neutral-400 text-xs font-semibold">₹</span>
                      <input
                        type="number"
                        placeholder="e.g. 250000"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                        value={form.monthlyRevenue || ''}
                        onChange={e => updateField('monthlyRevenue', e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Average Monthly Expenses (₹)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-neutral-400 text-xs font-semibold">₹</span>
                      <input
                        type="number"
                        placeholder="e.g. 180000"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                        value={form.monthlyExpenses || ''}
                        onChange={e => updateField('monthlyExpenses', e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Average Monthly Profit (₹)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-neutral-400 text-xs font-semibold">₹</span>
                      <input
                        type="number"
                        placeholder="e.g. 70000"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                        value={form.monthlyProfit || ''}
                        onChange={e => updateField('monthlyProfit', e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Monthly Marketing Budget (₹)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-neutral-400 text-xs font-semibold">₹</span>
                      <input
                        type="number"
                        placeholder="e.g. 15000"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                        value={form.marketingBudget || ''}
                        onChange={e => updateField('marketingBudget', e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PRODUCTS & SERVICES */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <Info size={16} className="text-orange-500" />
                  Products & Services
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Primary Product / Service</label>
                    <input
                      type="text"
                      placeholder="e.g. Workflow SaaS"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.primaryProduct || ''}
                      onChange={e => updateField('primaryProduct', e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Best Selling Product</label>
                    <input
                      type="text"
                      placeholder="e.g. Enterprise License"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.bestSellingProduct || ''}
                      onChange={e => updateField('bestSellingProduct', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Product / Service Count</label>
                    <input
                      type="number"
                      placeholder="e.g. 5"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.productCount || ''}
                      onChange={e => updateField('productCount', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Average Selling Price (₹)</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-neutral-400 text-xs font-semibold">₹</span>
                      <input
                        type="number"
                        placeholder="e.g. 1800"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                        value={form.averageSellingPrice || ''}
                        onChange={e => updateField('averageSellingPrice', e.target.value ? parseFloat(e.target.value) : null)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600">Business Description</label>
                  <textarea
                    placeholder="Brief overview of what your company offers..."
                    rows={3}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                    value={form.businessDescription || ''}
                    onChange={e => updateField('businessDescription', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* STEP 4: CUSTOMERS */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <Building2 size={16} className="text-orange-500" />
                  Customers & Marketing Channels
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-600">Approx. Customer Count</label>
                    <input
                      type="number"
                      placeholder="e.g. 1200"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.customerCount || ''}
                      onChange={e => updateField('customerCount', e.target.value ? parseInt(e.target.value) : null)}
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-neutral-600">Target Audience Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Students and Young Professionals"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                      value={form.targetAudience || ''}
                      onChange={e => updateField('targetAudience', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600">Primary Sales Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Tamil Nadu, India"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                    value={form.salesRegion || ''}
                    onChange={e => updateField('salesRegion', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-600">Acquisition Channels (Select All That Apply)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ACQUISITION_CHANNELS.map(c => {
                      const isSel = form.acquisitionChannels.includes(c);
                      return (
                        <button
                          type="button"
                          key={c}
                          onClick={() => handleToggle('acquisitionChannels', c)}
                          className={`flex items-center justify-between border text-left rounded-xl p-2.5 text-xs transition-all cursor-pointer select-none ${
                            isSel 
                              ? 'bg-orange-50 border-orange-300 text-orange-700 font-semibold' 
                              : 'bg-neutral-50/50 border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          <span>{c}</span>
                          {isSel && <Check size={12} className="text-orange-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: BUSINESS GOALS */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <Zap size={16} className="text-orange-500" />
                  Business Goals
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-600">Growth Milestones (Select All That Apply)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {GOALS.map(g => {
                      const isSel = form.businessGoals.includes(g);
                      return (
                        <button
                          type="button"
                          key={g}
                          onClick={() => handleToggle('businessGoals', g)}
                          className={`flex items-center justify-between border text-left rounded-xl p-2.5 text-xs transition-all cursor-pointer select-none ${
                            isSel 
                              ? 'bg-orange-50 border-orange-300 text-orange-700 font-semibold' 
                              : 'bg-neutral-50/50 border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          <span>{g}</span>
                          {isSel && <Check size={12} className="text-orange-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-neutral-600">Other Goal</label>
                  <input
                    type="text"
                    placeholder="Enter any other custom growth goal..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                    value={otherGoal}
                    onChange={e => setOtherGoal(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* STEP 6: CURRENT CHALLENGES */}
            {step === 6 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-800 flex items-center gap-2 border-b border-neutral-100 pb-2">
                  <Info size={16} className="text-orange-500" />
                  Current Challenges
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-600">Bottlenecks & Frictions (Select All That Apply)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {CHALLENGES.map(c => {
                      const isSel = form.businessChallenges.includes(c);
                      return (
                        <button
                          type="button"
                          key={c}
                          onClick={() => handleToggle('businessChallenges', c)}
                          className={`flex items-center justify-between border text-left rounded-xl p-2.5 text-xs transition-all cursor-pointer select-none ${
                            isSel 
                              ? 'bg-orange-50 border-orange-300 text-orange-700 font-semibold' 
                              : 'bg-neutral-50/50 border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                          }`}
                        >
                          <span>{c}</span>
                          {isSel && <Check size={12} className="text-orange-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-neutral-600">What is your biggest business challenge?</label>
                  <textarea
                    placeholder="Describe your primary strategic bottleneck..."
                    rows={3}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                    value={form.challengeDescription || ''}
                    onChange={e => updateField('challengeDescription', e.target.value)}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Controls Footer */}
        <div className="flex justify-between items-center border-t border-neutral-100 pt-5 mt-8">
          <button
            type="button"
            onClick={handleBack}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-neutral-500 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 transition-all cursor-pointer ${
              step === 1 ? 'opacity-40 pointer-events-none' : ''
            }`}
          >
            <ChevronLeft size={14} />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 text-xs font-bold text-neutral-400 hover:text-neutral-600 rounded-xl hover:bg-neutral-50 transition-all cursor-pointer"
            >
              Skip Section
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isRunning || (step === 1 && !form.organizationName.trim())}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/10 transition-all hover:-translate-y-[1px] active:translate-y-0 disabled:opacity-50 cursor-pointer"
            >
              {step === 6 ? (
                <>
                  <span>Orchestrate OS</span>
                  <Play size={10} className="fill-white" />
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
