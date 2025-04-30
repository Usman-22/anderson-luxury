import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("email", formData.email)
        .single();

      if (existingUser) {
        toast.error("Already Registered", {
          description: "This email is already taken.",
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(formData.password, 10);

      const { error } = await supabase.from("users").insert({
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
      });

      if (error) throw error;

      toast.success("Registration Successful", {
        description: "You can now login.",
      });

      navigate("/login");
    } catch (error: any) {
      console.error(error);
      toast.error("Registration Failed", {
        description: error.message || "Try again later.",
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
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

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
              {loading ? "Registering..." : "Register"}
            </Button>

            <p className="text-center text-white/70 text-sm mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-gold hover:underline font-semibold"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Register;
