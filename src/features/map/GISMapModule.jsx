import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../context/DashboardContext.jsx';
import { apiService } from '../../data/service/apiService.js';
import { ParcelDetailDrawer } from './ParcelDetailDrawer.jsx';

export const GISMapModule = () => {
  const {
    selectedState,
    setSelectedState,
    selectedDistrict,
    setSelectedDistrict,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    inspectParcelId,
    openParcelDetail,
    closeParcelDetail,
    isParcelDrawerOpen
  } = useDashboard();

  const [parcels, setParcels] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [activeParcel, setActiveParcel] = useState(null);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapCenter, setMapCenter] = useState([21.7679, 78.8718]); // India center
  const [statusFilter, setStatusFilter] = useState('all');
  const [layerType, setLayerType] = useState('cadastral'); // 'cadastral' | 'satellite' | 'heatmap'

  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersGroupRef = useRef(null);

  // Load datasets
  useEffect(() => {
    Promise.all([
      apiService.getStates(),
      apiService.getDistricts(selectedState)
    ]).then(([st, dt]) => {
      setStates(st);
      setDistricts(dt);
    });
  }, [selectedState]);

  // Load parcels based on active filters
  useEffect(() => {
    apiService.getParcels({
      stateId: selectedState,
      districtId: selectedDistrict,
      status: statusFilter !== 'all' ? statusFilter : selectedStatus,
      search: searchQuery
    }).then((data) => {
      setParcels(data);
      if (data.length > 0 && !inspectParcelId) {
        setActiveParcel(data[0]);
      }
    });
  }, [selectedState, selectedDistrict, selectedStatus, statusFilter, searchQuery, inspectParcelId]);

  // Set map center if state is selected
  useEffect(() => {
    if (selectedState !== 'all') {
      const st = states.find(s => s.id === selectedState);
      if (st && st.center) {
        setMapCenter(st.center);
        setMapZoom(st.zoom || 7);
        if (leafletMapRef.current) {
          leafletMapRef.current.setView(st.center, st.zoom || 7);
        }
      }
    } else {
      setMapCenter([21.7679, 78.8718]);
      setMapZoom(5);
      if (leafletMapRef.current) {
        leafletMapRef.current.setView([21.7679, 78.8718], 5);
      }
    }
  }, [selectedState, states]);

  // Handle direct parcel inspection
  useEffect(() => {
    if (inspectParcelId) {
      const found = parcels.find(p => p.id === inspectParcelId);
      if (found) {
        setActiveParcel(found);
        if (leafletMapRef.current) {
          leafletMapRef.current.setView([found.lat, found.lng], 12);
        }
      }
    }
  }, [inspectParcelId, parcels]);

  // Initialize Leaflet Map if available in window, or fallback gracefully
  useEffect(() => {
    if (typeof window !== 'undefined' && window.L && mapContainerRef.current && !leafletMapRef.current) {
      try {
        const map = window.L.map(mapContainerRef.current, {
          center: mapCenter,
          zoom: mapZoom,
          zoomControl: false
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors | BhoomiSetu GIS'
        }).addTo(map);

        window.L.control.zoom({ position: 'topright' }).addTo(map);

        const markersGroup = window.L.layerGroup().addTo(map);
        leafletMapRef.current = map;
        markersGroupRef.current = markersGroup;
      } catch (e) {
        console.warn('Leaflet init error', e);
      }
    }
  }, []);

  // Update Leaflet markers when parcels change
  useEffect(() => {
    if (leafletMapRef.current && markersGroupRef.current && window.L) {
      markersGroupRef.current.clearLayers();

      parcels.forEach((pcl) => {
        let color = '#2563eb';
        if (pcl.status.includes('Disputed')) color = '#dc2626';
        else if (pcl.status.includes('Closed') || pcl.status.includes('Possession')) color = '#16a34a';
        else if (pcl.status.includes('Delayed')) color = '#d97706';

        const customIcon = window.L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: bold;">📍</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = window.L.marker([pcl.lat, pcl.lng], { icon: customIcon });
        marker.bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 4px;">
            <strong style="font-size: 13px; color: #002147;">Survey Plot #${pcl.surveyNumber}</strong><br/>
            <span style="font-size: 11px; color: #64748b;">ULPIN: ${pcl.ulpin}</span><br/>
            <span style="display:inline-block; margin-top:4px; padding: 2px 8px; border-radius: 99px; background: ${color}22; color: ${color}; font-weight: 700; font-size: 10px;">${pcl.status}</span><br/>
            <small style="color: #334155;">Area: <b>${pcl.areaHa} ha</b> | Comp: <b>₹${pcl.compensationAssessed} Cr</b></small>
          </div>
        `);

        marker.on('click', () => {
          setActiveParcel(pcl);
          openParcelDetail(pcl.id);
        });

        marker.addTo(markersGroupRef.current);
      });
    }
  }, [parcels, openParcelDetail]);

  const getStatusColor = (status) => {
    if (status.includes('Disputed')) return 'color-red';
    if (status.includes('Closed') || status.includes('Possession')) return 'color-green';
    if (status.includes('Delayed') || status.includes('Pending')) return 'color-amber';
    return 'color-blue';
  };

  return (
    <div className="gis-map-module-view">
      {/* 1. Floating Top Glassmorphic Filter Pill Bar (From Inspiration 1) */}
      <div className="gis-floating-topbar">
        <div className="gis-topbar-pill-card">
          <div className="gis-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              className="gis-search-input"
              placeholder="Search Survey #, ULPIN, District, Landowner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="gis-pills-row">
            <select
              className="gis-pill-select"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="all">📍 All States (National)</option>
              {states.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>

            <select
              className="gis-pill-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={districts.length === 0}
            >
              <option value="all">District: All</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <div className="gis-layer-toggles">
              <button
                className={`layer-btn ${layerType === 'cadastral' ? 'active' : ''}`}
                onClick={() => setLayerType('cadastral')}
              >
                🗺️ Cadastral
              </button>
              <button
                className={`layer-btn ${layerType === 'satellite' ? 'active' : ''}`}
                onClick={() => setLayerType('satellite')}
              >
                🛰️ Satellite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Floating Left Accordion Categories Panel (From Inspiration 1) */}
      <div className="gis-floating-left-panel">
        <div className="gis-category-card">
          <div className="category-card-header">
            <h4>Acquisition Status Filter</h4>
            <span className="total-badge">{parcels.length} Parcels</span>
          </div>

          <div className="status-accordion-list">
            <div
              className={`status-filter-item ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              <span className="status-indicator-dot dot-all"></span>
              <span className="status-title">All Stages</span>
              <span className="count-tag">{parcels.length}</span>
            </div>

            <div
              className={`status-filter-item ${statusFilter === 'Possession Taken' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Possession Taken')}
            >
              <span className="status-indicator-dot dot-green"></span>
              <span className="status-title">Possession Taken</span>
              <span className="count-tag">{parcels.filter(p => p.status.includes('Possession') || p.status.includes('Closed')).length}</span>
            </div>

            <div
              className={`status-filter-item ${statusFilter === 'Award Declared' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Award Declared')}
            >
              <span className="status-indicator-dot dot-blue"></span>
              <span className="status-title">Award Declared</span>
              <span className="count-tag">{parcels.filter(p => p.status.includes('Award') || p.status.includes('Disbursed')).length}</span>
            </div>

            <div
              className={`status-filter-item ${statusFilter === 'Notified' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Notified')}
            >
              <span className="status-indicator-dot dot-amber"></span>
              <span className="status-title">Statutory Notified</span>
              <span className="count-tag">{parcels.filter(p => p.status.includes('Notified') || p.status.includes('Proposed')).length}</span>
            </div>

            <div
              className={`status-filter-item ${statusFilter === 'Disputed / Legal Hold' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Disputed / Legal Hold')}
            >
              <span className="status-indicator-dot dot-red"></span>
              <span className="status-title">Legal Stay / Disputed</span>
              <span className="count-tag">{parcels.filter(p => p.status.includes('Disputed') || p.status.includes('Delayed')).length}</span>
            </div>
          </div>

          <div className="gis-cadastral-meta">
            <div className="meta-row">
              <span>GeoServer WFS:</span>
              <span className="text-green font-bold">Connected (DILRMP)</span>
            </div>
            <div className="meta-row">
              <span>Projection:</span>
              <span>EPSG:4326 (WGS84)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Map Canvas Container */}
      <div className="gis-map-canvas-container" ref={mapContainerRef}>
        {/* Fallback Vector Visual Canvas if Leaflet tiles are loading */}
        <div className="gis-vector-overlay">
          <div className="interactive-map-hud">
            {parcels.map((p) => {
              const isSelected = activeParcel?.id === p.id;
              return (
                <div
                  key={p.id}
                  className={`vector-parcel-pin ${getStatusColor(p.status)} ${isSelected ? 'selected' : ''}`}
                  style={{
                    left: `${Math.max(10, Math.min(85, ((p.lng - 68) / (88 - 68)) * 100))}%`,
                    top: `${Math.max(15, Math.min(80, ((32 - p.lat) / (32 - 10)) * 100))}%`
                  }}
                  onClick={() => {
                    setActiveParcel(p);
                    openParcelDetail(p.id);
                  }}
                  title={`Plot #${p.surveyNumber} (${p.status})`}
                >
                  <div className="pin-badge">Plot #{p.surveyNumber}</div>
                  <div className="pin-dot"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Bottom Horizontal Quick Inspection Cards Strip (From Inspiration 1) */}
      <div className="gis-floating-bottom-strip">
        <div className="bottom-cards-scroll">
          {parcels.map((p) => {
            const isSelected = activeParcel?.id === p.id;
            return (
              <div
                key={p.id}
                className={`gis-parcel-card ${isSelected ? 'active-card' : ''}`}
                onClick={() => {
                  setActiveParcel(p);
                  openParcelDetail(p.id);
                }}
              >
                <div className="pcl-card-top">
                  <span className="pcl-survey-no">Survey #{p.surveyNumber}</span>
                  <span className={`pcl-status-tag ${getStatusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
                <div className="pcl-card-mid">
                  <div className="pcl-owner-text">{p.ownerName}</div>
                  <div className="pcl-ulpin-text">ULPIN: {p.ulpin}</div>
                </div>
                <div className="pcl-card-bottom">
                  <span>Area: <strong>{p.areaHa} ha</strong></span>
                  <span>Comp: <strong>₹{p.compensationAssessed} Cr</strong></span>
                  <button className="pcl-inspect-btn">Inspect ›</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Slide-in Parcel Detail Drawer */}
      <ParcelDetailDrawer
        parcelId={inspectParcelId || activeParcel?.id}
        isOpen={isParcelDrawerOpen}
        onClose={closeParcelDetail}
      />
    </div>
  );
};
