import React from "react";
import { CheckCircle } from "lucide-react";

const features = [
  {
    title: "Unmatched Quality",
    description: "Only the finest coaches, rigorously vetted for excellence.",
  },
  {
    title: "Expert Guidance",
    description:
      "Professional consultation to match you with your perfect coach.",
  },
  {
    title: "Trusted Marketplace",
    description: "A seamless, secure platform built on transparency and trust.",
  },
  {
    title: "Lifetime Support",
    description: "We support your journey even after the purchase is complete.",
  },
];

const AboutFeatures = () => {
  return (
    <section className="bg-background py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-playfair font-semibold text-center text-gold mb-12">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 border border-white/10 rounded-lg bg-card hover:border-gold transition"
            >
              <CheckCircle className="text-gold mb-4" size={32} />
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutFeatures;
