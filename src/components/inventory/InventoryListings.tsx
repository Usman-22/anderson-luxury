import React, { useEffect, useState } from "react";
import ListingCard from "@/components/ui/ListingCard";
import ListingRowCard from "@/components/inventory/ListingRowCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { supabase } from "@/lib/supabase"; // ✅ Import Supabase

interface InventoryListingsProps {
  viewMode: "grid" | "list";
  filters: {
    priceRange: number[];
    yearRange: number[];
    mileageRange: number[];
    coachType: string;
    location: string;
  };
}

interface Listing {
  id: number;
  slug: string;
  title: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  price: number;
  location: string;
  coach_type: string;
  hero_image_url: string;
  status: string;
}

const InventoryListings: React.FC<InventoryListingsProps> = ({
  viewMode,
  filters,
}) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("status", "approved"); // ✅ Only approved listings

        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error("Error fetching listings from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter logic
  const filteredListings = listings.filter((listing) => {
    const matchPrice =
      listing.price >= filters.priceRange[0] &&
      listing.price <= filters.priceRange[1];
    const matchYear =
      listing.year >= filters.yearRange[0] &&
      listing.year <= filters.yearRange[1];
    const matchMileage =
      listing.mileage >= filters.mileageRange[0] &&
      listing.mileage <= filters.mileageRange[1];
    const matchCoachType =
      !filters.coachType ||
      listing.coach_type.toLowerCase() === filters.coachType.toLowerCase();
    const matchLocation =
      !filters.location.trim() ||
      listing.location.toLowerCase().includes(filters.location.toLowerCase());

    return (
      matchPrice && matchYear && matchMileage && matchCoachType && matchLocation
    );
  });

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="text-center text-gray-400 py-20">
          Loading listings...
        </div>
      ) : filteredListings.length > 0 ? (
        <>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
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
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredListings.map((listing) => (
                <ListingRowCard
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
                />
              ))}
            </div>
          )}

          {/* Pagination Placeholder */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      ) : (
        <div className="text-center text-gray-400 py-20">
          No listings match your filters.
        </div>
      )}
    </div>
  );
};

export default InventoryListings;
