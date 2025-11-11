"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/contexts/EventsContext";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import SearchBar from "../UI Components/SearchBar";
import EventCard from "../UI Components/EventCard";
import Button from "../UI Components/Button";

export default function EventsPage({ userType = "public" }) {
  const { getAllEvents, events } = useEvents();
  const { getUserId, currentUser } = useUser();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    // Get events based on user type
    // Public and eventGoer see only non-flagged events
    // Organiser and moderator see all events
    const includesFlagged = userType === "eventOrganiser" || userType === "moderator";
    const fetchedEvents = getAllEvents(includesFlagged);
    setAllEvents(fetchedEvents);
    setFilteredEvents(fetchedEvents);
  }, [userType, currentUser, events]); // Added 'events' dependency to re-render when events change

  const handleSearch = ({ searchTerm, category, location }) => {
    let filtered = allEvents;

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

  // Get page title based on user type
  const getPageTitle = () => {
    switch (userType) {
      case "eventOrganiser":
        return "Manage Events";
      case "moderator":
        return "Moderate Events";
      default:
        return "Discover Events";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {userType === "eventOrganiser" 
              ? "View and manage all events on the platform"
              : userType === "moderator"
              ? "Monitor and moderate all events"
              : "Find the perfect event that matches your interests"
            }
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
          {/* Create Event Button for Event Organisers */}
          {userType === "eventOrganiser" && (
            <div className="mb-8">
              <Link href="/eo-create_event_page">
                <Button variant="primary" className="bg-black text-white hover:bg-gray-800">
                  + Create New Event
                </Button>
              </Link>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredEvents.length} Events Found
            </h2>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white">
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
                <EventCard 
                  key={event.id} 
                  event={event} 
                  userType={userType}
                  userId={getUserId()}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No events found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
