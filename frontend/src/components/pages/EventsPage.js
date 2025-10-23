"use client";

import { useState } from "react";
import SearchBar from "../UI Components/SearchBar";
import EventCard from "../UI Components/EventCard";
import Footer from "../UI Components/Footer";

// Sample event data - replace with actual data from API
const sampleEvents = [
  {
    id: 1,
    title: "Summer Music Festival 2025",
    date: "July 15, 2025",
    time: "6:00 PM",
    location: "Central Park, Nairobi",
    price: 2500,
    category: "Music",
    image: null,
    description: "Join us for an unforgettable evening of live music featuring top local and international artists.",
    attendees: 250
  },
  {
    id: 2,
    title: "Tech Innovation Summit",
    date: "August 5, 2025",
    time: "9:00 AM",
    location: "Kenyatta International Convention Centre",
    price: 5000,
    category: "Technology",
    image: null,
    description: "Discover the latest trends in technology and innovation from industry leaders.",
    attendees: 500
  },
  {
    id: 3,
    title: "Art Exhibition: Modern Kenya",
    date: "July 20, 2025",
    time: "10:00 AM",
    location: "National Museum",
    price: "Free",
    category: "Arts & Culture",
    image: null,
    description: "Experience contemporary Kenyan art from emerging and established artists.",
    attendees: 150
  },
  {
    id: 4,
    title: "Food & Wine Festival",
    date: "September 10, 2025",
    time: "12:00 PM",
    location: "Karen Country Club",
    price: 3500,
    category: "Food & Drink",
    image: null,
    description: "Taste the best cuisines and wines from around the world in one place.",
    attendees: 300
  },
  {
    id: 5,
    title: "Marathon for Health",
    date: "October 1, 2025",
    time: "6:00 AM",
    location: "Uhuru Park",
    price: 1000,
    category: "Sports",
    image: null,
    description: "Run for a cause! Join our annual marathon supporting health initiatives.",
    attendees: 1000
  },
  {
    id: 6,
    title: "Business Networking Evening",
    date: "August 15, 2025",
    time: "5:30 PM",
    location: "Radisson Blu Hotel",
    price: 2000,
    category: "Business",
    image: null,
    description: "Connect with entrepreneurs and business leaders in a professional setting.",
    attendees: 80
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState(sampleEvents);
  const [filteredEvents, setFilteredEvents] = useState(sampleEvents);

  const handleSearch = ({ searchTerm, category, location }) => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (category && category !== "all") {
      filtered = filtered.filter(event => event.category === category);
    }

    // Filter by location
    if (location && location !== "all") {
      if (location === "online") {
        filtered = filtered.filter(event => 
          event.location.toLowerCase().includes("online")
        );
      } else {
        filtered = filtered.filter(event => 
          event.location.toLowerCase().includes(location.toLowerCase())
        );
      }
    }

    setFilteredEvents(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Events
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Find the perfect event that matches your interests
          </p>
          
          {/* Search Bar */}
          <SearchBar 
            placeholder="Search for events, categories, or locations..." 
            onSearch={handleSearch}
            showFilters={true}
          />
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredEvents.length} Events Found
            </h2>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black">
              <option>Sort by: Featured</option>
              <option>Sort by: Date</option>
              <option>Sort by: Price (Low to High)</option>
              <option>Sort by: Price (High to Low)</option>
              <option>Sort by: Most Popular</option>
            </select>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No events found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
