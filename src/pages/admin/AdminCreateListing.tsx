// src/pages/admin/AdminCreateListing.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";

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

  const [files, setFiles] = useState<File[]>([]);

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
        // In production: upload image to server or cloud
        uploadedImageUrl = "https://via.placeholder.com/600x400"; // Placeholder image
      }

      const payload = {
        id: uuidv4(),
        slug,
        title: `${formData.year} ${formData.make} ${formData.model}`,
        year: parseInt(formData.year),
        make: formData.make,
        model: formData.model,
        mileage: parseInt(formData.mileage),
        price: parseInt(formData.price),
        location: formData.location,
        coach_type: formData.coach_type,
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
        throw new Error("Failed to create listing");
      }

      alert("Listing created successfully!");
      navigate("/admin/listings");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Unexpected error occurred");
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
          {/* Input Fields */}
          {[
            { label: "Year", name: "year", type: "number" },
            { label: "Make", name: "make", type: "text" },
            { label: "Model", name: "model", type: "text" },
            { label: "Mileage", name: "mileage", type: "number" },
            { label: "Price", name: "price", type: "number" },
            { label: "Location", name: "location", type: "text" },
          ].map((field) => (
            <div key={field.name}>
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

          {/* File Upload */}
          <div>
            <Label htmlFor="photos">Upload Photo</Label>
            <Input
              id="photos"
              name="photos"
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
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

          {/* Submit Button */}
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
