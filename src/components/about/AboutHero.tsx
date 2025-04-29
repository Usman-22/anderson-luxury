import React from "react";

const AboutHero = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat h-96 flex items-center justify-center"
      style={{ backgroundImage: "url('/about-hero.jpg')" }}
    >
      <div className="bg-black bg-opacity-60 p-8 rounded-lg text-center">
        <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gold mb-4">
          About Us
        </h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Discover the legacy of excellence behind Prevost Marketplace.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
