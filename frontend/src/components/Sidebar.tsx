'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Organization } from '@/types';
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  MessageSquare, 
  Settings, 
  Sparkles, 
  RotateCcw,
  Check,
  Briefcase,
  Layers,
  LayoutDashboard,
  Rocket,
  Brain,
  Network,
  Lock,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  organizations: Organization[];
  activeOrg: Organization | null;
  onSelectOrg: (id: string) => void;
  onCreateOrgClick: () => void;
  onResetWorkspace: () => void;
  activeView: string;
  onSelectView: (view: string) => void;
  onDeleteOrg: (id: string) => void;
}

export default function Sidebar({ 
  organizations, 
  activeOrg, 
  onSelectOrg, 
  onCreateOrgClick,
  onResetWorkspace,
  activeView,
  onSelectView,
  onDeleteOrg
}: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Aegis Navigation Items
  const navItems = [
<<<<<<< HEAD:src/components/Sidebar.tsx
    { id: 'discovery', icon: <Rocket size={14} />, label: '🚀 Onboarding & Interview', phase: 'Discover' },
    { id: 'boardroom', icon: <Brain size={14} />, label: '🧠 Agent Boardroom (Live Meeting)', phase: 'Live' },
    { id: 'dashboard', icon: <LayoutDashboard size={14} />, label: '🏢 Executive Goal Tracker', phase: 'Tracker' },
=======
    { id: 'dashboard', icon: <LayoutDashboard size={14} />, label: 'Executive Dashboard', phase: 'Dominate' },
    { id: 'boardroom', icon: <Brain size={14} />, label: 'Agent Boardroom', phase: 'Design & Deliver' },
    { id: 'architecture', icon: <Network size={14} />, label: 'Architecture & Flows', phase: 'System' },
    { id: 'chat', icon: <MessageSquare size={14} />, label: 'AI Copilot Chat', phase: 'Chat' },
>>>>>>> Rann:frontend/src/components/Sidebar.tsx
  ];

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="w-64 h-screen flex flex-col bg-white border-r border-neutral-200 relative z-30 select-none shrink-0">
      {/* Top Organization Switcher */}
      <div className="p-4 border-b border-neutral-200 relative z-40" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50 transition-all text-left group shadow-sm cursor-pointer"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
              <Building2 size={14} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider leading-none mb-1">
                Workspace Organization
              </p>
              <h4 className="text-xs font-bold text-neutral-700 truncate leading-none">
                {activeOrg ? activeOrg.name : 'Select Workspace'}
              </h4>
            </div>
          </div>
          <ChevronDown size={14} className="text-neutral-400 group-hover:text-neutral-600 transition-transform" />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute left-4 right-4 mt-2 p-1.5 rounded-2xl bg-white border border-neutral-200 shadow-xl z-50 overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1.5 border-b border-neutral-100">
                  Switch Workspace
                </p>
                {organizations.map((org) => (
                  <div
                    key={org.id}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeOrg?.id === org.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-100/50'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                    }`}
                    onClick={() => {
                      onSelectOrg(org.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className="truncate pr-2">{org.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      {activeOrg?.id === org.id && <Check size={12} />}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete organization "${org.name}"?`)) {
                            onDeleteOrg(org.id);
                          }
                        }}
                        className="p-1 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Org Button inside Dropdown */}
              <div className="mt-1.5 pt-1.5 border-t border-neutral-100">
                <button
                  onClick={() => {
                    onCreateOrgClick();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Create Organization</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Middle Operations Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        <div>
          <div className="px-2 mb-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Aegis Operations
            </span>
          </div>

            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                  activeView === item.id
                    ? 'bg-neutral-100 text-neutral-800 shadow-sm border border-neutral-200/50'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={activeView === item.id ? 'text-blue-500' : 'text-neutral-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                <span className="text-[8px] font-extrabold tracking-wider uppercase text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-lg border border-neutral-200/40">
                  {item.phase}
                </span>
              </button>
            ))}
        </div>

        {/* Future Integration Architecture */}
        <div className="px-2 pt-2 border-t border-neutral-200/80">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
            Boardroom Hubs
          </span>
          <div className="space-y-1.5">
            {[
              { name: 'CEO Hub', color: 'text-blue-500 bg-blue-50/50 border-blue-100' },
              { name: 'Strategy Hub', color: 'text-violet-500 bg-violet-50/50 border-violet-100' },
              { name: 'Marketing Hub', color: 'text-cyan-500 bg-cyan-50/50 border-cyan-100' },
              { name: 'Sales Hub', color: 'text-emerald-500 bg-emerald-50/50 border-emerald-100' },
              { name: 'Finance Hub', color: 'text-orange-500 bg-orange-50/50 border-orange-100' },
            ].map((hub) => (
              <div
                key={hub.name}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-[10px] font-semibold text-neutral-600 shadow-sm ${hub.color}`}
              >
                <div className="flex items-center gap-1.5">
                  <Briefcase size={10} className="opacity-75" />
                  <span>{hub.name}</span>
                </div>
                <span className="text-[8px] font-mono opacity-75 uppercase leading-none">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50 relative" ref={settingsRef}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm">
              <Sparkles size={11} className="text-blue-500 animate-pulse" />
            </div>
            <div className="leading-none">
              <span className="text-xs font-bold text-neutral-700 block">
                Aegis OS
              </span>
              <span className="text-[9px] text-neutral-400 block mt-0.5 font-mono">
                v1.2.0 (React)
              </span>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-neutral-600 hover:border-neutral-300 transition-colors shadow-sm cursor-pointer ${
              settingsOpen ? 'text-neutral-600 border-neutral-300' : ''
            }`}
          >
            <Settings size={14} />
          </button>
        </div>

        {/* Settings Dropup Menu */}
        <AnimatePresence>
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-16 left-4 right-4 p-2 rounded-2xl bg-white border border-neutral-200 shadow-xl z-50 space-y-1"
            >
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
                Admin Panel
              </p>
              <div className="text-[10px] text-neutral-400 px-2 pb-2 leading-relaxed border-b border-neutral-100">
                Connected to Gemini via local env key context. No cloud databases.
              </div>
              <button
                onClick={() => {
                  onResetWorkspace();
                  setSettingsOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Reset Demo (Clear Org)</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
