import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const AboutSection = () => {
  const { content } = useLanguage();
  const tabs = content.about.tabs;
  const [activeTabId, setActiveTabId] = useState('overview');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{content.about.sectionTitle}</h2>
          <p className="section-subtitle">{content.about.sectionSubtitle}</p>
        </div>

        <div className="about-grid">
          {/* Left Vertical Menu */}
          <div className="about-nav-card">
            <div className="about-nav-header">General Information</div>
            <div className="about-tabs-list">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`about-tab-btn ${tab.id === activeTabId ? 'active' : ''}`}
                  onClick={() => setActiveTabId(tab.id)}
                >
                  <span>{tab.title}</span>
                  <span>›</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Dynamic Card */}
          <div className="about-content-card">
            <div className="about-detail">
              <h3>{activeTab.contentHeading}</h3>
              <p>{activeTab.contentBody}</p>
              <a href="#services">{activeTab.linkText}</a>
            </div>
            <div className="about-illustration">
              <img
                src="./assets/images/icons/about-illustration.svg"
                alt="Digital Land Records System Illustration"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
