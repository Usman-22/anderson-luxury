import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Blog {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string;
  created_at: string;
  published: boolean;
}

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setBlogs(data || []);
    } catch (err: any) {
      console.error("Failed to fetch blogs:", err);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      try {
        const { error } = await supabase.from("blogs").delete().eq("id", id);
        if (error) throw error;

        toast.success("Blog deleted successfully");
        fetchBlogs();
      } catch (err: any) {
        console.error("Delete blog failed:", err);
        toast.error("Failed to delete blog");
      }
    }
  };

  const togglePublish = async (id: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from("blogs")
        .update({ published: !published })
        .eq("id", id);
      if (error) throw error;
      toast.success(`Blog ${!published ? "published" : "unpublished"}`);
      fetchBlogs();
    } catch (err: any) {
      toast.error("Failed to update publish status");
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="mb-6">
        <Input
          placeholder="Search blogs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {loading ? (
        <div className="text-center text-gray-400 py-20">Loading blogs...</div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          No blogs available.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-dark border border-white/10 rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={blog.cover_image_url}
                alt={blog.title}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/600x400?text=No+Image";
                }}
              />

              <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-white/70 text-sm">
                  {new Date(blog.created_at).toLocaleDateString()}
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
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
                  <Button
                    size="sm"
                    variant="outline"
                    className={
                      blog.published ? "text-red-500" : "text-green-500"
                    }
                    onClick={() => togglePublish(blog.id, blog.published)}
                  >
                    {blog.published ? "Unpublish" : "Publish"}
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
