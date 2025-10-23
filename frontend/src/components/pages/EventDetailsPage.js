"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "../UI Components/Footer";
import Button from "../UI Components/Button";

// Sample event data - in real app, this would come from props or API
const sampleEvent = {
  id: 1,
  title: "Summer Music Festival 2025",
  date: "July 15, 2025",
  time: "6:00 PM - 11:00 PM",
  location: "Central Park, Nairobi",
  address: "123 Central Park Road, Nairobi, Kenya",
  price: 2500,
  category: "Music",
  image: null,
  description: "Join us for an unforgettable evening of live music featuring top local and international artists. Experience world-class performances, delicious food, and an amazing atmosphere under the stars.",
  longDescription: `This year's Summer Music Festival promises to be the biggest yet! We're bringing together an incredible lineup of artists from various genres including Afrobeat, Jazz, Hip-Hop, and Rock.

The festival will feature:
• 5+ hours of live performances
• Multiple stages with different genres
• Food trucks from Nairobi's best restaurants
• Art installations and interactive experiences
• VIP lounge access for premium ticket holders
• Family-friendly activities

Don't miss out on this incredible celebration of music and culture!`,
  attendees: 250,
  capacity: 500,
  organizer: "Events Kenya Ltd",
  tags: ["Music", "Festival", "Outdoor", "Family-Friendly"],
  images: []
};

export default function EventDetailsPage({ eventData = sampleEvent }) {
  const [selectedTickets, setSelectedTickets] = useState(1);
  const event = eventData;

  const handleAddToCart = () => {
    // Handle add to cart logic
    alert(`Added ${selectedTickets} ticket(s) to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/events" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            ← Back to Events
          </Link>
        </div>
      </div>

      {/* Event Header */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Image */}
            <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden">
              {event.image ? (
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-8xl">🎉</span>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div>
              {/* Category Badge */}
              <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>

              <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
                {event.title}
              </h1>

              <p className="text-gray-600 text-lg mb-6">
                {event.description}
              </p>

              {/* Event Details Grid */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold text-gray-900">Date & Time</p>
                    <p className="text-gray-600">{event.date}</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                    <p className="text-sm text-gray-500">{event.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-semibold text-gray-900">Attendees</p>
                    <p className="text-gray-600">{event.attendees} / {event.capacity} spots filled</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="font-semibold text-gray-900">Organized by</p>
                    <p className="text-gray-600">{event.organizer}</p>
                  </div>
                </div>
              </div>

              {/* Ticket Selection */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Ticket Price</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {event.price === 0 || event.price === "Free" ? "Free" : `KSh ${event.price}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">Quantity:</label>
                    <select
                      value={selectedTickets}
                      onChange={(e) => setSelectedTickets(Number(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button 
                  variant="primary" 
                  size="large" 
                  className="w-full"
                  onClick={handleAddToCart}
                >
                  Add to Cart - KSh {(event.price * selectedTickets).toLocaleString()}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Description */}
      <section className="py-12 px-6 bg-white border-t">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {event.longDescription}
          </div>

          {/* Tags */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
