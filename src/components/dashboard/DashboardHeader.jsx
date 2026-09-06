import React from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { PERSONA_ROLES } from '../../data/schema/types.js';

export const DashboardHeader = () => {
  const {
    appMode,
    setAppMode,
    activeTab,
    setActiveTab,
    activeRole,
    handleRoleChange
  } = useDashboard();
  const { lang, setLang } = useLanguage();

  const navItems = [
    { id: 'analytics', label: 'Overview & Analytics', icon: '📊' },
    { id: 'map', label: 'Interactive GIS Map', icon: '🗺️', highlight: true },
    { id: 'workflow', label: 'Workflow Tracker', icon: '⚡' },
    { id: 'alerts', label: 'SLA & Statutory Alerts', icon: '🚨', badge: '5' },
    { id: 'documents', label: 'Document Repository', icon: '📂' },
    { id: 'reports', label: 'MIS Reports & Export', icon: '📑' },
    { id: 'integrations', label: 'Integration Hub', icon: '🔌' }
  ];

  return (
    <header className="dashboard-enterprise-header">
      {/* Top Utility Strip */}
      <div className="dash-topbar">
        <div className="dash-container topbar-flex">
          <div className="topbar-left-meta">
            <span className="gov-flag-badge">🇮🇳 GOVT OF INDIA</span>
            <span className="divider-sep">•</span>
            <span className="portal-subname">National Land Acquisition & Management Cockpit (DILRMP)</span>
          </div>

          <div className="topbar-right-controls">
            {/* Persona Switcher (PRD Section 4 & 6.8) */}
            <div className="persona-selector-box">
              <span className="persona-label">Persona Role:</span>
              <select
                className="persona-select"
                value={activeRole.id}
                onChange={(e) => handleRoleChange(e.target.value)}
                title="Switch persona role to simulate RBAC views"
              >
                {PERSONA_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Switch */}
            <div className="dash-lang-toggle">
              <button
                className={`dash-lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                className={`dash-lang-btn ${lang === 'hi' ? 'active' : ''}`}
                onClick={() => setLang('hi')}
              >
                हिन्दी
              </button>
            </div>

            {/* Portal Switcher */}
            <button
              className="exit-portal-btn"
              onClick={() => setAppMode('landing')}
              title="Return to Citizen Portal Home"
            >
              ← Public Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Navigation Bar */}
      <div className="dash-main-bar">
        <div className="dash-container main-nav-flex">
          <div className="dash-brand-wrap" onClick={() => { setActiveTab('analytics'); }}>
            <img src="./assets/images/emblems/national-emblem.png" alt="Emblem" className="dash-emblem-img" />
            <div className="dash-brand-info">
              <div className="dash-brand-title">
                BHOOMI<span>SETU</span>
                <span className="dash-badge-live">LIVE SYSTEM</span>
              </div>
              <div className="dash-brand-subtitle">Real-Time Land Acquisition & Resettlement Portal</div>
            </div>
          </div>

          {/* Module Navigation Tabs */}
          <nav className="dash-nav-pills" aria-label="Dashboard Modules">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`dash-nav-pill ${isActive ? 'active' : ''} ${item.highlight ? 'pill-highlight' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <span className="pill-icon">{item.icon}</span>
                  <span className="pill-text">{item.label}</span>
                  {item.badge && (
                    <span className="pill-badge">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
