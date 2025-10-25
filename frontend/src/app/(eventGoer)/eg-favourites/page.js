"use client";

import { useUser } from "@/contexts/UserContext";
import { useEvents } from "@/contexts/EventsContext";
import EventCard from "@/components/UI Components/EventCard";
import { Footer } from "@/components";

export default function FavouritesPage() {
  const { currentUser } = useUser();
  const { getEventById } = useEvents();

  // Get favorite event IDs and fetch the actual events
  const favoriteIds = currentUser?.favorites || [];
  const favoriteEvents = favoriteIds
    .map(id => getEventById(id))
    .filter(event => event !== undefined); // Filter out any undefined events

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My Favourites
          </h1>
          <p className="text-xl text-gray-300">
            {favoriteEvents.length} event{favoriteEvents.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {favoriteEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  userType="eventGoer"
                  userId={currentUser?.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No favorites yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start adding events to your favorites by clicking the heart icon on any event
              </p>
              <a 
                href="/eg-events" 
                className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Browse Events
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
