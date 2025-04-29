// src/pages/admin/LoginAdmin.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner"; // ✅ Added Toast import

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
      // Simple hardcoded Admin login for now
      if (
        formData.email === "admin@prevost.com" &&
        formData.password === "admin123"
      ) {
        localStorage.setItem(
          "admin",
          JSON.stringify({ email: formData.email })
        );
        toast.success("Login Successful", {
          description: "Welcome Admin! Redirecting to dashboard...",
        });
        navigate("/admin/dashboard");
      } else {
        toast.error("Login Failed", {
          description: "Invalid admin credentials. Please try again.",
        });
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Unexpected Error", {
        description: error.message || "Something went wrong. Please retry.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-playfair font-semibold text-center mb-8">
          Admin Login
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
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
