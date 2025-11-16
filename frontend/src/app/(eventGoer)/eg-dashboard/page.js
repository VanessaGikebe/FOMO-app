"use client";

import { useEvents } from '@/contexts/EventsContext';
import { useRouter } from 'next/navigation';
import EventCardComponent from '@/components/UI Components/EventCard';
import { Footer } from "@/components";
import Link from 'next/link';
import { Ticket, ShoppingCart, Heart } from 'lucide-react';

export default function EventGoerDashboard() {
  const { getAllEvents, cartItems } = useEvents();
  const events = getAllEvents(false); // exclude flagged for public/event goer
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50">
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Links Header */}
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Orders Link */}
            <Link href="/eg-orders">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border-l-4 border-purple-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
                    <p className="text-sm text-gray-600 mt-1">View your purchase history</p>
                  </div>
                  <Ticket className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </Link>

            {/* Cart Link */}
            <Link href="/eg-cart">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border-l-4 border-blue-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Cart</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {cartItems?.length || 0} item{cartItems?.length !== 1 ? 's' : ''} in cart
                    </p>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </Link>

            {/* Favorites Link */}
            <Link href="/eg-favourites">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 cursor-pointer border-l-4 border-red-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Favorites</h3>
                    <p className="text-sm text-gray-600 mt-1">Your saved events</p>
                  </div>
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </Link>
          </div>

          <hr className="my-10 border-gray-200" />

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
      <Footer />
    </div>
  );
}
