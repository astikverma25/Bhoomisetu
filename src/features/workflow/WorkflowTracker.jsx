import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { apiService } from '../../data/service/apiService.js';
import { WORKFLOW_STAGES } from '../../data/schema/types.js';

export const WorkflowTracker = () => {
  const { selectedProject, setSelectedProject, jumpToParcelOnMap } = useDashboard();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    apiService.getProjects().then((data) => {
      setProjects(data);
      if (selectedProject !== 'all') {
        const found = data.find(p => p.id === selectedProject);
        setActiveProject(found || data[0]);
      } else if (data.length > 0) {
        setActiveProject(data[0]);
      }
    });
  }, [selectedProject]);

  useEffect(() => {
    if (activeProject) {
      apiService.getParcels({ projectId: activeProject.id }).then(setParcels);
    }
  }, [activeProject]);

  return (
    <div className="workflow-tracker-view">
      <div className="dash-container">
        {/* Module Header */}
        <div className="module-banner-header">
          <div className="module-title-box">
            <h2>Statutory Land Acquisition Workflow Stepper</h2>
            <p>End-to-End lifecycle tracking from Project Proposal to Final RoR Mutation (RFCTLARR Act 2013 & NH Act 1956)</p>
          </div>

          <div className="project-selector-wrap">
            <label className="proj-select-label">Select Project:</label>
            <select
              className="proj-switcher-dropdown"
              value={activeProject?.id || ''}
              onChange={(e) => {
                const p = projects.find(item => item.id === e.target.value);
                setActiveProject(p);
                setSelectedProject(p.id);
              }}
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {activeProject && (
          <>
            {/* Project Summary Banner Card */}
            <div className="workflow-project-hero-card">
              <div className="hero-left-details">
                <span className="hero-sector-badge">{activeProject.type}</span>
                <h3>{activeProject.name}</h3>
                <p className="hero-agency-text">
                  Agency: <strong>{activeProject.implementingAgency}</strong> | Target Completion: <strong>{activeProject.targetClosureDate}</strong>
                </p>
                <div className="hero-stats-row">
                  <div className="hero-stat-pill">
                    <span>Target Area:</span> <strong>{activeProject.totalAreaProposed} ha</strong>
                  </div>
                  <div className="hero-stat-pill">
                    <span>Acquired:</span> <strong>{activeProject.totalAreaAcquired} ha</strong>
                  </div>
                  <div className="hero-stat-pill">
                    <span>Compensation:</span> <strong>₹{activeProject.compensationDisbursed} / ₹{activeProject.compensationAssessed} Cr</strong>
                  </div>
                  <div className="hero-stat-pill">
                    <span>R&R Progress:</span> <strong>{activeProject.rrProgressPct}% ({activeProject.familiesResettled}/{activeProject.familiesAffected})</strong>
                  </div>
                </div>
              </div>

              <div className="hero-right-status">
                <span className="current-stage-title">Current System Stage:</span>
                <div className="stage-highlight-box">
                  <span className="stage-num">Stage {activeProject.currentStageIndex + 1} of 8</span>
                  <div className="stage-name">{WORKFLOW_STAGES[activeProject.currentStageIndex]?.name || activeProject.status}</div>
                </div>
              </div>
            </div>

            {/* 8-Stage Interactive Stepper (PRD Section 6.3) */}
            <div className="workflow-stepper-container">
              <h3 className="section-block-title">Statutory Stage Progression</h3>
              <div className="stepper-horizontal-bar">
                {WORKFLOW_STAGES.map((stage, idx) => {
                  const isDone = idx < activeProject.currentStageIndex;
                  const isCurrent = idx === activeProject.currentStageIndex;
                  const isPending = idx > activeProject.currentStageIndex;

                  let stepClass = 'step-pending';
                  if (isDone) stepClass = 'step-completed';
                  if (isCurrent) stepClass = 'step-current';

                  return (
                    <div key={stage.id} className={`stepper-node ${stepClass}`}>
                      <div className="node-circle">
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div className="node-content">
                        <span className="node-short-name">{stage.shortName}</span>
                        <span className="node-sla">SLA: {stage.slaDays}d</span>
                      </div>
                      {idx < WORKFLOW_STAGES.length - 1 && <div className="node-connector"></div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Application & Case Cards List (Inspired by Inspiration 3) */}
            <div className="workflow-cases-section">
              <div className="cases-header-flex">
                <h3>Cadastral Survey Parcels in this Project</h3>
                <span className="cases-count-tag">{parcels.length} Registered Plots</span>
              </div>

              <div className="cases-cards-stack">
                {parcels.map((pcl) => {
                  const isProblem = pcl.status.includes('Disputed') || pcl.status.includes('Delayed') || (pcl.status.includes('Possession') && pcl.rrProgressPct < 50);

                  return (
                    <div key={pcl.id} className={`case-card-item ${isProblem ? 'border-problem' : ''}`}>
                      <div className="case-card-header">
                        <div className="case-title-area">
                          <div className="case-icon-box">📌</div>
                          <div>
                            <div className="case-code-row">
                              <span className="case-ulpin">ULPIN: {pcl.ulpin}</span>
                              <span className="case-survey">Survey #{pcl.surveyNumber}</span>
                            </div>
                            <h4 className="case-title">Land Title: {pcl.ownerName} ({pcl.ownerType})</h4>
                          </div>
                        </div>

                        <div className="case-badges-area">
                          {pcl.slaDelayedDays > 0 ? (
                            <span className="badge-overdue">
                              • {pcl.slaDelayedDays} days overdue (Action Needed)
                            </span>
                          ) : (
                            <span className="badge-ontime">
                              • On Schedule (Statutory SLA Compliant)
                            </span>
                          )}
                          <span className={`case-status-badge ${
                            pcl.status.includes('Closed') ? 'st-green' :
                            pcl.status.includes('Disputed') ? 'st-red' :
                            pcl.status.includes('Delayed') ? 'st-amber' : 'st-blue'
                          }`}>
                            {pcl.status}
                          </span>
                        </div>
                      </div>

                      <div className="case-card-grid">
                        <div className="case-meta-col">
                          <span className="meta-label">Acquisition Extent</span>
                          <span className="meta-val"><strong>{pcl.areaHa} ha</strong></span>
                        </div>
                        <div className="case-meta-col">
                          <span className="meta-label">Compensation Assessment</span>
                          <span className="meta-val"><strong>₹{pcl.compensationAssessed} Cr</strong> (Disbursed: ₹{pcl.compensationDisbursed} Cr)</span>
                        </div>
                        <div className="case-meta-col">
                          <span className="meta-label">R&R Resettlement</span>
                          <span className="meta-val"><strong>{pcl.rrProgressPct}%</strong> ({pcl.familiesResettled}/{pcl.familiesAffected} families)</span>
                        </div>
                        <div className="case-meta-col">
                          <span className="meta-label">Current Legal Action</span>
                          <span className="meta-val text-truncate">{pcl.legalStatus}</span>
                        </div>
                      </div>

                      <div className="case-card-footer">
                        <div className="case-actions-group">
                          <button
                            className="btn-track-parcel"
                            onClick={() => jumpToParcelOnMap(pcl.id, pcl.stateId, pcl.districtId)}
                          >
                            🗺️ Locate on GIS Map
                          </button>
                          <button
                            className="btn-inspect-docs"
                            onClick={() => alert(`Opening statutory dossier and CALA award documents for Plot #${pcl.surveyNumber}`)}
                          >
                            📄 View Dossier
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
