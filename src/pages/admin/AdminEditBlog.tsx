import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Blog {
  id: number;
  slug: string;
  title: string;
  content: string;
  cover_image_url: string;
  created_at: string;
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
        const res = await fetch(`http://localhost:5000/blogs`);
        if (!res.ok) throw new Error("Failed to load blogs");
        const data: Blog[] = await res.json();
        const foundBlog = data.find((b) => String(b.id) === String(id));
        if (!foundBlog) throw new Error("Blog not found");

        setFormData(foundBlog);
        setPreviewUrl(foundBlog.cover_image_url);
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error",
          description: error.message || "Failed to load blog.",
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
        const reader = new FileReader();
        reader.readAsDataURL(newImage);
        await new Promise((resolve) => (reader.onload = resolve));
        imageUrl = reader.result as string;
      }

      const updatedBlog = {
        ...formData,
        cover_image_url: imageUrl,
        slug: generateSlug(formData.title),
        updated_at: new Date().toISOString(),
      };

      const res = await fetch(`http://localhost:5000/blogs/${formData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBlog),
      });

      if (!res.ok) throw new Error("Failed to update blog");

      toast({
        title: "Success",
        description: "Blog updated successfully.",
      });

      navigate("/admin/blogs");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message || "Update failed.",
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
            <Label htmlFor="content">Content (HTML supported)</Label>
            <Textarea
              id="content"
              name="content"
              rows={10}
              value={formData.content}
              onChange={handleChange}
              required
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
