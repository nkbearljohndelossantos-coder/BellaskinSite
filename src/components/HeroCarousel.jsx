import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase, resolveImageUrl } from '../lib/supabaseClient';
import './HeroCarousel.css';

const HeroCarousel = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [globalShopeeLink, setGlobalShopeeLink] = useState('https://shopee.ph/bellaskinph');


  useEffect(() => {
    fetchSlides();
  }, []);
  const fetchSlides = async () => {
    try {
      const { data: config, error: cfgError } = await supabase.from('site_configs').select('shopee_link').eq('id', 'global').single();
      if (!cfgError && config && config.shopee_link) {
        setGlobalShopeeLink(config.shopee_link);
      }

      const { data, error } = await supabase
        .from('whats_new')
        .select('*')
        .eq('is_active', true)
        .not('image_url', 'is', null)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const dynamicSlides = data.map((item) => ({
          id: item.id,
          image: item.image_url,
          title: item.title,
          subtitle: item.content || item.subtitle,
          buttonText: item.link_url ? 'Discover More' : 'View Collection',
          link: item.link_url
        }));
        setSlides(dynamicSlides);
      }
    } catch (err) {
      console.warn('Carousel sync failed, using defaults.');
    }
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) return null;

  return (
    <div className="hero-carousel">
      <div 
        className="carousel-track" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div className="carousel-slide" key={slide.id}>
            <div className="slide-image-container">
              <img src={resolveImageUrl(slide.image)} alt={slide.title} className="slide-image" />
              <div className="slide-overlay"></div>
            </div>
            <div className={`slide-content ${currentSlide === index ? 'active' : ''}`}>
              <h1 className="fade-in-up">{slide.title}</h1>
              <p className="fade-in-up delay-1">{slide.subtitle}</p>
              {slide.link ? (
                <a href={slide.link} className="btn-primary fade-in-up delay-2" style={{display: 'inline-block'}}>{slide.buttonText}</a>
              ) : (
                <a href={globalShopeeLink} target="_blank" rel="noopener noreferrer" className="btn-primary fade-in-up delay-2" style={{display: 'inline-block'}}>{slide.buttonText}</a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Manual Controls */}
      <button className="carousel-btn prev-btn" onClick={prevSlide} aria-label="Previous slide">
        <ChevronLeft size={28} />
      </button>
      <button className="carousel-btn next-btn" onClick={nextSlide} aria-label="Next slide">
        <ChevronRight size={28} />
      </button>

      {/* Indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
