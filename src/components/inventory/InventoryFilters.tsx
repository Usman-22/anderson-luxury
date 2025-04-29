import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

interface InventoryFiltersProps {
  filters: {
    priceRange: number[];
    yearRange: number[];
    mileageRange: number[];
    coachType: string;
    location: string;
  };
  onFilterChange: (
    newFilters: Partial<InventoryFiltersProps["filters"]>
  ) => void;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const [yearRange, setYearRange] = useState(filters.yearRange);
  const [mileageRange, setMileageRange] = useState(filters.mileageRange);
  const [coachType, setCoachType] = useState(filters.coachType);
  const [location, setLocation] = useState(filters.location);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  const handleApplyFilters = () => {
    onFilterChange({
      priceRange,
      yearRange,
      mileageRange,
      coachType,
      location,
    });
  };

  const handleResetFilters = () => {
    const reset = {
      priceRange: [100000, 3000000],
      yearRange: [2010, 2025],
      mileageRange: [0, 500000],
      coachType: "",
      location: "",
    };
    setPriceRange(reset.priceRange);
    setYearRange(reset.yearRange);
    setMileageRange(reset.mileageRange);
    setCoachType(reset.coachType);
    setLocation(reset.location);
    onFilterChange(reset);
  };

  useEffect(() => {
    setPriceRange(filters.priceRange);
    setYearRange(filters.yearRange);
    setMileageRange(filters.mileageRange);
    setCoachType(filters.coachType);
    setLocation(filters.location);
  }, [filters]);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button
          className="flex items-center justify-between w-full p-4 bg-card rounded-md border border-white/10"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Filter size={18} />
            <span>Filters</span>
          </div>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Filters Section */}
      <div className={`space-y-6 ${isOpen ? "block" : "hidden lg:block"}`}>
        {/* Coach Type */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Coach Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {["Motorhome", "Entertainer"].map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={type}
                    checked={coachType === type}
                    onChange={() =>
                      setCoachType(coachType === type ? "" : type)
                    }
                    className="mr-2"
                  />
                  <Label htmlFor={type}>{type}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Range */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Price Range</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              value={priceRange}
              min={0}
              max={3000000}
              step={50000}
              onValueChange={setPriceRange}
            />
            <div className="flex justify-between text-sm text-white/70 mt-2">
              <span>{formatCurrency(priceRange[0])}</span>
              <span>{formatCurrency(priceRange[1])}</span>
            </div>
          </CardContent>
        </Card>

        {/* Year Range */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Year</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              value={yearRange}
              min={2000}
              max={2025}
              step={1}
              onValueChange={setYearRange}
            />
            <div className="flex justify-between text-sm text-white/70 mt-2">
              <span>{yearRange[0]}</span>
              <span>{yearRange[1]}</span>
            </div>
          </CardContent>
        </Card>

        {/* Mileage Range */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Mileage</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              value={mileageRange}
              min={0}
              max={500000}
              step={5000}
              onValueChange={setMileageRange}
            />
            <div className="flex justify-between text-sm text-white/70 mt-2">
              <span>{formatNumber(mileageRange[0])} mi</span>
              <span>{formatNumber(mileageRange[1])} mi</span>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="bg-card border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or state"
              className="bg-background border-white/10 text-white"
            />
          </CardContent>
        </Card>

        {/* Buttons */}
        <button
          className="button-gold w-full mt-4"
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
        <button
          className="button-outline w-full mt-3"
          onClick={handleResetFilters}
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default InventoryFilters;
