import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner"; // ✅ import toast
import { supabase } from "@/lib/supabase";

interface LeadFormProps {
  listingSlug: string; // Use slug to uniquely reference the listing
}

const LeadForm = ({ listingSlug }: LeadFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comments: "",
  });

  const [loading, setLoading] = useState(false);

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
    console.log("Submitting lead with payload:", {
      ...formData,
      listing: listingSlug, // Passing the listingSlug here to link it with the lead
    });

    try {
      // Insert lead into the Supabase leads table
      const { error } = await supabase.from("leads").insert([
        {
          ...formData,
          listing: listingSlug, // Link this lead with the listingSlug
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast.success("✅ Inquiry sent! Our team will contact you shortly.");
      setFormData({ name: "", email: "", phone: "", comments: "" });
    } catch (err: any) {
      console.error(err);
      toast.error("❌ Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 p-6 bg-dark border border-white/10 rounded-lg">
      <h2 className="text-2xl font-semibold font-playfair mb-4 text-gold">
        Interested in this Coach?
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="comments">Your Message</Label>
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
          className="w-full button-gold text-black font-bold py-2"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Inquiry"}
        </Button>
      </form>
    </div>
  );
};

export default LeadForm;
