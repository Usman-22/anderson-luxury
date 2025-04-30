import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase"; // Import the supabase instance

const Dashboard = () => {
  const navigate = useNavigate();
  const [listingsCount, setListingsCount] = useState(0);
  const [leadsCount, setLeadsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [blogsCount, setBlogsCount] = useState(0); // Count for blogs

  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) {
      navigate("/admin/login");
    }

    fetchCounts(); // Fetch data on component mount
  }, [navigate]);

  const fetchCounts = async () => {
    try {
      // Fetch Listings Count from Supabase
      const { data: listings, error: listingsError } = await supabase
        .from("listings")
        .select("*");

      if (listingsError) throw listingsError;
      setListingsCount(listings.length);

      // Fetch Users Count from Supabase
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("*");

      if (usersError) throw usersError;
      setUsersCount(users.length);

      // Fetch Leads Count from Supabase
      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("*");

      if (leadsError) throw leadsError;
      setLeadsCount(leads.length);

      // Fetch Blogs Count from Supabase
      const { data: blogs, error: blogsError } = await supabase
        .from("blogs")
        .select("*");

      if (blogsError) throw blogsError;
      setBlogsCount(blogs.length);
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
