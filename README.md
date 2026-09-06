# 🇮🇳 BhoomiSetu (भूमि सेतु) - National Integrated Land & Revenue Portal

[![Government of India](https://img.shields.io/badge/Govt.%20of%20India-DILRMP-orange.svg)](https://dilrmp.gov.in)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)](#)
[![Accessibility](https://img.shields.io/badge/Accessibility-W3C%20WCAG%202.1%20AAA-blue.svg)](#)

> **BhoomiSetu (भूमि सेतु)** is the unified national digital land records and citizen revenue services portal developed under the **Digital India Land Records Modernization Programme (DILRMP)** by the Department of Land Resources, Ministry of Rural Development, Government of India.

---

## 🏛️ Key Features

- **Scalable Component Architecture (30+ Files Ready)**: Built with zero-framework Vanilla JS (ES6 Modules) and Component-Driven CSS for maximum performance, maintainability, and zero stylesheet leakage.
- **Official Government Branding**: Integrated with the State Emblem of India ("सत्यमेव जयते"), G20 Bharat, Swachh Bharat, and Azadi Ka Amrit Mahotsav logos.
- **Accessibility & W3C WCAG 2.1 AAA Compliant**:
  - Live Font Scaling (`A-`, `A`, `A+`)
  - High-Contrast Theme Switcher
  - Bilingual Support (Instant English ⇄ हिन्दी Language Switcher)
  - Screen reader jump links & keyboard accessibility
- **Interactive Saffron Hero Carousel**: Dynamic slide transitions, indicators, keyboard arrow controls (`←`/`→`), and pause-on-hover.
- **Interactive About Section**: Vertical tabbed navigation with real-time detail rendering and SVG artwork.
- **Core Land Services Grid**:
  - **Bhu-Aadhaar (14-Digit ULPIN)** - Unique Land Parcel Identification Number
  - **Online RoR & Mutation** - Computerized Khatauni / Khasra downloads with QR verification
  - **Geo-Referenced Cadastral Maps (BhuNaksha)** - GIS mapping & survey overlay
  - **Revenue Court Dispute Tracker** - Judicial cause list and dispute resolution
- **Live 3-Column Feeds**: *What's New* notifications with pulsing tags, *Facebook Updates*, and *Twitter (X) Updates*.
- **Interactive GIS Map Preview**: Coordinate locator and direct links to Central & State land record portals.
- **National Initiatives Marquee**: Infinite smooth marquee for Make in India, Invest India, MADAD, MyGov / Bharat Quiz, and Pravasi Bharatiya Divas.
- **Comprehensive Institutional Footer**: Operational working hours, policy links, and legal compliance.

---

## 📁 Project Structure

```
Bhoomisetu/
├── index.html                           # Semantic HTML5 Master Portal Entry
├── package.json                         # Project Manifest
├── .gitignore                           # Git ignore rules
├── server.ps1                           # Built-in lightweight HTTP Server
├── README.md                            # Project Documentation
│
├── assets/                              # Static visual & branding assets
│   ├── images/
│   │   ├── hero/                        # Hero Carousel Photos (herovisual1, 2, 3)
│   │   ├── emblems/                     # Official National Emblem, BhoomiSetu Logo
│   │   ├── banners/                     # G20 Bharat, Swachh Bharat, Indian Flag, AKAM
│   │   ├── partners/                    # Make In India, Invest India, MADAD, MyGov, etc.
│   │   └── icons/                       # Reusable Vector Icons & Illustrations
│   └── fonts/                           # Web Typography (Inter, Outfit, Noto Sans Devanagari)
│
├── styles/                              # Modular CSS Architecture
│   ├── main.css                         # Master Aggregator Stylesheet
│   ├── variables.css                    # Design Tokens & Palette (Saffron, Navy, Green, Gold)
│   ├── reset.css                        # Modern CSS Reset & Focus Styles
│   ├── utilities.css                    # Helper Classes & Print Stylesheet
│   └── components/                      # Individual Component Stylesheets
│       ├── topbar.css
│       ├── header.css
│       ├── hero-carousel.css
│       ├── initiative-ribbon.css
│       ├── about-tabs.css
│       ├── services-grid.css
│       ├── media-gallery.css
│       ├── updates-feed.css
│       ├── useful-links.css
│       ├── partners-slider.css
│       ├── footer.css
│       └── search-modal.css
│
├── scripts/                             # Modular JavaScript Architecture (ES6)
│   ├── app.js                           # Application Bootstrap
│   ├── modules/                         # Feature Controllers
│   │   ├── hero-slider.js
│   │   ├── tab-manager.js
│   │   ├── gallery-slider.js
│   │   ├── feed-renderer.js
│   │   ├── language-toggle.js
│   │   ├── accessibility.js
│   │   └── search-modal.js
│   └── data/                            # Datasets & Localization
│       ├── content-en.js                # English Dictionary
│       ├── content-hi.js                # Hindi (हिन्दी) Dictionary
│       └── portal-links.js              # State Bhulekh Directory
│
└── docs/
    └── ARCHITECTURE.md                  # Scaling & Submodules Guide
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Bhoomisetu
```

### 2. Run Locally

**Option A: Using PowerShell (Built-in)**
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Open [http://localhost:8080/](http://localhost:8080/) in your browser.

**Option B: Using Node / npx**
```bash
npx serve . -l 8080
```

**Option C: Using Python**
```bash
python -m http.server 8080
```

---

## 📜 License & Compliance
Content Owned and Maintained by Department of Land Resources, Ministry of Rural Development, Government of India.
Designed for national public digital infrastructure under DILRMP.
