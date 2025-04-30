import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import LeadForm from "@/components/forms/LeadForm";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

interface Listing {
  id: string;
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
  comments: string;
  gallery: string[]; // ✅ Gallery image URLs
  status: string;
}

const ListingDetail: React.FC = () => {
  const { slug } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("slug", slug)
          .eq("status", "approved")
          .single();

        if (error) {
          setListing(null);
          console.error("Error fetching listing:", error);
        } else {
          setListing(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchListing();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        Listing not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 container mx-auto px-4 pb-32">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left - Main Image + Gallery */}
          <div className="w-full lg:w-2/3 space-y-6">
            <img
              src={
                listing.hero_image_url || "https://via.placeholder.com/1200x800"
              }
              alt={listing.title}
              className="rounded-lg w-full object-cover"
            />

            {listing.gallery && listing.gallery.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Gallery</h2>
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={10}
                  slidesPerView={3}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  loop={true}
                >
                  {listing.gallery.map((url, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={url}
                        alt={`Gallery ${index}`}
                        className="rounded-lg w-full object-cover h-[300px]"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-white/70">{listing.comments}</p>
            </div>
          </div>

          {/* Right - Details and Lead Form */}
          <div className="w-full lg:w-1/3 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{listing.title}</h1>
              <p className="text-gold text-2xl font-semibold">
                {listing.price
                  ? `$${listing.price.toLocaleString()}`
                  : "Contact for Price"}
              </p>
              <p className="text-sm text-white/70">{listing.location}</p>
              <p className="text-sm text-white/70">{listing.coach_type}</p>
            </div>

            <div className="space-y-1 text-white/80 text-sm">
              <p>
                <strong>Year:</strong> {listing.year}
              </p>
              <p>
                <strong>Make:</strong> {listing.make}
              </p>
              <p>
                <strong>Model:</strong> {listing.model}
              </p>
              <p>
                <strong>Mileage:</strong> {listing.mileage.toLocaleString()}{" "}
                miles
              </p>
            </div>

            <div className="mt-8">
              <LeadForm listingTitle={listing.title} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ListingDetail;
