import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryListings from "@/components/inventory/InventoryListings";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Grid2X2, List } from "lucide-react";

// Filters Type Definition
interface FiltersType {
  priceRange: number[];
  yearRange: number[];
  mileageRange: number[];
  coachType: string;
  location: string;
}

const Inventory: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [filters, setFilters] = useState<FiltersType>({
    priceRange: [0, 3000000], // match your updated filter range
    yearRange: [2010, 2025],
    mileageRange: [0, 500000],
    coachType: "",
    location: "",
  });

  const handleFilterChange = (newFilters: Partial<FiltersType>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="font-playfair text-3xl md:text-4xl font-semibold mb-2">
              Luxury Coach Inventory
            </h1>
            <p className="text-white/70">
              Discover premium Prevost coaches for your lifestyle
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-1/4">
              <InventoryFilters
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </aside>

            {/* Main Listings */}
            <section className="w-full lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-white/70 text-sm md:text-base">
                  Showing{" "}
                  <span className="text-gold font-semibold">filtered</span>{" "}
                  coaches
                </p>
                <div className="flex items-center gap-3">
                  <span className="hidden md:block text-sm text-white/70">
                    View:
                  </span>
                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(value) =>
                      value && setViewMode(value as "grid" | "list")
                    }
                    className="border border-white/10 rounded-md"
                  >
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <Grid2X2 size={18} />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List size={18} />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>

              {/* Listings Component */}
              <InventoryListings viewMode={viewMode} filters={filters} />
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Inventory;
