
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Sample hero images for carousel
const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1545164710-052201c31c2a?q=80&w=2070",
    alt: "Luxury Prevost Motorhome",
  },
  {
    url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070",
    alt: "Entertainer Coach Interior",
  },
  {
    url: "https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?q=80&w=2070",
    alt: "Premium Motorhome on the Road",
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Image Carousel */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover object-center"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto h-full flex flex-col justify-center px-4">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-4">
            Luxury Motorhomes & <span className="text-gold">Entertainer Coaches</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-lg">
            Experience unparalleled luxury and craftsmanship in our curated selection of premium Prevost motorhomes and entertainer coaches.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/inventory" className="button-gold inline-flex items-center justify-center">
              Browse Inventory
              <ArrowRight className="ml-2" size={18} />
            </Link>
            <Link to="/list-your-coach" className="button-outline inline-flex items-center justify-center">
              List Your Coach
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-gold w-8' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
