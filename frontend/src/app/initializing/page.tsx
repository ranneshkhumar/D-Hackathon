'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OrgManager } from '@/services/org-manager';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Cpu, Loader2 } from 'lucide-react';

const INITIALIZATION_STEPS = [
  'Creating organization workspace...',
  'Preparing business workspace...',
  'Configuring AI environment...',
  'Initializing CEO Intelligence...',
  'Initializing Marketing Intelligence...',
  'Initializing Sales Intelligence...',
  'Initializing Finance Intelligence...',
  'Initializing Operations Intelligence...',
  'Preparing Business Assistant...',
  'Workspace Ready.'
];

function InitializingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgName = searchParams ? (searchParams.get('name') || 'Acme Corp') : 'Acme Corp';

  const [currentStep, setCurrentStep] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Core loop for step-by-step loading bars
  useEffect(() => {
    if (currentStep >= INITIALIZATION_STEPS.length) {
      setShowSuccess(true);
      return;
    }

    let progress = 0;
    // Animate progress bar over 550ms
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        setStepProgress(100);
        clearInterval(interval);

        // Brief delay showing "Completed" checkmark before next step
        const delay = setTimeout(() => {
          setCurrentStep((prev) => prev + 1);
          setStepProgress(0);
        }, 220); // Total step duration: ~770ms. 10 steps = ~7.7s.

        return () => clearTimeout(delay);
      } else {
        setStepProgress(progress);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [currentStep]);

  // Transition to chat workspace after success screen delay
  useEffect(() => {
    if (showSuccess) {
      const redirectTimer = setTimeout(() => {
        // Get org id from searchParams and mark it onboarded
        const orgId = searchParams ? searchParams.get('id') : null;
        if (orgId) {
          OrgManager.setOnboarded(orgId, true);
        }
        // Navigate back to workspace
        router.push('/');
      }, 2300); // Display success screen for just over 2 seconds

      return () => clearTimeout(redirectTimer);
    }
  }, [showSuccess, router, searchParams]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-neutral-50 text-neutral-800 overflow-hidden relative">
      {/* Dynamic ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,88,12,0.03)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {!showSuccess ? (
          /* SECTION A: Sequential Preparation Steps */
          <motion.div
            key="steps-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-xl mx-4 p-8 rounded-2xl border border-neutral-200 bg-white shadow-xl relative z-10"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
              <Cpu className="text-orange-500 animate-pulse shrink-0" size={20} />
              <div>
                <h3 className="text-sm font-bold text-neutral-800">
                  Workspace Initialization
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono font-bold">
                  PREPARING ENVIRONMENT FOR {orgName.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Steps Container */}
            <div className="space-y-4">
              {INITIALIZATION_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 size={14} className="text-orange-500 animate-spin shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-neutral-200 shrink-0" />
                        )}
                        <span
                          className={`transition-colors duration-200 ${
                            isCompleted
                              ? 'text-neutral-400 font-medium'
                              : isCurrent
                              ? 'text-neutral-800 font-bold'
                              : 'text-neutral-300'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-mono text-orange-500 font-bold">
                          {stepProgress}%
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-mono text-green-600 font-bold uppercase tracking-wider">
                          Ready
                        </span>
                      )}
                    </div>

                    {/* Progress Bar (Visible only for active animating step) */}
                    {isCurrent && (
                      <div className="w-full h-1 bg-neutral-100 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stepProgress}%` }}
                          transition={{ duration: 0.05 }}
                          className="h-full bg-orange-500 rounded-full progress-glow"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* SECTION B: Business Profile Ready Success Screen */
          <motion.div
            key="success-panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="w-full max-w-md mx-4 p-8 rounded-2xl border border-neutral-200 bg-white shadow-xl relative z-10 text-center"
          >
            {/* Animated Success Seal */}
            <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600 border border-green-100 shadow-inner">
              <ShieldCheck size={32} />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-neutral-800 mb-6">
              Workspace Created Successfully
            </h2>

            {/* Key Value Strategy Grid */}
            <div className="border-t border-b border-neutral-200 py-4 mb-6 text-xs text-left font-mono space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-400">Organization</span>
                <span className="text-neutral-700 font-bold">{orgName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Status</span>
                <span className="text-green-600 font-bold uppercase tracking-wider">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Assistant</span>
                <span className="text-orange-600 font-bold uppercase tracking-wider">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Architecture</span>
                <span className="text-neutral-600">Version 1 Prototype</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-neutral-400 text-xs">
              <Loader2 size={12} className="animate-spin text-orange-500" />
              <span>Redirecting to your workspace...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function InitializingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-neutral-50 text-neutral-400">
          <Loader2 className="animate-spin text-orange-500" size={24} />
        </div>
      }
    >
      <InitializingContent />
    </Suspense>
  );
}
