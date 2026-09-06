# Bhoomisetu — Product Requirements Document (PRD)
### Real-Time National Land Acquisition & Management System (Frontend Demo)

| | |
|---|---|
| **Product Name** | Bhoomisetu |
| **Document Type** | Product Requirements Document (PRD) |
| **Version** | 1.0 |
| **Prepared For** | Frontend/demo build — no backend in this phase |
| **Status** | Draft for engineering sign-off |
| **Source Reference** | National Land Acquisition & Management System — problem statement (uploaded PDF) |

---

## 1. Executive Summary

Bhoomisetu is a web-based dashboard that digitizes and visualizes the end-to-end lifecycle of land acquisition in India — from project proposal to final possession — for stakeholders ranging from District Collectors to Central Ministries. This PRD scopes a **frontend-only demo build**: the landing page and visual design are already complete, so this document covers everything else the problem statement asks for — workflows, GIS map interactions, dashboards/analytics, document management, alerts, and reporting — implemented entirely on **realistic, varied mock data**, structured so a real backend can be dropped in later with minimal rework.

The centerpiece experience: a **national interactive map** where every acquired/in-process land parcel is geo-tagged. Clicking a parcel opens a detail panel with its stats — status, compensation, R&R progress, affected families, timeline — backed by a rich, multi-scenario mock dataset (not a single hardcoded example).

---

## 2. Background (from the Problem Statement)

Land acquisition today is run through fragmented, state-specific, largely manual systems. There's no single national platform, so data is inconsistent, approvals are slow, transparency is limited, and decision-makers can't see real-time status of notifications, awards, compensation, possession, or rehabilitation & resettlement (R&R). The ask is a unified platform covering: proposal submission → scrutiny → approval → notification → award → compensation → possession → closure, with GIS geo-tagging, national/state/district dashboards, document management, automated alerts, and MIS reporting — scalable to all states and UTs.

**This PRD's job:** deliver that experience as a convincing, fully-interactive frontend demo.

---

## 3. Goals & Non-Goals

### 3.1 Goals
- Ship a **fully workable dashboard** — every screen, filter, drill-down, and interaction genuinely functions against mock data (nothing is a static screenshot or dead button).
- Cover **every functional area** in the problem statement's scope table (workflow, GIS, dashboards, integration stubs, document mgmt, alerts, reporting, RBAC-at-UI-level, scalability/multilingual stubs) — except visual design and the landing page, which are already built.
- Build a **mock data layer shaped like a real API contract**, so swapping in a real backend later means changing a data-fetching layer, not rewriting components.
- Populate demo data with **many distinct, realistic test cases** (multiple states, districts, project types, and status permutations — including edge cases like disputes and delays) so the demo doesn't look like one lucky happy-path.

### 3.2 Non-Goals (explicitly out of scope for this phase)
- No real backend, database, or server — all data is local mock JSON/TS served through a service-layer abstraction.
- No real authentication/authorization — RBAC is simulated at the UI level (a role switcher), not enforced server-side.
- No real GIS server (GeoServer/PostGIS) — parcel geometry is mock GeoJSON rendered client-side.
- No real integrations with land record systems, cadastral databases, or government portals — these are represented as **integration stub cards** showing "connected / pending" states.
- Landing page and overall visual design system — already built, not touched by this PRD.

---

## 4. Users & Stakeholders

| Persona | Primary Need | Key Screens |
|---|---|---|
| **Central Ministry Official** | National overview, cross-state comparison, policy-level KPIs | National Dashboard, Reports |
| **State Government Official** | State-level progress, district comparison | State Dashboard, Map (state-filtered) |
| **District Collector / District Authority** | Case-level tracking, approvals pending, field data | District View, Proposal Workflow, Alerts |
| **Land Acquiring Authority / Project Implementing Agency** | Track own project's parcels, compensation, possession | Project View, Parcel Detail |
| **Rehabilitation Authority** | R&R progress, affected families | R&R Module, Parcel Detail |
| **Policy Maker / Analyst** | Trends, comparative analytics, exportable reports | Analytics, Reports & MIS Export |

A lightweight **role switcher** in the header lets the demo presenter toggle between these personas, changing which dashboard widgets and default filters are shown — purely a UI-level simulation of RBAC.

---

## 5. Scope of the Demo Build

| Module (from problem statement) | Demo Treatment |
|---|---|
| Workflow digitization (proposal → closure) | Interactive Kanban/stepper-style tracker per project, driven by mock status field |
| GIS & geo-tagging | Interactive map (React-Leaflet), clickable parcel markers/polygons, mock GeoJSON |
| Data standardization | Reflected as consistent schema across all mock entities (see §7) |
| Dashboard & analytics | National/state/district/project drill-down dashboards with charts and KPIs |
| Integration (land records, cadastral, financial, GIS) | "Integration Hub" screen with stub connectors showing mock status, sample payload preview |
| Document management | Mock document repository per parcel/project (name, type, version, uploaded-by, date) with a viewer stub |
| Monitoring & alerts | Alerts panel — pending approvals, delayed cases, upcoming statutory deadlines, computed from mock data rules |
| Reporting | Report builder screen — pick filters, "generate" produces a client-side CSV/PDF-style export of mock data |
| Security & governance | Represented only as UI affordances: role switcher, mock audit-trail log per record |
| Scalability / multilingual | Language switcher stub (labels swap via i18n dictionary, 2 languages seeded) |

---

## 6. Core Feature Requirements

### 6.1 National / State / District / Project Dashboard
- KPI strip: Total land proposed vs. acquired (ha), notifications issued, awards declared, compensation assessed vs. disbursed (₹), families affected/displaced, average timeline adherence.
- Drill-down breadcrumb: **National → State → District → Project → Parcel**, each level filtering the map and KPIs.
- Charts (via Recharts): 
  - Bar: state-wise land acquired vs. targeted
  - Line: compensation disbursed over time (monthly trend, mock time series)
  - Donut: project status distribution (Proposed / Notified / Award Declared / Compensation Paid / Possession Taken / Closed / Disputed)
  - Progress bars: R&R completion % by project
- All charts and KPIs must **recompute live** when a filter (state/district/date range/project type) changes — computed client-side from the mock dataset, not pre-baked per screen.

### 6.2 Interactive GIS Map (centerpiece feature)
- Base map with state/district boundary overlays (mock/simplified GeoJSON is acceptable — doesn't need survey-grade cadastral accuracy).
- Parcel markers/polygons color-coded by status (e.g., grey = proposed, amber = notified, blue = award declared, green = possession taken, red = disputed/delayed).
- **Click a parcel → slide-in detail panel** shows:
  - Parcel ID, project name, state/district, area (ha), current stage in workflow
  - Compensation: assessed vs. disbursed, disbursement %
  - R&R: families affected, families resettled, resettlement %
  - Possession status and date (or "pending")
  - Timeline: milestone list with planned vs. actual dates, flags for delayed milestones
  - Mini document list (2–3 mock documents: notification order, award copy, possession certificate)
  - Mock audit trail (e.g., "Notification issued — 12 Mar 2025 — District Office")
- Cluster markers when zoomed out (many parcels in one state); expand to individual parcels on zoom/click.
- Search/filter bar on the map: by state, district, project, status, or parcel ID.

### 6.3 Proposal & Workflow Tracker
- Per-project stepper: Proposal Submitted → Scrutiny → Approval → Notification → Award → Compensation → Possession → Closure.
- Each step shows status (done/in-progress/pending/delayed) and the responsible stakeholder, from mock data — not user-editable in this phase (read-only demo), but structured so "advance stage" actions can be wired to a real API later.

### 6.4 Alerts & Monitoring Panel
- Rule-driven list generated from the mock dataset at load time, e.g.:
  - Approvals pending > 30 days
  - Milestones past their planned date
  - Compensation assessed but not disbursed after X days
  - R&R progress below 50% with possession already taken (flag as a genuine problem case)
- Each alert links directly to the relevant parcel/project detail.

### 6.5 Document Management (mock repository)
- Per parcel/project: a document list (name, type — Notification/Award/Legal/Map, version, uploaded-by, date) and a "preview" stub (can open a static sample PDF/image placeholder).
- Upload button present in UI but disabled/mocked with a toast ("Connect a document store to enable uploads") — signals the integration point without needing real storage.

### 6.6 Reports & MIS Export
- Filter builder (state, district, date range, project type, status) → "Generate Report" produces:
  - An on-screen summary table
  - A downloadable CSV built client-side from the filtered mock dataset (no server needed)
- Saved report presets (mock, stored in local state) to show the "customizable reports" requirement.

### 6.7 Integration Hub (stub, not functional)
- A screen listing the systems the real platform would connect to per the problem statement: Land Records, Cadastral Maps, Financial/PFMS, GIS Platform, SMS/Email Gateway.
- Each shown as a card: name, mock "Connected/Not Connected" badge, and a sample JSON payload preview — this is where a real integration would plug in later.

### 6.8 Multilingual & Role Switch (stub)
- Header controls for language (English + 1 regional language, seeded via an i18n dictionary) and role (persona switcher from §4). Both purely client-side state — no backend needed.

---

## 7. Data Model (Mock Schema)

All entities are defined as TypeScript interfaces and served from a local mock data module — shaped exactly like what a real REST API would return, so the fetching layer (not the components) changes when a backend arrives.

```
State        { id, name, code }
District     { id, stateId, name }
Project      { id, name, type (Highway/Railway/Irrigation/Industrial/Renewable/Urban),
               stateId, districtIds[], implementingAgency, startDate, targetClosureDate,
               status, totalAreaProposed, totalAreaAcquired }
Parcel       { id, projectId, districtId, surveyNumber, geometry (GeoJSON),
               areaHa, status, ownerType (Private/Govt/Community),
               notificationDate, awardDate, possessionDate,
               compensationAssessed, compensationDisbursed,
               familiesAffected, familiesResettled, rrProgressPct }
Milestone    { id, parcelId or projectId, name, plannedDate, actualDate, status }
Document     { id, parentId, parentType (Parcel/Project), name, type, version,
               uploadedBy, uploadedDate, url (mock) }
Alert        { id, relatedId, relatedType, severity, message, createdDate }
AuditEntry   { id, relatedId, action, actor, timestamp }
Stakeholder  { id, name, role, organization }
```

---

## 8. Demo Data Plan — Test Case Matrix

To avoid a single "happy path" demo, the mock dataset should span **at least 6 states, 15+ districts, 10+ projects, and 40–60 parcels**, deliberately covering these scenarios:

| # | Scenario | Purpose |
|---|---|---|
| 1 | Fully closed project — possession taken, R&R 100%, compensation fully disbursed | Shows the "success" end state |
| 2 | Early-stage project — only proposal submitted, nothing else started | Shows the start of the funnel |
| 3 | Notification issued, award pending > 30 days | Triggers a "delayed approval" alert |
| 4 | Award declared, compensation assessed but not disbursed | Triggers a "compensation pending" alert |
| 5 | Possession taken but R&R progress < 50% | Triggers a "problem case" alert — possession ahead of resettlement |
| 6 | Disputed parcel (legal hold) | Shows the disputed/red status on map and in KPIs |
| 7 | Milestone missed (actual date past planned date) | Populates delayed-milestone flags on the timeline |
| 8 | High-displacement project (500+ families) vs. low-displacement (single-digit families) | Shows dashboard handles wide value ranges |
| 9 | Multi-district project (e.g., a highway spanning 3 districts) | Tests project-to-parcel aggregation across districts |
| 10 | Renewable energy project on community land (different owner type) | Tests ownerType variation in filters |
| 11 | Two projects in the same district at different stages | Tests district-level drill-down with mixed statuses |
| 12 | A state with very few parcels vs. a state with many | Tests chart/map scaling and empty-state handling |
| 13 | Project with all documents uploaded vs. one missing key documents | Tests document-management empty states |
| 14 | Parcel with a full audit trail (5+ events) vs. one with only 1 event | Tests audit-trail rendering at both ends |
| 15 | Overdue project (past targetClosureDate, still open) | Feeds a "timeline adherence" KPI failure case |

This matrix should be treated as the **minimum bar** — engineering can add more permutations, but every row above must exist in the seed data so every UI state (including empty/edge states) is demonstrably reachable.

---

## 9. Technical Architecture (Frontend-Only)

```
src/
  app/                     → routing, layout shell (integrates with existing landing page)
  features/
    dashboard/             → national/state/district/project dashboard widgets
    map/                   → GIS map, parcel markers, detail panel
    workflow/              → proposal stepper/tracker
    alerts/                → alerts panel + rule engine (client-side)
    documents/             → mock document repository UI
    reports/               → report builder + CSV export
    integrations/          → integration hub stub screens
  data/
    mock/                  → seed JSON/TS per entity (states, districts, projects, parcels, ...)
    schema/                → TypeScript interfaces (§7)
    service/               → data-access layer (getProjects(), getParcelById(), etc.)
                              — this is the single seam where a real API client swaps in later
  shared/
    charts/, ui/, i18n/, hooks/
```

**Recommended stack**
| Concern | Choice | Why |
|---|---|---|
| Map | React-Leaflet + Leaflet | Matches the problem statement's suggested GIS stack (Leaflet/OpenLayers), open-source, no API key needed for demo |
| Charts | Recharts | Lightweight, composable, matches existing React setup |
| State | React Query (for the mock service layer) + Zustand/Context for UI state (filters, role, language) | React Query gives "loading/cached/refetch" behavior identical to a real API, easing the future backend swap |
| CSV export | Client-side generation (e.g., a small CSV utility) | No server needed for the "Reports" feature |
| i18n | A simple key-based dictionary (2 locales seeded) | Satisfies "multilingual support" as a demonstrable stub |

**Why a service-layer abstraction matters:** every screen calls functions like `getNationalKpis()`, `getParcelsByState(stateId)`, `getParcelById(id)` from `data/service/`. Today these read from local mock arrays (with a simulated network delay for realism); tomorrow the same function signatures can call real REST/GraphQL endpoints without touching a single component.

---

## 10. Future API Contract (for backend hand-off)

Even though no backend is built now, the mock service layer should mirror this shape so integration later is a drop-in:

```
GET  /api/states
GET  /api/states/:id/districts
GET  /api/projects?state=&district=&status=&type=
GET  /api/projects/:id
GET  /api/parcels?project=&district=&status=
GET  /api/parcels/:id
GET  /api/parcels/:id/documents
GET  /api/parcels/:id/audit-trail
GET  /api/alerts?severity=
GET  /api/kpis/national
GET  /api/kpis/state/:id
POST /api/reports/generate   (body: filters) → returns report data for export
```

---

## 11. Non-Functional Requirements

- **Performance:** map should smoothly render 200+ mock parcels using clustering; dashboard filter changes should feel instant (<200ms) since all computation is client-side over an in-memory dataset.
- **Responsiveness:** dashboard and map usable down to tablet width; mobile can be a reduced "summary" view (per the "mobile-responsive interface" requirement in the source PDF).
- **Accessibility:** color-coded statuses must also carry a text/icon indicator (not color alone), given the map's heavy reliance on status colors.
- **Browser support:** current Chrome/Edge/Firefox — no legacy browser support needed for a demo.

---

## 12. Build Milestones

| Phase | Deliverable |
|---|---|
| 1 | Data schema + full mock dataset covering the test-case matrix (§8) |
| 2 | Service layer + React Query wiring (fake latency, loading/error states) |
| 3 | GIS map with clustering, status colors, click-to-detail panel |
| 4 | National/State/District/Project dashboards with live-filtered charts and KPIs |
| 5 | Workflow tracker, alerts panel, document repository UI |
| 6 | Reports/export, integration hub stub, i18n + role switcher |
| 7 | Polish pass: empty states, edge-case scenarios, responsive QA |

---

## 13. Risks & Assumptions

- **Assumption:** exact GeoJSON boundaries for states/districts don't need survey accuracy for the demo — simplified/public-domain boundary data is sufficient.
- **Assumption:** stakeholders reviewing the demo understand this is a frontend prototype and won't expect real data persistence (no data survives a refresh unless local storage/IndexedDB is deliberately added for demo continuity — flag if that's wanted).
- **Risk:** if the demo needs to *look* like it has live/real-time data (e.g., an "auto-refreshing" KPI), that can be simulated with a periodic mock-data tick, but should be called out explicitly since it adds complexity beyond static mock data.
- **Risk:** GIS libraries (Leaflet) render differently at very high marker counts — clustering is required, not optional, once parcel count crosses roughly 100–150 markers on screen at once.

---

## 14. Out-of-Scope Reminder

Per explicit direction: this PRD **excludes** the landing page and visual design system (already complete) and **excludes** a real backend, real authentication, and real third-party integrations. Every "integration point" called out above (§10, §6.7) is intentionally structured so those pieces can be added later without a dashboard rewrite.
