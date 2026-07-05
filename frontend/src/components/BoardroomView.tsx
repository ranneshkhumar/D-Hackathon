'use client';

import React, { useState } from 'react';
import { useAegis } from '../context/AegisContext';
import { AGENTS_META, CEO_AGENT_API_KEY, STRATEGY_AGENT_API_KEY, MARKETING_AGENT_API_KEY, SALES_AGENT_API_KEY, FINANCE_AGENT_API_KEY } from '../engine/agents';
import { Activity, Terminal, Shield } from 'lucide-react';

export default function BoardroomView() {
  const { agentOutputs, agentLog, onboarded, businessData } = useAegis();
  const [activeTab, setActiveTab] = useState(0);

  if (!onboarded || !agentOutputs || !businessData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-neutral-400 font-medium">
        <Activity className="animate-spin text-neutral-400" size={24} />
        Loading Boardroom Engine...
      </div>
    );
  }

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

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 overflow-y-auto max-h-screen custom-scrollbar pb-16">
      
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">5D Framework · Design & Deliver Phase</span>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-800 mt-1">Agent Boardroom</h1>
        <p className="text-xs text-neutral-400 mt-1">Simulated 5-agent sequence workspace — {businessData.company_name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        
        {/* Left tabs & viewer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex gap-1.5 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/60 overflow-x-auto w-fit max-w-full">
            {AGENTS_META.map((agent, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap border border-transparent ${
                  activeTab === i
                    ? 'bg-white text-neutral-800 shadow-sm border-neutral-200/50'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                <span>{agent.icon}</span>
                <span>{agent.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div>{renderers[activeTab]()}</div>
        </div>

        {/* Right timeline log */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-neutral-700 tracking-wider uppercase pb-2 border-b border-neutral-100 flex items-center gap-1.5">
              <Terminal size={14} className="text-neutral-400" />
              Execution Timeline
            </h4>
            <div className="timeline space-y-0 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
              {agentLog.map((entry, idx) => {
                const isMaster = entry.agent === '🤖 MASTER COPILOT';
                return (
                  <div key={idx} className="timeline-item py-2 border-b border-neutral-50 last:border-0 flex gap-2">
                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: entry.color }} />
                    <div className="min-w-0">
                      <div className="flex gap-1.5 items-center leading-none mb-1">
                        <span className="text-[9px] font-bold text-neutral-300 font-mono">{entry.time}</span>
                        <span className="text-[10px] font-extrabold uppercase" style={{ color: entry.color }}>
                          {isMaster ? 'MASTER COPILOT' : entry.agent.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-snug break-words">{entry.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
