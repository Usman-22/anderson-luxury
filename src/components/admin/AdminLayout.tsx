// src/components/admin/AdminLayout.tsx

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-dark border-r border-white/10 p-6">
        <h1 className="text-2xl font-playfair font-bold mb-10">
          <span className="text-gold">Admin</span> Panel
        </h1>
        <nav className="flex flex-col space-y-4">
          <Link
            to="/admin/dashboard"
            className="hover:text-gold hover:bg-gold/10 transition-colors p-2 rounded"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/listings"
            className="hover:text-gold hover:bg-gold/10 transition-colors p-2 rounded"
          >
            Listings
          </Link>
          <Link
            to="/admin/leads"
            className="hover:text-gold hover:bg-gold/10 transition-colors p-2 rounded"
          >
            Leads
          </Link>
          <Link
            to="/admin/blogs"
            className="hover:text-gold hover:bg-gold/10 transition-colors p-2 rounded"
          >
            Blogs
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center text-white/70 hover:text-gold transition-colors"
        >
          <LogOut className="mr-2" size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-4 bg-dark border-b border-white/10">
          <div className="flex items-center gap-2">
            <Menu className="md:hidden" size={24} />
            <h2 className="text-xl font-semibold font-playfair">Admin Panel</h2>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-gold text-black px-4 py-2 rounded hover:bg-gold/80 transition-colors"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
