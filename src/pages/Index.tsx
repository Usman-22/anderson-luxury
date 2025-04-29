
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedListings from '@/components/home/FeaturedListings';
import ListCoachCTA from '@/components/home/ListCoachCTA';
import Testimonials from '@/components/home/Testimonials';

const Index = () => {
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedListings />
        <ListCoachCTA />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
