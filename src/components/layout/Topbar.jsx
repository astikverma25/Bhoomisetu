import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

export const Topbar = () => {
  const { lang, setLang, content } = useLanguage();
  const { setFontSize, toggleContrast } = useAccessibility();

  return (
    <aside className="gov-topbar" aria-label="Accessibility and Utility Bar">
      <div className="container">
        <div className="topbar-left">
          <a href={`mailto:${content.meta.email}`} className="topbar-item">
            <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            <span>{content.meta.email}</span>
          </a>
          <span className="topbar-item">
            <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            <span>{content.meta.helpline}</span>
          </span>
        </div>

        <div className="topbar-right">
          <div className="accessibility-tools" aria-label="Text size and visual controls">
            <button type="button" className="font-btn" onClick={() => setFontSize(0)} title="Decrease font size">A-</button>
            <button type="button" className="font-btn" onClick={() => setFontSize(1)} title="Reset standard font size">A</button>
            <button type="button" className="font-btn" onClick={() => setFontSize(2)} title="Increase font size">A+</button>
            <button type="button" className="contrast-toggle" onClick={toggleContrast} title="Toggle High Contrast">Contrast</button>
          </div>

          <div className="language-selector">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Select Language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};
