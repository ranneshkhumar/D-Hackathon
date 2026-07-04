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
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -left-16 -top-16 h-32 w-32 rounded-full bg-orange-600/5 blur-3xl pointer-events-none" />
            <div className="absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600 border border-orange-100">
                  <Building2 size={16} />
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-1">
                  Create Organization
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div>
                <label htmlFor="org-name" className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
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
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-3 pl-4 pr-10 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500/20 transition-all duration-200"
                    autoFocus
                  />
                  <div className="absolute right-3 top-3.5 text-neutral-400">
                    <Sparkles size={16} />
                  </div>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-red-500 font-medium"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_15px_rgba(234,88,12,0.25)] hover:bg-orange-500 active:scale-98 transition-all"
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
