'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Building2 } from 'lucide-react';

interface CreateOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function CreateOrgModal({ isOpen, onClose, onSubmit }: CreateOrgModalProps) {
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) {
      setError('Organization name is required');
      return;
    }
    setError('');
    onSubmit(orgName.trim());
    setOrgName('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-2xl backdrop-blur-xl"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20">
                  <Building2 size={16} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-1">
                  Create Organization
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="org-name" className="block text-xs font-medium text-neutral-400 uppercase tracking-wider mb-2">
                  Organization Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="org-name"
                    value={orgName}
                    onChange={(e) => {
                      setOrgName(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="e.g. Savorit, Acme Corp, Stripe"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950/50 py-3 pl-4 pr-10 text-sm text-neutral-200 placeholder-neutral-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all duration-200"
                    autoFocus
                  />
                  <div className="absolute right-3 top-3.5 text-neutral-600">
                    <Sparkles size={16} />
                  </div>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-red-400"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-800/60">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:bg-blue-500 active:scale-98 transition-all"
                >
                  Create & Initialize
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
