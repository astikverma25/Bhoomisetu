import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const MediaGallery = () => {
  const { content } = useLanguage();
  const images = [
    "./assets/images/hero/herovisual1.jpg",
    "./assets/images/hero/herovisual2.jpg",
    "./assets/images/hero/herovisual3.jpg"
  ];
  const [selectedIdx, setSelectedIdx] = useState(1);

  const prev = () => {
    setSelectedIdx(prevIdx => (prevIdx - 1 + images.length) % images.length);
  };

  const next = () => {
    setSelectedIdx(prevIdx => (prevIdx + 1) % images.length);
  };

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="gallery-banner-card">
          <div className="gallery-banner-header">
            <h3>{content.gallery.title}</h3>
            <p>{content.gallery.subtitle}</p>
          </div>

          <div className="gallery-content-grid">
            <div className="gallery-left-visual">
              <img src="./assets/images/hero/herovisual1.jpg" alt="National Conclave on AI in Rural Governance" />
            </div>

            <div className="gallery-right-showcase">
              <div className="gallery-main-featured">
                <img src={images[selectedIdx]} alt="Featured Government Event" />
              </div>
              <div className="gallery-thumbnails-bar">
                <div className="gallery-thumbnails">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`gallery-thumb ${idx === selectedIdx ? 'active' : ''}`}
                      onClick={() => setSelectedIdx(idx)}
                      role="button"
                      aria-label={`Thumbnail ${idx + 1}`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </div>
                  ))}
                </div>
                <div className="gallery-nav-btns">
                  <button
                    type="button"
                    className="gallery-nav-btn"
                    onClick={prev}
                    aria-label="Previous gallery image"
                  >
                    ❮
                  </button>
                  <button
                    type="button"
                    className="gallery-nav-btn"
                    onClick={next}
                    aria-label="Next gallery image"
                  >
                    ❯
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
