/**
 * Bhoomisetu National Land Acquisition & Management System
 * Core Data Schema Definitions (PRD Section 7)
 */

export const PROJECT_TYPES = {
  HIGHWAY: 'Highway',
  RAILWAY: 'Railway',
  IRRIGATION: 'Irrigation',
  INDUSTRIAL: 'Industrial Corridor',
  RENEWABLE: 'Renewable Energy',
  URBAN: 'Urban Infrastructure'
};

export const PARCEL_STATUSES = {
  PROPOSED: 'Proposed',
  NOTIFIED: 'Notified',
  AWARD_DECLARED: 'Award Declared',
  COMPENSATION_PAID: 'Compensation Disbursed',
  POSSESSION_TAKEN: 'Possession Taken',
  CLOSED: 'Closed / Possession Complete',
  DISPUTED: 'Disputed / Legal Hold',
  DELAYED: 'Delayed / SLA Breach'
};

export const OWNER_TYPES = {
  PRIVATE: 'Private',
  GOVERNMENT: 'Government',
  COMMUNITY: 'Community / Gram Panchayat'
};

export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  INFO: 'info'
};

export const WORKFLOW_STAGES = [
  { id: 'stage_1', key: 'proposal', name: 'Proposal Submission', shortName: 'Proposal', slaDays: 15 },
  { id: 'stage_2', key: 'scrutiny', name: 'Scrutiny & Feasibility', shortName: 'Scrutiny', slaDays: 21 },
  { id: 'stage_3', key: 'approval', name: 'Administrative Approval', shortName: 'Approval', slaDays: 30 },
  { id: 'stage_4', key: 'notification', name: 'Statutory Notification (Sec 3A/11)', shortName: 'Notification', slaDays: 45 },
  { id: 'stage_5', key: 'award', name: 'Declaration of Award (Sec 3G/23)', shortName: 'Award', slaDays: 60 },
  { id: 'stage_6', key: 'compensation', name: 'Compensation Disbursal (PFMS Direct)', shortName: 'Disbursal', slaDays: 30 },
  { id: 'stage_7', key: 'possession', name: 'Possession & Resettlement (R&R)', shortName: 'Possession', slaDays: 60 },
  { id: 'stage_8', key: 'closure', name: 'Final Closure & Mutation in RoR', shortName: 'Closure', slaDays: 15 }
];

export const PERSONA_ROLES = [
  {
    id: 'central_official',
    name: 'Joint Secretary (MoRTH)',
    title: 'Central Ministry Official',
    department: 'Ministry of Road Transport & Highways',
    state: 'National Level',
    desc: 'National overview, cross-state comparison, policy KPIs',
    defaultView: 'analytics'
  },
  {
    id: 'state_official',
    name: 'State Revenue Secretary',
    title: 'State Government Official',
    department: 'Department of Revenue & Forest',
    state: 'Maharashtra',
    desc: 'State-level progress, district comparisons, state map',
    defaultView: 'analytics'
  },
  {
    id: 'district_collector',
    name: 'District Collector (Raigad)',
    title: 'Competent Authority (CALA)',
    department: 'District Administration',
    state: 'Raigad District, MH',
    desc: 'Case tracking, approvals pending, field parcel awards',
    defaultView: 'map'
  },
  {
    id: 'pia_officer',
    name: 'Project Director (NHAI)',
    title: 'Project Implementing Agency (PIA)',
    department: 'Delhi-Mumbai Expressway Pkg-4',
    state: 'Regional Office',
    desc: 'Track project parcels, compensation, possession timeline',
    defaultView: 'workflow'
  },
  {
    id: 'rehab_authority',
    name: 'R&R Commissioner',
    title: 'Rehabilitation & Resettlement Commissioner',
    department: 'National R&R Authority',
    state: 'Inter-State Oversight',
    desc: 'R&R monitoring, family displacement & compensation oversight',
    defaultView: 'analytics'
  },
  {
    id: 'policy_analyst',
    name: 'Senior Policy Analyst',
    title: 'MIS & Legislative Analyst',
    department: 'NITI Aayog / PM GatiShakti',
    state: 'National Planning',
    desc: 'Trends, statutory compliance metrics, customizable data exports',
    defaultView: 'reports'
  }
];
