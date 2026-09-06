import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Topbar } from './components/layout/Topbar';
import { Header } from './components/layout/Header';
import { HeroCarousel } from './components/hero/HeroCarousel';
import { InitiativeRibbon } from './components/initiative/InitiativeRibbon';
import { AboutSection } from './components/about/AboutSection';
import { ServicesGrid } from './components/services/ServicesGrid';
import { MediaGallery } from './components/gallery/MediaGallery';
import { UpdatesSection } from './components/updates/UpdatesSection';
import { UsefulLinks } from './components/useful-links/UsefulLinks';
import { PartnersMarquee } from './components/partners/PartnersMarquee';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';

export const App = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = useState('');

  const handleOpenSearch = (query = '') => {
    setSearchInitialQuery(query);
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <LanguageProvider>
      <AccessibilityProvider>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        
        <Topbar />
        <Header onOpenSearch={handleOpenSearch} />

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
      </AccessibilityProvider>
    </LanguageProvider>
  );
};

export default App;
