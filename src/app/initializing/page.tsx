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
  const orgName = searchParams.get('name') || 'Acme Corp';

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
        // Save organization via OrgManager service
        OrgManager.createOrganization(orgName);
        // Navigate back to workspace
        router.push('/');
      }, 2300); // Display success screen for just over 2 seconds

      return () => clearTimeout(redirectTimer);
    }
  }, [showSuccess, orgName, router]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-neutral-950 text-neutral-200 overflow-hidden relative">
      {/* Dynamic ambient backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.07)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {!showSuccess ? (
          /* SECTION A: Sequential Preparation Steps */
          <motion.div
            key="steps-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-xl mx-4 p-8 rounded-2xl border border-neutral-900 bg-neutral-900/40 shadow-2xl backdrop-blur-xl relative z-10"
          >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-950">
              <Cpu className="text-blue-500 animate-pulse shrink-0" size={20} />
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Workspace Initialization
                </h3>
                <p className="text-[10px] text-neutral-500 font-mono">
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
                          <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 size={14} className="text-blue-500 animate-spin shrink-0" />
                        ) : (
                          <div className="h-3.5 w-3.5 rounded-full border border-neutral-800 shrink-0" />
                        )}
                        <span
                          className={`transition-colors duration-200 ${
                            isCompleted
                              ? 'text-neutral-400 font-medium'
                              : isCurrent
                              ? 'text-neutral-100 font-semibold'
                              : 'text-neutral-600'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-mono text-blue-400 font-semibold">
                          {stepProgress}%
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-mono text-green-500 font-medium uppercase tracking-wider">
                          Ready
                        </span>
                      )}
                    </div>

                    {/* Progress Bar (Visible only for active animating step) */}
                    {isCurrent && (
                      <div className="w-full h-1 bg-neutral-950 rounded-full mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${stepProgress}%` }}
                          transition={{ duration: 0.05 }}
                          className="h-full bg-blue-500 rounded-full progress-glow"
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
            className="w-full max-w-md mx-4 p-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-2xl backdrop-blur-xl relative z-10 text-center"
          >
            {/* Animated Success Seal */}
            <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
              <ShieldCheck size={32} />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-neutral-100 mb-6">
              Workspace Created Successfully
            </h2>

            {/* Key Value Strategy Grid */}
            <div className="border-t border-b border-neutral-800/80 py-4 mb-6 text-xs text-left font-mono space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-500">Organization</span>
                <span className="text-neutral-200 font-semibold">{orgName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Status</span>
                <span className="text-green-500 font-semibold uppercase tracking-wider">Ready</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Assistant</span>
                <span className="text-blue-400 font-semibold uppercase tracking-wider">Online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Architecture</span>
                <span className="text-neutral-400">Version 1 Prototype</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs">
              <Loader2 size={12} className="animate-spin text-blue-500" />
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
        <div className="flex h-screen w-screen items-center justify-center bg-neutral-950 text-neutral-400">
          <Loader2 className="animate-spin text-blue-500" size={24} />
        </div>
      }
    >
      <InitializingContent />
    </Suspense>
  );
}
