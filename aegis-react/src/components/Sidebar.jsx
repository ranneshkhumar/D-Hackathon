import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAegis } from '../context/AegisContext';

const NAV_ITEMS = [
  { to: '/', icon: '🏢', label: 'Executive Dashboard', sub: 'Dominate' },
  { to: '/discovery', icon: '🚀', label: 'Discovery & Onboarding', sub: 'Discover' },
  { to: '/boardroom', icon: '🧠', label: 'Agent Boardroom', sub: 'Design & Deliver' },
  { to: '/architecture', icon: '📊', label: 'Architecture & Flows', sub: 'System View' },
];

export default function Sidebar() {
  const { businessData, onboarded } = useAegis();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-title">⚡ Aegis</div>
        <div className="sidebar-logo-sub">AI Business Growth OS</div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-item-icon">{item.icon}</span>
            <div>
              <div style={{ lineHeight: 1.3 }}>{item.label}</div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>{item.sub}</div>
            </div>
          </NavLink>
        ))}

        {onboarded && businessData && (
          <>
            <div className="sidebar-section-label" style={{ marginTop: 16 }}>Active Session</div>
            <div style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border-color)',
              borderRadius: 8,
              padding: '10px 12px',
              margin: '0 0 8px',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                {businessData.company_name}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}>
                {businessData.industry} · {businessData.team_size}
              </div>
              <div style={{ fontSize: 10, color: 'var(--green)', marginTop: 4, fontWeight: 600 }}>
                ● Agents Active
              </div>
            </div>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-badge">
          <strong>Not a CRM.</strong> Not a chatbot.<br />
          An autonomous multi-agent business growth operating system built on the 5D Framework.
        </div>
      </div>
    </aside>
  );
}
