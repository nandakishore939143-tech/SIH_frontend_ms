import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Plus, LayoutDashboard, Clock, Lightbulb, ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const NAV_LINKS = [
  { label: 'My Analyses', to: '/analyze',   icon: LayoutDashboard },
  { label: 'History',     to: '/history',   icon: Clock },
  { label: 'Use Cases',   to: '/use-cases', icon: Lightbulb },
];

export default function Sidebar({ onNewAnalysis }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`sq-sidebar ${collapsed ? 'sq-sidebar--collapsed' : ''}`}
      aria-label="Application sidebar"
    >
      <div className="sq-sidebar__inner">
        {/* New Analysis button */}
        <div className="sq-sidebar__top">
          <button
            type="button"
            className="sq-sidebar__new-btn"
            onClick={onNewAnalysis}
            id="sidebar-new-analysis-btn"
            aria-label="Start new analysis"
          >
            <Plus size={15} aria-hidden="true" />
            {!collapsed && <span>New Analysis</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="sq-sidebar__nav" aria-label="Sidebar navigation">
          <ul className="sq-sidebar__nav-list">
            {NAV_LINKS.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/analyze'}
                  className={({ isActive }) =>
                    `sq-sidebar__nav-link ${isActive ? 'sq-sidebar__nav-link--active' : ''}`
                  }
                  aria-label={collapsed ? label : undefined}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={16} aria-hidden="true" className="sq-sidebar__nav-icon" />
                  {!collapsed && <span className="sq-sidebar__nav-label">{label}</span>}
                  {!collapsed && <ChevronRight size={12} className="sq-sidebar__nav-chevron" aria-hidden="true" />}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse toggle */}
        <button
          type="button"
          className="sq-sidebar__collapse-btn"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          id="sidebar-collapse-btn"
        >
          <ChevronRight
            size={14}
            aria-hidden="true"
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}
          />
        </button>

        {/* Bottom tagline */}
        {!collapsed && (
          <div className="sq-sidebar__tagline" aria-hidden="true">
            <span style={{ color: 'var(--green-bright)', letterSpacing: '0.14em' }}>ASK</span>
            <span>↓</span>
            <span>ANALYZE</span>
            <span>↓</span>
            <span>UNDERSTAND</span>
            <span>↓</span>
            <span className="sq-sidebar__tagline-accent">ACT.</span>
          </div>
        )}
      </div>

      {/* Glow effect */}
      <div className="sq-sidebar__glow" aria-hidden="true" />
    </aside>
  );
}
