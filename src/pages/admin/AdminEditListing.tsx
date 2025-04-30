import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

const AdminEditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    year: "",
    make: "",
    model: "",
    mileage: "",
    price: "",
    location: "",
    comments: "",
    coach_type: "Motorhome",
    status: "approved",
  });

  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Failed to fetch listing:", error);
        return;
      }

      setFormData({
        title: data.title || "",
        year: data.year?.toString() || "",
        make: data.make || "",
        model: data.model || "",
        mileage: data.mileage?.toString() || "",
        price: data.price?.toString() || "",
        location: data.location || "",
        comments: data.comments || "",
        coach_type: data.coach_type || "Motorhome",
        status: data.status || "approved",
      });
      setHeroPreview(data.hero_image_url);
      setExistingGallery(data.gallery || []);
    };

    fetchListing();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setHeroImage(e.target.files[0]);
      setHeroPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let updatedHeroUrl = heroPreview;

      if (heroImage) {
        const path = `hero-${Date.now()}-${heroImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from("coach-images")
          .upload(path, heroImage, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("coach-images")
          .getPublicUrl(path);
        updatedHeroUrl = data.publicUrl;
      }

      const newGalleryUrls: string[] = [...existingGallery];
      for (let i = 0; i < galleryImages.length; i++) {
        const image = galleryImages[i];
        const path = `gallery-${Date.now()}-${image.name}`;
        const { error: gError } = await supabase.storage
          .from("coach-images")
          .upload(path, image);

        if (gError) throw gError;

        const { data } = supabase.storage
          .from("coach-images")
          .getPublicUrl(path);
        newGalleryUrls.push(data.publicUrl);
      }

      const { error } = await supabase
        .from("listings")
        .update({
          ...formData,
          year: parseInt(formData.year),
          mileage: parseInt(formData.mileage),
          price: parseInt(formData.price),
          hero_image_url: updatedHeroUrl,
          gallery: newGalleryUrls,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      alert("Listing updated successfully!");
      navigate("/admin/listings");
    } catch (error: any) {
      console.error("Error updating listing:", error);
      alert(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-playfair font-semibold mb-8">
        Edit Listing
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="make">Make</Label>
            <Input
              id="make"
              name="make"
              value={formData.make}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              name="mileage"
              type="number"
              value={formData.mileage}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="heroImage">Main Image</Label>
          <Input
            id="heroImage"
            name="heroImage"
            type="file"
            accept="image/*"
            onChange={handleHeroChange}
          />
          {heroPreview && (
            <img
              src={heroPreview}
              alt="Hero Preview"
              className="mt-3 w-full h-64 object-cover rounded border border-white/10"
            />
          )}
        </div>

        <div>
          <Label htmlFor="gallery">Gallery Images</Label>
          <Input
            id="gallery"
            name="gallery"
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryChange}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {existingGallery.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Gallery ${idx}`}
                className="w-full h-32 object-cover rounded border border-white/10"
              />
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="comments">Comments / Description</Label>
          <Textarea
            id="comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <Button
          type="submit"
          className="w-full button-gold text-black font-bold py-3"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Listing"}
        </Button>
      </form>
    </AdminLayout>
  );
};

export default AdminEditListing;
