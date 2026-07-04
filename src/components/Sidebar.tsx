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

  // Dummy chats list
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
    <aside className="w-64 h-screen flex flex-col bg-neutral-50 border-r border-neutral-200 relative z-30 select-none shrink-0">
      {/* Top Organization Switcher */}
      <div className="p-4 border-b border-neutral-200 relative z-40" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50 transition-all text-left group shadow-sm"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600 border border-orange-100 shrink-0">
              <Building2 size={14} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider leading-none mb-1">
                Workspace
              </p>
              <h4 className="text-sm font-semibold text-neutral-700 truncate leading-none">
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
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1.5 border-b border-neutral-100">
                  Switch Workspace
                </p>
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      onSelectOrg(org.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                      activeOrg?.id === org.id
                        ? 'bg-orange-50 text-orange-600 border border-orange-100/50'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                    }`}
                  >
                    <span className="truncate pr-2">{org.name}</span>
                    {activeOrg?.id === org.id && <Check size={12} />}
                  </button>
                ))}
              </div>

              {/* Add New Org Button inside Dropdown */}
              <div className="mt-1.5 pt-1.5 border-t border-neutral-100">
                <button
                  onClick={() => {
                    onCreateOrgClick();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
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
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Previous Blueprints
            </span>
            <span className="text-[9px] text-neutral-400 font-mono">Mock</span>
          </div>

          <div className="space-y-0.5">
            {dummyChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveDummyId(chat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  activeDummyId === chat.id
                    ? 'bg-white text-neutral-800 border-l-2 border-orange-500 shadow-sm'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800'
                }`}
              >
                <MessageSquare size={13} className={activeDummyId === chat.id ? 'text-orange-500' : 'text-neutral-400'} />
                <span className="truncate">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Future Integration Architecture */}
        <div className="px-2 pt-2 border-t border-neutral-200">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
            Workspace Intelligence
          </span>
          <div className="space-y-1.5">
            {['CEO Hub', 'Marketing Hub', 'Sales Hub', 'Finance Hub', 'Operations Hub'].map((hub) => (
              <div
                key={hub}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-[10px] text-neutral-600 shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <Briefcase size={10} className="text-neutral-400" />
                  <span>{hub}</span>
                </div>
                <span className="text-[9px] font-mono text-neutral-400 bg-neutral-50 px-1 py-0.5 rounded uppercase leading-none border border-neutral-100">
                  Simulated
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
              <Sparkles size={11} className="text-orange-500" />
            </div>
            <div className="leading-none">
              <span className="text-xs font-bold text-neutral-700 block">
                Business OS
              </span>
              <span className="text-[9px] text-neutral-400 block mt-0.5 font-mono">
                v1.0.0 (Beta)
              </span>
            </div>
          </div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className={`p-2 rounded-xl border border-neutral-200 bg-white text-neutral-400 hover:text-neutral-600 hover:border-neutral-300 transition-colors shadow-sm ${
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
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
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
                className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
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
