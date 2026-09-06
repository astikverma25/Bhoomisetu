/**
 * Bhoomisetu National Land Acquisition & Management System
 * Mock Service Layer (PRD Section 9 & 10)
 * 
 * Provides an asynchronous REST-like data abstraction. In future phases,
 * this is the single seam where real backend API clients (Axios/fetch) swap in.
 */

import {
  SEED_STATES,
  SEED_DISTRICTS,
  SEED_PROJECTS,
  SEED_PARCELS,
  SEED_ALERTS,
  SEED_DOCUMENTS,
  SEED_AUDIT_TRAIL,
  SEED_INTEGRATIONS
} from '../mock/seedData.js';

// Simulated latency utility
const fakeDelay = (ms = 80) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // 1. States & Districts
  async getStates() {
    await fakeDelay();
    return [...SEED_STATES];
  },

  async getDistricts(stateId = null) {
    await fakeDelay();
    if (!stateId || stateId === 'all') return [...SEED_DISTRICTS];
    return SEED_DISTRICTS.filter(d => d.stateId === stateId);
  },

  // 2. Projects
  async getProjects(filters = {}) {
    await fakeDelay();
    let result = [...SEED_PROJECTS];
    if (filters.stateId && filters.stateId !== 'all') {
      result = result.filter(p => p.stateId === filters.stateId);
    }
    if (filters.districtId && filters.districtId !== 'all') {
      result = result.filter(p => p.districtIds.includes(filters.districtId));
    }
    if (filters.type && filters.type !== 'all') {
      result = result.filter(p => p.type === filters.type);
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.implementingAgency.toLowerCase().includes(q));
    }
    return result;
  },

  async getProjectById(id) {
    await fakeDelay();
    return SEED_PROJECTS.find(p => p.id === id) || null;
  },

  // 3. Parcels (Centerpiece GIS dataset)
  async getParcels(filters = {}) {
    await fakeDelay();
    let result = [...SEED_PARCELS];
    if (filters.stateId && filters.stateId !== 'all') {
      result = result.filter(p => p.stateId === filters.stateId);
    }
    if (filters.districtId && filters.districtId !== 'all') {
      result = result.filter(p => p.districtId === filters.districtId);
    }
    if (filters.projectId && filters.projectId !== 'all') {
      result = result.filter(p => p.projectId === filters.projectId);
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.ownerType && filters.ownerType !== 'all') {
      result = result.filter(p => p.ownerType === filters.ownerType);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.surveyNumber.toLowerCase().includes(q) ||
        p.ulpin.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q)
      );
    }
    return result;
  },

  async getParcelById(id) {
    await fakeDelay();
    const parcel = SEED_PARCELS.find(p => p.id === id);
    if (!parcel) return null;
    const project = SEED_PROJECTS.find(p => p.id === parcel.projectId);
    const district = SEED_DISTRICTS.find(d => d.id === parcel.districtId);
    const state = SEED_STATES.find(s => s.id === parcel.stateId);
    const docs = SEED_DOCUMENTS.filter(d => d.parentId === parcel.id);
    const audit = SEED_AUDIT_TRAIL.filter(a => a.relatedId === parcel.id);
    return { ...parcel, project, district, state, documents: docs, auditTrail: audit };
  },

  // 4. Alerts & Monitoring
  async getAlerts(severity = null) {
    await fakeDelay();
    if (!severity || severity === 'all') return [...SEED_ALERTS];
    return SEED_ALERTS.filter(a => a.severity === severity);
  },

  // 5. Document Repository
  async getDocuments(parentId = null) {
    await fakeDelay();
    if (!parentId || parentId === 'all') return [...SEED_DOCUMENTS];
    return SEED_DOCUMENTS.filter(d => d.parentId === parentId);
  },

  // 6. Integration Connectors
  async getIntegrations() {
    await fakeDelay();
    return [...SEED_INTEGRATIONS];
  },

  // 7. National & Filtered Live KPIs
  async getKpiStats(filters = {}) {
    await fakeDelay();
    const parcels = await this.getParcels(filters);
    const projects = await this.getProjects(filters);

    const totalProposedHa = projects.reduce((sum, p) => sum + p.totalAreaProposed, 0);
    const totalAcquiredHa = projects.reduce((sum, p) => sum + p.totalAreaAcquired, 0);
    const totalCompAssessedCr = projects.reduce((sum, p) => sum + p.compensationAssessed, 0);
    const totalCompDisbursedCr = projects.reduce((sum, p) => sum + p.compensationDisbursed, 0);
    const totalFamiliesAffected = projects.reduce((sum, p) => sum + p.familiesAffected, 0);
    const totalFamiliesResettled = projects.reduce((sum, p) => sum + p.familiesResettled, 0);

    const activeAlertsCount = SEED_ALERTS.length;
    const acquisitionRate = totalProposedHa > 0 ? ((totalAcquiredHa / totalProposedHa) * 100).toFixed(1) : 0;
    const disbursalRate = totalCompAssessedCr > 0 ? ((totalCompDisbursedCr / totalCompAssessedCr) * 100).toFixed(1) : 0;
    const rrRate = totalFamiliesAffected > 0 ? ((totalFamiliesResettled / totalFamiliesAffected) * 100).toFixed(1) : 0;

    return {
      totalProjects: projects.length,
      totalParcels: parcels.length,
      totalProposedHa,
      totalAcquiredHa,
      acquisitionRate,
      totalCompAssessedCr,
      totalCompDisbursedCr,
      disbursalRate,
      totalFamiliesAffected,
      totalFamiliesResettled,
      rrRate,
      activeAlertsCount,
      statutoryAdherenceRate: 88.4
    };
  },

  // 8. Client-side Report Generation & CSV builder
  async generateReport(filters = {}) {
    await fakeDelay(150);
    const parcels = await this.getParcels(filters);
    return parcels.map((p, idx) => {
      const proj = SEED_PROJECTS.find(pr => pr.id === p.projectId);
      const st = SEED_STATES.find(s => s.id === p.stateId);
      const dist = SEED_DISTRICTS.find(d => d.id === p.districtId);
      return {
        srNo: idx + 1,
        parcelId: p.id,
        surveyNo: p.surveyNumber,
        ulpin: p.ulpin,
        state: st?.name || 'N/A',
        district: dist?.name || 'N/A',
        projectName: proj?.name || 'N/A',
        projectType: proj?.type || 'N/A',
        areaHa: p.areaHa,
        ownerType: p.ownerType,
        ownerName: p.ownerName,
        status: p.status,
        compAssessedCr: p.compensationAssessed,
        compDisbursedCr: p.compensationDisbursed,
        familiesAffected: p.familiesAffected,
        familiesResettled: p.familiesResettled,
        rrPct: p.rrProgressPct,
        slaDelayDays: p.slaDelayedDays
      };
    });
  }
};
