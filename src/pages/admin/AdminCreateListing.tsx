import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const AdminCreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    year: "",
    make: "",
    model: "",
    mileage: "",
    price: "",
    location: "",
    coach_type: "Motorhome",
    comments: "",
  });

  const [featureImage, setFeatureImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const featureImageRef = useRef<HTMLInputElement>(null);
  const galleryImagesRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeatureImage(e.target.files[0]);
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryImages(Array.from(e.target.files));
    }
  };

  const generateSlug = (make: string, model: string, year: string) => {
    const base = `${make}-${model}-${year}`;
    return base.toLowerCase().replace(/\s+/g, "-");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!featureImage) {
        throw new Error("Please upload the main product image.");
      }

      const slug =
        generateSlug(formData.make, formData.model, formData.year) || uuidv4();
      let heroImageUrl = "";
      const gallery: string[] = [];

      // Upload hero image
      const heroPath = `admin-${slug}-hero-${Date.now()}-${featureImage.name}`;
      const { error: heroError } = await supabase.storage
        .from("coach-images")
        .upload(heroPath, featureImage);

      if (heroError) throw heroError;

      const { data: heroData } = supabase.storage
        .from("coach-images")
        .getPublicUrl(heroPath);
      heroImageUrl = heroData.publicUrl;

      // Upload gallery images
      for (let i = 0; i < galleryImages.length; i++) {
        const image = galleryImages[i];
        const path = `admin-${slug}-gallery-${i}-${Date.now()}-${image.name}`;
        const { error: gError } = await supabase.storage
          .from("coach-images")
          .upload(path, image);
        if (gError) throw gError;

        const { data } = supabase.storage
          .from("coach-images")
          .getPublicUrl(path);
        gallery.push(data.publicUrl);
      }

      const payload = {
        slug,
        title: `${formData.year} ${formData.make} ${formData.model}`,
        year: parseInt(formData.year),
        make: formData.make,
        model: formData.model,
        mileage: parseInt(formData.mileage),
        price: parseInt(formData.price),
        location: formData.location,
        coach_type: formData.coach_type,
        hero_image_url: heroImageUrl,
        gallery,
        comments: formData.comments,
        status: "approved",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("listings").insert([payload]);
      if (error) throw error;

      toast.success("Listing created successfully!");
      navigate("/admin/listings");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-playfair font-semibold mb-8 text-center">
          Create New Listing
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Year + Make */}
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

          {/* Model + Mileage */}
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

          {/* Price + Location */}
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

          {/* Feature Image */}
          <div>
            <Label htmlFor="featureImage">Main Product Image</Label>
            <Input
              id="featureImage"
              name="featureImage"
              type="file"
              accept="image/*"
              onChange={handleFeatureImageChange}
              ref={featureImageRef}
            />
          </div>

          {/* Gallery Images */}
          <div>
            <Label htmlFor="galleryImages">Gallery Images</Label>
            <Input
              id="galleryImages"
              name="galleryImages"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryImageChange}
              ref={galleryImagesRef}
            />
          </div>

          {/* Comments */}
          <div>
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              name="comments"
              rows={4}
              value={formData.comments}
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full button-gold text-black font-bold py-3"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Listing"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateListing;
