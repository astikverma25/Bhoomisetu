import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const Header = ({ onOpenSearch }) => {
  const { content } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onOpenSearch) onOpenSearch(searchInput);
  };

  return (
    <header className="main-header">
      <div className="header-branding">
        <div className="container">
          <div className="brand-wrapper">
            <img src="./assets/images/emblems/national-emblem.png" alt="State Emblem of India" className="national-emblem-img" />
            <div className="brand-divider"></div>
            <img src="./assets/images/emblems/bhoomisetu-logo.svg" alt="BhoomiSetu National Land Portal" className="portal-brand-logo" />
          </div>

          <div className="header-auxiliary">
            <img src="./assets/images/banners/g20-logo.png" alt="G20 Bharat" className="g20-logo-img" />
            <img src="./assets/images/banners/cleanindialogo.png" alt="Swachh Bharat Clean India" className="cleanindia-logo-img" />
            <img src="./assets/images/banners/azadi-ka-amrit-mahotsav.svg" alt="Azadi Ka Amrit Mahotsav" className="akam-logo-img" />

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
  );
};
