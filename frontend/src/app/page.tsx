'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { OrgManager } from '@/services/org-manager';
import { ApiClient } from '@/services/api-client';
import { Organization } from '@/types';
import Sidebar from '@/components/Sidebar';
import EmptyState from '@/components/EmptyState';
import CreateOrgModal from '@/components/CreateOrgModal';
import { Loader2, MessageSquare, Send, X, Sparkles } from 'lucide-react';
import { AegisProvider, useAegis } from '@/context/AegisContext';
import DashboardView from '@/components/DashboardView';
import DiscoveryView from '@/components/DiscoveryView';
import BoardroomView from '@/components/BoardroomView';
import ArchitectureView from '@/components/ArchitectureView';
import ChatWorkspace from '@/components/ChatWorkspace';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

function WorkspaceContent() {
  const router = useRouter();
  
  // State management for multi-organizations
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const { runOrchestrator, copilotOpen, setCopilotOpen, copilotMessages, runCopilotPrompt, isRunning } = useAegis();
  const [copilotInput, setCopilotInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [gimmickStep, setGimmickStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      setGimmickStep(0);
      interval = setInterval(() => {
        setGimmickStep((prev) => prev + 1);
      }, 2500);
    } else {
      setGimmickStep(0);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Sync state from localStorage on client-side mount
  const refreshState = () => {
    const orgs = OrgManager.getOrganizations();
    const active = OrgManager.getActiveOrganization();
    setOrganizations(orgs);
    setActiveOrg(active);
  };

  useEffect(() => {
    refreshState();
    setIsMounted(true);
  }, []);

  // Auto-scroll to bottom of copilot chat
  useEffect(() => {
    if (copilotOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [copilotMessages, copilotOpen]);

  // Redirect to onboarding if organization is not onboarded
  useEffect(() => {
    if (activeOrg) {
      if (activeOrg.onboarded !== true) {
        router.push(`/onboarding?name=${encodeURIComponent(activeOrg.name)}`);
      } else {
        setActiveView('dashboard');
      }
    }
  }, [activeOrg?.id, activeOrg?.onboarded]);

  // Switch organizations inside the workspace and re-run orchestrator context
  const handleSelectOrg = (id: string) => {
    OrgManager.setActiveOrganization(id);
    refreshState();
    
    if (typeof window !== 'undefined') {
      const savedDataRaw = localStorage.getItem(`aegis_business_data_${id}`);
      if (savedDataRaw) {
        try {
          const data = JSON.parse(savedDataRaw);
          runOrchestrator(data);
          return;
        } catch (e) {
          console.error('Failed to load custom organization data:', e);
        }
      }
    }
    // Fallback to default template context
    const DEFAULT_BUSINESS = {
      company_name: 'Aura Wellness',
      industry: 'Technology',
      annual_revenue: 500000,
      target_audience: 'Mid-market B2B SaaS',
      primary_goal: 'Increase Revenue & ARR',
      team_size: '1–10 (Startup)',
      doc_text: '',
    };
    runOrchestrator(DEFAULT_BUSINESS);
  };

  // Triggers workspace creation by redirecting to onboarding discovery wizard
  const handleCreateOrg = async (name: string) => {
    setIsModalOpen(false);
    
    // 1. Create locally first
    let org = OrgManager.createOrganization(name);
    
    // 2. Try creating on backend database
    try {
      const backendOrgRes = await ApiClient.createOrganization(name);
      if (backendOrgRes && backendOrgRes.organization) {
        const backendOrg = backendOrgRes.organization;
        
        org = {
          id: backendOrg.id,
          name: backendOrg.name,
          createdAt: backendOrg.createdAt,
          onboarded: false
        };
        
        const state = OrgManager.getOrgState();
        state.organizations = state.organizations.filter(o => o.id !== state.activeOrganizationId);
        state.organizations.push(org);
        state.activeOrganizationId = org.id;
        OrgManager.saveOrgState(state);
      }
    } catch (e) {
      console.warn('[Workspace] Failed to sync workspace organization with database, using local fallback:', e);
    }
    
    refreshState();
    router.push(`/onboarding?name=${encodeURIComponent(name)}`);
  };

  // Reset the demo workspace helper (clears localStorage so user can re-test empty state)
  const handleResetWorkspace = () => {
    OrgManager.clearAll();
    refreshState();
  };

  // Handle organization deletion
  const handleDeleteOrg = (id: string) => {
    OrgManager.deleteOrganization(id);
    refreshState();
  };

  const handleSendCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotInput.trim() || isRunning) return;
    runCopilotPrompt(copilotInput);
    setCopilotInput('');
  };

  // Simple loader to prevent hydration flickering on first paint
  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-neutral-400">
        <Loader2 className="animate-spin text-blue-500" size={24} />
      </div>
    );
  }

  // Render Empty State if no organizations exist yet
  if (!activeOrg) {
    return (
      <>
        <EmptyState onCreateClick={() => setIsModalOpen(true)} />
        <CreateOrgModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateOrg}
        />
      </>
    );
  }

  // Choose which operational view to render
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'discovery':
        return <DiscoveryView onSuccessRedirect={() => setActiveView('boardroom')} />;
      case 'boardroom':
        return <BoardroomView />;
      case 'architecture':
        return <ArchitectureView />;
      case 'chat':
        return <ChatWorkspace activeOrg={activeOrg} />;
      default:
        return <DashboardView />;
    }
  };

  // Render Dashboard Workspace once active organization is created/selected
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-50 relative">
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <Sidebar
          organizations={organizations}
          activeOrg={activeOrg}
          onSelectOrg={handleSelectOrg}
          onCreateOrgClick={() => setIsModalOpen(true)}
          onResetWorkspace={handleResetWorkspace}
          activeView={activeView}
          onSelectView={setActiveView}
          onDeleteOrg={handleDeleteOrg}
        />
      
      {/* Main View Shell */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-50 overflow-hidden relative">
        {renderActiveView()}

        {/* Floating Copilot Activator Badge (aligned to right bottom) */}
        {/* Floating Copilot Activator Badge (aligned to right bottom) */}
        {!copilotOpen && (
          <button
            onClick={() => setCopilotOpen(true)}
            className="absolute bottom-6 right-6 flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-full shadow-lg shadow-orange-500/20 transition-all transform active:scale-95 hover:scale-110 cursor-pointer z-40 w-14 h-14"
            title="AI Copilot Chat"
          >
            <Sparkles size={22} className="animate-pulse" />
            <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
          </button>
        )}
      </div>

      {/* Right Anchored Master Executive Copilot Drawer */}
      <AnimatePresence>
        {copilotOpen && (
          <>
            {/* Drawer Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setCopilotOpen(false)}
              className="absolute inset-0 bg-black z-45"
            />

            {/* Slide-out Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute right-0 top-0 bottom-0 w-[380px] bg-white border-l border-neutral-200 z-50 flex flex-col shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                    <Sparkles size={14} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-800">AI Copilot</h3>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none mt-1">AI STRATEGIC ASSISTANT</p>
                  </div>
                </div>
                <button
                  onClick={() => setCopilotOpen(false)}
                  className="p-1.5 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-neutral-50/30">
                {copilotMessages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={i}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-sm leading-relaxed ${
                          isUser
                            ? 'bg-neutral-800 text-white rounded-tr-none'
                            : 'bg-white border border-neutral-200/80 text-neutral-700 rounded-tl-none prose prose-xs'
                        }`}
                      >
                        {isUser ? (
                          <p>{msg.text}</p>
                        ) : (
                          <div className="markdown-body text-[11.5px]">
                            <ReactMarkdown>{msg.text}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-neutral-300 font-mono mt-1 px-1">
                        {isUser ? 'User' : 'AI Copilot'} · {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
                {isRunning && (
                  <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-sm w-full space-y-3 relative overflow-hidden animate-fade-in rounded-tl-none">
                    {/* Glowing progress line */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-cyan-500 via-green-500 to-orange-500 animate-pulse" />
                    
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Loader2 size={12} className="animate-spin text-orange-500" />
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider">Boardroom Debates Active</span>
                      </div>
                      <span className="text-[8px] font-mono text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100 uppercase font-semibold">
                        Step {Math.min(gimmickStep + 1, 6)} of 6
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                      {[
                        { agent: 'CEO Agent', icon: '👔', color: '#3b82f6', text: 'Initiating advisory sweep for this request. Strategy unit, analyze current baseline metrics.' },
                        { agent: 'Strategy Agent', icon: '🧭', color: '#8b5cf6', text: 'Baseline loaded. Reviewing product-market positioning and competitive moats. Marketing, how does this impact our customer acquisition channels?' },
                        { agent: 'Marketing Agent', icon: '📣', color: '#06b6d4', text: 'Auditing campaign spend. Proposing optimization to CPC and shifting weights to B2B outbound loops. Sales, align discovery scripts.' },
                        { agent: 'Sales Agent', icon: '💼', color: '#10b981', text: 'Outbound parameters received. Constructing automated sequence. Finance, model cash flow readiness.' },
                        { agent: 'Finance Agent', icon: '🪙', color: '#f59e0b', text: 'Running projection sweeps. CAC payback remains below 9 months. Risk filters are green. Summarizing mandate for CEO.' },
                        { agent: 'CEO Agent', icon: '👔', color: '#3b82f6', text: 'Perfect alignment. Consolidating boardroom blueprint for executive review...' }
                      ].slice(0, gimmickStep + 1).map((m, idx) => (
                        <div key={idx} className="flex gap-2 items-start text-[11px] leading-relaxed animate-fade-in">
                          <span className="text-sm shrink-0 mt-0.5">{m.icon}</span>
                          <div>
                            <span className="font-semibold" style={{ color: m.color }}>{m.agent}: </span>
                            <span className="text-neutral-600 italic">"{m.text}"</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Field Form */}
              <form onSubmit={handleSendCopilot} className="p-3.5 border-t border-neutral-100 bg-white">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    disabled={isRunning}
                    placeholder={isRunning ? "Generating reply..." : "Ask AI Copilot (e.g. 'Need marketing ideas...')..."}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-neutral-800 outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all disabled:opacity-60"
                    value={copilotInput}
                    onChange={e => setCopilotInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={!copilotInput.trim() || isRunning}
                    className="absolute right-2 p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all disabled:opacity-40 disabled:hover:bg-orange-500 cursor-pointer"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CreateOrgModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrg}
      />
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <AegisProvider>
      <WorkspaceContent />
    </AegisProvider>
  );
}
