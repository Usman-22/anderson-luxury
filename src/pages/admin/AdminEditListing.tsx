// src/pages/admin/AdminEditListing.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
    hero_image_url: "",
    comments: "",
    coach_type: "Motorhome",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/listings/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            title: data.title,
            year: data.year.toString(),
            make: data.make,
            model: data.model,
            mileage: data.mileage.toString(),
            price: data.price.toString(),
            location: data.location,
            hero_image_url: data.hero_image_url,
            comments: data.comments,
            coach_type: data.coach_type,
          });
        })
        .catch((error) => {
          console.error("Failed to fetch listing:", error);
        });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          year: parseInt(formData.year),
          mileage: parseInt(formData.mileage),
          price: parseInt(formData.price),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update listing");
      }

      alert("Listing updated successfully!");
      navigate("/admin/listings");
    } catch (error: any) {
      console.error(error);
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

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {[
          { label: "Title", name: "title", type: "text" },
          { label: "Year", name: "year", type: "number" },
          { label: "Make", name: "make", type: "text" },
          { label: "Model", name: "model", type: "text" },
          { label: "Mileage", name: "mileage", type: "number" },
          { label: "Price", name: "price", type: "number" },
          { label: "Location", name: "location", type: "text" },
          { label: "Hero Image URL", name: "hero_image_url", type: "text" },
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
