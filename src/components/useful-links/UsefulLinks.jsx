import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const UsefulLinks = () => {
  const { content } = useLanguage();
  const links = content.usefulLinks.links;

  return (
    <section className="useful-links-section" id="useful-links">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{content.usefulLinks.title}</h2>
        </div>

        <div className="useful-links-grid">
          {/* Left Mini GIS Widget */}
          <div className="gis-map-widget">
            <div className="gis-map-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              </svg>
              BhoomiSetu GIS Cadastral
            </div>
            <div className="gis-map-frame">
              <div className="gis-map-canvas">
                <div className="gis-map-pin">
                  📍 Plot #204-A (Verified)
                </div>
              </div>
            </div>
            <div className="gis-map-footer">
              Lat: 28.6139° N, Long: 77.2090° E
            </div>
          </div>

          {/* Middle Links List */}
          <div className="links-list-card">
            <ul>
              {links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Monitor Graphic */}
          <div className="links-illustration-box">
            <img
              src="./assets/images/icons/services-illustration.svg"
              alt="Digital Land Records Access Graphic"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
