/**
 * Hero Slider Controller
 * Supports automatic slide advance, multiple next/previous buttons, and synchronized dot indicators.
 */
export class HeroSlider {
  constructor(containerSelector, autoPlayInterval = 6000) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;

    this.slides = Array.from(this.container.querySelectorAll('.hero-slide'));
    this.prevBtns = Array.from(this.container.querySelectorAll('.hero-prev-btn'));
    this.nextBtns = Array.from(this.container.querySelectorAll('.hero-next-btn'));
    this.dotGroups = Array.from(this.container.querySelectorAll('.hero-dots'));
    
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = autoPlayInterval;
    this.timer = null;

    this.init();
  }

  init() {
    if (this.totalSlides === 0) return;

    // Attach to ALL prev buttons across all slides
    this.prevBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.prevSlide();
        this.resetAutoplay();
      });
    });

    // Attach to ALL next buttons across all slides
    this.nextBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.nextSlide();
        this.resetAutoplay();
      });
    });

    // Attach click listeners to all dots in all groups
    this.dotGroups.forEach(group => {
      const dots = Array.from(group.querySelectorAll('.hero-dot'));
      dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.goToSlide(index);
          this.resetAutoplay();
        });
      });
    });

    // Keyboard arrow keys navigation
    document.addEventListener('keydown', (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
        this.resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
        this.resetAutoplay();
      }
    });

    this.startAutoplay();

    // Pause on hover
    this.container.addEventListener('mouseenter', () => this.stopAutoplay());
    this.container.addEventListener('mouseleave', () => this.startAutoplay());
  }

  goToSlide(index) {
    if (this.totalSlides === 0) return;

    // Remove active class from current slide
    this.slides[this.currentIndex].classList.remove('active');

    // Update index
    this.currentIndex = (index + this.totalSlides) % this.totalSlides;

    // Add active class to new slide
    this.slides[this.currentIndex].classList.add('active');

    // Synchronize all dot groups
    this.dotGroups.forEach(group => {
      const dots = group.querySelectorAll('.hero-dot');
      dots.forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === this.currentIndex);
      });
    });
  }

  nextSlide() {
    this.goToSlide(this.currentIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.currentIndex - 1);
  }

  startAutoplay() {
    if (!this.timer && this.autoPlayInterval > 0) {
      this.timer = setInterval(() => this.nextSlide(), this.autoPlayInterval);
    }
  }

  stopAutoplay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}
