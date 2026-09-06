import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { PERSONA_ROLES } from '../../data/schema/types.js';

export const SSOLoginModal = ({ isOpen, onClose, onLogin }) => {
  const { handleRoleChange } = useDashboard ? useDashboard() : { handleRoleChange: () => {} };
  const [selectedRoleId, setSelectedRoleId] = useState(PERSONA_ROLES[0]?.id || 'central_official');
  const [govId, setGovId] = useState('officer.nic@gov.in');
  const [password, setPassword] = useState('••••••••••••');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleRoleChange) handleRoleChange(selectedRoleId);
    if (onLogin) onLogin();
  };

  return (
    <div className="sso-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="sso-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="sso-modal-header">
          <div className="sso-modal-brand">
            <img src="./assets/images/emblems/national-emblem.png" alt="National Emblem" className="sso-modal-emblem" />
            <div>
              <div className="sso-modal-title">Jan Parichay SSO</div>
              <div className="sso-modal-subtitle">BhoomiSetu National Enterprise Cockpit</div>
            </div>
          </div>
          <button className="sso-close-btn" onClick={onClose} aria-label="Close login dialog">✕</button>
        </div>

        <div className="sso-modal-body">
          <div className="sso-notice-box">
            <span>🛡️</span>
            <span>Government Officer Single Sign-On (GOI Parichay Authentication)</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="sso-form-group">
              <label className="sso-label">Select Designated Officer Persona</label>
              <select
                className="sso-select"
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
              >
                {PERSONA_ROLES.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} — {role.title} ({role.state})
                  </option>
                ))}
              </select>
            </div>

            <div className="sso-form-group">
              <label className="sso-label">Gov.in Email / Officer ID</label>
              <input
                type="text"
                className="sso-input"
                value={govId}
                onChange={(e) => setGovId(e.target.value)}
                placeholder="e.g. collector.raigad@nic.in"
              />
            </div>

            <div className="sso-form-group">
              <label className="sso-label">Password / Digital Token</label>
              <input
                type="password"
                className="sso-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="sso-submit-btn">
              <span>🔐</span> Sign In to Enterprise Dashboard
            </button>
          </form>

          <div className="sso-modal-footer-note">
            Authorized NIC / DILRMP Personnel Only • Protected by 256-Bit SSL
          </div>
        </div>
      </div>
    </div>
  );
};

export const Header = ({ onOpenSearch }) => {
  const { content } = useLanguage();
  const { setAppMode, setActiveTab } = useDashboard ? useDashboard() : { setAppMode: () => {}, setActiveTab: () => {} };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onOpenSearch) onOpenSearch(searchInput);
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    if (setAppMode) setAppMode('dashboard');
    if (setActiveTab) setActiveTab('analytics');
  };

  return (
    <>
      <header className="main-header">
        <div className="header-branding">
          <div className="container">
            <div className="brand-wrapper">
              <img src="./assets/images/emblems/national-emblem.png" alt="State Emblem of India" className="national-emblem-img" />
              <div className="brand-divider"></div>
              <div className="brand-text-block">
                <div className="brand-hindi-title">भूमि सेतु <span>पोर्टल</span></div>
                <div className="brand-eng-title">BhoomiSetu <span>National Portal</span></div>
                <div className="brand-subtext">Department of Land Resources • Ministry of Rural Development, Govt. of India</div>
              </div>
            </div>

            <div className="header-auxiliary">
              <img src="./assets/images/banners/g20-logo.png" alt="G20 Bharat" className="g20-logo-img" />
              <img src="./assets/images/banners/cleanindialogo.png" alt="Swachh Bharat Clean India" className="cleanindia-logo-img" />
              <img src="./assets/images/banners/azadi-ka-amrit-mahotsav.svg" alt="Azadi Ka Amrit Mahotsav" className="akam-logo-img" />

              {/* Single Clean Officer Login Button */}
              <button
                type="button"
                className="btn-officer-login"
                onClick={() => setIsLoginModalOpen(true)}
                title="Officer Single Sign-On Login"
              >
                <span className="login-lock-icon">🔐</span>
                <span>Officer Login</span>
                <span className="login-btn-badge">Sign In</span>
              </button>

              <form className="header-search" onSubmit={handleSearchSubmit} role="search">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search Portal..."
                  aria-label="Search Land Services"
                />
                <button type="submit" aria-label="Submit Search">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        <nav className="gov-navbar" aria-label="Main Navigation">
          <div className="container">
            <button
              className="mobile-nav-toggle"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label="Toggle Menu"
            >
              ☰
            </button>
            <div className={`nav-links ${isMobileMenuOpen ? 'show' : ''}`}>
              <a href="#" className="nav-link active">{content.nav.home}</a>
              <a href="#about" className="nav-link">{content.nav.about}</a>
              <a href="#services" className="nav-link">{content.nav.services}</a>
              <a href="#updates" className="nav-link">{content.nav.citizenCorner}</a>
              <a href="#services" className="nav-link">{content.nav.schemes}</a>
              <a href="#updates" className="nav-link">{content.nav.circulars}</a>
              <a href="#gallery" className="nav-link">{content.nav.media}</a>
              <a href="#useful-links" className="nav-link">{content.nav.grievance}</a>
              <a href="#footer" className="nav-link">{content.nav.contact}</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Jan Parichay SSO Authentication Dialog */}
      <SSOLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLoginSuccess}
      />
    </>
  );
};
