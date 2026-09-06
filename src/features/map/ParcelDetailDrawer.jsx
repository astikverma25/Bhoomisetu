import React, { useState, useEffect } from 'react';
import { apiService } from '../../data/service/apiService.js';

export const ParcelDetailDrawer = ({ parcelId, isOpen, onClose }) => {
  const [parcelData, setParcelData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'timeline' | 'documents' | 'audit'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
        {/* Drawer Header */}
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

        {/* Drawer Subnav Tabs */}
        <div className="drawer-nav-tabs">
          <button className={`drawer-nav-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            📋 Overview & Stats
          </button>
          <button className={`drawer-nav-tab ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
            ⏱️ Statutory Milestones
          </button>
          <button className={`drawer-nav-tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
            📄 Documents ({parcelData?.documents?.length || 0})
          </button>
          <button className={`drawer-nav-tab ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
            🛡️ Audit Trail ({parcelData?.auditTrail?.length || 0})
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body-scroll">
          {loading || !parcelData ? (
            <div className="drawer-loading">
              <div className="dash-spinner"></div>
              <p>Fetching parcel metadata from State Land Record Server...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="drawer-tab-content">
                  {/* Key Stats Cards Grid */}
                  <div className="drawer-stats-grid">
                    <div className="drawer-stat-card">
                      <span className="stat-card-label">Acquisition Area</span>
                      <span className="stat-card-value">{parcelData.areaHa} <small>ha</small></span>
                      <span className="stat-card-sub">{parcelData.ownerType} Tenure</span>
                    </div>

                    <div className="drawer-stat-card">
                      <span className="stat-card-label">Compensation Assessed</span>
                      <span className="stat-card-value">₹{parcelData.compensationAssessed} <small>Cr</small></span>
                      <span className="stat-card-sub">
                        {parcelData.compensationDisbursed >= parcelData.compensationAssessed
                          ? '✅ Fully Disbursed via PFMS'
                          : `⚠️ ₹${(parcelData.compensationAssessed - parcelData.compensationDisbursed).toFixed(1)} Cr Pending`}
                      </span>
                    </div>

                    <div className="drawer-stat-card">
                      <span className="stat-card-label">Affected Families</span>
                      <span className="stat-card-value">{parcelData.familiesAffected} <small>Families</small></span>
                      <span className="stat-card-sub">{parcelData.familiesResettled} Resettled ({parcelData.rrProgressPct}%)</span>
                    </div>

                    <div className="drawer-stat-card">
                      <span className="stat-card-label">Geo-Coordinates</span>
                      <span className="stat-card-value-small">{parcelData.lat}° N, {parcelData.lng}° E</span>
                      <span className="stat-card-sub">RTK GPS Verified</span>
                    </div>
                  </div>

                  {/* Owner & Legal Card */}
                  <div className="drawer-section-card">
                    <h4 className="section-card-title">Landowner & Title Record (DILRMP)</h4>
                    <div className="drawer-key-values">
                      <div className="kv-row">
                        <span className="kv-key">Primary Landowner(s):</span>
                        <span className="kv-val font-semibold">{parcelData.ownerName}</span>
                      </div>
                      <div className="kv-row">
                        <span className="kv-key">Owner Classification:</span>
                        <span className="kv-val">{parcelData.ownerType}</span>
                      </div>
                      <div className="kv-row">
                        <span className="kv-key">Legal & Possession Status:</span>
                        <span className={`kv-val ${parcelData.status.includes('Disputed') ? 'text-critical font-bold' : ''}`}>
                          {parcelData.legalStatus}
                        </span>
                      </div>
                      {parcelData.slaDelayedDays > 0 && (
                        <div className="kv-row alert-bg-row">
                          <span className="kv-key text-critical">⚠️ SLA Overdue:</span>
                          <span className="kv-val text-critical font-bold">+{parcelData.slaDelayedDays} Days beyond statutory threshold</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Info Card */}
                  <div className="drawer-section-card">
                    <h4 className="section-card-title">Associated National Project</h4>
                    <div className="drawer-key-values">
                      <div className="kv-row">
                        <span className="kv-key">Project:</span>
                        <span className="kv-val font-semibold">{parcelData.project?.name}</span>
                      </div>
                      <div className="kv-row">
                        <span className="kv-key">Sector Type:</span>
                        <span className="kv-val">{parcelData.project?.type}</span>
                      </div>
                      <div className="kv-row">
                        <span className="kv-key">Implementing Agency:</span>
                        <span className="kv-val">{parcelData.project?.implementingAgency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STATUTORY TIMELINE */}
              {activeTab === 'timeline' && (
                <div className="drawer-tab-content">
                  <div className="drawer-timeline-stepper">
                    <div className={`timeline-step-item ${parcelData.notificationDate ? 'done' : 'pending'}`}>
                      <div className="step-bullet">1</div>
                      <div className="step-content">
                        <h5>Section 3A / Section 11 Notification</h5>
                        <p className="step-date">Date: {parcelData.notificationDate || 'Pending Submission'}</p>
                        <span className="step-desc">Publication of preliminary acquisition intention in Gazette of India.</span>
                      </div>
                    </div>

                    <div className={`timeline-step-item ${parcelData.awardDate ? 'done' : parcelData.notificationDate ? 'in-progress' : 'pending'}`}>
                      <div className="step-bullet">2</div>
                      <div className="step-content">
                        <h5>Section 3G / Section 23 Award Declaration</h5>
                        <p className="step-date">Date: {parcelData.awardDate || (parcelData.slaDelayedDays > 0 ? `Delayed (+${parcelData.slaDelayedDays}d)` : 'Under Hearing')}</p>
                        <span className="step-desc">Competent Authority (CALA) determines compensation, solatium & market value.</span>
                      </div>
                    </div>

                    <div className={`timeline-step-item ${parcelData.compensationDisbursed > 0 ? 'done' : 'pending'}`}>
                      <div className="step-bullet">3</div>
                      <div className="step-content">
                        <h5>PFMS Electronic Compensation Disbursal</h5>
                        <p className="step-date">Status: ₹{parcelData.compensationDisbursed} Cr of ₹{parcelData.compensationAssessed} Cr Released</p>
                        <span className="step-desc">Direct electronic bank transfer to verified beneficiary accounts.</span>
                      </div>
                    </div>

                    <div className={`timeline-step-item ${parcelData.possessionDate ? 'done' : 'pending'}`}>
                      <div className="step-bullet">4</div>
                      <div className="step-content">
                        <h5>Physical Possession & R&R Resettlement</h5>
                        <p className="step-date">Date: {parcelData.possessionDate || 'Pending Final Handover'}</p>
                        <span className="step-desc">Execution of Form G possession certificate and mutation in RoR.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DOCUMENTS */}
              {activeTab === 'documents' && (
                <div className="drawer-tab-content">
                  <div className="drawer-docs-list">
                    {parcelData.documents && parcelData.documents.length > 0 ? (
                      parcelData.documents.map((doc) => (
                        <div key={doc.id} className="drawer-doc-card">
                          <div className="doc-icon-box">📄</div>
                          <div className="doc-details">
                            <span className="doc-type-tag">{doc.type}</span>
                            <h5 className="doc-name">{doc.name}</h5>
                            <span className="doc-meta">{doc.uploadedBy} • {doc.uploadedDate} • {doc.fileSize}</span>
                          </div>
                          <button
                            className="doc-download-btn"
                            onClick={() => alert(`Simulating secure download for verified official document: ${doc.name}`)}
                          >
                            ⬇ Download
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state-card">
                        <p>No statutory documents uploaded for this parcel yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: AUDIT TRAIL */}
              {activeTab === 'audit' && (
                <div className="drawer-tab-content">
                  <div className="drawer-audit-list">
                    {parcelData.auditTrail && parcelData.auditTrail.length > 0 ? (
                      parcelData.auditTrail.map((aud) => (
                        <div key={aud.id} className="audit-card-item">
                          <div className="audit-header">
                            <span className="audit-actor">{aud.actor}</span>
                            <span className="audit-time">{aud.timestamp}</span>
                          </div>
                          <h5 className="audit-action">{aud.action}</h5>
                          <p className="audit-remarks">{aud.remarks}</p>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state-card">
                        <p>Initial survey record logged. Further audit entries will populate automatically.</p>
                      </div>
                    )}
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
