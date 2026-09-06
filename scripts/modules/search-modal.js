/**
 * Search Modal Controller
 * Provides quick citizen portal lookup and shortcut search.
 */
export class SearchModal {
  constructor() {
    this.searchBtn = document.getElementById('searchSubmitBtn');
    this.headerInput = document.getElementById('headerSearchInput');
    this.modalBackdrop = document.getElementById('searchModal');
    this.modalInput = document.getElementById('modalSearchInput');
    this.modalClose = document.getElementById('searchModalClose');
    this.resultsContainer = document.getElementById('searchResultsContainer');

    this.searchIndex = [
      { title: "Download Digitally Signed RoR (Khatauni)", category: "Citizen Services", desc: "Instant certified Record of Rights copy with QR verification." },
      { title: "Bhu-Aadhaar (ULPIN) Verification", category: "Geo-Spatial", desc: "Lookup 14-digit Unique Land Parcel ID number for any survey plot." },
      { title: "Online Mutation & Title Transfer", category: "Revenue Services", desc: "File succession, sale deed mutation, and track approval status." },
      { title: "Cadastral Map Overlay (BhuNaksha)", category: "GIS Maps", desc: "View satellite geo-referenced survey boundaries and village parcels." },
      { title: "Revenue Court Case Status", category: "Judicial & Disputes", desc: "Check cause list, hearing dates, and stay order status." },
      { title: "Citizen Charter & Delivery SLA 2026", category: "Information", desc: "Guaranteed turnaround times for all land revenue services." },
      { title: "Lodge Grievance (CPGRAMS / MADAD)", category: "Citizen Corner", desc: "Direct complaint portal with 7-day resolution guarantee." }
    ];

    this.init();
  }

  init() {
    if (this.searchBtn) {
      this.searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(this.headerInput ? this.headerInput.value : '');
      });
    }

    if (this.headerInput) {
      this.headerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.open(this.headerInput.value);
        }
      });
    }

    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => this.close());
    }

    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.modalBackdrop) this.close();
      });
    }

    if (this.modalInput) {
      this.modalInput.addEventListener('input', (e) => {
        this.filterResults(e.target.value);
      });
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalBackdrop && this.modalBackdrop.classList.contains('open')) {
        this.close();
      }
    });
  }

  open(query = '') {
    if (!this.modalBackdrop) return;
    this.modalBackdrop.classList.add('open');
    if (this.modalInput) {
      this.modalInput.value = query;
      this.modalInput.focus();
    }
    this.filterResults(query);
  }

  close() {
    if (this.modalBackdrop) {
      this.modalBackdrop.classList.remove('open');
    }
  }

  filterResults(query) {
    if (!this.resultsContainer) return;

    const q = (query || '').toLowerCase().trim();
    const filtered = this.searchIndex.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.category.toLowerCase().includes(q) || 
      item.desc.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      this.resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 20px; color: #64748b;">
          No matching revenue services found for "${query}". Try "RoR", "ULPIN", "Mutation" or "Map".
        </div>
      `;
      return;
    }

    this.resultsContainer.innerHTML = filtered.map(item => `
      <div class="search-result-item" onclick="alert('Redirecting to: ${item.title}');">
        <span style="font-size: 0.75rem; font-weight: 700; color: #ea580c; text-transform: uppercase;">${item.category}</span>
        <h5>${item.title}</h5>
        <p>${item.desc}</p>
      </div>
    `).join('');
  }
}
