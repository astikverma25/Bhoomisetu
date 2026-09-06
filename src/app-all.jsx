import { contentEn } from './src/data/content-en.js';
import { contentHi } from './src/data/content-hi.js';
import {
  SEED_STATES,
  SEED_DISTRICTS,
  SEED_PROJECTS,
  SEED_PARCELS,
  SEED_ALERTS,
  SEED_DOCUMENTS,
  SEED_AUDIT_TRAIL,
  SEED_INTEGRATIONS
} from './src/data/mock/seedData.js';
import { PROJECT_TYPES, PARCEL_STATUSES, PERSONA_ROLES, WORKFLOW_STAGES } from './src/data/schema/types.js';
import { apiService } from './src/data/service/apiService.js';

// ==========================================
// 1. CONTEXTS
// ==========================================

// Language Context
const LanguageContext = React.createContext(null);
const LanguageProvider = ({ children }) => {
  const [lang, setLang] = React.useState('en');
  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const content = lang === 'hi' ? contentHi : contentEn;
  return (
    <LanguageContext.Provider value={{ lang, setLang, content }}>
      {children}
    </LanguageContext.Provider>
  );
};
const useLanguage = () => React.useContext(LanguageContext);

// Accessibility Context
const AccessibilityContext = React.createContext(null);
const AccessibilityProvider = ({ children }) => {
  const fontSizes = [14, 16, 18];
  const [fontIndex, setFontIndex] = React.useState(1);
  const [isHighContrast, setIsHighContrast] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizes[fontIndex]}px`;
  }, [fontIndex]);

  React.useEffect(() => {
    if (isHighContrast) document.body.classList.add('high-contrast');
    else document.body.classList.remove('high-contrast');
  }, [isHighContrast]);

  return (
    <AccessibilityContext.Provider value={{
      fontIndex,
      setFontSize: (idx) => setFontIndex(idx),
      isHighContrast,
      toggleContrast: () => setIsHighContrast(prev => !prev)
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
const useAccessibility = () => React.useContext(AccessibilityContext);

// Dashboard Context
const DashboardContext = React.createContext(null);
const DashboardProvider = ({ children }) => {
  const [appMode, setAppMode] = React.useState('landing'); // 'landing' | 'dashboard'
  const [activeTab, setActiveTab] = React.useState('analytics');
  const [activeRole, setActiveRole] = React.useState(PERSONA_ROLES[0]);

  const [selectedState, setSelectedState] = React.useState('all');
  const [selectedDistrict, setSelectedDistrict] = React.useState('all');
  const [selectedProject, setSelectedProject] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [selectedProjectType, setSelectedProjectType] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const [inspectParcelId, setInspectParcelId] = React.useState(null);
  const [isParcelDrawerOpen, setIsParcelDrawerOpen] = React.useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  const handleRoleChange = (roleId) => {
    const role = PERSONA_ROLES.find(r => r.id === roleId) || PERSONA_ROLES[0];
    setActiveRole(role);
    if (role.id === 'district_collector') {
      setSelectedState('st_mh');
      setSelectedDistrict('dist_raigad');
      setActiveTab('map');
    } else if (role.id === 'state_official') {
      setSelectedState('st_mh');
      setSelectedDistrict('all');
      setActiveTab('analytics');
    } else if (role.id === 'pia_officer') {
      setSelectedProject('proj_dme_pkg4');
      setActiveTab('workflow');
    } else if (role.id === 'rehab_authority') {
      setActiveTab('analytics');
    } else if (role.id === 'policy_analyst') {
      setActiveTab('reports');
    } else {
      setSelectedState('all');
      setSelectedDistrict('all');
      setSelectedProject('all');
      setActiveTab('analytics');
    }
  };

  const openParcelDetail = (parcelId) => {
    setInspectParcelId(parcelId);
    setIsParcelDrawerOpen(true);
  };

  const closeParcelDetail = () => {
    setIsParcelDrawerOpen(false);
  };

  const jumpToParcelOnMap = (parcelId, stateId = null, districtId = null) => {
    setAppMode('dashboard');
    setActiveTab('map');
    if (stateId) setSelectedState(stateId);
    if (districtId) setSelectedDistrict(districtId);
    if (parcelId) {
      setInspectParcelId(parcelId);
      setIsParcelDrawerOpen(true);
    }
  };

  const resetFilters = () => {
    setSelectedState('all');
    setSelectedDistrict('all');
    setSelectedProject('all');
    setSelectedStatus('all');
    setSelectedProjectType('all');
    setSearchQuery('');
  };

  return (
    <DashboardContext.Provider value={{
      appMode,
      setAppMode,
      activeTab,
      setActiveTab,
      activeRole,
      handleRoleChange,
      isSidebarCollapsed,
      setIsSidebarCollapsed,
      toggleSidebar,
      selectedState,
      setSelectedState,
      selectedDistrict,
      setSelectedDistrict,
      selectedProject,
      setSelectedProject,
      selectedStatus,
      setSelectedStatus,
      selectedProjectType,
      setSelectedProjectType,
      searchQuery,
      setSearchQuery,
      resetFilters,
      inspectParcelId,
      setInspectParcelId,
      isParcelDrawerOpen,
      openParcelDetail,
      closeParcelDetail,
      jumpToParcelOnMap
    }}>
      {children}
    </DashboardContext.Provider>
  );
};
const useDashboard = () => React.useContext(DashboardContext);

// ==========================================
// 2. LANDING PAGE COMPONENTS
// ==========================================

const Topbar = () => {
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
            <button type="button" className="font-btn" onClick={() => setFontSize(0)}>A-</button>
            <button type="button" className="font-btn" onClick={() => setFontSize(1)}>A</button>
            <button type="button" className="font-btn" onClick={() => setFontSize(2)}>A+</button>
            <button type="button" className="contrast-toggle" onClick={toggleContrast}>Contrast</button>
          </div>
          <div className="language-selector">
            <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Select Language">
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SSOLoginModal = ({ isOpen, onClose, onLogin }) => {
  const { handleRoleChange } = useDashboard();
  const [selectedRoleId, setSelectedRoleId] = React.useState(PERSONA_ROLES[0].id);
  const [govId, setGovId] = React.useState('officer.nic@gov.in');
  const [password, setPassword] = React.useState('••••••••••••');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRoleChange(selectedRoleId);
    onLogin();
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

const Header = ({ onOpenSearch }) => {
  const { content } = useLanguage();
  const { setAppMode, setActiveTab } = useDashboard();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [q, setQ] = React.useState('');

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setAppMode('dashboard');
    setActiveTab('analytics');
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

              <form className="header-search" onSubmit={(e) => { e.preventDefault(); onOpenSearch(q); }} role="search">
                <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Portal..." aria-label="Search Land Services" />
                <button type="submit" aria-label="Submit Search">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        <nav className="gov-navbar" aria-label="Main Navigation">
          <div className="container">
            <button className="mobile-nav-toggle" onClick={() => setIsMobileOpen(p => !p)}>☰</button>
            <div className={`nav-links ${isMobileOpen ? 'show' : ''}`}>
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

const HeroCarousel = () => {
  const { content } = useLanguage();
  const slides = content.heroSlides;
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const next = React.useCallback(() => setIdx(p => (p + 1) % slides.length), [slides.length]);
  const prev = React.useCallback(() => setIdx(p => (p - 1 + slides.length) % slides.length), [slides.length]);

  React.useEffect(() => {
    if (!paused) {
      const t = setInterval(next, 5000);
      return () => clearInterval(t);
    }
  }, [paused, next]);

  return (
    <section className="hero-carousel-section" aria-label="Hero Spotlight Slider" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container hero-slider-container">
        {slides.map((slide, sIdx) => (
          <div key={slide.id} className={`hero-slide ${sIdx === idx ? 'active' : ''}`} style={{ display: sIdx === idx ? 'grid' : 'none' }}>
            <div className="hero-content">
              <span className="hero-badge">{slide.tag}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="hero-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
                <span>{slide.date}</span>
              </div>
              <div>
                <a href={slide.ctaLink} className="hero-cta-btn">
                  {slide.ctaText}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                </a>
              </div>
            </div>
            <div className="hero-visual-wrapper">
              <div className="hero-image-frame">
                <img src={slide.image} alt={slide.title} />
              </div>
              <div className="hero-nav-controls">
                <div className="hero-dots">
                  {slides.map((_, dIdx) => (
                    <span key={dIdx} className={`hero-dot ${dIdx === idx ? 'active' : ''}`} onClick={() => setIdx(dIdx)} />
                  ))}
                </div>
                <button type="button" className="hero-nav-btn hero-prev-btn" onClick={prev} aria-label="Previous Slide">❮</button>
                <button type="button" className="hero-nav-btn hero-next-btn" onClick={next} aria-label="Next Slide">❯</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const InitiativeRibbon = () => {
  const { content } = useLanguage();
  return (
    <section className="initiative-ribbon-section">
      <div className="container">
        <div className="initiative-banner-card">
          <div className="initiative-left">
            <div className="india-map-badge" style={{ padding: '4px', overflow: 'hidden', background: '#ffffff' }}>
              <img src="./assets/images/banners/indianflag.png" alt="National Flag of India" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
            </div>
            <div className="initiative-text">
              <h3>{content.azadiBanner.heading}</h3>
              <p>{content.azadiBanner.subheading}</p>
            </div>
          </div>
          <div className="initiative-right">
            <img src="./assets/images/banners/azadi-ka-amrit-mahotsav.svg" alt="Azadi Ka Amrit Mahotsav" className="akam-badge-logo" />
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const { content } = useLanguage();
  const tabs = content.about.tabs;
  const [tabId, setTabId] = React.useState('overview');
  const activeTab = tabs.find(t => t.id === tabId) || tabs[0];

  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{content.about.sectionTitle}</h2>
          <p className="section-subtitle">{content.about.sectionSubtitle}</p>
        </div>
        <div className="about-grid">
          <div className="about-nav-card">
            <div className="about-nav-header">General Information</div>
            <div className="about-tabs-list">
              {tabs.map((tab) => (
                <button key={tab.id} type="button" className={`about-tab-btn ${tab.id === tabId ? 'active' : ''}`} onClick={() => setTabId(tab.id)}>
                  <span>{tab.title}</span>
                  <span>›</span>
                </button>
              ))}
            </div>
          </div>
          <div className="about-content-card">
            <div className="about-detail">
              <h3>{activeTab.contentHeading}</h3>
              <p>{activeTab.contentBody}</p>
              <a href="#services">{activeTab.linkText}</a>
            </div>
            <div className="about-illustration">
              <img src="./assets/images/icons/about-illustration.svg" alt="Digital Land Records System Illustration" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesGrid = () => {
  const { content } = useLanguage();
  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{content.services.sectionTitle}</h2>
          <p className="section-subtitle">{content.services.sectionSubtitle}</p>
        </div>
        <div className="services-grid">
          {content.services.items.map((item) => (
            <div key={item.id} className="service-card">
              <div className="service-icon-box">
                <img src={item.icon} alt={item.title} />
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <a href="#updates" className="service-card-link">{item.linkText}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MediaGallery = () => {
  const { content } = useLanguage();
  const images = ["./assets/images/hero/herovisual1.jpg", "./assets/images/hero/herovisual2.jpg", "./assets/images/hero/herovisual3.jpg"];
  const [sel, setSel] = React.useState(1);

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="gallery-banner-card">
          <div className="gallery-banner-header">
            <h3>{content.gallery.title}</h3>
            <p>{content.gallery.subtitle}</p>
          </div>
          <div className="gallery-content-grid">
            <div className="gallery-left-visual">
              <img src="./assets/images/hero/herovisual1.jpg" alt="National Conclave on AI in Rural Governance" />
            </div>
            <div className="gallery-right-showcase">
              <div className="gallery-main-featured">
                <img src={images[sel]} alt="Featured Government Event" />
              </div>
              <div className="gallery-thumbnails-bar">
                <div className="gallery-thumbnails">
                  {images.map((img, i) => (
                    <div key={i} className={`gallery-thumb ${i === sel ? 'active' : ''}`} onClick={() => setSel(i)}>
                      <img src={img} alt={`Thumb ${i + 1}`} />
                    </div>
                  ))}
                </div>
                <div className="gallery-nav-btns">
                  <button type="button" className="gallery-nav-btn" onClick={() => setSel(p => (p - 1 + images.length) % images.length)}>❮</button>
                  <button type="button" className="gallery-nav-btn" onClick={() => setSel(p => (p + 1) % images.length)}>❯</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const UpdatesSection = () => {
  const { content } = useLanguage();
  const { whatsNew, facebook, twitter } = content.updates;
  return (
    <section className="updates-section" id="updates">
      <div className="container">
        <div className="updates-grid">
          <div className="feed-card">
            <div className="feed-header">
              <h3 className="feed-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#ea580c"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>
                {whatsNew.title}
              </h3>
            </div>
            <div className="feed-scroll-body">
              {whatsNew.items.map((item, idx) => (
                <div key={idx} className="news-item">
                  <div className="news-meta">
                    <span className="news-date">{item.date}</span>
                    <span className="news-badge">{item.badge}</span>
                  </div>
                  <a href={item.link}><p className="news-text">{item.text}</p></a>
                </div>
              ))}
            </div>
          </div>

          <div className="feed-card">
            <div className="feed-header">
              <h3 className="feed-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                {facebook.title}
              </h3>
            </div>
            <div className="feed-scroll-body">
              <div className="fb-profile-strip">
                <div className="fb-avatar">BS</div>
                <div className="fb-info">
                  <h5>{facebook.pageName}</h5>
                  <span>{facebook.followers} • {facebook.postDate}</span>
                </div>
              </div>
              <p className="fb-post-text">{facebook.postText}</p>
              <div className="fb-post-media"><img src={facebook.postImage} alt="Ministry Facebook update photo" /></div>
              <div className="fb-post-actions">
                <span>👍 1.4K Likes</span><span>💬 184 Comments</span><span>🔄 320 Shares</span>
              </div>
            </div>
          </div>

          <div className="feed-card">
            <div className="feed-header">
              <h3 className="feed-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0f172a"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                {twitter.title}
              </h3>
            </div>
            <div className="feed-scroll-body">
              {twitter.items.map((tweet, idx) => (
                <div key={idx} className="tweet-item">
                  <div className="tweet-header">
                    <span className="tweet-user">{tweet.handle}</span>
                    <span className="tweet-time">{tweet.time}</span>
                  </div>
                  <p className="tweet-body">{tweet.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const UsefulLinks = () => {
  const { content } = useLanguage();
  return (
    <section className="useful-links-section" id="useful-links">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{content.usefulLinks.title}</h2>
        </div>
        <div className="useful-links-grid">
          <div className="gis-map-widget">
            <div className="gis-map-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              BhoomiSetu GIS Cadastral
            </div>
            <div className="gis-map-frame">
              <div className="gis-map-canvas">
                <div className="gis-map-pin">📍 Plot #204-A (Verified)</div>
              </div>
            </div>
            <div className="gis-map-footer">Lat: 28.6139° N, Long: 77.2090° E</div>
          </div>
          <div className="links-list-card">
            <ul>
              {content.usefulLinks.links.map((link, idx) => (
                <li key={idx}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a></li>
              ))}
            </ul>
          </div>
          <div className="links-illustration-box">
            <img src="./assets/images/icons/services-illustration.svg" alt="Digital Land Records Access Graphic" />
          </div>
        </div>
      </div>
    </section>
  );
};

const PartnersMarquee = () => {
  const partnerLogos = [
    { src: './assets/images/partners/make-in-india.svg', alt: 'Make in India' },
    { src: './assets/images/partners/invest-india.svg', alt: 'Invest India' },
    { src: './assets/images/partners/madad.svg', alt: 'MADAD Portal' },
    { src: './assets/images/partners/bharat-quiz.svg', alt: 'Bharat Quiz / MyGov' },
    { src: './assets/images/partners/pravasi-bharatiya.svg', alt: 'Pravasi Bharatiya Divas' }
  ];
  const institutionalLogos = [
    { src: './assets/images/partners/india-gov.svg', alt: 'National Portal of India' },
    { src: './assets/images/partners/incredible-india.svg', alt: 'Incredible India' },
    { src: './assets/images/partners/india-africa.svg', alt: 'India Africa' },
    { src: './assets/images/partners/iig.svg', alt: 'India Investment Grid' },
    { src: './assets/images/partners/mea-logo.svg', alt: 'Ministry of Rural Development' },
    { src: './assets/images/partners/iccr-logo.svg', alt: 'NIC DILRMP' }
  ];
  return (
    <React.Fragment>
      <section className="partners-carousel-section" aria-label="National Initiatives and Programs">
        <div className="container partners-slider-wrapper">
          <div className="partners-track">
            {partnerLogos.concat(partnerLogos).map((logo, idx) => (
              <div key={idx} className="partner-logo-item"><img src={logo.src} alt={logo.alt} /></div>
            ))}
          </div>
        </div>
      </section>
      <div className="institutional-partners-strip">
        <div className="container institutional-logos-grid">
          {institutionalLogos.map((inst, idx) => (
            <div key={idx} className="inst-logo-card"><img src={inst.src} alt={inst.alt} /></div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

const Footer = () => {
  const { content } = useLanguage();
  const { footer } = content;
  return (
    <footer className="gov-footer" id="footer">
      <div className="container">
        <div className="footer-main-grid">
          <div className="footer-brand-col">
            <div className="footer-emblem-wrap">
              <img src="./assets/images/emblems/national-emblem.png" alt="Emblem of India" style={{ height: '58px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
              <div>
                <h3 className="footer-brand-title">{footer.title}</h3>
                <p className="footer-brand-desc">{footer.subTitle}</p>
              </div>
            </div>
            <p className="footer-brand-desc">{footer.org}</p>
            <div className="footer-hours-box"><strong>{footer.workingHours}</strong></div>
          </div>
          <div className="footer-links-col">
            <h4>Policy & Compliance</h4>
            <ul>
              {footer.navLinks.slice(0, 5).map((link, idx) => (
                <li key={idx}><a href={link.url}>{link.name}</a></li>
              ))}
            </ul>
          </div>
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
        <div className="container"><p>{footer.copyright}</p></div>
      </div>
    </footer>
  );
};

const SearchModal = ({ isOpen, onClose, initialQuery = '' }) => {
  const [query, setQuery] = React.useState(initialQuery);
  const searchIndex = [
    { title: "Download Digitally Signed RoR (Khatauni)", category: "Citizen Services", desc: "Instant certified Record of Rights copy with QR verification." },
    { title: "Bhu-Aadhaar (ULPIN) Verification", category: "Geo-Spatial", desc: "Lookup 14-digit Unique Land Parcel ID number for any survey plot." },
    { title: "Online Mutation & Title Transfer", category: "Revenue Services", desc: "File succession, sale deed mutation, and track approval status." },
    { title: "Cadastral Map Overlay (BhuNaksha)", category: "GIS Maps", desc: "View satellite geo-referenced survey boundaries and village parcels." },
    { title: "Revenue Court Case Status", category: "Judicial & Disputes", desc: "Check cause list, hearing dates, and stay order status." },
    { title: "Citizen Charter & Delivery SLA 2026", category: "Information", desc: "Guaranteed turnaround times for all land revenue services." },
    { title: "Lodge Grievance (CPGRAMS / MADAD)", category: "Citizen Corner", desc: "Direct complaint portal with 7-day resolution guarantee." }
  ];

  React.useEffect(() => { setQuery(initialQuery); }, [initialQuery, isOpen]);
  if (!isOpen) return null;

  const q = query.toLowerCase().trim();
  const filtered = searchIndex.filter(item => item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q));

  return (
    <div className="search-modal-backdrop open" onClick={(e) => { if (e.target.classList.contains('search-modal-backdrop')) onClose(); }} role="dialog" aria-modal="true">
      <div className="search-modal-dialog">
        <div className="search-modal-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#002147"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search RoR, Bhu-Aadhaar, Cadastral Maps, Services..." autoFocus />
          <button type="button" className="search-modal-close" onClick={onClose} aria-label="Close Search">&times;</button>
        </div>
        <div className="search-results-container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No matching revenue services found.</div>
          ) : (
            filtered.map((item, idx) => (
              <div key={idx} className="search-result-item" onClick={() => alert(`Selected service: ${item.title}`)}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase' }}>{item.category}</span>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. ENTERPRISE DASHBOARD COMPONENTS
// ==========================================

const DashboardHeader = () => {
  const { setAppMode, activeTab, setActiveTab, activeRole, handleRoleChange } = useDashboard();
  const { lang, setLang } = useLanguage();

  const navItems = [
    { id: 'analytics', label: 'Overview & Analytics', icon: '📊' },
    { id: 'map', label: 'Interactive GIS Map', icon: '🗺️', highlight: true },
    { id: 'workflow', label: 'Workflow Tracker', icon: '⚡' },
    { id: 'alerts', label: 'SLA & Statutory Alerts', icon: '🚨', badge: '5' },
    { id: 'documents', label: 'Document Repository', icon: '📂' },
    { id: 'reports', label: 'MIS Reports & Export', icon: '📑' },
    { id: 'integrations', label: 'Integration Hub', icon: '🔌' }
  ];

  return (
    <header className="dashboard-enterprise-header">
      <div className="dash-topbar">
        <div className="dash-container topbar-flex">
          <div className="topbar-left-meta">
            <span className="gov-flag-badge">🇮🇳 GOVT OF INDIA</span>
            <span className="divider-sep">•</span>
            <span className="portal-subname">National Land Acquisition & Management Cockpit (DILRMP)</span>
          </div>

          <div className="topbar-right-controls">
            <div className="persona-selector-box">
              <span className="persona-label">Persona Role:</span>
              <select
                className="persona-select"
                value={activeRole.id}
                onChange={(e) => handleRoleChange(e.target.value)}
                title="Switch persona role"
              >
                {PERSONA_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="dash-lang-toggle">
              <button className={`dash-lang-btn ${lang === 'en' ? 'active' : ''}`} onClick={() => setLang('en')}>EN</button>
              <button className={`dash-lang-btn ${lang === 'hi' ? 'active' : ''}`} onClick={() => setLang('hi')}>हिन्दी</button>
            </div>

            <button className="exit-portal-btn" onClick={() => setAppMode('landing')}>
              ← Public Portal
            </button>
          </div>
        </div>
      </div>

      <div className="dash-main-bar">
        <div className="dash-container main-nav-flex">
          <div className="dash-brand-wrap" onClick={() => setActiveTab('analytics')}>
            <img src="./assets/images/emblems/national-emblem.png" alt="Emblem" className="dash-emblem-img" />
            <div className="dash-brand-info">
              <div className="dash-brand-title">
                BHOOMI<span>SETU</span>
                <span className="dash-badge-live">LIVE SYSTEM</span>
              </div>
              <div className="dash-brand-subtitle">Real-Time Land Acquisition & Resettlement Portal</div>
            </div>
          </div>

          <nav className="dash-nav-pills" aria-label="Dashboard Modules">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`dash-nav-pill ${activeTab === item.id ? 'active' : ''} ${item.highlight ? 'pill-highlight' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="pill-icon">{item.icon}</span>
                <span className="pill-text">{item.label}</span>
                {item.badge && <span className="pill-badge">{item.badge}</span>}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

const DashboardFilterBar = () => {
  const {
    selectedState, setSelectedState,
    selectedDistrict, setSelectedDistrict,
    selectedProjectType, setSelectedProjectType,
    selectedStatus, setSelectedStatus,
    searchQuery, setSearchQuery,
    resetFilters
  } = useDashboard();

  const [statesList, setStatesList] = React.useState([]);
  const [districtsList, setDistrictsList] = React.useState([]);

  React.useEffect(() => {
    apiService.getStates().then(setStatesList);
  }, []);

  React.useEffect(() => {
    apiService.getDistricts(selectedState).then(setDistrictsList);
    if (selectedState === 'all') {
      setSelectedDistrict('all');
    }
  }, [selectedState]);

  const hasActive = selectedState !== 'all' || selectedDistrict !== 'all' || selectedProjectType !== 'all' || selectedStatus !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="dash-filter-bar">
      <div className="dash-container filter-bar-inner">
        <div className="filter-item search-box-wrap">
          <svg className="filter-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search Survey #, ULPIN, Owner, Project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="filter-item">
          <label className="filter-label">State</label>
          <select className="filter-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
            <option value="all">All States (National)</option>
            {statesList.map(s => (<option key={s.id} value={s.id}>{s.name} ({s.code})</option>))}
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">District</label>
          <select className="filter-select" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={districtsList.length === 0}>
            <option value="all">All Districts</option>
            {districtsList.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Sector</label>
          <select className="filter-select" value={selectedProjectType} onChange={(e) => setSelectedProjectType(e.target.value)}>
            <option value="all">All Sectors</option>
            {Object.values(PROJECT_TYPES).map(t => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Status Stage</label>
          <select className="filter-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="all">All Status Stages</option>
            {Object.values(PARCEL_STATUSES).map(st => (<option key={st} value={st}>{st}</option>))}
          </select>
        </div>

        {hasActive && (
          <button className="filter-reset-btn" onClick={resetFilters}>↺ Reset</button>
        )}
      </div>
    </div>
  );
};

const ParcelDetailDrawer = ({ parcelId, isOpen, onClose }) => {
  const [parcelData, setParcelData] = React.useState(null);
  const [activeTab, setActiveTab] = React.useState('overview');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (parcelId && isOpen) {
      setLoading(true);
      apiService.getParcelById(parcelId).then(data => {
        setParcelData(data);
        setLoading(false);
      });
    }
  }, [parcelId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="parcel-drawer-backdrop" onClick={(e) => { if (e.target.classList.contains('parcel-drawer-backdrop')) onClose(); }}>
      <div className="parcel-drawer-panel">
        <div className="drawer-header">
          <div className="drawer-title-box">
            <div className="drawer-badges-row">
              <span className="drawer-ulpin-badge">ULPIN: {parcelData?.ulpin || 'LOADING...'}</span>
              <span className={`drawer-status-pill ${
                parcelData?.status.includes('Disputed') ? 'status-red' :
                parcelData?.status.includes('Closed') || parcelData?.status.includes('Possession') ? 'status-green' :
                parcelData?.status.includes('Delayed') ? 'status-amber' : 'status-blue'
              }`}>
                {parcelData?.status}
              </span>
            </div>
            <h2 className="drawer-title">Survey Plot #{parcelData?.surveyNumber || '...'}</h2>
            <p className="drawer-subtitle">{parcelData?.project?.name} • {parcelData?.district?.name}, {parcelData?.state?.name}</p>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close details">✕</button>
        </div>

        <div className="drawer-nav-tabs">
          <button className={`drawer-nav-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>📋 Overview & Stats</button>
          <button className={`drawer-nav-tab ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>⏱️ Milestones</button>
          <button className={`drawer-nav-tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>📄 Documents ({parcelData?.documents?.length || 0})</button>
          <button className={`drawer-nav-tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>🛡️ Audit Trail ({parcelData?.auditTrail?.length || 0})</button>
        </div>

        <div className="drawer-body-scroll">
          {loading || !parcelData ? (
            <div className="drawer-loading"><div className="dash-spinner"></div><p>Fetching parcel metadata...</p></div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="drawer-tab-content">
                  <div className="drawer-stats-grid">
                    <div className="drawer-stat-card">
                      <span className="stat-card-label">Acquisition Area</span>
                      <span className="stat-card-value">{parcelData.areaHa} <small>ha</small></span>
                      <span className="stat-card-sub">{parcelData.ownerType}</span>
                    </div>
                    <div className="drawer-stat-card">
                      <span className="stat-card-label">Compensation</span>
                      <span className="stat-card-value">₹{parcelData.compensationAssessed} <small>Cr</small></span>
                      <span className="stat-card-sub">{parcelData.compensationDisbursed >= parcelData.compensationAssessed ? '✅ 100% Paid via PFMS' : `⚠️ ₹${(parcelData.compensationAssessed - parcelData.compensationDisbursed).toFixed(1)} Cr Pending`}</span>
                    </div>
                    <div className="drawer-stat-card">
                      <span className="stat-card-label">Affected Families</span>
                      <span className="stat-card-value">{parcelData.familiesAffected}</span>
                      <span className="stat-card-sub">{parcelData.familiesResettled} Resettled ({parcelData.rrProgressPct}%)</span>
                    </div>
                    <div className="drawer-stat-card">
                      <span className="stat-card-label">Coordinates</span>
                      <span className="stat-card-value-small">{parcelData.lat}° N, {parcelData.lng}° E</span>
                      <span className="stat-card-sub">RTK GPS Verified</span>
                    </div>
                  </div>

                  <div className="drawer-section-card">
                    <h4 className="section-card-title">Landowner & Title Record (DILRMP)</h4>
                    <div className="drawer-key-values">
                      <div className="kv-row"><span className="kv-key">Primary Owner:</span><span className="kv-val font-semibold">{parcelData.ownerName}</span></div>
                      <div className="kv-row"><span className="kv-key">Owner Classification:</span><span className="kv-val">{parcelData.ownerType}</span></div>
                      <div className="kv-row"><span className="kv-key">Legal & Possession:</span><span className="kv-val">{parcelData.legalStatus}</span></div>
                      {parcelData.slaDelayedDays > 0 && (
                        <div className="kv-row alert-bg-row">
                          <span className="kv-key text-critical">⚠️ Statutory SLA Overdue:</span>
                          <span className="kv-val text-critical font-bold">+{parcelData.slaDelayedDays} Days</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="drawer-section-card">
                    <h4 className="section-card-title">Project Context</h4>
                    <div className="drawer-key-values">
                      <div className="kv-row"><span className="kv-key">Project:</span><span className="kv-val">{parcelData.project?.name}</span></div>
                      <div className="kv-row"><span className="kv-key">Agency:</span><span className="kv-val">{parcelData.project?.implementingAgency}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="drawer-tab-content">
                  <div className="drawer-timeline-stepper">
                    <div className={`timeline-step-item ${parcelData.notificationDate ? 'done' : 'pending'}`}>
                      <div className="step-bullet">1</div>
                      <div className="step-content">
                        <h5>Section 3A / 11 Preliminary Notification</h5>
                        <p className="step-date">Date: {parcelData.notificationDate || 'Pending'}</p>
                      </div>
                    </div>
                    <div className={`timeline-step-item ${parcelData.awardDate ? 'done' : parcelData.notificationDate ? 'in-progress' : 'pending'}`}>
                      <div className="step-bullet">2</div>
                      <div className="step-content">
                        <h5>Section 3G / 23 Award Declaration</h5>
                        <p className="step-date">Date: {parcelData.awardDate || (parcelData.slaDelayedDays > 0 ? `Delayed (+${parcelData.slaDelayedDays}d)` : 'Under Hearing')}</p>
                      </div>
                    </div>
                    <div className={`timeline-step-item ${parcelData.compensationDisbursed > 0 ? 'done' : 'pending'}`}>
                      <div className="step-bullet">3</div>
                      <div className="step-content">
                        <h5>PFMS Electronic Compensation Credit</h5>
                        <p className="step-date">Status: ₹{parcelData.compensationDisbursed} Cr of ₹{parcelData.compensationAssessed} Cr Disbursed</p>
                      </div>
                    </div>
                    <div className={`timeline-step-item ${parcelData.possessionDate ? 'done' : 'pending'}`}>
                      <div className="step-bullet">4</div>
                      <div className="step-content">
                        <h5>Physical Possession & Mutation in RoR</h5>
                        <p className="step-date">Date: {parcelData.possessionDate || 'Pending Final Handover'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="drawer-tab-content">
                  <div className="drawer-docs-list">
                    {parcelData.documents && parcelData.documents.length > 0 ? (
                      parcelData.documents.map(doc => (
                        <div key={doc.id} className="drawer-doc-card">
                          <div className="doc-icon-box">📄</div>
                          <div className="doc-details">
                            <span className="doc-type-tag">{doc.type}</span>
                            <h5 className="doc-name">{doc.name}</h5>
                            <span className="doc-meta">{doc.uploadedBy} • {doc.uploadedDate} • {doc.fileSize}</span>
                          </div>
                          <button className="doc-download-btn" onClick={() => alert(`Downloading ${doc.name}`)}>⬇ Download</button>
                        </div>
                      ))
                    ) : (<div className="empty-state-card"><p>No statutory documents uploaded for this parcel yet.</p></div>)}
                  </div>
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="drawer-tab-content">
                  <div className="drawer-audit-list">
                    {parcelData.auditTrail && parcelData.auditTrail.length > 0 ? (
                      parcelData.auditTrail.map(aud => (
                        <div key={aud.id} className="audit-card-item">
                          <div className="audit-header"><span className="audit-actor">{aud.actor}</span><span className="audit-time">{aud.timestamp}</span></div>
                          <h5 className="audit-action">{aud.action}</h5>
                          <p className="audit-remarks">{aud.remarks}</p>
                        </div>
                      ))
                    ) : (<div className="empty-state-card"><p>Initial survey logged.</p></div>)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const AnalyticsDashboard = () => {
  const { selectedState, setSelectedState, selectedDistrict, selectedProjectType, selectedStatus, searchQuery, jumpToParcelOnMap, setActiveTab } = useDashboard();
  const [kpis, setKpis] = React.useState(null);
  const [projects, setProjects] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    const filterObj = { stateId: selectedState, districtId: selectedDistrict, type: selectedProjectType, status: selectedStatus, search: searchQuery };
    Promise.all([
      apiService.getKpiStats(filterObj),
      apiService.getProjects(filterObj),
      apiService.getStates()
    ]).then(([kpiData, projData, stateData]) => {
      setKpis(kpiData);
      setProjects(projData);
      setStates(stateData);
      setLoading(false);
    });
  }, [selectedState, selectedDistrict, selectedProjectType, selectedStatus, searchQuery]);

  if (loading || !kpis) {
    return (
      <div className="dash-loading-state">
        <div className="dash-spinner"></div>
        <p>Loading real-time National Land Acquisition intelligence...</p>
      </div>
    );
  }

  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="analytics-dashboard-view">
      <div className="dash-breadcrumb-bar">
        <div className="dash-container breadcrumb-flex">
          <div className="breadcrumb-trail">
            <span className="crumb-item crumb-link" onClick={() => setSelectedState('all')}>🇮🇳 National Cockpit</span>
            {selectedState !== 'all' && (
              <>
                <span className="crumb-sep">›</span>
                <span className="crumb-item active">{states.find(s => s.id === selectedState)?.name || selectedState}</span>
              </>
            )}
          </div>
          <div className="breadcrumb-live-badge"><span className="pulse-dot"></span><span>Live Data Sync (15+ Cadastral Nodes Active)</span></div>
        </div>
      </div>

      <div className="dash-container dash-content-layout">
        <div className="kpi-metrics-grid">
          <div className="kpi-card kpi-card-saffron">
            <div className="kpi-card-header">
              <span className="kpi-label">Total Land Acquired</span>
              <span className="kpi-trend positive">↑ {kpis.acquisitionRate}%</span>
            </div>
            <div className="kpi-main-val">{kpis.totalAcquiredHa.toLocaleString()} <span className="kpi-unit">ha</span></div>
            <div className="kpi-progress-bg"><div className="kpi-progress-bar saffron" style={{ width: `${Math.min(kpis.acquisitionRate, 100)}%` }}></div></div>
            <div className="kpi-footer-meta">Target: <strong>{kpis.totalProposedHa.toLocaleString()} ha</strong></div>
          </div>

          <div className="kpi-card kpi-card-emerald">
            <div className="kpi-card-header">
              <span className="kpi-label">Compensation Disbursed (PFMS)</span>
              <span className="kpi-trend positive">↑ {kpis.disbursalRate}%</span>
            </div>
            <div className="kpi-main-val">₹{kpis.totalCompDisbursedCr.toLocaleString()} <span className="kpi-unit">Cr</span></div>
            <div className="kpi-progress-bg"><div className="kpi-progress-bar emerald" style={{ width: `${Math.min(kpis.disbursalRate, 100)}%` }}></div></div>
            <div className="kpi-footer-meta">Assessed: <strong>₹{kpis.totalCompAssessedCr.toLocaleString()} Cr</strong></div>
          </div>

          <div className="kpi-card kpi-card-navy">
            <div className="kpi-card-header">
              <span className="kpi-label">R&R Resettlement</span>
              <span className={`kpi-trend ${kpis.rrRate < 50 ? 'warning' : 'positive'}`}>{kpis.rrRate}% Resettled</span>
            </div>
            <div className="kpi-main-val">{kpis.totalFamiliesResettled.toLocaleString()} <span className="kpi-unit">Families</span></div>
            <div className="kpi-progress-bg"><div className="kpi-progress-bar navy" style={{ width: `${Math.min(kpis.rrRate, 100)}%` }}></div></div>
            <div className="kpi-footer-meta">Affected: <strong>{kpis.totalFamiliesAffected.toLocaleString()} families</strong></div>
          </div>

          <div className="kpi-card kpi-card-alert" onClick={() => setActiveTab('alerts')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-header">
              <span className="kpi-label">Statutory SLA Compliance</span>
              <span className="kpi-badge-critical">{kpis.activeAlertsCount} Alerts</span>
            </div>
            <div className="kpi-main-val">{kpis.statutoryAdherenceRate}% <span className="kpi-unit">On Schedule</span></div>
            <div className="kpi-footer-meta text-critical">🚨 <strong>{kpis.activeAlertsCount} statutory bottlenecks</strong> require action ›</div>
          </div>
        </div>

        <div className="analytics-charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">State-wise Land Acquisition Progress (ha)</h3>
                <p className="chart-subtitle">Target Area vs. Possessed Area across States</p>
              </div>
              <span className="chart-tag">DILRMP Live</span>
            </div>
            <div className="chart-body">
              <div className="bar-comparison-list">
                {states.map((st) => {
                  const pct = Math.round((st.totalAreaAcquired / st.totalAreaTarget) * 100);
                  return (
                    <div key={st.id} className="bar-comp-item" onClick={() => setSelectedState(st.id)}>
                      <div className="bar-comp-labels">
                        <span className="state-name-label">{st.name} ({st.code})</span>
                        <span className="state-ha-val"><strong>{st.totalAreaAcquired.toLocaleString()} ha</strong> / {st.totalAreaTarget.toLocaleString()} ha ({pct}%)</span>
                      </div>
                      <div className="bar-track"><div className="bar-fill-saffron" style={{ width: `${pct}%` }}></div></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Project Status Distribution</h3>
                <p className="chart-subtitle">Lifecycle Breakdown</p>
              </div>
              <span className="chart-tag">{projects.length} Projects</span>
            </div>
            <div className="chart-body">
              <div className="status-pills-list">
                {Object.entries(statusCounts).map(([statusName, count]) => {
                  let pillClass = 'status-pill-blue';
                  if (statusName.includes('Closed') || statusName.includes('Possession')) pillClass = 'status-pill-green';
                  if (statusName.includes('Disputed') || statusName.includes('Delayed')) pillClass = 'status-pill-red';
                  if (statusName.includes('Proposed') || statusName.includes('Notified')) pillClass = 'status-pill-amber';

                  return (
                    <div key={statusName} className="status-count-row">
                      <span className={`status-dot ${pillClass}`}></span>
                      <span className="status-name">{statusName}</span>
                      <span className="status-badge-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="dash-table-card">
          <div className="table-card-header">
            <div>
              <h3 className="chart-title">High-Impact Infrastructure Projects</h3>
              <p className="chart-subtitle">Click View Map to locate parcels in GIS map</p>
            </div>
            <button className="btn-view-map-cta" onClick={() => setActiveTab('map')}>🗺️ Open Full GIS Map Cockpit</button>
          </div>

          <div className="dash-table-responsive">
            <table className="dash-data-table">
              <thead>
                <tr>
                  <th>Project Name & Sector</th>
                  <th>State & Implementing Agency</th>
                  <th>Target Land (ha)</th>
                  <th>Compensation (Cr)</th>
                  <th>R&R Status</th>
                  <th>Current Stage</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => {
                  const stateObj = states.find(s => s.id === proj.stateId);
                  return (
                    <tr key={proj.id}>
                      <td>
                        <div className="proj-cell-main">
                          <span className="proj-name-text">{proj.name}</span>
                          <span className="proj-sector-tag">{proj.type}</span>
                        </div>
                      </td>
                      <td>
                        <div className="proj-agency-cell">
                          <strong>{stateObj?.name || 'Multi-State'}</strong>
                          <span>{proj.implementingAgency}</span>
                        </div>
                      </td>
                      <td>
                        <div className="ha-stat-cell">
                          <strong>{proj.totalAreaAcquired} ha</strong> / {proj.totalAreaProposed} ha
                          <div className="mini-progress-track"><div className="mini-progress-bar" style={{ width: `${Math.round((proj.totalAreaAcquired / proj.totalAreaProposed) * 100)}%` }}></div></div>
                        </div>
                      </td>
                      <td>
                        <div className="comp-stat-cell">
                          <strong>₹{proj.compensationDisbursed} Cr</strong>
                          <span className="text-muted"> / ₹{proj.compensationAssessed} Cr</span>
                        </div>
                      </td>
                      <td>
                        <div className="rr-stat-cell">
                          <span className={`rr-badge ${proj.rrProgressPct >= 80 ? 'rr-good' : proj.rrProgressPct < 50 ? 'rr-bad' : 'rr-mid'}`}>{proj.rrProgressPct}%</span>
                          <span className="text-sub">({proj.familiesResettled}/{proj.familiesAffected})</span>
                        </div>
                      </td>
                      <td>
                        <span className={`stage-badge-pill ${
                          proj.status.includes('Closed') ? 'badge-closed' :
                          proj.status.includes('Disputed') ? 'badge-disputed' :
                          proj.status.includes('Delayed') ? 'badge-delayed' :
                          proj.status.includes('Possession') ? 'badge-possession' : 'badge-progress'
                        }`}>
                          {proj.status}
                        </span>
                      </td>
                      <td>
                        <button className="table-action-btn" onClick={() => jumpToParcelOnMap(null, proj.stateId, proj.districtIds[0])}>
                          View Map ↗
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const GISMapModule = () => {
  const {
    selectedState, setSelectedState,
    selectedDistrict, setSelectedDistrict,
    selectedStatus,
    searchQuery, setSearchQuery,
    inspectParcelId, openParcelDetail, closeParcelDetail, isParcelDrawerOpen
  } = useDashboard();

  const [parcels, setParcels] = React.useState([]);
  const [states, setStates] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);
  const [activeParcel, setActiveParcel] = React.useState(null);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [layerType, setLayerType] = React.useState('cadastral');

  const mapContainerRef = React.useRef(null);
  const leafletMapRef = React.useRef(null);
  const markersGroupRef = React.useRef(null);

  React.useEffect(() => {
    Promise.all([
      apiService.getStates(),
      apiService.getDistricts(selectedState)
    ]).then(([st, dt]) => {
      setStates(st);
      setDistricts(dt);
    });
  }, [selectedState]);

  React.useEffect(() => {
    apiService.getParcels({
      stateId: selectedState,
      districtId: selectedDistrict,
      status: statusFilter !== 'all' ? statusFilter : selectedStatus,
      search: searchQuery
    }).then((data) => {
      setParcels(data);
      if (data.length > 0 && !inspectParcelId) {
        setActiveParcel(data[0]);
      }
    });
  }, [selectedState, selectedDistrict, selectedStatus, statusFilter, searchQuery, inspectParcelId]);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.L && mapContainerRef.current && !leafletMapRef.current) {
      try {
        const map = window.L.map(mapContainerRef.current, {
          center: [21.7679, 78.8718],
          zoom: 5,
          zoomControl: false
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap | BhoomiSetu GIS'
        }).addTo(map);

        window.L.control.zoom({ position: 'topright' }).addTo(map);
        const mg = window.L.layerGroup().addTo(map);
        leafletMapRef.current = map;
        markersGroupRef.current = mg;
      } catch (e) {
        console.warn(e);
      }
    }
  }, []);

  React.useEffect(() => {
    if (leafletMapRef.current && markersGroupRef.current && window.L) {
      markersGroupRef.current.clearLayers();
      parcels.forEach((pcl) => {
        let color = '#2563eb';
        if (pcl.status.includes('Disputed')) color = '#dc2626';
        else if (pcl.status.includes('Closed') || pcl.status.includes('Possession')) color = '#16a34a';
        else if (pcl.status.includes('Delayed')) color = '#d97706';

        const customIcon = window.L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: ${color}; width: 26px; height: 26px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 10px; font-weight: bold;">📍</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = window.L.marker([pcl.lat, pcl.lng], { icon: customIcon });
        marker.bindPopup(`<b>Survey Plot #${pcl.surveyNumber}</b><br/>ULPIN: ${pcl.ulpin}<br/>Status: <b>${pcl.status}</b><br/>Area: <b>${pcl.areaHa} ha</b>`);
        marker.on('click', () => {
          setActiveParcel(pcl);
          openParcelDetail(pcl.id);
        });
        marker.addTo(markersGroupRef.current);
      });
    }
  }, [parcels]);

  const getStatusColor = (st) => {
    if (st.includes('Disputed')) return 'color-red';
    if (st.includes('Closed') || st.includes('Possession')) return 'color-green';
    if (st.includes('Delayed') || st.includes('Pending')) return 'color-amber';
    return 'color-blue';
  };

  return (
    <div className="gis-map-module-view">
      <div className="gis-floating-topbar">
        <div className="gis-topbar-pill-card">
          <div className="gis-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" /></svg>
            <input type="text" className="gis-search-input" placeholder="Search Survey #, ULPIN, Landowner..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="gis-pills-row">
            <select className="gis-pill-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
              <option value="all">📍 All States (National)</option>
              {states.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
            </select>
            <select className="gis-pill-select" value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={districts.length === 0}>
              <option value="all">District: All</option>
              {districts.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
            </select>
            <div className="gis-layer-toggles">
              <button className={`layer-btn ${layerType === 'cadastral' ? 'active' : ''}`} onClick={() => setLayerType('cadastral')}>🗺️ Cadastral</button>
              <button className={`layer-btn ${layerType === 'satellite' ? 'active' : ''}`} onClick={() => setLayerType('satellite')}>🛰️ Satellite</button>
            </div>
          </div>
        </div>
      </div>

      <div className="gis-floating-left-panel">
        <div className="gis-category-card">
          <div className="category-card-header">
            <h4>Acquisition Status Filter</h4>
            <span className="total-badge">{parcels.length} Parcels</span>
          </div>
          <div className="status-accordion-list">
            <div className={`status-filter-item ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
              <span className="status-indicator-dot dot-all"></span><span className="status-title">All Stages</span><span className="count-tag">{parcels.length}</span>
            </div>
            <div className={`status-filter-item ${statusFilter === 'Possession Taken' ? 'active' : ''}`} onClick={() => setStatusFilter('Possession Taken')}>
              <span className="status-indicator-dot dot-green"></span><span className="status-title">Possession Taken</span><span className="count-tag">{parcels.filter(p => p.status.includes('Possession') || p.status.includes('Closed')).length}</span>
            </div>
            <div className={`status-filter-item ${statusFilter === 'Award Declared' ? 'active' : ''}`} onClick={() => setStatusFilter('Award Declared')}>
              <span className="status-indicator-dot dot-blue"></span><span className="status-title">Award Declared</span><span className="count-tag">{parcels.filter(p => p.status.includes('Award') || p.status.includes('Disbursed')).length}</span>
            </div>
            <div className={`status-filter-item ${statusFilter === 'Notified' ? 'active' : ''}`} onClick={() => setStatusFilter('Notified')}>
              <span className="status-indicator-dot dot-amber"></span><span className="status-title">Statutory Notified</span><span className="count-tag">{parcels.filter(p => p.status.includes('Notified') || p.status.includes('Proposed')).length}</span>
            </div>
            <div className={`status-filter-item ${statusFilter === 'Disputed / Legal Hold' ? 'active' : ''}`} onClick={() => setStatusFilter('Disputed / Legal Hold')}>
              <span className="status-indicator-dot dot-red"></span><span className="status-title">Legal Stay / Disputed</span><span className="count-tag">{parcels.filter(p => p.status.includes('Disputed') || p.status.includes('Delayed')).length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="gis-map-canvas-container" ref={mapContainerRef}>
        <div className="gis-vector-overlay">
          <div className="interactive-map-hud">
            {parcels.map((p) => (
              <div
                key={p.id}
                className={`vector-parcel-pin ${getStatusColor(p.status)} ${activeParcel?.id === p.id ? 'selected' : ''}`}
                style={{
                  left: `${Math.max(10, Math.min(85, ((p.lng - 68) / (88 - 68)) * 100))}%`,
                  top: `${Math.max(15, Math.min(80, ((32 - p.lat) / (32 - 10)) * 100))}%`
                }}
                onClick={() => { setActiveParcel(p); openParcelDetail(p.id); }}
              >
                <div className="pin-badge">Plot #{p.surveyNumber}</div>
                <div className="pin-dot"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="gis-floating-bottom-strip">
        <div className="bottom-cards-scroll">
          {parcels.map((p) => (
            <div key={p.id} className={`gis-parcel-card ${activeParcel?.id === p.id ? 'active-card' : ''}`} onClick={() => { setActiveParcel(p); openParcelDetail(p.id); }}>
              <div className="pcl-card-top">
                <span className="pcl-survey-no">Survey #{p.surveyNumber}</span>
                <span className={`pcl-status-tag ${getStatusColor(p.status)}`}>{p.status}</span>
              </div>
              <div className="pcl-card-mid">
                <div className="pcl-owner-text">{p.ownerName}</div>
                <div className="pcl-ulpin-text">ULPIN: {p.ulpin}</div>
              </div>
              <div className="pcl-card-bottom">
                <span>Area: <strong>{p.areaHa} ha</strong></span>
                <span>Comp: <strong>₹{p.compensationAssessed} Cr</strong></span>
                <button className="pcl-inspect-btn">Inspect ›</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ParcelDetailDrawer parcelId={inspectParcelId || activeParcel?.id} isOpen={isParcelDrawerOpen} onClose={closeParcelDetail} />
    </div>
  );
};

const WorkflowTracker = () => {
  const { selectedProject, setSelectedProject, jumpToParcelOnMap } = useDashboard();
  const [projects, setProjects] = React.useState([]);
  const [activeProject, setActiveProject] = React.useState(null);
  const [parcels, setParcels] = React.useState([]);

  React.useEffect(() => {
    apiService.getProjects().then((data) => {
      setProjects(data);
      if (selectedProject !== 'all') {
        const found = data.find(p => p.id === selectedProject);
        setActiveProject(found || data[0]);
      } else if (data.length > 0) {
        setActiveProject(data[0]);
      }
    });
  }, [selectedProject]);

  React.useEffect(() => {
    if (activeProject) {
      apiService.getParcels({ projectId: activeProject.id }).then(setParcels);
    }
  }, [activeProject]);

  return (
    <div className="workflow-tracker-view">
      <div className="dash-container">
        <div className="module-banner-header">
          <div className="module-title-box">
            <h2>Statutory Land Acquisition Workflow Stepper</h2>
            <p>End-to-End lifecycle tracking from Project Proposal to Final RoR Mutation (RFCTLARR Act 2013 & NH Act 1956)</p>
          </div>
          <div className="project-selector-wrap">
            <label className="proj-select-label">Select Project:</label>
            <select
              className="proj-switcher-dropdown"
              value={activeProject?.id || ''}
              onChange={(e) => {
                const p = projects.find(item => item.id === e.target.value);
                setActiveProject(p);
                setSelectedProject(p.id);
              }}
            >
              {projects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
            </select>
          </div>
        </div>

        {activeProject && (
          <>
            <div className="workflow-project-hero-card">
              <div className="hero-left-details">
                <span className="hero-sector-badge">{activeProject.type}</span>
                <h3>{activeProject.name}</h3>
                <p className="hero-agency-text">Agency: <strong>{activeProject.implementingAgency}</strong> | Target: <strong>{activeProject.targetClosureDate}</strong></p>
                <div className="hero-stats-row">
                  <div className="hero-stat-pill"><span>Target Area:</span> <strong>{activeProject.totalAreaProposed} ha</strong></div>
                  <div className="hero-stat-pill"><span>Acquired:</span> <strong>{activeProject.totalAreaAcquired} ha</strong></div>
                  <div className="hero-stat-pill"><span>Compensation:</span> <strong>₹{activeProject.compensationDisbursed} / ₹{activeProject.compensationAssessed} Cr</strong></div>
                  <div className="hero-stat-pill"><span>R&R:</span> <strong>{activeProject.rrProgressPct}%</strong></div>
                </div>
              </div>
              <div className="hero-right-status">
                <span className="current-stage-title">Current Stage:</span>
                <div className="stage-highlight-box">
                  <span className="stage-num">Stage {activeProject.currentStageIndex + 1} of 8</span>
                  <div className="stage-name">{WORKFLOW_STAGES[activeProject.currentStageIndex]?.name || activeProject.status}</div>
                </div>
              </div>
            </div>

            <div className="workflow-stepper-container">
              <h3 className="section-block-title">Statutory Progression</h3>
              <div className="stepper-horizontal-bar">
                {WORKFLOW_STAGES.map((stage, idx) => {
                  const isDone = idx < activeProject.currentStageIndex;
                  const isCurrent = idx === activeProject.currentStageIndex;
                  return (
                    <div key={stage.id} className={`stepper-node ${isDone ? 'step-completed' : isCurrent ? 'step-current' : 'step-pending'}`}>
                      <div className="node-circle">{isDone ? '✓' : idx + 1}</div>
                      <div className="node-content"><span className="node-short-name">{stage.shortName}</span><span className="node-sla">SLA: {stage.slaDays}d</span></div>
                      {idx < WORKFLOW_STAGES.length - 1 && <div className="node-connector"></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="workflow-cases-section">
              <div className="cases-header-flex">
                <h3>Cadastral Survey Parcels in this Project</h3>
                <span className="cases-count-tag">{parcels.length} Registered Plots</span>
              </div>
              <div className="cases-cards-stack">
                {parcels.map((pcl) => (
                  <div key={pcl.id} className="case-card-item">
                    <div className="case-card-header">
                      <div className="case-title-area">
                        <div className="case-icon-box">📌</div>
                        <div>
                          <div className="case-code-row"><span className="case-ulpin">ULPIN: {pcl.ulpin}</span><span className="case-survey">Survey #{pcl.surveyNumber}</span></div>
                          <h4 className="case-title">Land Title: {pcl.ownerName} ({pcl.ownerType})</h4>
                        </div>
                      </div>
                      <div className="case-badges-area">
                        {pcl.slaDelayedDays > 0 ? (
                          <span className="badge-overdue">• {pcl.slaDelayedDays} days overdue</span>
                        ) : (
                          <span className="badge-ontime">• On Schedule</span>
                        )}
                        <span className={`case-status-badge ${pcl.status.includes('Closed') ? 'st-green' : pcl.status.includes('Disputed') ? 'st-red' : 'st-blue'}`}>{pcl.status}</span>
                      </div>
                    </div>
                    <div className="case-card-grid">
                      <div className="case-meta-col"><span className="meta-label">Area</span><span className="meta-val"><strong>{pcl.areaHa} ha</strong></span></div>
                      <div className="case-meta-col"><span className="meta-label">Compensation</span><span className="meta-val"><strong>₹{pcl.compensationAssessed} Cr</strong></span></div>
                      <div className="case-meta-col"><span className="meta-label">R&R Progress</span><span className="meta-val"><strong>{pcl.rrProgressPct}%</strong></span></div>
                      <div className="case-meta-col"><span className="meta-label">Legal Status</span><span className="meta-val text-truncate">{pcl.legalStatus}</span></div>
                    </div>
                    <div className="case-card-footer">
                      <button className="btn-track-parcel" onClick={() => jumpToParcelOnMap(pcl.id, pcl.stateId, pcl.districtId)}>🗺️ Locate on GIS Map</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AlertsPanel = () => {
  const { jumpToParcelOnMap } = useDashboard();
  const [alerts, setAlerts] = React.useState([]);
  const [activeSeverity, setActiveSeverity] = React.useState('all');

  React.useEffect(() => {
    apiService.getAlerts(activeSeverity).then(setAlerts);
  }, [activeSeverity]);

  return (
    <div className="alerts-panel-view">
      <div className="dash-container">
        <div className="module-banner-header">
          <div className="module-title-box">
            <h2>Statutory SLA & Automated Monitoring Engine</h2>
            <p>Real-time rule engine detecting statutory delays, pending CALA awards, and PFMS disbursal lags.</p>
          </div>
          <div className="severity-filter-pills">
            <button className={`sev-pill ${activeSeverity === 'all' ? 'active' : ''}`} onClick={() => setActiveSeverity('all')}>All Alerts ({alerts.length})</button>
            <button className={`sev-pill sev-critical ${activeSeverity === 'critical' ? 'active' : ''}`} onClick={() => setActiveSeverity('critical')}>🚨 Critical</button>
            <button className={`sev-pill sev-high ${activeSeverity === 'high' ? 'active' : ''}`} onClick={() => setActiveSeverity('high')}>⚠️ High</button>
          </div>
        </div>

        <div className="alerts-cards-grid">
          {alerts.map((alt) => (
            <div key={alt.id} className={`alert-card-item ${alt.severity === 'critical' ? 'card-critical' : alt.severity === 'high' ? 'card-high' : 'card-medium'}`}>
              <div className="alert-card-topbar">
                <div className="alert-rule-tag"><span>{alt.severity === 'critical' ? '🚨' : '⚠️'}</span><span>{alt.ruleCategory}</span></div>
                <span className="alert-date-badge">Logged: {alt.createdDate}</span>
              </div>
              <h3 className="alert-title-text">{alt.title}</h3>
              <p className="alert-message-text">{alt.message}</p>
              <div className="alert-action-box">
                <div className="action-required-label"><strong>Action:</strong><span>{alt.actionRequired}</span></div>
                <button className="btn-resolve-alert" onClick={() => jumpToParcelOnMap(alt.relatedId)}>🗺️ Inspect in GIS Cockpit →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DocumentRepository = () => {
  const [documents, setDocuments] = React.useState([]);
  const [filterType, setFilterType] = React.useState('all');
  const [searchDoc, setSearchDoc] = React.useState('');
  const [previewDoc, setPreviewDoc] = React.useState(null);

  React.useEffect(() => {
    apiService.getDocuments().then(setDocuments);
  }, []);

  const filteredDocs = documents.filter(d => {
    const matchesType = filterType === 'all' || d.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch = searchDoc === '' || d.name.toLowerCase().includes(searchDoc.toLowerCase()) || d.type.toLowerCase().includes(searchDoc.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="document-repo-view">
      <div className="dash-container">
        <div className="module-banner-header">
          <div className="module-title-box">
            <h2>Statutory Document & Gazette Repository</h2>
            <p>Cryptographically signed Gazette Notifications, CALA Award Declarations, and Form-G Possession Certificates.</p>
          </div>
          <button className="btn-primary-upload" onClick={() => alert('Connect secure NIC S3/e-Sign document vault to enable live multi-party gazette uploads.')}>📤 Upload Statutory Order</button>
        </div>

        <div className="doc-search-filter-card">
          <div className="doc-search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z" /></svg>
            <input type="text" placeholder="Search files..." value={searchDoc} onChange={(e) => setSearchDoc(e.target.value)} />
          </div>
          <div className="doc-category-pills">
            <button className={`doc-pill ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All ({documents.length})</button>
            <button className={`doc-pill ${filterType === 'Notification' ? 'active' : ''}`} onClick={() => setFilterType('Notification')}>Notifications</button>
            <button className={`doc-pill ${filterType === 'Award' ? 'active' : ''}`} onClick={() => setFilterType('Award')}>Awards</button>
            <button className={`doc-pill ${filterType === 'Possession' ? 'active' : ''}`} onClick={() => setFilterType('Possession')}>Possession</button>
          </div>
        </div>

        <div className="dash-table-card">
          <div className="dash-table-responsive">
            <table className="dash-data-table">
              <thead>
                <tr>
                  <th>Title & Type</th>
                  <th>Version</th>
                  <th>Issuing Authority</th>
                  <th>Date</th>
                  <th>Verification</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-row-title">
                        <span className="doc-file-icon">📄</span>
                        <div><strong>{doc.name}</strong><br/><span className="doc-type-badge">{doc.type}</span></div>
                      </div>
                    </td>
                    <td><span className="doc-ver-pill">{doc.version}</span></td>
                    <td>{doc.uploadedBy}</td>
                    <td>{doc.uploadedDate}</td>
                    <td><span className="doc-verified-badge">🛡️ Verified</span></td>
                    <td><button className="btn-doc-preview" onClick={() => setPreviewDoc(doc)}>👁️ Preview</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {previewDoc && (
          <div className="doc-modal-backdrop" onClick={() => setPreviewDoc(null)}>
            <div className="doc-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="doc-modal-header">
                <div><h3>{previewDoc.name}</h3><span>{previewDoc.type} • {previewDoc.uploadedBy}</span></div>
                <button className="doc-modal-close" onClick={() => setPreviewDoc(null)}>✕</button>
              </div>
              <div className="doc-modal-body">
                <div className="document-sample-viewer">
                  <div className="sample-gazette-header">
                    <h4>THE GAZETTE OF INDIA : EXTRAORDINARY</h4>
                    <h5>MINISTRY OF ROAD TRANSPORT AND HIGHWAYS / DILRMP</h5>
                  </div>
                  <div className="sample-gazette-content">
                    <p><strong>NOTIFICATION:</strong> Section 3A / Section 11 Statutory Acquisition Gazette Record.</p>
                  </div>
                </div>
              </div>
              <div className="doc-modal-footer">
                <button className="btn-secondary" onClick={() => setPreviewDoc(null)}>Close</button>
                <button className="btn-primary" onClick={() => alert(`Downloading certified copy of ${previewDoc.name}`)}>⬇ Download PDF</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReportsBuilder = () => {
  const [states, setStates] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);
  const [selectedState, setSelectedState] = React.useState('all');
  const [selectedDistrict, setSelectedDistrict] = React.useState('all');
  const [selectedType, setSelectedType] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [reportData, setReportData] = React.useState([]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [hasGenerated, setHasGenerated] = React.useState(false);

  React.useEffect(() => {
    apiService.getStates().then(setStates);
  }, []);

  React.useEffect(() => {
    apiService.getDistricts(selectedState).then(setDistricts);
    setSelectedDistrict('all');
  }, [selectedState]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const data = await apiService.generateReport({
      stateId: selectedState,
      districtId: selectedDistrict,
      type: selectedType,
      status: selectedStatus
    });
    setReportData(data);
    setIsGenerating(false);
    setHasGenerated(true);
  };

  const downloadCSV = () => {
    if (reportData.length === 0) return;
    const headers = ['Sr No', 'Survey No', 'ULPIN', 'State', 'District', 'Project', 'Area (ha)', 'Landowner', 'Status', 'Comp (Cr)', 'R&R (%)'];
    const rows = reportData.map(r => [r.srNo, `"${r.surveyNo}"`, `"${r.ulpin}"`, `"${r.state}"`, `"${r.district}"`, `"${r.projectName}"`, r.areaHa, `"${r.ownerName}"`, `"${r.status}"`, r.compAssessedCr, `${r.rrPct}%`]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BhoomiSetu_MIS_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="reports-builder-view">
      <div className="dash-container">
        <div className="module-banner-header">
          <div className="module-title-box">
            <h2>Custom MIS Report Generator & Data Export</h2>
            <p>Generate filtered land acquisition audit reports and direct benefit logs with instant CSV export.</p>
          </div>
        </div>

        <div className="report-filter-builder-card">
          <h3 className="builder-title">Query Parameters</h3>
          <div className="builder-grid">
            <div className="builder-field">
              <label>State Scope</label>
              <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                <option value="all">All States (National)</option>
                {states.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
              </select>
            </div>
            <div className="builder-field">
              <label>District Scope</label>
              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={districts.length === 0}>
                <option value="all">All Districts</option>
                {districts.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
              </select>
            </div>
            <div className="builder-field">
              <label>Sector</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="all">All Sectors</option>
                {Object.values(PROJECT_TYPES).map(t => (<option key={t} value={t}>{t}</option>))}
              </select>
            </div>
            <div className="builder-field">
              <label>Status</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="all">All Statuses</option>
                {Object.values(PARCEL_STATUSES).map(st => (<option key={st} value={st}>{st}</option>))}
              </select>
            </div>
          </div>
          <div className="builder-actions-row">
            <button className="btn-generate-report" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Querying...' : '📊 Run Query & Generate'}
            </button>
            {hasGenerated && reportData.length > 0 && (
              <button className="btn-download-csv" onClick={downloadCSV}>⬇ Download CSV ({reportData.length} records)</button>
            )}
          </div>
        </div>

        {hasGenerated && (
          <div className="dash-table-card">
            <div className="table-card-header">
              <h3>Generated MIS Table ({reportData.length} records)</h3>
              <button className="btn-download-csv-sm" onClick={downloadCSV}>⬇ Export CSV</button>
            </div>
            <div className="dash-table-responsive">
              <table className="dash-data-table">
                <thead>
                  <tr>
                    <th>Sr</th><th>Survey #</th><th>Location</th><th>Project</th><th>Area</th><th>Landowner</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map(r => (
                    <tr key={r.parcelId}>
                      <td>{r.srNo}</td>
                      <td><strong>Plot #{r.surveyNo}</strong></td>
                      <td>{r.district}, {r.state}</td>
                      <td>{r.projectName}</td>
                      <td>{r.areaHa} ha</td>
                      <td>{r.ownerName}</td>
                      <td><span className="stage-badge-pill badge-progress">{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const IntegrationHub = () => {
  const [integrations, setIntegrations] = React.useState([]);
  const [activePayload, setActivePayload] = React.useState(null);

  React.useEffect(() => {
    apiService.getIntegrations().then(setIntegrations);
  }, []);

  return (
    <div className="integration-hub-view">
      <div className="dash-container">
        <div className="module-banner-header">
          <div className="module-title-box">
            <h2>National Interoperability & Integration Gateway</h2>
            <p>Unified bridge connecting State Cadastral Repositories (DILRMP), PFMS Treasury, BhuNaksha GIS, and PM Gati Shakti NMP.</p>
          </div>
        </div>

        <div className="integrations-grid">
          {integrations.map((intg) => (
            <div key={intg.id} className="integration-card-item">
              <div className="intg-card-header">
                <div>
                  <span className="intg-protocol-tag">{intg.protocol}</span>
                  <h3 className="intg-title">{intg.name}</h3>
                </div>
                <div className="intg-status-badge"><span className="live-ping-dot"></span><span>{intg.status}</span></div>
              </div>
              <p className="intg-desc">{intg.description}</p>
              <div className="intg-metrics-strip">
                <div className="intg-metric"><span className="m-label">Uptime</span><strong className="m-val text-green">{intg.uptime}</strong></div>
                <div className="intg-metric"><span className="m-label">Throughput</span><strong className="m-val">{intg.recordsSynced}</strong></div>
                <div className="intg-metric"><span className="m-label">Pulse</span><strong className="m-val">{intg.lastSync}</strong></div>
              </div>
              <button className="btn-inspect-payload" onClick={() => setActivePayload(intg)}>⚡ Inspect Live API Payload Schema</button>
            </div>
          ))}
        </div>

        {activePayload && (
          <div className="doc-modal-backdrop" onClick={() => setActivePayload(null)}>
            <div className="doc-modal-dialog payload-modal" onClick={(e) => e.stopPropagation()}>
              <div className="doc-modal-header">
                <div><h3>{activePayload.name}</h3><span>{activePayload.protocol}</span></div>
                <button className="doc-modal-close" onClick={() => setActivePayload(null)}>✕</button>
              </div>
              <div className="doc-modal-body">
                <div className="payload-json-viewer">
                  <pre>{JSON.stringify(activePayload.samplePayload, null, 2)}</pre>
                </div>
              </div>
              <div className="doc-modal-footer">
                <button className="btn-secondary" onClick={() => setActivePayload(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardSidebar = () => {
  const {
    activeTab,
    setActiveTab,
    activeRole,
    handleRoleChange,
    setAppMode,
    isSidebarCollapsed,
    toggleSidebar
  } = useDashboard();
  const { lang, setLang } = useLanguage();

  const navGroups = [
    {
      group: 'Analytics & Spatial',
      items: [
        { id: 'analytics', label: 'Executive Overview', icon: '📊' },
        { id: 'map', label: 'GIS Spatial Cockpit', icon: '🗺️', badge: 'LIVE GPS', badgeClass: 'nav-badge-live' },
        { id: 'workflow', label: 'RFCTLARR Workflow', icon: '📋', badge: '9 Stages' }
      ]
    },
    {
      group: 'Governance & Operations',
      items: [
        { id: 'alerts', label: 'Critical Alerts & SLA', icon: '🔔', badge: '5 High', badgeClass: 'nav-badge-count' },
        { id: 'documents', label: 'Document Repository', icon: '📁' },
        { id: 'reports', label: 'Reports & Export', icon: '📑' },
        { id: 'integrations', label: 'PM GatiShakti Hub', icon: '⚡', badge: 'Active', badgeClass: 'nav-badge-live' }
      ]
    }
  ];

  return (
    <aside className={`dash-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Branding Header */}
      <div className="sidebar-header">
        <div className="sidebar-brand-group">
          <img src="./assets/images/emblems/national-emblem.png" alt="National Emblem" className="sidebar-emblem" />
          <div>
            <div className="sidebar-brand-title">Bhoomi<span>Setu</span></div>
            <span className="sidebar-live-pill">ENTERPRISE</span>
          </div>
        </div>
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label="Toggle Sidebar"
        >
          {isSidebarCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* Officer Persona Profile Card */}
      <div className="sidebar-persona-card" title={isSidebarCollapsed ? `${activeRole?.name} (${activeRole?.title})` : ''}>
        <div className="persona-profile-row">
          <div className="persona-avatar-wrap">
            <span>{activeRole?.name ? activeRole.name.charAt(0) : '👤'}</span>
            <span className="avatar-online-dot"></span>
          </div>
          <div className="persona-details">
            <div className="persona-name">{activeRole?.name || 'Officer'}</div>
            <span className="persona-role-label">{activeRole?.title || 'Administrator'}</span>
          </div>
        </div>
        <select
          className="persona-dropdown-select"
          value={activeRole?.id}
          onChange={(e) => handleRoleChange(e.target.value)}
          aria-label="Switch Officer Persona"
        >
          {PERSONA_ROLES.map((role) => (
            <option key={role.id} value={role.id}>
              Switch: {role.name} ({role.state})
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Groups */}
      <div className="sidebar-nav-scroll">
        {navGroups.map((grp, idx) => (
          <div key={idx} className="sidebar-nav-section">
            <div className="nav-section-label">{grp.group}</div>
            {grp.items.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  title={isSidebarCollapsed ? item.label : ''}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && (
                    <span className={item.badgeClass || 'nav-badge-count'}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Sidebar Footer Controls */}
      <div className="sidebar-footer">
        <div className="sidebar-lang-row">
          <span>Lang:</span>
          <div className="sidebar-lang-pills">
            <button
              className={`sidebar-lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              className={`sidebar-lang-btn ${lang === 'hi' ? 'active' : ''}`}
              onClick={() => setLang('hi')}
            >
              हिन्दी
            </button>
          </div>
        </div>

        <button
          className="sidebar-exit-btn"
          onClick={() => setAppMode('landing')}
          title="Return to Public BhoomiSetu Portal"
        >
          <span>←</span>
          <span>Back to Portal</span>
        </button>
      </div>
    </aside>
  );
};

const DashboardTopNav = () => {
  const {
    activeTab,
    setActiveTab,
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedProjectType,
    setSelectedProjectType,
    searchQuery,
    setSearchQuery,
    resetFilters,
    toggleSidebar,
    isSidebarCollapsed
  } = useDashboard();

  const tabTitles = {
    analytics: { title: 'Acquisition Analytics', icon: '📊' },
    map: { title: 'GIS Spatial Geo-Viewer', icon: '🗺️' },
    workflow: { title: 'Statutory RFCTLARR Workflow', icon: '📋' },
    alerts: { title: 'SLA Breach & Critical Alerts', icon: '🔔' },
    documents: { title: 'Land Records & Documents', icon: '📁' },
    reports: { title: 'Parliamentary & Executive Reports', icon: '📑' },
    integrations: { title: 'PM GatiShakti Multi-Modal Hub', icon: '⚡' }
  };

  const currentTabInfo = tabTitles[activeTab] || { title: 'Dashboard', icon: '📊' };

  const availableDistricts = selectedState === 'all'
    ? SEED_DISTRICTS
    : SEED_DISTRICTS.filter(d => d.stateId === selectedState);

  const hasActiveFilters = selectedState !== 'all' || selectedDistrict !== 'all' || selectedProjectType !== 'all' || searchQuery !== '';

  return (
    <header className="dash-top-navbar">
      <div className="top-nav-left">
        <button
          className="top-hamburger-btn"
          onClick={toggleSidebar}
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar to widen workspace'}
          aria-label="Toggle Sidebar"
        >
          ☰
        </button>
        <div className="page-title-badge">
          <span>{currentTabInfo.icon}</span>
          <span>{currentTabInfo.title}</span>
        </div>
        <div className="top-node-status">
          <span className="live-pulse-dot"></span>
          <span>NIC Cloud (18ms)</span>
        </div>
      </div>

      <div className="top-nav-filters">
        {/* Global Search */}
        <div className="top-search-wrap">
          <span className="top-search-icon">🔍</span>
          <input
            type="text"
            className="top-search-input"
            placeholder="Search parcel, project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* State Filter */}
        <select
          className="top-filter-select"
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedDistrict('all');
          }}
          aria-label="Filter by State"
        >
          <option value="all">All States</option>
          {SEED_STATES.map((st) => (
            <option key={st.id} value={st.id}>{st.name}</option>
          ))}
        </select>

        {/* District Filter */}
        <select
          className="top-filter-select"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          aria-label="Filter by District"
        >
          <option value="all">All Districts</option>
          {availableDistricts.map((dist) => (
            <option key={dist.id} value={dist.id}>{dist.name}</option>
          ))}
        </select>

        {/* Project Type Filter */}
        <select
          className="top-filter-select"
          value={selectedProjectType}
          onChange={(e) => setSelectedProjectType(e.target.value)}
          aria-label="Filter by Sector"
        >
          <option value="all">All Sectors</option>
          {Object.values(PROJECT_TYPES).map((pt) => (
            <option key={pt} value={pt}>{pt}</option>
          ))}
        </select>

        {/* Reset Filter button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="btn-text-reset"
            style={{
              background: '#e2e8f0',
              border: 'none',
              padding: '5px 8px',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="Clear all filters"
          >
            ✕ Reset
          </button>
        )}

        {/* Alerts Button */}
        <button
          className="top-alert-bell-btn"
          onClick={() => setActiveTab('alerts')}
          title="View SLA Alerts"
        >
          <span>🔔</span>
          <span>5 Alerts</span>
        </button>
      </div>
    </header>
  );
};

const EnterpriseDashboard = () => {
  const { activeTab } = useDashboard();
  return (
    <div className="bhoomisetu-dashboard-root">
      {/* 1. Left Sidebar Navigation */}
      <DashboardSidebar />

      {/* 2. Main Content Area */}
      <div className="dash-content-area">
        {/* Top Navbar */}
        <DashboardTopNav />

        {/* Scrollable Viewport */}
        <div className={`dash-view-scrollable ${activeTab === 'map' ? 'map-no-scroll' : ''}`}>
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'map' && <GISMapModule />}
          {activeTab === 'workflow' && <WorkflowTracker />}
          {activeTab === 'alerts' && <AlertsPanel />}
          {activeTab === 'documents' && <DocumentRepository />}
          {activeTab === 'reports' && <ReportsBuilder />}
          {activeTab === 'integrations' && <IntegrationHub />}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. ROOT APP COMPONENT
// ==========================================

const MainAppContent = () => {
  const { appMode, setAppMode, setActiveTab } = useDashboard();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchInitialQuery, setSearchInitialQuery] = React.useState('');

  const handleOpenSearch = (query = '') => {
    setSearchInitialQuery(query);
    setIsSearchOpen(true);
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
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} initialQuery={searchInitialQuery} />
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
