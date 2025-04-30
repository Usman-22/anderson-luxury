import React, { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

const ListYourCoach = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    year: "",
    make: "",
    model: "",
    mileage: "",
    location: "",
    price: "",
    comments: "",
  });

  const [featureImage, setFeatureImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const featureImageRef = useRef<HTMLInputElement>(null);
  const galleryImagesRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFeatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeatureImage(e.target.files[0]);
    }
  };

  const handleGalleryImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      const slug =
        generateSlug(formData.make, formData.model, formData.year) || uuidv4();

      // Upload feature image to Supabase bucket
      let heroImageUrl = "";
      if (featureImage) {
        const path = `feature-${slug}-${Date.now()}-${featureImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from("coach-images")
          .upload(path, featureImage);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("coach-images")
          .getPublicUrl(path);
        heroImageUrl = data.publicUrl;
      }

      // Upload gallery images to Supabase bucket
      const galleryUrls: string[] = [];
      for (let i = 0; i < galleryImages.length; i++) {
        const image = galleryImages[i];
        const path = `gallery-${slug}-${i}-${Date.now()}-${image.name}`;
        const { error: gError } = await supabase.storage
          .from("coach-images")
          .upload(path, image);

        if (gError) throw gError;

        const { data } = supabase.storage
          .from("coach-images")
          .getPublicUrl(path);
        galleryUrls.push(data.publicUrl);
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
        coach_type: "Motorhome",
        hero_image_url: heroImageUrl,
        gallery: galleryUrls,
        comments: formData.comments,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("listings").insert([payload]);
      if (error) throw error;

      toast.success("✅ Submission received!", {
        description: "Admin will review your coach before publishing.",
      });

      // Reset all fields
      setFormData({
        name: "",
        email: "",
        phone: "",
        year: "",
        make: "",
        model: "",
        mileage: "",
        location: "",
        price: "",
        comments: "",
      });
      setFeatureImage(null);
      setGalleryImages([]);
      if (featureImageRef.current) featureImageRef.current.value = "";
      if (galleryImagesRef.current) galleryImagesRef.current.value = "";
    } catch (error: any) {
      console.error(error);
      toast.error("❌ Submission Failed", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-playfair text-3xl md:text-4xl font-semibold mb-6 text-center">
            List Your Coach
          </h1>
          <p className="text-white/70 mb-12 text-center">
            Submit your luxury coach for a personalized listing experience.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email + Phone */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Year + Make */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Coach Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
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
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
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

            {/* Location + Price */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
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
            </div>

            {/* Feature Image */}
            <div className="space-y-2">
              <Label htmlFor="productMainImage">
                Upload Product Main Image
              </Label>
              <Input
                id="productMainImage"
                name="productMainImage"
                type="file"
                accept="image/*"
                onChange={handleFeatureImageChange}
                ref={featureImageRef}
              />
            </div>

            {/* Gallery Images */}
            <div className="space-y-2">
              <Label htmlFor="galleryImages">Upload Gallery Images</Label>
              <Input
                id="galleryImages"
                name="galleryImages"
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryImagesChange}
                ref={galleryImagesRef}
              />
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label htmlFor="comments">Comments / Description</Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={5}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-gold text-black font-bold py-3 text-lg hover:bg-gold/80"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Your Coach"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListYourCoach;
