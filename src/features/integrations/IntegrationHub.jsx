import React, { useState, useEffect } from 'react';
import { apiService } from '../../data/service/apiService.js';

export const IntegrationHub = () => {
  const [integrations, setIntegrations] = useState([]);
  const [activePayload, setActivePayload] = useState(null);

  useEffect(() => {
    apiService.getIntegrations().then(setIntegrations);
  }, []);

  return (
    <div className="integration-hub-view">
      <div className="dash-container">
        {/* Module Header */}
        <div className="module-banner-header">
          <div className="module-title-box">
            <h2>National Interoperability & Integration Gateway</h2>
            <p>Unified bridge connecting State Cadastral Repositories (DILRMP), PFMS Treasury Direct Benefit, BhuNaksha GIS, and PM Gati Shakti NMP.</p>
          </div>
        </div>

        {/* Integration Cards Grid */}
        <div className="integrations-grid">
          {integrations.map((intg) => (
            <div key={intg.id} className="integration-card-item">
              <div className="intg-card-header">
                <div className="intg-name-box">
                  <span className="intg-protocol-tag">{intg.protocol}</span>
                  <h3 className="intg-title">{intg.name}</h3>
                </div>
                <div className="intg-status-badge">
                  <span className="live-ping-dot"></span>
                  <span>{intg.status}</span>
                </div>
              </div>

              <p className="intg-desc">{intg.description}</p>

              <div className="intg-metrics-strip">
                <div className="intg-metric">
                  <span className="m-label">Uptime SLA</span>
                  <strong className="m-val text-green">{intg.uptime}</strong>
                </div>
                <div className="intg-metric">
                  <span className="m-label">Data Throughput</span>
                  <strong className="m-val">{intg.recordsSynced}</strong>
                </div>
                <div className="intg-metric">
                  <span className="m-label">Sync Pulse</span>
                  <strong className="m-val">{intg.lastSync}</strong>
                </div>
              </div>

              <div className="intg-card-footer">
                <button
                  className="btn-inspect-payload"
                  onClick={() => setActivePayload(intg)}
                >
                  ⚡ Inspect Live API Payload Schema
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payload Inspector Modal */}
        {activePayload && (
          <div className="doc-modal-backdrop" onClick={() => setActivePayload(null)}>
            <div className="doc-modal-dialog payload-modal" onClick={(e) => e.stopPropagation()}>
              <div className="doc-modal-header">
                <div>
                  <h3>{activePayload.name}</h3>
                  <span className="text-muted">Protocol: {activePayload.protocol} • Real-Time JSON Endpoint Schema</span>
                </div>
                <button className="doc-modal-close" onClick={() => setActivePayload(null)}>✕</button>
              </div>

              <div className="doc-modal-body">
                <div className="payload-json-viewer">
                  <pre>{JSON.stringify(activePayload.samplePayload, null, 2)}</pre>
                </div>
              </div>

              <div className="doc-modal-footer">
                <span className="text-sub">API Contract verified against Digital India Land Standards v2.4</span>
                <button className="btn-secondary" onClick={() => setActivePayload(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
