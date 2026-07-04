'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { OrgManager } from '@/services/org-manager';
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
import ReactMarkdown from 'react-markdown';

function WorkspaceContent() {
  const router = useRouter();
  
  // State management for multi-organizations
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrg, setActiveOrg] = useState<Organization | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const { copilotOpen, setCopilotOpen, copilotMessages, runCopilotPrompt, isRunning } = useAegis();
  const [copilotInput, setCopilotInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

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

  // Switch organizations inside the workspace
  const handleSelectOrg = (id: string) => {
    OrgManager.setActiveOrganization(id);
    refreshState();
  };

  // Triggers the simulated workspace initialization
  const handleCreateOrg = (name: string) => {
    setIsModalOpen(false);
    // Route to initializing sequence with name parameter
    router.push(`/initializing?name=${encodeURIComponent(name)}`);
  };

  // Reset the demo workspace helper (clears localStorage so user can re-test empty state)
  const handleResetWorkspace = () => {
    OrgManager.clearAll();
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
        return <DiscoveryView onSuccessRedirect={() => setActiveView('dashboard')} />;
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
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50 relative">
      <Sidebar
        organizations={organizations}
        activeOrg={activeOrg}
        onSelectOrg={handleSelectOrg}
        onCreateOrgClick={() => setIsModalOpen(true)}
        onResetWorkspace={handleResetWorkspace}
        activeView={activeView}
        onSelectView={setActiveView}
      />
      
      {/* Main View Shell */}
      <div className="flex-1 flex flex-col min-w-0 bg-neutral-50 overflow-hidden relative">
        {renderActiveView()}

        {/* Floating Copilot Activator Badge (aligned to right bottom) */}
        {!copilotOpen && (
          <button
            onClick={() => setCopilotOpen(true)}
            className="absolute bottom-6 right-6 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-full shadow-lg shadow-orange-500/20 transition-all transform active:scale-95 cursor-pointer z-40"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Master Executive Copilot</span>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
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
                    <h3 className="text-xs font-bold text-neutral-800">Master Copilot</h3>
                    <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none mt-1">MAIN EXECUTIVE BRIDGE</p>
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
                          <ReactMarkdown className="markdown-body text-[11.5px]">{msg.text}</ReactMarkdown>
                        )}
                      </div>
                      <span className="text-[9px] text-neutral-300 font-mono mt-1 px-1">
                        {isUser ? 'User' : 'Master Copilot'} · {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
                {isRunning && (
                  <div className="flex gap-2 items-center bg-white border border-neutral-200/60 p-3 rounded-2xl rounded-tl-none shadow-sm w-fit">
                    <Loader2 size={12} className="animate-spin text-orange-500" />
                    <span className="text-[10px] text-neutral-400 font-medium">Orchestrating agent units...</span>
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
                    placeholder={isRunning ? "Orchestrating agents..." : "Ask Master Copilot (e.g. 'Revenue dipped 10%...')..."}
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
  );
}

export default function WorkspacePage() {
  return (
    <AegisProvider>
      <WorkspaceContent />
    </AegisProvider>
  );
}
