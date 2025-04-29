// src/pages/admin/AdminBlogs.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Blog {
  id: number;
  slug: string;
  title: string;
  cover_image_url: string;
  created_at: string;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        const res = await fetch(`http://localhost:5000/blogs/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete");
        toast.success("Blog deleted successfully");
        fetchBlogs(); // refresh list
      } catch (err) {
        console.error("Delete blog failed:", err);
        toast.error("Failed to delete blog");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-playfair font-semibold">Manage Blogs</h1>
        <Link to="/admin/blogs/create">
          <Button className="bg-gold text-black font-bold hover:bg-gold/80">
            + Create Blog
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          No blogs available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-dark border border-white/10 rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={blog.cover_image_url}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-white/70 text-sm">
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-3 mt-4">
                  <Link to={`/admin/blogs/${blog.id}/edit`}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="hover:border-gold"
                    >
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(blog.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlogs;
