import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

const AdminCreateBlog = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    meta_title: "",
    meta_description: "",
    tags: "",
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
      if (!imageFile) {
        throw new Error("Please select a cover image.");
      }

      const blogId = uuidv4();
      const slug = generateSlug(formData.title) || blogId;
      const fileExt = imageFile.name.split(".").pop();
      const filePath = `public/${slug}.${fileExt}`;

      // Upload cover image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath);

      // Convert tags from comma-separated to array
      const tagsArray =
        formData.tags.trim() === ""
          ? []
          : formData.tags
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean);

      const payload = {
        id: blogId,
        slug,
        title: formData.title,
        content: formData.content,
        cover_image_url: publicUrl,
        meta_title: formData.meta_title || "",
        meta_description: formData.meta_description || "",
        tags: tagsArray,
        published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: insertError } = await supabase
        .from("blogs")
        .insert(payload);

      if (insertError) throw insertError;

      toast.success("Blog created successfully!");
      navigate("/admin/blogs");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Unexpected error occurred.");
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

          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
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
