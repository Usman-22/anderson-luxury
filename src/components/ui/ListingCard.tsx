import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

interface ListingCardProps {
  id: string;
  slug: string;
  title: string;
  year: number;
  make: string;
  model: string;
  price: number;
  location: string;
  heroImageUrl: string;
  featured?: boolean;
}

const ListingCard = ({
  slug,
  title,
  year,
  make,
  model,
  price,
  location,
  heroImageUrl,
  featured = false,
}: ListingCardProps) => {
  const formatPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <Link
      to={`/listing/${slug}`}
      className={`group block overflow-hidden rounded-lg bg-gradient-to-b from-black/5 to-black/30 backdrop-blur-sm border transition-all duration-300 
        ${
          featured
            ? "border-gold/50 hover:border-gold"
            : "border-white/10 hover:border-white/30"
        }
        hover:shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:-translate-y-1`}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[16/9]">
          <img
            src={heroImageUrl}
            alt={title}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {featured && (
          <div className="absolute top-3 right-3 bg-gold px-3 py-1 text-xs font-semibold text-black rounded">
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-playfair font-medium mb-1 group-hover:text-gold transition-colors">
          {title}
        </h3>
        <p className="text-white/70 mb-3">
          {year} {make} {model}
        </p>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xl font-semibold text-gold">{formatPrice}</p>
          </div>
          <div className="flex items-center text-white/60 text-sm">
            <MapPin size={14} className="mr-1" />
            {location}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
