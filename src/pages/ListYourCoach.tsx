// src/pages/ListYourCoach.tsx

import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { v4 as uuidv4 } from "uuid";

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
    price: "", // ✅ Added Price here
    comments: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
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

      let uploadedImageUrl = "";
      if (files.length > 0) {
        uploadedImageUrl = "https://placehold.co/600x400"; // Temporary image
      }

      const payload = {
        slug,
        title: `${formData.year} ${formData.make} ${formData.model}`,
        year: parseInt(formData.year),
        make: formData.make,
        model: formData.model,
        mileage: parseInt(formData.mileage),
        price: parseInt(formData.price), // ✅ Correct: using user-entered price
        location: formData.location,
        coach_type: "Motorhome",
        hero_image_url: uploadedImageUrl,
        comments: formData.comments,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const response = await fetch("http://localhost:5000/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit coach listing.");
      }

      toast.success("✅ Coach listed successfully!", {
        description: "Your listing is now live on the marketplace.",
      });

      // Reset Form
      setFormData({
        name: "",
        email: "",
        phone: "",
        year: "",
        make: "",
        model: "",
        mileage: "",
        location: "",
        price: "", // ✅ Clear price too
        comments: "",
      });
      setFiles([]);
    } catch (error: any) {
      console.error(error);
      toast.error("❌ Something went wrong", {
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
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="font-playfair text-3xl md:text-4xl font-semibold mb-6 text-center">
            List Your Coach
          </h1>
          <p className="text-white/70 mb-12 text-center">
            Submit your luxury coach for a personalized listing experience.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields */}
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone", type: "text" },
              { label: "Coach Year", name: "year", type: "number" },
              { label: "Make", name: "make", type: "text" },
              { label: "Model", name: "model", type: "text" },
              { label: "Mileage", name: "mileage", type: "number" },
              { label: "Location", name: "location", type: "text" },
              { label: "Price", name: "price", type: "number" }, // ✅ Added Price input field
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            {/* Upload Photos */}
            <div className="space-y-2">
              <Label htmlFor="photos">Upload Photos</Label>
              <Input
                id="photos"
                name="photos"
                type="file"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {files.length > 0 && (
                <div className="text-sm text-white/70 mt-2">
                  {files.length} file(s) selected
                </div>
              )}
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
              className="w-full button-gold text-black font-bold py-3 text-lg"
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
