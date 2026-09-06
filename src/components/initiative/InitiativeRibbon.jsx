import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const InitiativeRibbon = () => {
  const { content } = useLanguage();

  return (
    <section className="initiative-ribbon-section">
      <div className="container">
        <div className="initiative-banner-card">
          <div className="initiative-left">
            <div className="india-map-badge" style={{ padding: '4px', overflow: 'hidden', background: '#ffffff' }}>
              <img
                src="./assets/images/banners/indianflag.png"
                alt="National Flag of India"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              />
            </div>
            <div className="initiative-text">
              <h3>{content.azadiBanner.heading}</h3>
              <p>{content.azadiBanner.subheading}</p>
            </div>
          </div>
          <div className="initiative-right">
            <img
              src="./assets/images/banners/azadi-ka-amrit-mahotsav.svg"
              alt="Azadi Ka Amrit Mahotsav"
              className="akam-badge-logo"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
