// src/components/home/FeaturedListings.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingCard from "../ui/ListingCard";
import { ArrowRight } from "lucide-react";

interface Listing {
  id: string;
  slug: string;
  title: string;
  year: number;
  make: string;
  model: string;
  price: number;
  location: string;
  heroImageUrl: string;
  coachType: string;
}

const FeaturedListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:5000/listings");
        const data = await response.json();

        // Sort by created_at if available, or just get latest 3
        const latestThree = data
          .sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .slice(0, 3);

        setListings(latestThree);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  return (
    <section className="py-24 bg-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-3">
              Featured <span className="text-gold">Coaches</span>
            </h2>
            <p className="text-white/70 max-w-xl">
              Discover our hand-selected collection of exceptional luxury
              coaches, representing the pinnacle of craftsmanship and design.
            </p>
          </div>
          <Link
            to="/inventory"
            className="group mt-4 md:mt-0 flex items-center text-gold hover:text-gold/80 transition-colors font-medium"
          >
            View All Inventory
            <ArrowRight
              className="ml-2 group-hover:translate-x-1 transition-transform"
              size={18}
            />
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-white/70">
            Loading featured coaches...
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id.toString()}
                slug={listing.slug}
                title={listing.title}
                year={listing.year}
                make={listing.make}
                model={listing.model}
                price={listing.price}
                location={listing.location}
                heroImageUrl={listing.hero_image_url}
                featured
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
