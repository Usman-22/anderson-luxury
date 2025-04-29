// src/pages/admin/Dashboard.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [listingsCount, setListingsCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0); // ✅ Added blogs count

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/admin/login");
    }

    fetchCounts();
  }, [navigate]);

  const fetchCounts = async () => {
    try {
      const listingsRes = await fetch("http://localhost:5000/listings");
      const listings = await listingsRes.json();
      setListingsCount(listings.length);

      const usersRes = await fetch("http://localhost:5000/users");
      const users = await usersRes.json();
      setUsersCount(users.length);

      const leadsRes = await fetch("http://localhost:5000/leads");
      const leads = await leadsRes.json();
      setLeadsCount(leads.length);

      const blogsRes = await fetch("http://localhost:5000/blogs");
      const blogs = await blogsRes.json();
      setBlogsCount(blogs.length); // ✅ fetch blogs
    } catch (error) {
      console.error("Failed to fetch counts", error);
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Listings */}
        <div className="bg-dark rounded-lg p-6 border border-white/10 shadow hover:shadow-lg transition-all">
          <h3 className="text-lg text-white/70 mb-2">Total Listings</h3>
          <p className="text-4xl font-bold text-gold">{listingsCount}</p>
        </div>

        {/* Total Users */}
        <div className="bg-dark rounded-lg p-6 border border-white/10 shadow hover:shadow-lg transition-all">
          <h3 className="text-lg text-white/70 mb-2">Total Users</h3>
          <p className="text-4xl font-bold text-gold">{usersCount}</p>
        </div>

        {/* Total Leads */}
        <div className="bg-dark rounded-lg p-6 border border-white/10 shadow hover:shadow-lg transition-all">
          <h3 className="text-lg text-white/70 mb-2">Total Leads</h3>
          <p className="text-4xl font-bold text-gold">{leadsCount}</p>
        </div>

        {/* Total Blogs */}
        <div className="bg-dark rounded-lg p-6 border border-white/10 shadow hover:shadow-lg transition-all">
          <h3 className="text-lg text-white/70 mb-2">Total Blogs</h3>
          <p className="text-4xl font-bold text-gold">{blogsCount}</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
