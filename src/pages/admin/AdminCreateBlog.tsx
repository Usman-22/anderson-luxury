import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const AdminCreateBlog = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let coverImageUrl = "";

      if (imageFile) {
        // In real backend: upload the file and get the URL
        // For now: simulate with base64 or blob URL
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        await new Promise((resolve) => (reader.onload = resolve));
        coverImageUrl = reader.result as string;
      } else {
        throw new Error("Please select a cover image.");
      }

      const slug = generateSlug(formData.title) || uuidv4();

      const payload = {
        ...formData,
        slug,
        cover_image_url: coverImageUrl,
        created_at: new Date().toISOString(),
      };

      const res = await fetch("http://localhost:5000/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create blog.");

      toast.success("Blog created successfully!");
      navigate("/admin/blogs");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Unexpected error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-playfair font-semibold mb-8">
          Create New Blog
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title">Blog Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image">Cover Image</Label>
            <Input
              id="cover_image"
              name="cover_image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 rounded border border-white/10 w-full h-64 object-cover"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content (HTML Allowed)</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={10}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gold text-black font-bold py-3 hover:bg-gold/80"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Blog"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminCreateBlog;
