import React from "react";
import { Link } from "react-router-dom";

const ListCoachCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/60 z-10" />
        <img
          src="/beautiful-campsite-mountains-with-rv-wooden-bench.webp"
          alt="Luxury RV"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
            Ready to <span className="text-gold">Sell Your Coach?</span>
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Our concierge listing service makes selling your premium motorhome
            or entertainer coach simple and stress-free.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full border-2 border-gold flex items-center justify-center text-gold font-semibold mr-4">
                1
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">
                  Professional Marketing
                </h3>
                <p className="text-white/70">
                  High-quality photography, detailed descriptions, and targeted
                  promotion to qualified buyers.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full border-2 border-gold flex items-center justify-center text-gold font-semibold mr-4">
                2
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Expert Guidance</h3>
                <p className="text-white/70">
                  Our team of luxury coach specialists will help you price and
                  position your coach competitively.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 h-10 w-10 rounded-full border-2 border-gold flex items-center justify-center text-gold font-semibold mr-4">
                3
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Qualified Buyers</h3>
                <p className="text-white/70">
                  Access to our network of serious buyers looking for premium
                  coaches like yours.
                </p>
              </div>
            </div>

            <Link
              to="/list-your-coach"
              className="button-gold inline-flex mt-6"
            >
              List Your Coach
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ListCoachCTA;
