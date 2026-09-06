# BhoomiSetu Architecture & Scalability Guide (30+ Files Expansion)

## Overview
This codebase is architected with senior-level modular principles to ensure long-term maintainability, zero stylesheet conflicts, seamless internationalization (i18n), and scalable growth up to 30+ pages and micro-services.

---

## 1. Directory Structure

```
d:/Bhoomisetu/
├── index.html                           # Semantic HTML5 entry point with W3C WCAG 2.1 AAA accessibility
├── package.json                         # Scripts & dependency definitions
│
├── assets/                              # Static visual & branding assets
│   ├── images/
│   │   ├── hero/                        # High-resolution hero visuals (herovisual1, herovisual2, herovisual3)
│   │   ├── emblems/                     # Official State Emblem of India, BhoomiSetu logo
│   │   ├── partners/                    # Make In India, Invest India, MADAD, MyGov, etc.
│   │   ├── banners/                     # Azadi Ka Amrit Mahotsav, G20 Bharat
│   │   └── icons/                       # Reusable vector icons (Bhu-Aadhaar, RoR, GIS maps, Revenue Court)
│   └── fonts/                           # Font resources (Inter, Outfit, Noto Sans Devanagari)
│
├── styles/                              # CSS Architecture (BEM-inspired, Component-Driven)
│   ├── main.css                         # Master aggregator importing all submodules
│   ├── variables.css                    # Design tokens (Colors, Typography, Shadows, Spacing)
│   ├── reset.css                        # Modern reset & baseline accessibility focus rings
│   ├── utilities.css                    # Global helper classes and print styles
│   └── components/                      # Individual isolated component styles
│       ├── topbar.css                   # Top utility bar, language switch, helpline, font resizer
│       ├── header.css                   # Main navigation and government branding
│       ├── hero-carousel.css            # Saffron decorative hero slider
│       ├── initiative-ribbon.css        # AKAM / Digital India badge strip
│       ├── about-tabs.css               # Vertical menu + dynamic info cards
│       ├── services-grid.css            # 4-column key services cards
│       ├── media-gallery.css            # Photo highlights and event carousel
│       ├── updates-feed.css             # 3-column live circulars, Facebook & Twitter feeds
│       ├── useful-links.css             # Interactive GIS preview & government link directory
│       ├── partners-slider.css          # Infinite marquee for national initiatives
│       ├── footer.css                   # Comprehensive dark institutional footer
│       └── search-modal.css             # Citizen quick service search modal
│
├── scripts/                             # JavaScript Architecture (ES6 Modules)
│   ├── app.js                           # Central bootstrap initializing all controllers
│   ├── modules/                         # Isolated controllers
│   │   ├── hero-slider.js               # Auto-play hero visual carousel with indicators
│   │   ├── tab-manager.js               # Vertical tab switcher for About section
│   │   ├── gallery-slider.js            # Media highlights thumbnail gallery
│   │   ├── feed-renderer.js             # Live circulars and social updates renderer
│   │   ├── language-toggle.js           # Bilingual switcher (English ⇄ हिन्दी)
│   │   ├── accessibility.js             # Font scaling (A-, A, A+) and High Contrast mode
│   │   └── search-modal.js              # Real-time search modal and lookup
│   └── data/                            # Decoupled content & configuration datasets
│       ├── content-en.js                # English content dictionary
│       ├── content-hi.js                # Hindi content dictionary
│       └── portal-links.js              # 28 State land record portals database
│
└── docs/
    └── ARCHITECTURE.md                  # This architectural reference guide
```

---

## 2. How to Scale to 30+ Pages & Submodules

1. **Adding a New Sub-Page (e.g. `pages/ror-search.html`)**:
   - Create `pages/ror-search.html` reusing `styles/main.css` and `scripts/app.js`.
   - Add new component CSS under `styles/components/` and import it into `styles/main.css`.
2. **Adding New Data Sets**:
   - Store API data schemas or state databases in `scripts/data/` (e.g. `scripts/data/districts.js`).
3. **Adding New Feature Controllers**:
   - Add a class in `scripts/modules/` and import it in `scripts/app.js`.
