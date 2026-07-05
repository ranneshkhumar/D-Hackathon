'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAegis } from '../context/AegisContext';
import { Terminal, Play, RotateCcw, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

interface AgentBlock {
  badge: string;
  badgeColor: string;
  textColor: string;
  name: string;
  role: string;
  responsibility: string;
  input: string;
  output: string;
  message: string;
}

export default function BoardroomView() {
  const { agentOutputs, businessData, onboarded, targetRevenue, timeframeDays, startingCapital } = useAegis();
  const [meetingLogs, setMeetingLogs] = useState<AgentBlock[]>([]);
  const [currentRunningIndex, setCurrentRunningIndex] = useState<number>(-1);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const getAgentsChain = (): AgentBlock[] => {
    if (!agentOutputs || !businessData) return [];

    const { strategy, marketing, sales, cs, analytics } = agentOutputs;

    return [
      {
        badge: '🤖 MASTER COPILOT',
        badgeColor: 'bg-neutral-800 text-neutral-200 border-neutral-700',
        textColor: 'text-neutral-400',
        name: 'Master Executive Copilot',
        role: 'Central Strategy Dispatcher',
        responsibility: 'Receives user inputs and sets the Target Revenue Goal framework.',
        input: `Business: ${businessData.company_name} | Goal: $${targetRevenue.toLocaleString()} in ${timeframeDays} Days`,
        output: 'Structured strategic objectives dispatched to agent units.',
        message: `System target initialized: $${targetRevenue.toLocaleString()} revenue over ${timeframeDays} days. Starting capital: $${startingCapital.toLocaleString()}. Dispatching framework parameters to the Boardroom...`,
      },
      {
        badge: '👔 CEO AGENT',
        badgeColor: 'bg-emerald-500 text-white border-emerald-600',
        textColor: 'text-emerald-400',
        name: 'CEO Agent',
        role: 'Chief Executive Officer',
        responsibility: 'Opens meeting, references target goal, and commands action.',
        input: 'User Target Revenue Goal and capital parameters.',
        output: 'Mandate instruction to Strategy and Marketing units.',
        message: `Board meeting convened. Our primary mandate is to hit $${targetRevenue.toLocaleString()} in ${timeframeDays} days. I am ordering the Strategy team to map the exact trajectory, and Marketing to build immediate campaign support. Let's make this happen.`,
      },
      {
        badge: '🧠 STRATEGY AGENT',
        badgeColor: 'bg-blue-500 text-white border-blue-600',
        textColor: 'text-blue-400',
        name: 'Strategy Agent',
        role: 'Chief Strategy Architect',
        responsibility: 'Calculates milestone velocities and designs growth models.',
        input: 'Industry context and target revenue parameters.',
        output: 'Calculated growth pillars and milestone targets.',
        message: `Ingested ${businessData.industry} baseline parameters. Calculated expected velocity: $${(targetRevenue / timeframeDays).toFixed(0)}/day. Focus strategy model: "${strategy.strategy.primary}". Moat is set to: ${strategy.strategy.competitive_moat}.`,
      },
      {
        badge: '📢 MARKETING AGENT',
        badgeColor: 'bg-amber-500 text-white border-amber-600',
        textColor: 'text-amber-400',
        name: 'Marketing Agent',
        role: 'Chief Marketing Officer',
        responsibility: 'Suggests and designs 360 marketing strategies to promote the product.',
        input: 'Strategy growth pillars and milestone goals.',
        output: 'Ad copy captions, email funnels, and channel mixes.',
        message: `Campaign hook created: "${marketing.campaigns.hook}". Hero Ad Copy generated: "${marketing.campaigns.hero_ad}". Content calendar initialized for channels: ${marketing.campaigns.channels.join(', ')}.`,
      },
      {
        badge: '🎯 SALES AGENT',
        badgeColor: 'bg-orange-500 text-white border-orange-600',
        textColor: 'text-orange-400',
        name: 'Sales Agent',
        role: 'Chief Revenue Officer',
        responsibility: 'Builds sales funnel stages and sets outbound sequences.',
        input: 'Marketing channels and target milestones.',
        output: 'Cold outreach templates and objection handlers.',
        message: `Sales script mapped: "${sales.discovery_script.slice(0, 100)}...". Sequence launched. Outbound LinkedIn/Email touch points synchronized. Target ICP qualification score set to ${sales.lead_score}/100.`,
      },
      {
        badge: '💵 FINANCE AGENT',
        badgeColor: 'bg-red-500 text-white border-red-600',
        textColor: 'text-red-400',
        name: 'Finance Agent',
        role: 'Chief Financial Officer',
        responsibility: 'Audits budgets, flags cash-flow risks, and determines feasibility.',
        input: 'Budget capital and sales funnel numbers.',
        output: 'Risk audit signals and target feasibility checks.',
        message: `Starting budget of $${startingCapital.toLocaleString()} audited. Flags active: ${cs.support_tickets.length} tickets. Risk check complete. Dynamic target feasibility rated at: ${cs.client_health}/100. CRM state: "${cs.crm_notes || cs.crm_status}".`,
      },
    ];
  };

  const startMeetingSimulation = () => {
    setMeetingLogs([]);
    setCurrentRunningIndex(0);
  };

  // Auto start simulation on load if onboarded
  useEffect(() => {
    if (onboarded && agentOutputs) {
      startMeetingSimulation();
    }
  }, [onboarded, agentOutputs]);

  // Scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [meetingLogs, currentRunningIndex]);

  // Handle typing sequence delays
  useEffect(() => {
    const chain = getAgentsChain();
    if (currentRunningIndex === -1 || currentRunningIndex >= chain.length) {
      if (currentRunningIndex >= chain.length) {
        setCurrentRunningIndex(-1); // Completed
      }
      return;
    }

    const timer = setTimeout(() => {
      setMeetingLogs(prev => [...prev, chain[currentRunningIndex]]);
      setCurrentRunningIndex(prev => prev + 1);
    }, 1500); // 1.5 seconds typing/streaming delay

    return () => clearTimeout(timer);
  }, [currentRunningIndex]);

  if (!onboarded || !agentOutputs || !businessData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-neutral-400 font-medium">
        <Activity className="animate-spin text-neutral-400" size={24} />
        Loading Boardroom meeting...
      </div>
    );
  }

<<<<<<< HEAD:src/components/BoardroomView.tsx
  const chain = getAgentsChain();
=======
  const { ceo, strategy, marketing, sales, finance } = agentOutputs;

  const renderApiBadge = (keyPlaceholder: string) => (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span>API Connected</span>
      <span className="text-[8px] opacity-60 font-mono">({keyPlaceholder.slice(0, 10)}...)</span>
    </div>
  );

  const renderCEO = () => (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">👔</span>
            <div>
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">CEO Agent</h3>
              <p className="text-[11px] text-neutral-400">Chief Intelligence Officer · Synthesizes board briefing mandates</p>
            </div>
          </div>
          {renderApiBadge(CEO_AGENT_API_KEY)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/60">
            <div className="text-[10px] font-bold text-neutral-400 uppercase">HEALTH SCORE</div>
            <div className="text-2xl font-black text-blue-500 mt-1">{ceo.health_score}<span className="text-xs font-normal text-neutral-400">/100</span></div>
          </div>
          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/60">
            <div className="text-[10px] font-bold text-neutral-400 uppercase">GROWTH SCORE</div>
            <div className="text-2xl font-black text-emerald-500 mt-1">{ceo.growth_score}<span className="text-xs font-normal text-neutral-400">/100</span></div>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">STRATEGIC MANDATE</span>
          <div className="bg-blue-50/50 border border-blue-100 border-l-4 border-l-blue-500 rounded-xl px-4 py-3 text-xs italic text-neutral-700">
            &quot;{ceo.mandate}&quot;
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">EXECUTIVE SUMMARY</span>
          <p className="text-xs leading-relaxed text-neutral-500">{ceo.summary}</p>
        </div>
      </div>
    </div>
  );

  const renderStrategy = () => {
    const s = strategy.strategy;
    return (
      <div className="space-y-5">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">🧭</span>
              <div>
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">Strategy Agent</h3>
                <p className="text-[11px] text-neutral-400">Chief Strategy Architect · Maps growth pillars & SWOT moats</p>
              </div>
            </div>
            {renderApiBadge(STRATEGY_AGENT_API_KEY)}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">PRIMARY STRATEGY</span>
            <div className="text-xs font-bold text-neutral-800 bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 rounded-xl">
              {s.primary}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">GROWTH PILLARS</span>
            <div className="space-y-2">
              {s.pillars.map((p, i) => (
                <div key={i} className="flex gap-2.5 items-center">
                  <span className="w-5 h-5 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-500 shrink-0">{i + 1}</span>
                  <span className="text-xs text-neutral-600 font-medium">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">KPI TARGETS</span>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(s.kpis).map(([k, v]) => (
                <div key={k} className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/60">
                  <div className="text-[9px] font-bold text-neutral-400 uppercase">{k}</div>
                  <div className="text-sm font-black text-violet-500 mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">COMPETITIVE MOAT</span>
            <p className="text-xs text-neutral-500 font-medium">{s.competitive_moat}</p>
          </div>
        </div>

        {/* Projections card */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">Quarterly Projections</h4>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(strategy.growth_projection).map(([q, v]) => (
              <div key={q} className="bg-neutral-50 rounded-xl p-3 text-center border border-neutral-200/60">
                <div className="text-[9px] font-bold text-neutral-400 uppercase">{q}</div>
                <div className="text-sm font-black text-neutral-800 mt-1">${(v/1000).toFixed(0)}K</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMarketing = () => {
    const c = marketing.campaigns;
    return (
      <div className="space-y-5">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center">📣</span>
              <div>
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">Marketing Agent</h3>
                <p className="text-[11px] text-neutral-400">Chief Growth Marketer · Builds marketing & campaign frameworks</p>
              </div>
            </div>
            {renderApiBadge(MARKETING_AGENT_API_KEY)}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">CAMPAIGN HOOK</span>
            <div className="text-xs font-bold text-neutral-700 bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 rounded-xl italic">
              &quot;{c.hook}&quot;
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">HERO AD COPY</span>
            <div className="text-xs leading-relaxed text-neutral-500 bg-neutral-50 border border-neutral-200/80 rounded-xl px-4 py-3 border-l-4 border-l-cyan-400">
              {c.hero_ad}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">EMAIL FUNNEL PREVIEW</span>
            <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-3.5 space-y-2">
              <div className="text-[10px] text-neutral-400 font-bold">SUBJECT: {c.email_subject}</div>
              <pre className="text-[11px] font-mono text-neutral-500 leading-relaxed whitespace-pre-wrap font-sans">
                {c.email_body}
              </pre>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">CHANNEL MIX</span>
            <div className="flex flex-wrap gap-2">
              {c.channels.map((ch, idx) => (
                <span key={idx} className="bg-cyan-50 border border-cyan-100 text-cyan-600 text-[10px] font-bold tracking-wide rounded-full px-3 py-1 uppercase">{ch}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Instagram Post & Influencer Script Creative Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Instagram Social Post Copy mockup */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <span className="text-lg">📸</span>
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Instagram Social Creative Copy</h4>
            </div>
            
            <div className="space-y-2">
              <div className="text-[9px] font-bold text-neutral-400 uppercase">Visual Layout Directions</div>
              <div className="text-xs text-neutral-600 bg-neutral-50 border border-neutral-100 rounded-xl p-3 italic">
                {(c as any).instagram_post?.visualDirections}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[9px] font-bold text-neutral-400 uppercase">Post Caption Copy</div>
              <p className="text-xs leading-relaxed text-neutral-600 bg-neutral-50/50 border border-neutral-100 rounded-xl p-3.5 whitespace-pre-wrap">
                {(c as any).instagram_post?.caption}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {((c as any).instagram_post?.hashtags || []).map((tag: string, idx: number) => (
                <span key={idx} className="text-[10px] font-bold text-cyan-600 font-mono">{tag}</span>
              ))}
            </div>
          </div>

          {/* Influencer Marketing Script Prompter */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <span className="text-lg">🎥</span>
              <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Influencer Marketing Video Script</h4>
            </div>

            <div className="space-y-1">
              <div className="text-[9px] font-bold text-neutral-400 uppercase">Target Creator Profile (Niche & Budget Balanced)</div>
              <div className="text-xs font-bold text-cyan-700 bg-cyan-50/50 border border-cyan-100 rounded-xl p-2.5">
                {(c as any).influencer_script?.targetingProfile}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="border border-neutral-100 rounded-xl overflow-hidden divide-y divide-neutral-100 text-xs">
                <div className="p-3 bg-neutral-50/50 flex gap-2">
                  <span className="font-bold text-neutral-400 w-[60px] shrink-0 uppercase text-[9px] pt-0.5">0-3s Hook</span>
                  <span className="text-neutral-700 font-semibold italic">&quot;{(c as any).influencer_script?.hook}&quot;</span>
                </div>
                <div className="p-3 flex gap-2">
                  <span className="font-bold text-neutral-400 w-[60px] shrink-0 uppercase text-[9px] pt-0.5">Dialogue</span>
                  <p className="text-neutral-600 leading-relaxed">{(c as any).influencer_script?.scriptBody}</p>
                </div>
                <div className="p-3 bg-neutral-50/50 flex gap-2">
                  <span className="font-bold text-neutral-400 w-[60px] shrink-0 uppercase text-[9px] pt-0.5">CTA Video</span>
                  <span className="text-cyan-600 font-bold">{(c as any).influencer_script?.cta}</span>
                </div>
                <div className="p-3 flex gap-2">
                  <span className="font-bold text-neutral-400 w-[60px] shrink-0 uppercase text-[9px] pt-0.5">Visuals</span>
                  <span className="text-neutral-500 font-medium italic">{(c as any).influencer_script?.visualNotes}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content calendar table */}
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-neutral-700 tracking-wide uppercase">4-Week Content Calendar</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="font-bold text-neutral-400 uppercase pb-2 w-[70px]">Week</th>
                  <th className="font-bold text-neutral-400 uppercase pb-2">Content Target</th>
                  <th className="font-bold text-neutral-400 uppercase pb-2">Primary Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {marketing.content_calendar.map((w, i) => (
                  <tr key={i} className="hover:bg-neutral-50/50">
                    <td className="py-2.5"><span className="bg-neutral-100 border border-neutral-200/60 text-neutral-500 text-[9px] font-bold rounded-lg px-2 py-0.5">{w.week}</span></td>
                    <td className="py-2.5 font-semibold text-neutral-700">{w.content}</td>
                    <td className="py-2.5 text-neutral-400">{w.channel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderSales = () => (
    <div className="space-y-5">
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">🎯</span>
            <div>
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">Sales Agent</h3>
              <p className="text-[11px] text-neutral-400">Chief Revenue Officer · Configures lead scoring & discovery frameworks</p>
            </div>
          </div>
          {renderApiBadge(SALES_AGENT_API_KEY)}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/60">
            <div className="text-[10px] font-bold text-neutral-400 uppercase">ICP LEAD SCORE</div>
            <div className="text-2xl font-black text-emerald-500 mt-1">{sales.lead_score}<span className="text-xs font-normal text-neutral-400">/100</span></div>
          </div>
          <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/60">
            <div className="text-[10px] font-bold text-neutral-400 uppercase">REVENUE OPPORTUNITY</div>
            <div className="text-2xl font-black text-emerald-500 mt-1">₹{sales.revenue_opportunity.toLocaleString()}</div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">PIPELINE CONVERSIONS</span>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-100">
                  <th className="font-bold text-neutral-400 uppercase pb-2">Stage</th>
                  <th className="font-bold text-neutral-400 uppercase pb-2">Conversion</th>
                  <th className="font-bold text-neutral-400 uppercase pb-2">Avg Time</th>
                  <th className="font-bold text-neutral-400 uppercase pb-2">Execution Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {sales.pipeline.map((p, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50">
                    <td className="py-2.5 font-bold text-neutral-700">{p.stage}</td>
                    <td className="py-2.5"><span className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold rounded-lg px-2 py-0.5">{p.conversion}</span></td>
                    <td className="py-2.5 text-neutral-500 font-semibold">{p.avg_days}d</td>
                    <td className="py-2.5 text-neutral-400">{p.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">OUTBOUND TOUCH SEQUENCE</span>
          <div className="space-y-2">
            {sales.outbound_sequence.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-center border border-neutral-100 p-2.5 rounded-xl hover:bg-neutral-50/30">
                <span className="bg-blue-50 border border-blue-100 text-blue-500 text-[9px] font-bold tracking-wider rounded-lg px-2 py-1 shrink-0 uppercase">{item.day}</span>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-neutral-700 truncate">{item.touch}</div>
                  <div className="text-[10px] text-neutral-400">Goal: {item.goal}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">DISCOVERY CALL SCRIPT</span>
          <pre className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-3.5 text-[11px] leading-relaxed text-neutral-500 whitespace-pre-wrap font-sans">
            {sales.discovery_script}
          </pre>
        </div>
      </div>
    </div>
  );

  const renderFinance = () => {
    const colors = { red: 'bg-red-500 text-red-700 border-red-100 bg-red-50/50', amber: 'bg-amber-500 text-amber-700 border-amber-100 bg-amber-50/50', green: 'bg-emerald-500 text-emerald-700 border-emerald-100 bg-emerald-50/50' };
    const textColors = { red: 'bg-red-500', amber: 'bg-amber-500', green: 'bg-emerald-500' };
    return (
      <div className="space-y-5">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 pb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">💹</span>
              <div>
                <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">Finance Agent</h3>
                <p className="text-[11px] text-neutral-400">Chief Financial Intelligence Officer · Audits risks, cash burn, margin health</p>
              </div>
            </div>
            {renderApiBadge(FINANCE_AGENT_API_KEY)}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/60">
              <div className="text-[10px] font-bold text-neutral-400 uppercase">CUSTOMER FINANCIAL HEALTH</div>
              <div className="text-2xl font-black text-amber-500 mt-1">{finance.customer_health}<span className="text-xs font-normal text-neutral-400">/100</span></div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/60">
              <div className="text-[10px] font-bold text-neutral-400 uppercase">MARKET READINESS</div>
              <div className="text-2xl font-black text-emerald-500 mt-1">{finance.market_readiness}<span className="text-xs font-normal text-neutral-400">/100</span></div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">RISK AUDIT SIGNALS</span>
            {finance.risk_alerts.map((alert, idx) => (
              <div key={idx} className={`flex gap-3 items-start border rounded-xl p-3.5 ${alert.level === 'red' ? colors.red : alert.level === 'amber' ? colors.amber : colors.green}`}>
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${textColors[alert.level]}`} />
                <div>
                  <h5 className="text-[12px] font-bold text-neutral-800">{alert.title}</h5>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">UNIT ECONOMICS BOARD</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(finance.unit_economics).map(([k, v]) => (
                <div key={k} className="bg-neutral-50 rounded-xl p-3 border border-neutral-200/60">
                  <div className="text-[9px] font-bold text-neutral-400 uppercase">{k}</div>
                  <div className="text-sm font-black text-neutral-700 mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderers = [renderCEO, renderStrategy, renderMarketing, renderSales, renderFinance];
>>>>>>> Rann:frontend/src/components/BoardroomView.tsx

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto max-h-screen custom-scrollbar pb-16">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">5D Framework · Boardroom Phase</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 mt-1">Agent Boardroom (Live Meeting)</h1>
          <p className="text-xs text-neutral-400 mt-1">Live sequence matching goal trajectory checks for {businessData.company_name}.</p>
        </div>
        <button
          onClick={startMeetingSimulation}
          className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all cursor-pointer shrink-0 shadow-sm"
        >
          <RotateCcw size={13} />
          <span>Restart Meeting</span>
        </button>
      </div>

      {/* Terminal Slate Log */}
      <div className="bg-[#0f172a] border border-neutral-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[400px]">
        {/* Terminal Header */}
        <div className="flex justify-between items-center bg-[#1e293b] px-4 py-2.5 border-b border-neutral-800">
          <div className="flex items-center gap-1.5">
            <Terminal size={14} className="text-neutral-400" />
            <span className="font-mono text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Aegis OS Boardroom Terminal Log</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Terminal Output Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 font-mono text-xs custom-scrollbar">
          {meetingLogs.map((log, idx) => (
            <div key={idx} className="space-y-2 border-b border-neutral-800/40 pb-4 last:border-0 last:pb-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${log.badgeColor}`}>
                  {log.badge}
                </span>
                <span className="text-[10px] text-neutral-500">[{log.role}]</span>
              </div>

              {/* Explicit Agent Metrics State Box */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#1e293b]/40 border border-neutral-800/80 rounded-lg p-2.5 text-[10px] text-neutral-400">
                <div>
                  <span className="font-semibold block text-neutral-500">ROLE:</span>
                  <span className="truncate block font-bold text-neutral-300">{log.role}</span>
                </div>
                <div>
                  <span className="font-semibold block text-neutral-500">RESPONSIBILITY:</span>
                  <span className="truncate block text-neutral-300">{log.responsibility}</span>
                </div>
                <div>
                  <span className="font-semibold block text-neutral-500">INPUT STATE:</span>
                  <span className="truncate block text-neutral-300 font-sans">{log.input}</span>
                </div>
                <div>
                  <span className="font-semibold block text-neutral-500">OUTPUT STATE:</span>
                  <span className="truncate block text-neutral-300 font-sans">{log.output}</span>
                </div>
              </div>

              {/* Agent body log */}
              <p className={`leading-relaxed pl-1 whitespace-pre-wrap ${log.textColor}`}>
                &gt; {log.message}
              </p>
            </div>
          ))}

          {/* Active Typing Loader */}
          {currentRunningIndex !== -1 && currentRunningIndex < chain.length && (
            <div className="flex items-center gap-2 text-neutral-500">
              <Cpu size={12} className="animate-spin text-orange-500" />
              <span>[{chain[currentRunningIndex].badge.split(' ')[0]}] preparing outputs...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Agents Breakdown Grid cards */}
      <div className="space-y-4">
        <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Boardroom AI Agent Specifications</span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {chain.slice(1).map((agent, i) => (
            <div key={i} className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                <span className="text-xs font-bold text-neutral-700 tracking-wide uppercase">{agent.name}</span>
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${agent.badgeColor}`}>
                  Active
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase block">Role</span>
                  <span className="text-neutral-700 font-semibold">{agent.role}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-neutral-400 uppercase block">Responsibility</span>
                  <p className="text-neutral-500 leading-snug">{agent.responsibility}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
