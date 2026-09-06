import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { apiService } from '../../data/service/apiService.js';
import { PROJECT_TYPES, PARCEL_STATUSES } from '../../data/schema/types.js';

export const DashboardFilterBar = () => {
  const {
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedProjectType,
    setSelectedProjectType,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    resetFilters
  } = useDashboard();

  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  useEffect(() => {
    apiService.getStates().then(setStatesList);
  }, []);

  useEffect(() => {
    apiService.getDistricts(selectedState).then(setDistrictsList);
    if (selectedState === 'all') {
      setSelectedDistrict('all');
    }
  }, [selectedState, setSelectedDistrict]);

  const hasActiveFilters =
    selectedState !== 'all' ||
    selectedDistrict !== 'all' ||
    selectedProjectType !== 'all' ||
    selectedStatus !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div className="dash-filter-bar">
      <div className="dash-container filter-bar-inner">
        {/* Search input */}
        <div className="filter-item search-box-wrap">
          <svg className="filter-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search Survey #, ULPIN, Owner, Project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {/* State dropdown */}
        <div className="filter-item">
          <label className="filter-label">State</label>
          <select
            className="filter-select"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('all');
            }}
          >
            <option value="all">All States (National)</option>
            {statesList.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>

        {/* District dropdown */}
        <div className="filter-item">
          <label className="filter-label">District</label>
          <select
            className="filter-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={districtsList.length === 0}
          >
            <option value="all">All Districts</option>
            {districtsList.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Project Sector Type */}
        <div className="filter-item">
          <label className="filter-label">Sector</label>
          <select
            className="filter-select"
            value={selectedProjectType}
            onChange={(e) => setSelectedProjectType(e.target.value)}
          >
            <option value="all">All Sectors</option>
            {Object.values(PROJECT_TYPES).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="filter-item">
          <label className="filter-label">Status Stage</label>
          <select
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status Stages</option>
            {Object.values(PARCEL_STATUSES).map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <button className="filter-reset-btn" onClick={resetFilters} title="Reset all filters">
            ↺ Reset
          </button>
        )}
      </div>
    </div>
  );
};
