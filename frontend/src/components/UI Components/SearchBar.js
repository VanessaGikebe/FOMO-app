"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({
  placeholder = "Search events...",
  onSearch,
  showFilters = false,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cat_music", label: "Music" },
    { value: "cat_sports", label: "Sports" },
    { value: "cat_art", label: "Art & Culture" },
    { value: "cat_food", label: "Food & Drink" },
    { value: "cat_tech", label: "Technology" },
    { value: "cat_business", label: "Business" },
    { value: "cat_fitness", label: "Fitness & Wellness" },
    { value: "cat_education", label: "Education" },
    { value: "cat_workshop", label: "Workshop" },
    { value: "cat_conference", label: "Conference" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({
        searchTerm,
        category: selectedCategory,
        location: selectedLocation,
      });
    }
  };

  // Real-time search as user types
  const handleSearchTermChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch({
        searchTerm: value,
        category: selectedCategory,
        location: selectedLocation
      });
    }
  };

  // Real-time filter update for category
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    if (onSearch) {
      onSearch({
        searchTerm,
        category: value,
        location: selectedLocation
      });
    }
  };

  // Real-time filter update for location
  const handleLocationChange = (e) => {
    const value = e.target.value;
    setSelectedLocation(value);
    if (onSearch) {
      onSearch({
        searchTerm,
        category: selectedCategory,
        location: value
      });
    }
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={handleSearchTermChange}
              className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            {/* Lucide Magnifying Glass */}
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters (Optional) */}
      {showFilters && (
        <div className="mt-4 flex flex-wrap gap-4">
          {/* Category Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={handleLocationChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Locations</option>
              <option value="online">Online</option>
              <option value="nairobi">Nairobi</option>
              <option value="mombasa">Mombasa</option>
              <option value="kisumu">Kisumu</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
