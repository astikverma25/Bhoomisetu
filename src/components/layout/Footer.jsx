import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const Footer = () => {
  const { content } = useLanguage();
  const { footer } = content;

  return (
    <footer className="gov-footer" id="footer">
      <div className="container">
        <div className="footer-main-grid">
          {/* Column 1: Brand & Ministry Information */}
          <div className="footer-brand-col">
            <div className="footer-emblem-wrap">
              <img
                src="./assets/images/emblems/national-emblem.png"
                alt="Emblem of India"
                style={{ height: '58px', width: 'auto', filter: 'brightness(0) invert(1)' }}
              />
              <div>
                <h3 className="footer-brand-title">{footer.title}</h3>
                <p className="footer-brand-desc">{footer.subTitle}</p>
              </div>
            </div>
            <p className="footer-brand-desc">{footer.org}</p>
            <div className="footer-hours-box">
              <strong>{footer.workingHours}</strong>
            </div>
          </div>

          {/* Column 2: Legal & Governance Policies */}
          <div className="footer-links-col">
            <h4>Policy & Compliance</h4>
            <ul>
              {footer.navLinks.slice(0, 5).map((link, idx) => (
                <li key={idx}>
                  <a href={link.url}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Citizen Direct Connect */}
          <div className="footer-links-col">
            <h4>Quick Assistance</h4>
            <ul>
              <li><a href="#about">About BhoomiSetu</a></li>
              <li><a href="#services">Land Record Services</a></li>
              <li><a href="#updates">Grievance Redressal (CPGRAMS)</a></li>
              <li><a href="#useful-links">State Land Portals</a></li>
              <li><a href="#footer">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="container">
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};
