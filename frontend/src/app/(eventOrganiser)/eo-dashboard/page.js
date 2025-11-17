"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import EventCardComponent from '@/components/UI Components/EventCard';
import { getEventMetrics, getEventsByOrganizer } from '@/lib/api';

// --- Utility Components ---

// Component for the Metric/Stat Cards with updated icons
const MetricCard = ({ title, value, iconPath, isLoading = false }) => (
  <div className="w-full sm:w-1/3 p-2">
    <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4 border-2 border-orange-50 hover:border-[#FF6B35] transition-all">
      {/* Icon Area */}
      <div className="flex-shrink-0 bg-[#FF6B35] rounded-full p-2">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {!isLoading && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />}
        </svg>
      </div>
      {/* Text/Value Area */}
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#6C5CE7] bg-clip-text text-transparent">
          {isLoading ? "..." : value}
        </p>
      </div>
    </div>
  </div>
);

// Component for an individual Upcoming Event Card with the new design (rounded/hovering tag)
const EventCard = ({ category = "Technology", title = "Event Title", venueDate = "2025-11-01", time = "09:00 AM", description = "Join us for the biggest tech conference of the year featuring industry leaders, cutting-edge innovation..." }) => (
  <div className="w-full sm:w-1/3 p-2 flex-shrink-0">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-50 hover:border-[#FF6B35] transition-all hover:shadow-xl">
      
      {/* Top Visual Area (Matches the design: light background, category tag, emoji) */}
      <div className="relative pt-[65%] bg-gradient-to-br from-orange-50 to-teal-50 border-b border-gray-100"> 
        
        {/* Category Tag: UPDATED to be rounded and hovering */}
        <div className="absolute top-4 right-4 bg-[#FF6B35]text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg"> 
          {category}
        </div>

        {/* Centered Emoji Placeholder (You'll need an image for the specific confetti emoji) */}
        <div className="absolute inset-0 flex items-center justify-center">
           {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <PartyPopper className="w-12 h-12" />
            </div>
          )}
        </div>
      </div>
      
      {/* Text Content Section */}
      <div className="p-4 pt-6">
        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        
        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-2">
          {description}
        </p>

        {/* Date/Time (Small text with calendar icon) */}
        <div className="flex items-center text-sm font-medium text-gray-700 mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            {date} | {time}
          </div>

        {/* View Event Button (Full width, Dark background) */}
        <button className="w-full bg-[#FF6B35] text-white text-sm py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold">
          View Event
        </button>
      </div>
    </div>
  </div>
);

// Component for Quick Action Buttons
const QuickActionButton = ({ title, iconPath, onClick }) => (
  <button onClick={onClick} className="w-full sm:w-1/4 p-2 flex-shrink-0">
    <div className="bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-purple-50 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center transition-all duration-200 h-32 border-2 border-purple-100 hover:border-[#FF6B35] hover:scale-105">
      {/* Icon */}
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-full p-2 mb-2">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
        </svg>
      </div>
      {/* Title */}
      <span className="text-sm font-medium text-gray-900">{title}</span>
    </div>
  </button>
);


// --- Main Dashboard Component ---

export default function EventOrganiserDashboard() {
  const { getUserId } = useUser();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [metrics, setMetrics] = useState({
    totalVisits: 0,
    ticketsSold: 0,
    conversionRate: 0,
    isLoading: true
  });
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const router = useRouter();

  // Fetch organizer's events on mount
  useEffect(() => {
    const uid = getUserId();
    if (!uid) {
      setIsLoadingEvents(false);
      setMetrics(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const events = await getEventsByOrganizer(uid);
        
        if (Array.isArray(events)) {
          setUpcomingEvents(events);
          // Fetch metrics for organizer's events
          if (events.length > 0) {
            await fetchMetrics(events);
          } else {
            setMetrics(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          console.warn('Failed to fetch events:', events?.error);
          setMetrics(prev => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setMetrics(prev => ({ ...prev, isLoading: false }));
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [getUserId]);

  const fetchMetrics = async (eventList) => {
    try {
      setMetrics(prev => ({ ...prev, isLoading: true }));
      
      let totalVisits = 0;
      let totalTicketsSold = 0;
      let totalRevenue = 0;

      // Fetch metrics for all organizer's events
      for (const event of eventList) {
        try {
          const eventMetrics = await getEventMetrics(event.id);
          if (eventMetrics) {
            totalVisits += eventMetrics.visits || 0;
            totalTicketsSold += eventMetrics.ticketsSold || 0;
            totalRevenue += eventMetrics.revenue || 0;
          }
        } catch (err) {
          console.warn(`Failed to fetch metrics for event ${event.id}:`, err);
        }
      }

      const conversionRate = totalVisits > 0 
        ? Math.round((totalTicketsSold / totalVisits) * 100)
        : 0;

      setMetrics({
        totalVisits,
        ticketsSold: totalTicketsSold,
        conversionRate,
        isLoading: false
      });
    } catch (err) {
      console.error('Failed to fetch metrics:', err);
      setMetrics(prev => ({ ...prev, isLoading: false }));
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50">
      
      {/* (Header component assumed to be here, based on original Organiser code) */}
      
      {/* --- Main Dashboard Content --- */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* 1. Digital Event Metrics Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#FF6B35] mb-1">Digital Event Metrics</h2>
            <p className="text-gray-600 mb-6">Understand how visitors interact with your events</p>
            
            <div className="flex flex-wrap -m-2">
              <MetricCard 
                title="Total Visits" 
                value={metrics.totalVisits.toLocaleString()}
                iconPath="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                isLoading={metrics.isLoading}
              />
              <MetricCard 
                title="Tickets Sold" 
                value={metrics.ticketsSold.toLocaleString()}
                iconPath="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                isLoading={metrics.isLoading}
              />
              <MetricCard 
                title="Conversion Rate" 
                value={`${metrics.conversionRate}%`}
                iconPath="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                isLoading={metrics.isLoading}
              />
            </div>
          </section>
          
          {/* 2. My Upcoming Events Section (Uses the updated EventCard) */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#FF6B35] mb-1">My Upcoming Events</h2>
            <p className="text-gray-600 mb-6">Review scheduled events to refine marketing and update key details</p>
            
            <div className="flex flex-wrap -m-2">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <EventCardComponent 
                    key={event.id}
                    event={event}
                    userType="eventOrganiser"
                    userId={getUserId()}
                  />
                ))
              ) : (
                <p className="text-gray-500 p-4">No upcoming events yet.</p>
              )}
            </div>
          </section>
          
          {/* 3. Quick Actions Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#FF6B35] mb-1">Quick Actions</h2>
            <p className="text-gray-600 mb-6">Streamline your workflow with easy one-step actions</p>
            
            <div className="flex flex-wrap -m-2">
              {/* View Events: Eye Icon */}
              <QuickActionButton 
                title="View Events" 
                iconPath="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                onClick={() => router.push('/eo-manageEvents')}
              />
              {/* Create Event: Plus Icon */}
              <QuickActionButton 
                title="Create Event" 
                iconPath="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" 
                onClick={() => router.push('/eo-create_event_page')}
              />
              {/* Edit Event: Pencil Icon */}
              <QuickActionButton 
                title="Edit Event" 
                iconPath="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-9-9h5m-5 0a2 2 0 00-2 2v5m2-5h5m-5 0L19 7" 
                onClick={() => router.push('/eo-manageEvents')}
              />
              {/* Delete Event: Trash Icon */}
              <QuickActionButton 
                title="Delete Event" 
                iconPath="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                onClick={() => router.push('/eo-manageEvents')}
              />
            </div>
          </section>
          
        </div>
      </main>

      {/* --- Footer Component --- */}    </div>
  );
}