import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { apiService } from '../../data/service/apiService.js';

export const AnalyticsDashboard = () => {
  const {
    selectedState,
    setSelectedState,
    selectedDistrict,
    selectedProjectType,
    selectedStatus,
    searchQuery,
    jumpToParcelOnMap,
    openParcelDetail,
    setActiveTab
  } = useDashboard();

  const [kpis, setKpis] = useState(null);
  const [projects, setProjects] = useState([]);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const filterObj = {
      stateId: selectedState,
      districtId: selectedDistrict,
      type: selectedProjectType,
      status: selectedStatus,
      search: searchQuery
    };

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

  // Calculate project status counts for Donut breakdown
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="analytics-dashboard-view">
      {/* Breadcrumb Navigation Strip */}
      <div className="dash-breadcrumb-bar">
        <div className="dash-container breadcrumb-flex">
          <div className="breadcrumb-trail">
            <span className="crumb-item crumb-link" onClick={() => setSelectedState('all')}>
              🇮🇳 National Cockpit
            </span>
            {selectedState !== 'all' && (
              <>
                <span className="crumb-sep">›</span>
                <span className="crumb-item active">
                  {states.find(s => s.id === selectedState)?.name || selectedState}
                </span>
              </>
            )}
          </div>
          <div className="breadcrumb-live-badge">
            <span className="pulse-dot"></span>
            <span>Live Data Sync (15+ Cadastral Nodes Active)</span>
          </div>
        </div>
      </div>

      <div className="dash-container dash-content-layout">
        {/* Top KPI Metric Cards Strip (Inspired by design inspiration 1 & 2) */}
        <div className="kpi-metrics-grid">
          {/* KPI 1: Land Acquired */}
          <div className="kpi-card kpi-card-saffron">
            <div className="kpi-card-header">
              <span className="kpi-label">Total Land Acquired</span>
              <span className="kpi-trend positive">↑ {kpis.acquisitionRate}% of Target</span>
            </div>
            <div className="kpi-main-val">
              {kpis.totalAcquiredHa.toLocaleString()} <span className="kpi-unit">ha</span>
            </div>
            <div className="kpi-progress-bg">
              <div className="kpi-progress-bar saffron" style={{ width: `${Math.min(kpis.acquisitionRate, 100)}%` }}></div>
            </div>
            <div className="kpi-footer-meta">
              Target: <strong>{kpis.totalProposedHa.toLocaleString()} ha</strong> proposed
            </div>
          </div>

          {/* KPI 2: Compensation Disbursed */}
          <div className="kpi-card kpi-card-emerald">
            <div className="kpi-card-header">
              <span className="kpi-label">Compensation Disbursed (PFMS)</span>
              <span className="kpi-trend positive">↑ {kpis.disbursalRate}% released</span>
            </div>
            <div className="kpi-main-val">
              ₹{kpis.totalCompDisbursedCr.toLocaleString()} <span className="kpi-unit">Cr</span>
            </div>
            <div className="kpi-progress-bg">
              <div className="kpi-progress-bar emerald" style={{ width: `${Math.min(kpis.disbursalRate, 100)}%` }}></div>
            </div>
            <div className="kpi-footer-meta">
              Assessed: <strong>₹{kpis.totalCompAssessedCr.toLocaleString()} Cr</strong> total
            </div>
          </div>

          {/* KPI 3: R&R Resettlement */}
          <div className="kpi-card kpi-card-navy">
            <div className="kpi-card-header">
              <span className="kpi-label">Rehabilitation & Resettlement</span>
              <span className={`kpi-trend ${kpis.rrRate < 50 ? 'warning' : 'positive'}`}>
                {kpis.rrRate}% Resettled
              </span>
            </div>
            <div className="kpi-main-val">
              {kpis.totalFamiliesResettled.toLocaleString()} <span className="kpi-unit">Families</span>
            </div>
            <div className="kpi-progress-bg">
              <div className="kpi-progress-bar navy" style={{ width: `${Math.min(kpis.rrRate, 100)}%` }}></div>
            </div>
            <div className="kpi-footer-meta">
              Affected: <strong>{kpis.totalFamiliesAffected.toLocaleString()} families</strong> tracked
            </div>
          </div>

          {/* KPI 4: Timeline Adherence & Active Alerts */}
          <div className="kpi-card kpi-card-alert" onClick={() => setActiveTab('alerts')} style={{ cursor: 'pointer' }}>
            <div className="kpi-card-header">
              <span className="kpi-label">Statutory SLA Compliance</span>
              <span className="kpi-badge-critical">{kpis.activeAlertsCount} Action Alerts</span>
            </div>
            <div className="kpi-main-val">
              {kpis.statutoryAdherenceRate}% <span className="kpi-unit">On Schedule</span>
            </div>
            <div className="kpi-footer-meta text-critical">
              🚨 <strong>{kpis.activeAlertsCount} statutory bottlenecks</strong> require CALA action ›
            </div>
          </div>
        </div>

        {/* Charts & Analytics Section */}
        <div className="analytics-charts-grid">
          {/* Chart 1: State-wise Land Acquisition Comparison */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">State-wise Land Acquisition Progress (ha)</h3>
                <p className="chart-subtitle">Target Area vs. Possessed Area across high-impact States</p>
              </div>
              <span className="chart-tag">MoRTH & DILRMP Data</span>
            </div>
            <div className="chart-body">
              <div className="bar-comparison-list">
                {states.map((st) => {
                  const pct = Math.round((st.totalAreaAcquired / st.totalAreaTarget) * 100);
                  return (
                    <div key={st.id} className="bar-comp-item" onClick={() => setSelectedState(st.id)}>
                      <div className="bar-comp-labels">
                        <span className="state-name-label">{st.name} ({st.code})</span>
                        <span className="state-ha-val">
                          <strong>{st.totalAreaAcquired.toLocaleString()} ha</strong> / {st.totalAreaTarget.toLocaleString()} ha ({pct}%)
                        </span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill-saffron" style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart 2: Project Status Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Project Lifecycle Distribution</h3>
                <p className="chart-subtitle">Active national infrastructure projects by current stage</p>
              </div>
              <span className="chart-tag">{projects.length} Projects</span>
            </div>
            <div className="chart-body">
              <div className="donut-summary-layout">
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
        </div>

        {/* Priority Projects Table & Quick Inspect (Design pattern from Inspiration 3) */}
        <div className="dash-table-card">
          <div className="table-card-header">
            <div>
              <h3 className="chart-title">High-Impact Infrastructure Projects</h3>
              <p className="chart-subtitle">Click any project to inspect parcels or view in GIS map</p>
            </div>
            <button className="btn-view-map-cta" onClick={() => setActiveTab('map')}>
              🗺️ Open Full GIS Map Cockpit
            </button>
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
                  const isProblem = proj.status.includes('Disputed') || proj.status.includes('Delayed') || (proj.status.includes('Possession') && proj.rrProgressPct < 50);

                  return (
                    <tr key={proj.id} className={isProblem ? 'row-problem' : ''}>
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
                          <div className="mini-progress-track">
                            <div
                              className="mini-progress-bar"
                              style={{ width: `${Math.round((proj.totalAreaAcquired / proj.totalAreaProposed) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="comp-stat-cell">
                          <strong>₹{proj.compensationDisbursed} Cr</strong>
                          <span className="text-muted">of ₹{proj.compensationAssessed} Cr</span>
                        </div>
                      </td>
                      <td>
                        <div className="rr-stat-cell">
                          <span className={`rr-badge ${proj.rrProgressPct >= 80 ? 'rr-good' : proj.rrProgressPct < 50 ? 'rr-bad' : 'rr-mid'}`}>
                            {proj.rrProgressPct}% Resettled
                          </span>
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
                        <button
                          className="table-action-btn"
                          onClick={() => jumpToParcelOnMap(null, proj.stateId, proj.districtIds[0])}
                        >
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
