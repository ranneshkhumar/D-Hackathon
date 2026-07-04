import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAegis } from '../context/AegisContext';

const INDUSTRIES = [
  'Technology', 'Healthcare', 'Retail / E-Commerce', 'Financial Services',
  'Education', 'Manufacturing', 'Real Estate', 'Consulting / Professional Services',
];
const GOALS = [
  'Increase Revenue & ARR', 'Enter New Markets', 'Reduce Customer Churn',
  'Build Brand Authority', 'Launch New Product', 'Raise Funding / Series A',
  'Achieve Profitability', 'Scale Operations',
];
const TEAM_SIZES = [
  '1–10 (Startup)', '11–50 (Early Stage)', '51–200 (Scale-up)',
  '201–500 (Mid-market)', '500+ (Enterprise)',
];

export default function Discovery() {
  const { runOrchestrator, isRunning, businessData } = useAegis();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_name: businessData?.company_name || '',
    industry: businessData?.industry || 'Technology',
    annual_revenue: businessData?.annual_revenue || 500000,
    target_audience: businessData?.target_audience || '',
    primary_goal: businessData?.primary_goal || 'Increase Revenue & ARR',
    team_size: businessData?.team_size || '1–10 (Startup)',
    doc_text: businessData?.doc_text || '',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company_name.trim()) return;
    runOrchestrator({ ...form, annual_revenue: Number(form.annual_revenue) });
    navigate('/');
  };

  return (
    <>
      <div className="page-header">
        <div className="page-eyebrow">5D Framework · Discover Phase</div>
        <div className="page-title">Discovery & Onboarding</div>
        <div className="page-sub">Enter your business context to activate the 5-agent intelligence suite.</div>
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

          {/* Main Form */}
          <form onSubmit={handleSubmit}>
            <div className="card" style={{ marginBottom: 20 }}>
              <div className="section-eyebrow" style={{ marginBottom: 16 }}>Company Profile</div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Aura Wellness"
                    value={form.company_name}
                    onChange={e => update('company_name', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Industry Vertical</label>
                  <select className="form-select" value={form.industry} onChange={e => update('industry', e.target.value)}>
                    {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Annual Revenue (USD)</label>
                  <input
                    className="form-input"
                    type="number"
                    min="10000"
                    max="100000000"
                    step="10000"
                    value={form.annual_revenue}
                    onChange={e => update('annual_revenue', e.target.value)}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
                    ${Number(form.annual_revenue).toLocaleString()}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Team Size</label>
                  <select className="form-select" value={form.team_size} onChange={e => update('team_size', e.target.value)}>
                    {TEAM_SIZES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Mid-market B2B SaaS"
                    value={form.target_audience}
                    onChange={e => update('target_audience', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Growth Goal</label>
                  <select className="form-select" value={form.primary_goal} onChange={e => update('primary_goal', e.target.value)}>
                    {GOALS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div className="section-eyebrow" style={{ marginBottom: 12 }}>Business Intelligence Document</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>
                Paste your pitch deck notes, company overview, challenges, or strategic goals. The agent network will extract signals from this document.
              </div>
              <textarea
                className="form-textarea"
                style={{ minHeight: 200, fontFamily: 'inherit', fontSize: 13 }}
                placeholder="e.g. COMPANY OVERVIEW: We are a B2B SaaS platform...\nCURRENT CHALLENGES: High churn, long sales cycles...\nGOALS: Reach $5M ARR..."
                value={form.doc_text}
                onChange={e => update('doc_text', e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isRunning || !form.company_name}
              style={{ width: '100%', justifyContent: 'center', padding: '14px 20px', fontSize: 15 }}
            >
              {isRunning ? (
                <><div className="spinner" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} /> Running Agent Boardroom...</>
              ) : (
                <> ⚡ Run Agent Boardroom</>
              )}
            </button>
          </form>

          {/* Side Panel */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="section-eyebrow" style={{ marginBottom: 12 }}>What happens next?</div>
              {[
                { icon: '👔', agent: 'CEO Agent', desc: 'Sets strategic mandate & health score' },
                { icon: '🧭', agent: 'Strategy Agent', desc: 'Maps 12-month growth blueprint' },
                { icon: '📣', agent: 'Marketing Agent', desc: 'Generates campaigns & content calendar' },
                { icon: '🎯', agent: 'Sales Agent', desc: 'Builds pipeline & outbound sequences' },
                { icon: '💹', agent: 'Finance Agent', desc: 'Models risk, cash flow & unit economics' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{step.icon}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{step.agent}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card" style={{ background: '#f5f5f7', border: 'none' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, letterSpacing: 1 }}>DISCLAIMER</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Aegis is NOT a CRM.</strong> It does not store customer records, manage contact databases, or track deal pipelines.<br /><br />
                <strong style={{ color: 'var(--text-primary)' }}>Aegis is NOT a chatbot.</strong> It is an autonomous multi-agent business intelligence system powered by the 5D Framework: Discover, Design, Deliver, Develop, Dominate.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
