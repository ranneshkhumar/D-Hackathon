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
  Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  organizations: Organization[];
  activeOrg: Organization | null;
  onSelectOrg: (id: string) => void;
  onCreateOrgClick: () => void;
  onResetWorkspace: () => void;
}

export default function Sidebar({ 
  organizations, 
  activeOrg, 
  onSelectOrg, 
  onCreateOrgClick,
  onResetWorkspace
}: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Dummy chats list as requested
  const dummyChats = [
    { id: 'c1', title: 'Q3 Growth Blueprint' },
    { id: 'c2', title: 'Marketing Funnel Optimization' },
    { id: 'c3', title: 'Competitor Revenue Audit' },
    { id: 'c4', title: 'Operational Automation Plan' },
    { id: 'c5', title: 'Pricing & Unit Economics Model' }
  ];

  const [activeDummyId, setActiveDummyId] = useState('c1');

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
    <aside className="w-64 h-screen flex flex-col bg-neutral-950 border-r border-neutral-900 relative z-30 select-none shrink-0">
      {/* Ambient glass blur */}
      <div className="absolute inset-0 bg-neutral-900/10 backdrop-blur-md pointer-events-none" />

      {/* Top Organization Switcher */}
      <div className="p-4 border-b border-neutral-900 relative z-40" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between gap-2 p-2 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700/80 hover:bg-neutral-900 transition-all text-left group"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-600/20 transition-all shrink-0">
              <Building2 size={14} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider leading-none mb-1">
                Workspace
              </p>
              <h4 className="text-sm font-medium text-neutral-200 truncate leading-none">
                {activeOrg ? activeOrg.name : 'Select Workspace'}
              </h4>
            </div>
          </div>
          <ChevronDown size={14} className={`text-neutral-500 group-hover:text-neutral-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="absolute left-4 right-4 mt-2 p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
            >
              <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-0.5">
                <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider px-2 py-1.5 border-b border-neutral-800/40">
                  Switch Workspace
                </p>
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      onSelectOrg(org.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-medium transition-colors ${
                      activeOrg?.id === org.id
                        ? 'bg-blue-600/10 text-blue-400 border border-blue-500/10'
                        : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                    }`}
                  >
                    <span className="truncate pr-2">{org.name}</span>
                    {activeOrg?.id === org.id && <Check size={12} />}
                  </button>
                ))}
              </div>

              {/* Add New Org Button inside Dropdown */}
              <div className="mt-1.5 pt-1.5 border-t border-neutral-800/60">
                <button
                  onClick={() => {
                    onCreateOrgClick();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-blue-400 hover:bg-neutral-800/60 transition-colors"
                >
                  <Plus size={12} />
                  <span>Create Organization</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Middle Previous Chats (Dummy Items) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Previous Blueprints
            </span>
            <span className="text-[9px] text-neutral-600 font-mono">Mock</span>
          </div>

          <div className="space-y-0.5">
            {dummyChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveDummyId(chat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-all ${
                  activeDummyId === chat.id
                    ? 'bg-neutral-900 text-neutral-100 border-l-2 border-blue-500'
                    : 'text-neutral-400 hover:bg-neutral-900/40 hover:text-neutral-200'
                }`}
              >
                <MessageSquare size={13} className={activeDummyId === chat.id ? 'text-blue-400' : 'text-neutral-500'} />
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Future Integration Architecture (Informational V1 Display) */}
        <div className="px-2 pt-2 border-t border-neutral-900/60">
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-2">
            Workspace Intelligence
          </span>
          <div className="space-y-1.5">
            {['CEO Hub', 'Marketing Hub', 'Sales Hub', 'Finance Hub', 'Operations Hub'].map((hub) => (
              <div
                key={hub}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-900 text-[10px] text-neutral-500"
              >
                <div className="flex items-center gap-1.5">
                  <Briefcase size={10} className="text-neutral-600" />
                  <span>{hub}</span>
                </div>
                <span className="text-[9px] font-mono text-neutral-600 bg-neutral-900 px-1 py-0.5 rounded uppercase leading-none">
                  Simulated
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Panel (Settings / Config) */}
      <div className="p-4 border-t border-neutral-900 bg-neutral-950/40 relative" ref={settingsRef}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Sparkles size={11} className="text-blue-400" />
            </div>
            <div className="leading-none">
              <span className="text-xs font-semibold text-neutral-300 block">
                Business OS
              </span>
              <span className="text-[9px] text-neutral-500 block mt-0.5 font-mono">
                v1.0.0 (Beta)
              </span>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`p-2 rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700 transition-colors ${
              settingsOpen ? 'text-neutral-200 border-neutral-700 bg-neutral-900' : ''
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
              className="absolute bottom-16 left-4 right-4 p-2 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl backdrop-blur-xl z-50 space-y-1"
            >
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-2 py-1">
                Admin Panel
              </p>
              <div className="text-[10px] text-neutral-500 px-2 pb-2 leading-relaxed border-b border-neutral-800/60">
                Connected to Gemini via local env key context. No cloud databases.
              </div>
              <button
                onClick={() => {
                  onResetWorkspace();
                  setSettingsOpen(false);
                }}
                className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
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
