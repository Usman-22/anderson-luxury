// src/pages/admin/Leads.tsx

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input"; // ✅ Using your custom Input component

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  comments: string;
  created_at: string;
}

const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ New

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch("http://localhost:5000/leads");
        if (!res.ok) throw new Error("Failed to fetch leads");
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        console.error("Failed to fetch leads", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) =>
    (lead.name + lead.email + lead.phone + lead.comments)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold font-playfair">Leads</h1>

        {/* ✅ Search Bar */}
        <Input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-dark border border-white/10 text-white placeholder:text-white/50"
        />
      </div>

      {loading ? (
        <p className="text-gray-400">Loading leads...</p>
      ) : filteredLeads.length === 0 ? (
        <p className="text-gray-400">No matching leads found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-dark border border-white/10 rounded">
            <thead>
              <tr className="text-left text-white/70 border-b border-white/10">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Message</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-white/5">
                  <td className="py-2 px-4 text-white/90">{lead.name}</td>
                  <td className="py-2 px-4 text-white/90">{lead.email}</td>
                  <td className="py-2 px-4 text-white/90">{lead.phone}</td>
                  <td className="py-2 px-4 text-white/70">{lead.comments}</td>
                  <td className="py-2 px-4 text-white/50">
                    {new Date(lead.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default Leads;
