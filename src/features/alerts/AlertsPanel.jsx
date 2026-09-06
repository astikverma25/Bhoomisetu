import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { apiService } from '../../data/service/apiService.js';

export const AlertsPanel = () => {
  const { jumpToParcelOnMap } = useDashboard();
  const [alerts, setAlerts] = useState([]);
  const [activeSeverity, setActiveSeverity] = useState('all');

  useEffect(() => {
    apiService.getAlerts(activeSeverity).then(setAlerts);
  }, [activeSeverity]);

  return (
    <div className="alerts-panel-view">
      <div className="dash-container">
        {/* Header */}
        <div className="module-banner-header">
          <div className="module-title-box">
            <h2>Statutory SLA & Automated Monitoring Engine</h2>
            <p>Real-time rule engine detecting statutory delays, pending CALA awards, PFMS disbursal lags, and R&R imbalances.</p>
          </div>

          <div className="severity-filter-pills">
            <button
              className={`sev-pill ${activeSeverity === 'all' ? 'active' : ''}`}
              onClick={() => setActiveSeverity('all')}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              className={`sev-pill sev-critical ${activeSeverity === 'critical' ? 'active' : ''}`}
              onClick={() => setActiveSeverity('critical')}
            >
              🚨 Critical Breaches
            </button>
            <button
              className={`sev-pill sev-high ${activeSeverity === 'high' ? 'active' : ''}`}
              onClick={() => setActiveSeverity('high')}
            >
              ⚠️ High Priority
            </button>
          </div>
        </div>

        {/* Alerts Cards List */}
        <div className="alerts-cards-grid">
          {alerts.map((alt) => {
            const isCritical = alt.severity === 'critical';
            const isHigh = alt.severity === 'high';

            return (
              <div key={alt.id} className={`alert-card-item ${isCritical ? 'card-critical' : isHigh ? 'card-high' : 'card-medium'}`}>
                <div className="alert-card-topbar">
                  <div className="alert-rule-tag">
                    <span className="alert-icon">{isCritical ? '🚨' : isHigh ? '⚠️' : 'ℹ️'}</span>
                    <span>{alt.ruleCategory}</span>
                  </div>
                  <span className="alert-date-badge">Logged: {alt.createdDate}</span>
                </div>

                <h3 className="alert-title-text">{alt.title}</h3>
                <p className="alert-message-text">{alt.message}</p>

                <div className="alert-action-box">
                  <div className="action-required-label">
                    <strong>Recommended Statutory Action:</strong>
                    <span>{alt.actionRequired}</span>
                  </div>

                  <button
                    className="btn-resolve-alert"
                    onClick={() => jumpToParcelOnMap(alt.relatedId)}
                  >
                    🗺️ Inspect in GIS Cockpit →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
