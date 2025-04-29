import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner"; // ✅ Toast

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const checkResponse = await fetch(
        `http://localhost:5000/users?email=${formData.email}`
      );
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        toast.error("Already Registered", {
          description: "This email is already associated with an account.",
        });
      } else {
        const response = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Registration failed.");
        }

        toast.success("Registration Successful", {
          description: "Welcome! You can now login.",
        });

        navigate("/login");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong", {
        description: error.message || "Please try again later.",
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
