import React, { useState, useEffect } from 'react';
import { apiService } from '../../data/service/apiService.js';
import { PROJECT_TYPES, PARCEL_STATUSES } from '../../data/schema/types.js';

export const ReportsBuilder = () => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [reportData, setReportData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    apiService.getStates().then(setStates);
  }, []);

  useEffect(() => {
    apiService.getDistricts(selectedState).then(setDistricts);
    setSelectedDistrict('all');
  }, [selectedState]);

  // Handle Preset Report selection
  const applyPreset = (presetType) => {
    if (presetType === 'disbursal_pending') {
      setSelectedStatus('Award Declared');
      setSelectedType('all');
      setSelectedState('all');
    } else if (presetType === 'disputed_cases') {
      setSelectedStatus('Disputed / Legal Hold');
      setSelectedType('all');
      setSelectedState('all');
    } else if (presetType === 'highways_only') {
      setSelectedType('Highway');
      setSelectedStatus('all');
      setSelectedState('all');
    } else if (presetType === 'possession_taken') {
      setSelectedStatus('Possession Taken');
      setSelectedType('all');
      setSelectedState('all');
    }
  };

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

  // Client-side CSV Exporter (PRD Section 6.6)
  const downloadCSV = () => {
    if (reportData.length === 0) return;

    const headers = [
      'Sr No',
      'Survey Plot No',
      'ULPIN',
      'State',
      'District',
      'Project Name',
      'Project Sector',
      'Area (ha)',
      'Owner Type',
      'Landowner Name',
      'Stage / Status',
      'Comp Assessed (Cr)',
      'Comp Disbursed (Cr)',
      'Families Affected',
      'Families Resettled',
      'R&R Progress (%)',
      'SLA Delay (Days)'
    ];

    const rows = reportData.map(r => [
      r.srNo,
      `"${r.surveyNo}"`,
      `"${r.ulpin}"`,
      `"${r.state}"`,
      `"${r.district}"`,
      `"${r.projectName}"`,
      `"${r.projectType}"`,
      r.areaHa,
      `"${r.ownerType}"`,
      `"${r.ownerName}"`,
      `"${r.status}"`,
      r.compAssessedCr,
      r.compDisbursedCr,
      r.familiesAffected,
      r.familiesResettled,
      `${r.rrPct}%`,
      r.slaDelayDays
    ]);

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
        {/* Module Header */}
        <div className="module-banner-header">
          <div className="module-title-box">
            <h2>Custom MIS Report Generator & Data Export</h2>
            <p>Generate filtered land acquisition audit reports, PFMS direct benefit logs, and legal hold registers with instant CSV export.</p>
          </div>
        </div>

        {/* Presets Strip */}
        <div className="report-presets-card">
          <span className="preset-label">Standard MIS Presets:</span>
          <div className="preset-buttons">
            <button className="preset-btn" onClick={() => applyPreset('disbursal_pending')}>
              ⚡ Pending Compensation Disbursals
            </button>
            <button className="preset-btn" onClick={() => applyPreset('disputed_cases')}>
              ⚖️ High Court Stays & Disputes
            </button>
            <button className="preset-btn" onClick={() => applyPreset('highways_only')}>
              🛣️ National Highways (NHAI)
            </button>
            <button className="preset-btn" onClick={() => applyPreset('possession_taken')}>
              ✅ Possessed & Handed Over Parcels
            </button>
          </div>
        </div>

        {/* Filter Query Builder Form */}
        <div className="report-filter-builder-card">
          <h3 className="builder-title">Query Parameters</h3>
          <div className="builder-grid">
            <div className="builder-field">
              <label>State Scope</label>
              <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                <option value="all">All States (National Report)</option>
                {states.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div className="builder-field">
              <label>District Scope</label>
              <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} disabled={districts.length === 0}>
                <option value="all">All Districts</option>
                {districts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="builder-field">
              <label>Project Sector</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                <option value="all">All Sectors</option>
                {Object.values(PROJECT_TYPES).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="builder-field">
              <label>Acquisition Status Stage</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="all">All Lifecycle Stages</option>
                {Object.values(PARCEL_STATUSES).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="builder-actions-row">
            <button className="btn-generate-report" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? 'Querying Data Lake...' : '📊 Run Query & Generate Table'}
            </button>
            {hasGenerated && reportData.length > 0 && (
              <button className="btn-download-csv" onClick={downloadCSV}>
                ⬇ Download CSV Dataset ({reportData.length} records)
              </button>
            )}
          </div>
        </div>

        {/* Report Output Table */}
        {hasGenerated && (
          <div className="dash-table-card">
            <div className="table-card-header">
              <div>
                <h3 className="chart-title">Generated MIS Audit Report</h3>
                <p className="chart-subtitle">Matched {reportData.length} land parcels based on active query filters</p>
              </div>
              <button className="btn-download-csv-sm" onClick={downloadCSV}>
                ⬇ Export CSV
              </button>
            </div>

            <div className="dash-table-responsive">
              <table className="dash-data-table">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Survey # & ULPIN</th>
                    <th>State / District</th>
                    <th>Project</th>
                    <th>Area (ha)</th>
                    <th>Landowner</th>
                    <th>Comp Assessed / Paid</th>
                    <th>R&R</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row) => (
                    <tr key={row.parcelId}>
                      <td>{row.srNo}</td>
                      <td>
                        <strong>Plot #{row.surveyNo}</strong>
                        <div className="text-sub">{row.ulpin}</div>
                      </td>
                      <td>{row.district}, {row.state}</td>
                      <td>{row.projectName}</td>
                      <td><strong>{row.areaHa} ha</strong></td>
                      <td>
                        <div>{row.ownerName}</div>
                        <span className="text-sub">({row.ownerType})</span>
                      </td>
                      <td>
                        <div>₹{row.compDisbursedCr} Cr / ₹{row.compAssessedCr} Cr</div>
                        {row.compDisbursedCr >= row.compAssessedCr ? (
                          <span className="text-green text-xs font-bold">100% Disbursed</span>
                        ) : (
                          <span className="text-amber text-xs font-bold">Pending PFMS</span>
                        )}
                      </td>
                      <td>
                        <span className={`rr-badge ${row.rrPct >= 80 ? 'rr-good' : row.rrPct < 50 ? 'rr-bad' : 'rr-mid'}`}>
                          {row.rrPct}%
                        </span>
                      </td>
                      <td>
                        <span className={`stage-badge-pill ${
                          row.status.includes('Closed') ? 'badge-closed' :
                          row.status.includes('Disputed') ? 'badge-disputed' :
                          row.status.includes('Delayed') ? 'badge-delayed' :
                          row.status.includes('Possession') ? 'badge-possession' : 'badge-progress'
                        }`}>
                          {row.status}
                        </span>
                      </td>
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
