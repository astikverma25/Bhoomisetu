import React, { useState, useEffect } from 'react';

export const SearchModal = ({ isOpen, onClose, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);

  const searchIndex = [
    { title: "Download Digitally Signed RoR (Khatauni)", category: "Citizen Services", desc: "Instant certified Record of Rights copy with QR verification." },
    { title: "Bhu-Aadhaar (ULPIN) Verification", category: "Geo-Spatial", desc: "Lookup 14-digit Unique Land Parcel ID number for any survey plot." },
    { title: "Online Mutation & Title Transfer", category: "Revenue Services", desc: "File succession, sale deed mutation, and track approval status." },
    { title: "Cadastral Map Overlay (BhuNaksha)", category: "GIS Maps", desc: "View satellite geo-referenced survey boundaries and village parcels." },
    { title: "Revenue Court Case Status", category: "Judicial & Disputes", desc: "Check cause list, hearing dates, and stay order status." },
    { title: "Citizen Charter & Delivery SLA 2026", category: "Information", desc: "Guaranteed turnaround times for all land revenue services." },
    { title: "Lodge Grievance (CPGRAMS / MADAD)", category: "Citizen Corner", desc: "Direct complaint portal with 7-day resolution guarantee." }
  ];

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();
  const filtered = searchIndex.filter(item =>
    item.title.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q) ||
    item.desc.toLowerCase().includes(q)
  );

  return (
    <div
      className="search-modal-backdrop open"
      onClick={(e) => {
        if (e.target.classList.contains('search-modal-backdrop')) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="search-modal-dialog">
        <div className="search-modal-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#002147">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search RoR, Bhu-Aadhaar, Cadastral Maps, Services..."
            autoFocus
          />
          <button type="button" className="search-modal-close" onClick={onClose} aria-label="Close Search">
            &times;
          </button>
        </div>

        <div className="search-results-container">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
              No matching revenue services found for "{query}". Try "RoR", "ULPIN", "Mutation" or "Map".
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                className="search-result-item"
                onClick={() => alert(`Selected service: ${item.title}`)}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ea580c', textTransform: 'uppercase' }}>
                  {item.category}
                </span>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
