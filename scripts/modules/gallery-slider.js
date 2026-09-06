/**
 * Gallery Slider Controller
 * Controls photo gallery thumbnails and featured image display.
 */
export class GallerySlider {
  constructor() {
    this.featuredImg = document.getElementById('galleryFeaturedImg');
    this.thumbnails = document.querySelectorAll('.gallery-thumb');
    this.prevBtn = document.querySelector('.gallery-prev-btn');
    this.nextBtn = document.querySelector('.gallery-next-btn');
    
    this.currentIndex = 0;
    this.images = [
      "./assets/images/hero/herovisual1.jpg",
      "./assets/images/hero/herovisual2.jpg",
      "./assets/images/hero/herovisual3.jpg"
    ];

    this.init();
  }

  init() {
    if (!this.featuredImg || this.thumbnails.length === 0) return;

    this.thumbnails.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => {
        this.selectImage(idx);
      });
    });

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.selectImage((this.currentIndex - 1 + this.images.length) % this.images.length);
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.selectImage((this.currentIndex + 1) % this.images.length);
      });
    }
  }

  selectImage(index) {
    this.currentIndex = index;
    if (this.featuredImg) {
      this.featuredImg.src = this.images[this.currentIndex];
    }
    this.thumbnails.forEach((thumb, idx) => {
      thumb.classList.toggle('active', idx === this.currentIndex);
    });
  }
}
