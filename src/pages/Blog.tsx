import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

interface Blog {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string;
  created_at: string;
  meta_description: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select(
            "id, slug, title, cover_image_url, created_at, meta_description"
          )
          .eq("published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBlogs(data || []);
      } catch (err) {
        console.error("Failed to fetch blogs:", err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-3xl md:text-4xl font-playfair font-bold mb-12">
          Blog
        </h1>

        {loading ? (
          <p>Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                to={`/blog/${blog.slug}`}
                key={blog.id}
                className="group bg-dark border border-white/10 rounded-lg overflow-hidden hover:shadow-lg"
              >
                <img
                  src={blog.cover_image_url}
                  alt={blog.title}
                  className="h-48 w-full object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-gold">
                    {blog.title}
                  </h2>
                  <p className="text-white/70 line-clamp-3">
                    {blog.meta_description || "No description provided."}
                  </p>
                  <p className="text-xs text-white/50 mt-2">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
