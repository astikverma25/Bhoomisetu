import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { AccessibilityProvider } from './context/AccessibilityContext.jsx';
import { DashboardProvider, useDashboard } from './context/DashboardContext.jsx';
import { Topbar } from './components/layout/Topbar.jsx';
import { Header } from './components/layout/Header.jsx';
import { HeroCarousel } from './components/hero/HeroCarousel.jsx';
import { InitiativeRibbon } from './components/initiative/InitiativeRibbon.jsx';
import { AboutSection } from './components/about/AboutSection.jsx';
import { ServicesGrid } from './components/services/ServicesGrid.jsx';
import { MediaGallery } from './components/gallery/MediaGallery.jsx';
import { UpdatesSection } from './components/updates/UpdatesSection.jsx';
import { UsefulLinks } from './components/useful-links/UsefulLinks.jsx';
import { PartnersMarquee } from './components/partners/PartnersMarquee.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { SearchModal } from './components/common/SearchModal.jsx';
import { EnterpriseDashboard } from './features/dashboard/EnterpriseDashboard.jsx';

const MainAppContent = () => {
  const { appMode, setAppMode, setActiveTab } = useDashboard();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');

  const handleOpenSearch = (query = '') => {
    setSearchInitialQuery(query);
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  if (appMode === 'dashboard') {
    return (
      <div className="bhoomisetu-app-wrapper">
        <EnterpriseDashboard />
      </div>
    );
  }

  return (
    <div className="bhoomisetu-app-wrapper">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      <Topbar />
      <Header onOpenSearch={handleOpenSearch} />

      {/* Floating Spotlight Action Banner to Launch Dashboard */}
      <div style={{
        background: 'linear-gradient(90deg, #002147 0%, #0b3b60 60%, #1e3a8a 100%)',
        borderBottom: '2px solid #FF9933',
        padding: '10px 0',
        color: '#fff'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ background: '#FF9933', color: '#000', padding: '3px 8px', borderRadius: '99px', fontWeight: '800', fontSize: '0.72rem' }}>
              NATIONAL SYSTEM
            </span>
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>
              Real-Time National Land Acquisition & Management System (BhoomiSetu Cockpit)
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => { setAppMode('dashboard'); setActiveTab('analytics'); }}
              style={{
                background: '#FF9933',
                color: '#002147',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: '800',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📊 Open Acquisition Dashboard ›
            </button>
            <button
              onClick={() => { setAppMode('dashboard'); setActiveTab('map'); }}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.4)',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              🗺️ Interactive GIS Map
            </button>
          </div>
        </div>
      </div>

      <main id="main-content">
        <HeroCarousel />
        <InitiativeRibbon />
        <AboutSection />
        <ServicesGrid />
        <MediaGallery />
        <UpdatesSection />
        <UsefulLinks />
        <PartnersMarquee />
      </main>

      <Footer />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={handleCloseSearch}
        initialQuery={searchInitialQuery}
      />
    </div>
  );
};

export const App = () => {
  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <DashboardProvider>
          <MainAppContent />
        </DashboardProvider>
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default App;
