import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Blog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  created_at: string;
}

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:5000/blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error(err);
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
                  <p className="text-white/70">{blog.excerpt}</p>
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
