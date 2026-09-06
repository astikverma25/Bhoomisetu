/**
 * BhoomiSetu Portal Application Entry Point
 * Initializes all modular components, event listeners, and data providers.
 */
import { HeroSlider } from './modules/hero-slider.js';
import { TabManager } from './modules/tab-manager.js';
import { GallerySlider } from './modules/gallery-slider.js';
import { FeedRenderer } from './modules/feed-renderer.js';
import { LanguageToggle } from './modules/language-toggle.js';
import { AccessibilityManager } from './modules/accessibility.js';
import { SearchModal } from './modules/search-modal.js';
import { contentEn } from './data/content-en.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Accessibility Manager (Font zoom & Contrast)
  const accessibility = new AccessibilityManager();

  // 2. Language Switcher
  const langToggle = new LanguageToggle({ selectorId: 'languageSelect' });

  // 3. Hero Carousel Slider
  const heroSlider = new HeroSlider('.hero-carousel-section', 5000);

  // 4. Tab Manager for About Section
  const tabManager = new TabManager({
    tabButtonSelector: '.about-tab-btn',
    headingSelector: '#aboutTabHeading',
    bodySelector: '#aboutTabBody',
    linkSelector: '#aboutTabLink',
    data: contentEn.about.tabs
  });

  // 5. Gallery Showcase Slider
  const gallerySlider = new GallerySlider();

  // 6. Live Feed & Social Updates Renderer
  const feedRenderer = new FeedRenderer({
    whatsNew: '#whatsNewList',
    facebook: '#fbPostContainer',
    twitter: '#twitterFeedList'
  });
  feedRenderer.render(contentEn.updates);

  // 7. Search Modal
  const searchModal = new SearchModal();

  // Register dynamic updates on language toggle
  langToggle.onLanguageChange((data) => {
    tabManager.updateData(data.about.tabs);
    feedRenderer.render(data.updates);
  });

  // Mobile Menu Toggle
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navLinksContainer = document.getElementById('navLinksContainer');
  if (mobileNavToggle && navLinksContainer) {
    mobileNavToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('show');
    });
  }

  console.log('✅ BhoomiSetu National Land Portal initialized successfully.');
});
