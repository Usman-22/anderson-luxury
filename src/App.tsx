import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import ListYourCoach from "./pages/ListYourCoach";
import ListingDetail from "./pages/ListingDetail";
import Login from "./pages/Login";
import Blog from "./pages/Blog";
import SingleBlog from "./pages/SingleBlog";
import Register from "./pages/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginAdmin from "@/pages/admin/LoginAdmin";
import AdminListings from "@/pages/admin/AdminListings";
import AdminEditListing from "./pages/admin/AdminEditListing";
import AdminLeads from "./pages/admin/Leads";
import Dashboard from "@/pages/admin/Dashboard";
import AdminCreateListing from "./pages/admin/AdminCreateListing";
import AdminBlogs from "@/pages/admin/AdminBlogs";
import AdminCreateBlog from "@/pages/admin/AdminCreateBlog";
import AdminEditBlog from "@/pages/admin/AdminEditBlog";
import React from "react";

// Create a client
const queryClient = new QueryClient();

// Make App a proper React function component
const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/list-your-coach"
                element={
                  <ProtectedRoute>
                    <ListYourCoach />
                  </ProtectedRoute>
                }
              />
              <Route path="/listing/:slug" element={<ListingDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<SingleBlog />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<LoginAdmin />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route
                path="/admin/listings/create"
                element={<AdminCreateListing />}
              />
              <Route
                path="/admin/listings/edit/:id"
                element={<AdminEditListing />}
              />
              <Route path="/admin/listings" element={<AdminListings />} />
              <Route
                path="/admin/create-listing"
                element={<AdminCreateListing />}
              />
              <Route path="/admin/leads" element={<AdminLeads />} />
              <Route path="/admin/blogs" element={<AdminBlogs />} />
              <Route path="/admin/blogs/create" element={<AdminCreateBlog />} />
              <Route path="/admin/blogs/:id/edit" element={<AdminEditBlog />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
