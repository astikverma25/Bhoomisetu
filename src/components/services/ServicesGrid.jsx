import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const ServicesGrid = () => {
  const { content } = useLanguage();
  const items = content.services.items;

  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{content.services.sectionTitle}</h2>
          <p className="section-subtitle">{content.services.sectionSubtitle}</p>
        </div>

        <div className="services-grid">
          {items.map((item) => (
            <div key={item.id} className="service-card">
              <div className="service-icon-box">
                <img src={item.icon} alt={item.title} />
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <a href="#updates" className="service-card-link">
                {item.linkText}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
