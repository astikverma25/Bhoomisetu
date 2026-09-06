/**
 * Language Switcher Module
 * Handles dynamic swapping between English and Hindi translations across all page sections.
 */
import { contentEn } from '../data/content-en.js';
import { contentHi } from '../data/content-hi.js';

export class LanguageToggle {
  constructor(options = {}) {
    this.selectEl = document.getElementById(options.selectorId || 'languageSelect');
    this.currentLang = 'en';
    this.onLanguageChangeCallbacks = [];

    this.init();
  }

  init() {
    if (!this.selectEl) return;

    this.selectEl.addEventListener('change', (e) => {
      this.setLanguage(e.target.value);
    });
  }

  onLanguageChange(callback) {
    if (typeof callback === 'function') {
      this.onLanguageChangeCallbacks.push(callback);
    }
  }

  setLanguage(lang) {
    this.currentLang = lang;
    const data = lang === 'hi' ? contentHi : contentEn;
    
    // Update HTML lang attribute
    document.documentElement.lang = data.meta.lang;
    
    // Update Topbar
    const helplineEl = document.getElementById('topbarHelpline');
    if (helplineEl) helplineEl.textContent = data.meta.helpline;

    // Update Nav Links
    const navMapping = {
      'navHome': data.nav.home,
      'navAbout': data.nav.about,
      'navServices': data.nav.services,
      'navCitizen': data.nav.citizenCorner,
      'navSchemes': data.nav.schemes,
      'navCirculars': data.nav.circulars,
      'navMedia': data.nav.media,
      'navGrievance': data.nav.grievance,
      'navContact': data.nav.contact
    };
    for (const [id, text] of Object.entries(navMapping)) {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    }

    // Update Azadi Banner
    const akamHeading = document.getElementById('akamHeading');
    const akamSubheading = document.getElementById('akamSubheading');
    if (akamHeading) akamHeading.textContent = data.azadiBanner.heading;
    if (akamSubheading) akamSubheading.textContent = data.azadiBanner.subheading;

    // Update About Section
    const aboutTitle = document.getElementById('aboutSectionTitle');
    const aboutSubtitle = document.getElementById('aboutSectionSubtitle');
    if (aboutTitle) aboutTitle.textContent = data.about.sectionTitle;
    if (aboutSubtitle) aboutSubtitle.textContent = data.about.sectionSubtitle;

    // Update About Tab Button Labels
    data.about.tabs.forEach(tab => {
      const btn = document.querySelector(`.about-tab-btn[data-tab="${tab.id}"] span`);
      if (btn) btn.textContent = tab.title;
    });

    // Update Services Section
    const servicesTitle = document.getElementById('servicesSectionTitle');
    const servicesSubtitle = document.getElementById('servicesSectionSubtitle');
    if (servicesTitle) servicesTitle.textContent = data.services.sectionTitle;
    if (servicesSubtitle) servicesSubtitle.textContent = data.services.sectionSubtitle;

    // Update Service Cards
    data.services.items.forEach((item, idx) => {
      const cardTitle = document.getElementById(`serviceCardTitle${idx + 1}`);
      const cardDesc = document.getElementById(`serviceCardDesc${idx + 1}`);
      const cardLink = document.getElementById(`serviceCardLink${idx + 1}`);
      if (cardTitle) cardTitle.textContent = item.title;
      if (cardDesc) cardDesc.textContent = item.desc;
      if (cardLink) cardLink.textContent = item.linkText;
    });

    // Update Gallery Section Titles
    const galleryTitle = document.getElementById('galleryTitle');
    const gallerySubtitle = document.getElementById('gallerySubtitle');
    if (galleryTitle) galleryTitle.textContent = data.gallery.title;
    if (gallerySubtitle) gallerySubtitle.textContent = data.gallery.subtitle;

    // Update Useful Links Title
    const usefulLinksTitle = document.getElementById('usefulLinksTitle');
    if (usefulLinksTitle) usefulLinksTitle.textContent = data.usefulLinks.title;

    // Trigger registered callbacks
    this.onLanguageChangeCallbacks.forEach(cb => cb(data));
  }

  getCurrentData() {
    return this.currentLang === 'hi' ? contentHi : contentEn;
  }
}
