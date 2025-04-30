import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  cover_image_url: string;
  meta_title: string;
  meta_description: string;
  tags: string[]; // array type
  created_at: string;
  updated_at?: string;
}

const AdminEditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Blog | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("id", id)
          .single();
        if (error || !data) throw new Error("Blog not found");
        setFormData(data);
        setPreviewUrl(data.cover_image_url);
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBlog();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewImage(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      let imageUrl = formData.cover_image_url;

      if (newImage) {
        const imagePath = `public/edit-${uuidv4()}.${newImage.name
          .split(".")
          .pop()}`;
        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(imagePath, newImage, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("blog-images")
          .getPublicUrl(imagePath);
        imageUrl = urlData.publicUrl;
      }

      const updated = {
        ...formData,
        slug: generateSlug(formData.title),
        cover_image_url: imageUrl,
        tags:
          typeof formData.tags === "string"
            ? formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : formData.tags,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from("blogs")
        .update(updated)
        .eq("id", formData.id);

      if (updateError) throw updateError;

      toast({ title: "Success", description: "Blog updated successfully." });
      navigate("/admin/blogs");
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-48 text-gray-400">
          <Loader2 className="animate-spin mr-2" /> Loading blog...
        </div>
      </AdminLayout>
    );
  }

  if (!formData) {
    return (
      <AdminLayout>
        <p className="text-center text-red-400">Blog not found.</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-playfair font-bold">Edit Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="cover_image">Cover Image</Label>
            <Input
              id="cover_image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-3 rounded w-full h-64 object-cover border border-white/10"
              />
            )}
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              rows={10}
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input
              id="meta_title"
              name="meta_title"
              value={formData.meta_title || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea
              id="meta_description"
              name="meta_description"
              rows={3}
              value={formData.meta_description || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              name="tags"
              value={
                Array.isArray(formData.tags) ? formData.tags.join(", ") : ""
              }
              onChange={handleChange}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gold text-black font-bold hover:bg-gold/80"
          >
            Update Blog
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminEditBlog;
