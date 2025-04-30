import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

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
  status: string; // ✅ Replacing 'approved'
}

const AdminListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
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
        const { error } = await supabase.from("listings").delete().eq("id", id);
        if (error) throw error;

        fetchListings();
        toast({ title: "Listing deleted successfully!" });
      } catch (error) {
        console.error("Failed to delete listing:", error);
        toast({
          title: "Error",
          description: "Failed to delete.",
          variant: "destructive",
        });
      }
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: "approved" }) // ✅ Use status instead of approved
        .eq("id", id);

      if (error) throw error;

      toast({ title: "Listing approved successfully!" });
      fetchListings();
    } catch (error) {
      console.error("Failed to approve listing:", error);
      toast({
        title: "Error",
        description: "Failed to approve.",
        variant: "destructive",
      });
    }
  };

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

                <div className="flex flex-wrap gap-3 mt-4">
                  {listing.status !== "approved" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white font-bold"
                      onClick={() => handleApprove(listing.id)}
                    >
                      Approve
                    </Button>
                  )}
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
