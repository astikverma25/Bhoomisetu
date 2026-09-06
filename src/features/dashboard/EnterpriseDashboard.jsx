import React from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { PERSONA_ROLES, PROJECT_TYPES } from '../../data/schema/types.js';
import { SEED_STATES, SEED_DISTRICTS } from '../../data/mock/seedData.js';
import { AnalyticsDashboard } from './AnalyticsDashboard.jsx';
import { GISMapModule } from '../map/GISMapModule.jsx';
import { WorkflowTracker } from '../workflow/WorkflowTracker.jsx';
import { AlertsPanel } from '../alerts/AlertsPanel.jsx';
import { DocumentRepository } from '../documents/DocumentRepository.jsx';
import { ReportsBuilder } from '../reports/ReportsBuilder.jsx';
import { IntegrationHub } from '../integrations/IntegrationHub.jsx';

export const DashboardSidebar = () => {
  const {
    activeTab,
    setActiveTab,
    activeRole,
    handleRoleChange,
    setAppMode,
    isSidebarCollapsed,
    toggleSidebar
  } = useDashboard();
  const { lang, setLang } = useLanguage();

  const navGroups = [
    {
      group: 'Analytics & Spatial',
      items: [
        { id: 'analytics', label: 'Executive Overview', icon: '📊' },
        { id: 'map', label: 'GIS Spatial Cockpit', icon: '🗺️', badge: 'LIVE GPS', badgeClass: 'nav-badge-live' },
        { id: 'workflow', label: 'RFCTLARR Workflow', icon: '📋', badge: '9 Stages' }
      ]
    },
    {
      group: 'Governance & Operations',
      items: [
        { id: 'alerts', label: 'Critical Alerts & SLA', icon: '🔔', badge: '5 High', badgeClass: 'nav-badge-count' },
        { id: 'documents', label: 'Document Repository', icon: '📁' },
        { id: 'reports', label: 'Reports & Export', icon: '📑' },
        { id: 'integrations', label: 'PM GatiShakti Hub', icon: '⚡', badge: 'Active', badgeClass: 'nav-badge-live' }
      ]
    }
  ];

  return (
    <aside className={`dash-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Branding Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand-group">
          <img src="./assets/images/emblems/national-emblem.png" alt="National Emblem" className="sidebar-emblem" />
          <div>
            <div className="sidebar-brand-title">Bhoomi<span>Setu</span></div>
            <span className="sidebar-live-pill">ENTERPRISE</span>
          </div>
        </div>
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label="Toggle Sidebar"
        >
          {isSidebarCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Officer Persona Profile Card */}
      <div className="sidebar-persona-card" title={isSidebarCollapsed ? `${activeRole?.name} (${activeRole?.title})` : ''}>
        <div className="persona-profile-row">
          <div className="persona-avatar-wrap">
            <span>{activeRole?.name ? activeRole.name.charAt(0) : '👤'}</span>
            <span className="avatar-online-dot"></span>
          </div>
          <div className="persona-details">
            <div className="persona-name">{activeRole?.name || 'Officer'}</div>
            <span className="persona-role-label">{activeRole?.title || 'Administrator'}</span>
          </div>
        </div>
        <select
          className="persona-dropdown-select"
          value={activeRole?.id}
          onChange={(e) => handleRoleChange(e.target.value)}
          aria-label="Switch Officer Persona"
        >
          {PERSONA_ROLES.map((role) => (
            <option key={role.id} value={role.id}>
              Switch: {role.name} ({role.state})
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Groups */}
      <div className="sidebar-nav-scroll">
        {navGroups.map((grp, idx) => (
          <div key={idx} className="sidebar-nav-section">
            <div className="nav-section-label">{grp.group}</div>
            {grp.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  title={isSidebarCollapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className={item.badgeClass || 'nav-badge-count'}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer Controls */}
      <div className="sidebar-footer">
        <div className="sidebar-lang-row">
          <span>Lang:</span>
          <div className="sidebar-lang-pills">
            <button
              className={`sidebar-lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              className={`sidebar-lang-btn ${lang === 'hi' ? 'active' : ''}`}
              onClick={() => setLang('hi')}
            >
              हिन्दी
            </button>
          </div>
        </div>

        <button
          className="sidebar-exit-btn"
          onClick={() => setAppMode('landing')}
          title="Return to Public BhoomiSetu Portal"
        >
          <span>←</span>
          <span>Back to Portal</span>
        </button>
      </div>
    </aside>
  );
};

export const DashboardTopNav = () => {
  const {
    activeTab,
    setActiveTab,
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedProjectType,
    setSelectedProjectType,
    searchQuery,
    setSearchQuery,
    resetFilters,
    toggleSidebar,
    isSidebarCollapsed
  } = useDashboard();

  const tabTitles = {
    analytics: { title: 'Acquisition Analytics', icon: '📊' },
    map: { title: 'GIS Spatial Geo-Viewer', icon: '🗺️' },
    workflow: { title: 'Statutory RFCTLARR Workflow', icon: '📋' },
    alerts: { title: 'SLA Breach & Critical Alerts', icon: '🔔' },
    documents: { title: 'Land Records & Documents', icon: '📁' },
    reports: { title: 'Parliamentary & Executive Reports', icon: '📑' },
    integrations: { title: 'PM GatiShakti Multi-Modal Hub', icon: '⚡' }
  };

  const currentTabInfo = tabTitles[activeTab] || { title: 'Dashboard', icon: '📊' };

  const availableDistricts = selectedState === 'all'
    ? SEED_DISTRICTS
    : SEED_DISTRICTS.filter(d => d.stateId === selectedState);

  const hasActiveFilters = selectedState !== 'all' || selectedDistrict !== 'all' || selectedProjectType !== 'all' || searchQuery !== '';

  return (
    <header className="dash-top-navbar">
      <div className="top-nav-left">
        <button
          className="top-hamburger-btn"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar to widen workspace'}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
        <div className="page-title-badge">
          <span>{currentTabInfo.icon}</span>
          <span>{currentTabInfo.title}</span>
        </div>
        <div className="top-node-status">
          <span className="live-pulse-dot"></span>
          <span>NIC Cloud (18ms)</span>
        </div>
      </div>

      <div className="top-nav-filters">
        <div className="top-search-wrap">
          <span className="top-search-icon">🔍</span>
          <input
            type="text"
            className="top-search-input"
            placeholder="Search parcel, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="top-filter-select"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedDistrict('all');
          }}
          aria-label="Filter by State"
        >
          <option value="all">All States</option>
          {SEED_STATES.map((st) => (
            <option key={st.id} value={st.id}>{st.name}</option>
          ))}
        </select>

        <select
          className="top-filter-select"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          aria-label="Filter by District"
        >
          <option value="all">All Districts</option>
          {availableDistricts.map((dist) => (
            <option key={dist.id} value={dist.id}>{dist.name}</option>
          ))}
        </select>

        <select
          className="top-filter-select"
          value={selectedProjectType}
          onChange={(e) => setSelectedProjectType(e.target.value)}
          aria-label="Filter by Sector"
        >
          <option value="all">All Sectors</option>
          {Object.values(PROJECT_TYPES).map((pt) => (
            <option key={pt} value={pt}>{pt}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="btn-text-reset"
            style={{
              background: '#e2e8f0',
              border: 'none',
              padding: '5px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="Clear all filters"
          >
            ✕ Reset
          </button>
        )}

        <button
          className="top-alert-bell-btn"
          onClick={() => setActiveTab('alerts')}
          title="View SLA Alerts"
        >
          <span>🔔</span>
          <span>5 Alerts</span>
        </button>
      </div>
    </header>
  );
};

export const EnterpriseDashboard = () => {
  const { activeTab } = useDashboard();

  return (
    <div className="bhoomisetu-dashboard-root">
      {/* 1. Left Sidebar Navigation */}
      <DashboardSidebar />

      {/* 2. Main Content Viewport */}
      <div className="dash-content-area">
        {/* Top Navbar */}
        <DashboardTopNav />

        {/* Scrollable Viewport */}
        <div className={`dash-view-scrollable ${activeTab === 'map' ? 'map-no-scroll' : ''}`}>
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'map' && <GISMapModule />}
          {activeTab === 'workflow' && <WorkflowTracker />}
          {activeTab === 'alerts' && <AlertsPanel />}
          {activeTab === 'documents' && <DocumentRepository />}
          {activeTab === 'reports' && <ReportsBuilder />}
          {activeTab === 'integrations' && <IntegrationHub />}
        </div>
      </div>
    </div>
  );
};
