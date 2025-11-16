"use client";

<<<<<<< HEAD
import { useEvents } from '@/contexts/EventsContext';
import EventCardComponent from '@/components/UI Components/EventCard';
=======
import { Footer } from "@/components";
import { useEvents } from "@/contexts/EventsContext";
import EventCardComponent from "@/components/UI Components/EventCard";
>>>>>>> 113ed2b (Improved frontend UI with icons)

export default function EventGoerDashboard() {
  const { getAllEvents } = useEvents();
  const events = getAllEvents(false); // exclude flagged for public/event goer

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50">
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Recommended Events
            </h2>
            <p className="text-gray-600 mb-8">Events you may like</p>
            <div className="flex flex-wrap justify-center -mx-4">
              {events.slice(0, 3).map((ev) => (
                <div key={ev.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                  <EventCardComponent event={ev} userType="eventGoer" />
                </div>
              ))}
            </div>
          </section>

          <hr className="my-10 border-gray-200" />

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Upcoming Events
            </h2>
            <p className="text-gray-600 mb-8">Events happening soon</p>
            <div className="flex flex-wrap justify-center -mx-4">
              {events.slice(3, 6).map((ev) => (
                <div key={ev.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                  <EventCardComponent event={ev} userType="eventGoer" />
                </div>
              ))}
            </div>
          </section>

          <hr className="my-10 border-gray-200" />

          <section className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">My Events</h2>
            <p className="text-gray-600 mb-8">
              Events you've created or favorited
            </p>
            <div className="flex flex-wrap justify-center -mx-4">
              {events.slice(6, 9).map((ev) => (
                <div key={ev.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                  <EventCardComponent event={ev} userType="eventGoer" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
