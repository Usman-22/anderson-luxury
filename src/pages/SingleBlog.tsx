import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  cover_image_url: string;
  created_at: string;
}

const SingleBlog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .single();

        if (error || !data) throw new Error("Blog not found");
        setBlog(data);
      } catch (err) {
        console.error(err);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-dark text-white flex items-center justify-center">
        Blog not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />

      {/* Hero Image with Black Overlay */}
      <div className="relative w-full">
        <img
          src={blog.cover_image_url}
          alt={blog.title}
          className="w-full h-[400px] md:h-[500px] object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4 text-gold">
            {blog.title}
          </h1>
          <p className="text-white/80 text-sm">
            {new Date(blog.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Blog Content */}
      <main className="flex-grow w-full px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div
            className="prose prose-invert max-w-none text-white/80"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SingleBlog;
