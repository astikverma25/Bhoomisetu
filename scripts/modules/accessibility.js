/**
 * Accessibility Module
 * Manages Font Scaling (A-, A, A+) and High Contrast View Mode.
 */
export class AccessibilityManager {
  constructor() {
    this.fontSizes = [14, 16, 18];
    this.currentFontIdx = 1; // Default: 16px
    this.contrastToggleBtn = document.getElementById('contrastToggleBtn');
    this.fontDecreaseBtn = document.getElementById('fontDecreaseBtn');
    this.fontNormalBtn = document.getElementById('fontNormalBtn');
    this.fontIncreaseBtn = document.getElementById('fontIncreaseBtn');

    this.init();
  }

  init() {
    if (this.fontDecreaseBtn) {
      this.fontDecreaseBtn.addEventListener('click', () => this.setFontSize(0));
    }
    if (this.fontNormalBtn) {
      this.fontNormalBtn.addEventListener('click', () => this.setFontSize(1));
    }
    if (this.fontIncreaseBtn) {
      this.fontIncreaseBtn.addEventListener('click', () => this.setFontSize(2));
    }

    if (this.contrastToggleBtn) {
      this.contrastToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
      });
    }
  }

  setFontSize(index) {
    this.currentFontIdx = index;
    const size = this.fontSizes[this.currentFontIdx];
    document.documentElement.style.fontSize = `${size}px`;
  }
}
