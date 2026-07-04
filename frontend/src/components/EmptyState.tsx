'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onCreateClick: () => void;
}

export default function EmptyState({ onCreateClick }: EmptyStateProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-neutral-50 text-neutral-800 overflow-hidden relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-orange-600/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg rounded-2xl border border-neutral-200/80 bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl relative z-10"
      >
        {/* Animated Icon Container */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="text-neutral-500"
          >
            <Building2 size={36} />
          </motion.div>
          <div className="absolute -right-2 -top-2 text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-1">
            <Sparkles size={12} />
          </div>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-3">
          AI Business Growth Operating System
        </h2>
        <p className="text-neutral-500 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
          Welcome to the executive workspace. Get started by initializing your organization profile to deploy your dedicated Business Assistant.
        </p>

        {/* Informative Sub-features Grid (Non-functional, V1 Branding) */}
        <div className="grid grid-cols-2 gap-3 mb-8 text-left text-xs text-neutral-500 border-t border-neutral-100 pt-6">
          <div className="p-3 rounded-xl bg-neutral-50/50 border border-neutral-100">
            <span className="font-semibold text-neutral-700 block mb-1">Executive Advisory</span>
            Configures CEO, Marketing, and Operations specialized pipelines.
          </div>
          <div className="p-3 rounded-xl bg-neutral-50/50 border border-neutral-100">
            <span className="font-semibold text-neutral-700 block mb-1">Unified Workspace</span>
            Multi-organization structure built for scalability and team alignment.
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(234,88,12,0.25)] hover:bg-orange-500 transition-all duration-200"
        >
          <Plus size={16} />
          <span>Create Organization</span>
        </motion.button>

        <p className="text-[10px] text-neutral-400 mt-6 uppercase tracking-wider font-mono">
          Architecture: Version 1 Prototype
        </p>
      </motion.div>
    </div>
  );
}
