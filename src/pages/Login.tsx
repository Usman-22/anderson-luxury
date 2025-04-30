import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/list-your-coach";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: false })
        .eq("email", formData.email)
        .single();

      if (error || !user) {
        toast.error("Login Failed", {
          description: "Invalid email or password.",
        });
        return;
      }

      const isMatch = await bcrypt.compare(formData.password, user.password);
      if (!isMatch) {
        toast.error("Login Failed", {
          description: "Invalid email or password.",
        });
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login Successful!", {
        description: `Welcome back, ${user.name}!`,
      });

      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      toast.error("Error", {
        description: err.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      <main className="flex-grow pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-md">
          <h1 className="text-3xl font-playfair font-semibold text-center mb-8">
            Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full button-gold text-black font-bold py-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-white/70 text-sm mt-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-gold hover:underline font-semibold"
              >
                Register here
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
