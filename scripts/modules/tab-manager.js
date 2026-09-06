/**
 * Tab Manager for About BhoomiSetu Section
 * Switches vertical menu items and updates content details smoothly.
 */
export class TabManager {
  constructor(options = {}) {
    this.tabButtons = document.querySelectorAll(options.tabButtonSelector || '.about-tab-btn');
    this.contentHeading = document.querySelector(options.headingSelector || '#aboutTabHeading');
    this.contentBody = document.querySelector(options.bodySelector || '#aboutTabBody');
    this.contentLink = document.querySelector(options.linkSelector || '#aboutTabLink');
    this.tabsData = options.data || [];

    this.init();
  }

  init() {
    this.tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tabId = button.getAttribute('data-tab');
        this.setActiveTab(tabId);
      });
    });
  }

  updateData(newData) {
    this.tabsData = newData;
    const activeBtn = document.querySelector('.about-tab-btn.active');
    if (activeBtn) {
      this.setActiveTab(activeBtn.getAttribute('data-tab'));
    }
  }

  setActiveTab(tabId) {
    this.tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    const itemData = this.tabsData.find(item => item.id === tabId);
    if (itemData) {
      if (this.contentHeading) this.contentHeading.textContent = itemData.contentHeading;
      if (this.contentBody) this.contentBody.textContent = itemData.contentBody;
      if (this.contentLink) this.contentLink.textContent = itemData.linkText;
    }
  }
}
