import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAutoCarousel } from '../../hooks/useAutoCarousel';

export const HeroCarousel = () => {
  const { content } = useLanguage();
  const slides = content.heroSlides;
  const { currentIndex, next, prev, goTo, pause, play } = useAutoCarousel(slides.length, 6000);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  return (
    <section
      className="hero-carousel-section"
      aria-label="Hero Spotlight Slider"
      onMouseEnter={pause}
      onMouseLeave={play}
    >
      <div className="container hero-slider-container">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-slide ${idx === currentIndex ? 'active' : ''}`}
            style={{ display: idx === currentIndex ? 'grid' : 'none' }}
          >
            <div className="hero-content">
              <span className="hero-badge">{slide.tag}</span>
              <h1 className="hero-title">{slide.title}</h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="hero-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                <span>{slide.date}</span>
              </div>
              <div>
                <a href={slide.ctaLink} className="hero-cta-btn">
                  {slide.ctaText}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="hero-visual-wrapper">
              <div className="hero-image-frame">
                <img src={slide.image} alt={slide.title} />
              </div>
              <div className="hero-nav-controls">
                <div className="hero-dots">
                  {slides.map((_, dIdx) => (
                    <span
                      key={dIdx}
                      className={`hero-dot ${dIdx === currentIndex ? 'active' : ''}`}
                      onClick={() => goTo(dIdx)}
                      role="button"
                      aria-label={`Go to slide ${dIdx + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="hero-nav-btn hero-prev-btn"
                  onClick={prev}
                  aria-label="Previous Slide"
                >
                  ❮
                </button>
                <button
                  type="button"
                  className="hero-nav-btn hero-next-btn"
                  onClick={next}
                  aria-label="Next Slide"
                >
                  ❯
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
