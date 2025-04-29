import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutFeatures from "@/components/about/AboutFeatures";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      <main className="flex-grow">
        <AboutHero />
        <AboutStory />
        <AboutFeatures />
      </main>
      <Footer />
    </div>
  );
};

export default About;
