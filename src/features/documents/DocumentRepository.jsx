import React, { useState, useEffect } from 'react';
import { apiService } from '../../data/service/apiService.js';

export const DocumentRepository = () => {
  const [documents, setDocuments] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchDoc, setSearchDoc] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showUploadToast, setShowUploadToast] = useState(false);

  useEffect(() => {
    apiService.getDocuments().then(setDocuments);
  }, []);

  const filteredDocs = documents.filter(d => {
    const matchesType = filterType === 'all' || d.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch = searchDoc === '' || d.name.toLowerCase().includes(searchDoc.toLowerCase()) || d.type.toLowerCase().includes(searchDoc.toLowerCase()) || d.uploadedBy.toLowerCase().includes(searchDoc.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleUploadClick = () => {
    setShowUploadToast(true);
    setTimeout(() => setShowUploadToast(false), 4000);
  };

  return (
    <div className="document-repo-view">
      <div className="dash-container">
        {/* Module Header */}
        <div className="module-banner-header">
          <div className="module-title-box">
            <h2>Statutory Document & Gazette Repository</h2>
            <p>Cryptographically signed Gazette Notifications (Sec 3A/3D/11), CALA Award Declarations, Court Orders, and Form-G Possession Certificates.</p>
          </div>

          <button className="btn-primary-upload" onClick={handleUploadClick}>
            📤 Upload Statutory Gazette Order
          </button>
        </div>

        {/* Upload Integration Toast */}
        {showUploadToast && (
          <div className="doc-upload-toast">
            <div className="toast-icon">ℹ️</div>
            <div className="toast-text">
              <strong>Government e-Locker Integration Stub</strong>
              <p>Connect secure NIC S3/e-Sign document vault to enable live multi-party gazette uploads.</p>
            </div>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="doc-search-filter-card">
          <div className="doc-search-input-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search by file name, gazette notification number, or issuing office..."
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
            />
          </div>

          <div className="doc-category-pills">
            <button className={`doc-pill ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>
              All Categories ({documents.length})
            </button>
            <button className={`doc-pill ${filterType === 'Notification' ? 'active' : ''}`} onClick={() => setFilterType('Notification')}>
              Gazette Notifications
            </button>
            <button className={`doc-pill ${filterType === 'Award' ? 'active' : ''}`} onClick={() => setFilterType('Award')}>
              Award Orders
            </button>
            <button className={`doc-pill ${filterType === 'Possession' ? 'active' : ''}`} onClick={() => setFilterType('Possession')}>
              Possession Certificates
            </button>
            <button className={`doc-pill ${filterType === 'Legal' ? 'active' : ''}`} onClick={() => setFilterType('Legal')}>
              High Court Orders
            </button>
          </div>
        </div>

        {/* Documents Grid Table */}
        <div className="dash-table-card">
          <div className="dash-table-responsive">
            <table className="dash-data-table">
              <thead>
                <tr>
                  <th>Document Title & Type</th>
                  <th>Version</th>
                  <th>Uploaded By & Issuing Authority</th>
                  <th>Date</th>
                  <th>Size</th>
                  <th>Verification</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="doc-row-title">
                        <span className="doc-file-icon">📄</span>
                        <div>
                          <strong className="doc-filename">{doc.name}</strong>
                          <span className="doc-type-badge">{doc.type}</span>
                        </div>
                      </div>
                    </td>
                    <td><span className="doc-ver-pill">{doc.version}</span></td>
                    <td><div className="doc-uploader-text">{doc.uploadedBy}</div></td>
                    <td><span className="doc-date">{doc.uploadedDate}</span></td>
                    <td><span className="doc-size">{doc.fileSize}</span></td>
                    <td>
                      <span className="doc-verified-badge">
                        🛡️ e-Sign Verified
                      </span>
                    </td>
                    <td>
                      <div className="doc-actions-cell">
                        <button
                          className="btn-doc-preview"
                          onClick={() => setPreviewDoc(doc)}
                        >
                          👁️ Preview
                        </button>
                        <button
                          className="btn-doc-download"
                          onClick={() => alert(`Downloading official PDF copy: ${doc.name}`)}
                        >
                          ⬇ PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Preview Modal */}
        {previewDoc && (
          <div className="doc-modal-backdrop" onClick={() => setPreviewDoc(null)}>
            <div className="doc-modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="doc-modal-header">
                <div>
                  <h3>{previewDoc.name}</h3>
                  <span className="text-muted">{previewDoc.type} • {previewDoc.uploadedBy}</span>
                </div>
                <button className="doc-modal-close" onClick={() => setPreviewDoc(null)}>✕</button>
              </div>
              <div className="doc-modal-body">
                <div className="document-sample-viewer">
                  <div className="sample-gazette-header">
                    <h4>THE GAZETTE OF INDIA : EXTRAORDINARY</h4>
                    <h5>MINISTRY OF ROAD TRANSPORT AND HIGHWAYS / DILRMP</h5>
                    <p>New Delhi, Gazette Notification No. S.O. 4410(E)</p>
                  </div>
                  <div className="sample-gazette-content">
                    <p>
                      <strong>NOTIFICATION:</strong> In exercise of the powers conferred by sub-section (1) of Section 3A of the National Highways Act, 1956 (48 of 1956), the Central Government hereby declares its intention to acquire the land specified in the Schedule annexed hereto for building (four-laning/six-laning) of the National Highway corridor.
                    </p>
                    <p>
                      Any person interested in the said land may, within twenty-one days from the date of publication of this notification in the Official Gazette, object to the use of such land under Section 3C.
                    </p>
                    <div className="sample-gazette-seal">
                      <span>[Digitally Signed by CALA Competent Authority]</span>
                      <small>e-Aadhaar Sign Timestamp: {previewDoc.uploadedDate} 10:42:15 IST</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="doc-modal-footer">
                <button className="btn-secondary" onClick={() => setPreviewDoc(null)}>Close</button>
                <button className="btn-primary" onClick={() => alert(`Downloading verified copy of ${previewDoc.name}`)}>⬇ Download Certified PDF</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
