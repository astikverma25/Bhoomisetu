import React, { createContext, useContext, useState, useEffect } from 'react';
import { PERSONA_ROLES } from '../data/schema/types.js';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  // Navigation & View Mode
  const [appMode, setAppMode] = useState('landing'); // 'landing' | 'dashboard'
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'map' | 'workflow' | 'alerts' | 'documents' | 'reports' | 'integrations'
  
  // Persona Role Switcher (PRD Section 4 & 6.8)
  const [activeRole, setActiveRole] = useState(PERSONA_ROLES[0]);

  // Global Filters
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedProjectType, setSelectedProjectType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Item for detail inspection (e.g. Slide-in Parcel Drawer)
  const [inspectParcelId, setInspectParcelId] = useState(null);
  const [isParcelDrawerOpen, setIsParcelDrawerOpen] = useState(false);

  // When role changes, adapt view and default filters
  const handleRoleChange = (roleId) => {
    const role = PERSONA_ROLES.find(r => r.id === roleId) || PERSONA_ROLES[0];
    setActiveRole(role);
    if (role.id === 'district_collector') {
      setSelectedState('st_mh');
      setSelectedDistrict('dist_raigad');
      setActiveTab('map');
    } else if (role.id === 'state_official') {
      setSelectedState('st_mh');
      setSelectedDistrict('all');
      setActiveTab('analytics');
    } else if (role.id === 'pia_officer') {
      setSelectedProject('proj_dme_pkg4');
      setActiveTab('workflow');
    } else if (role.id === 'rehab_authority') {
      setActiveTab('analytics');
    } else if (role.id === 'policy_analyst') {
      setActiveTab('reports');
    } else {
      // Central official
      setSelectedState('all');
      setSelectedDistrict('all');
      setSelectedProject('all');
      setActiveTab('analytics');
    }
  };

  const openParcelDetail = (parcelId) => {
    setInspectParcelId(parcelId);
    setIsParcelDrawerOpen(true);
  };

  const closeParcelDetail = () => {
    setIsParcelDrawerOpen(false);
  };

  const jumpToParcelOnMap = (parcelId, stateId = null, districtId = null) => {
    setAppMode('dashboard');
    setActiveTab('map');
    if (stateId) setSelectedState(stateId);
    if (districtId) setSelectedDistrict(districtId);
    setInspectParcelId(parcelId);
    setIsParcelDrawerOpen(true);
  };

  const resetFilters = () => {
    setSelectedState('all');
    setSelectedDistrict('all');
    setSelectedProject('all');
    setSelectedStatus('all');
    setSelectedProjectType('all');
    setSearchQuery('');
  };

  return (
    <DashboardContext.Provider value={{
      appMode,
      setAppMode,
      activeTab,
      setActiveTab,
      activeRole,
      handleRoleChange,
      selectedState,
      setSelectedState,
      selectedDistrict,
      setSelectedDistrict,
      selectedProject,
      setSelectedProject,
      selectedStatus,
      setSelectedStatus,
      selectedProjectType,
      setSelectedProjectType,
      searchQuery,
      setSearchQuery,
      resetFilters,
      inspectParcelId,
      setInspectParcelId,
      isParcelDrawerOpen,
      openParcelDetail,
      closeParcelDetail,
      jumpToParcelOnMap
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
