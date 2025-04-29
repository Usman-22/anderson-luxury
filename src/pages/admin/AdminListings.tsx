// src/pages/admin/AdminListings.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ✅ Importing your custom Input

interface Listing {
  id: number;
  title: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  price: number;
  location: string;
  coach_type: string;
  hero_image_url: string;
}

const AdminListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ New for searching

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/listings");
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        const response = await fetch(`http://localhost:5000/listings/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchListings();
          alert("Listing deleted successfully!");
        } else {
          throw new Error("Failed to delete listing");
        }
      } catch (error) {
        console.error("Failed to delete listing:", error);
        alert("An unexpected error occurred.");
      }
    }
  };

  // ✅ Filter listings by title, make, model or location
  const filteredListings = listings.filter((listing) =>
    (listing.title + listing.make + listing.model + listing.location)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-playfair font-semibold">
          Manage Listings
        </h1>

        <div className="flex gap-3 items-center">
          <Input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs bg-dark border border-white/10 text-white placeholder:text-white/50"
          />
          <Link to="/admin/listings/create">
            <Button className="bg-gold text-black font-bold hover:bg-gold/80">
              + Create New
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">
          Loading listings...
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          No matching listings found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-dark border border-white/10 rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={listing.hero_image_url}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{listing.title}</h2>
                <p className="text-white/70 text-sm">{listing.location}</p>
                <p className="text-white/70 text-sm">
                  {listing.year} - {listing.make} {listing.model}
                </p>
                <p className="text-white/80 font-bold">
                  ${listing.price.toLocaleString()}
                </p>

                <div className="flex gap-3 mt-4">
                  <Link to={`/admin/listings/${listing.id}/edit`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:border-gold"
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(listing.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminListings;
