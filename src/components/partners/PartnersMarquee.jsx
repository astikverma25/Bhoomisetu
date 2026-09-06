import React from 'react';

export const PartnersMarquee = () => {
  const partnerLogos = [
    { src: './assets/images/partners/make-in-india.svg', alt: 'Make in India' },
    { src: './assets/images/partners/invest-india.svg', alt: 'Invest India' },
    { src: './assets/images/partners/madad.svg', alt: 'MADAD Portal' },
    { src: './assets/images/partners/bharat-quiz.svg', alt: 'Bharat Quiz / MyGov' },
    { src: './assets/images/partners/pravasi-bharatiya.svg', alt: 'Pravasi Bharatiya Divas' }
  ];

  const institutionalLogos = [
    { src: './assets/images/partners/india-gov.svg', alt: 'National Portal of India' },
    { src: './assets/images/partners/incredible-india.svg', alt: 'Incredible India' },
    { src: './assets/images/partners/india-africa.svg', alt: 'India Africa' },
    { src: './assets/images/partners/iig.svg', alt: 'India Investment Grid' },
    { src: './assets/images/partners/mea-logo.svg', alt: 'Ministry of Rural Development' },
    { src: './assets/images/partners/iccr-logo.svg', alt: 'NIC DILRMP' }
  ];

  return (
    <>
      <section className="partners-carousel-section" aria-label="National Initiatives and Programs">
        <div className="container partners-slider-wrapper">
          <div className="partners-track">
            {partnerLogos.concat(partnerLogos).map((logo, idx) => (
              <div key={idx} className="partner-logo-item">
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="institutional-partners-strip">
        <div className="container institutional-logos-grid">
          {institutionalLogos.map((inst, idx) => (
            <div key={idx} className="inst-logo-card">
              <img src={inst.src} alt={inst.alt} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
