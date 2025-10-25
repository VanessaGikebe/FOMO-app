"use client";

import { createContext, useContext, useState, useEffect } from "react";

const EventsContext = createContext();

// Mock events data
const initialEvents = [
  {
    id: "evt001",
    title: "Tech Summit 2025",
    description: "Join us for the biggest tech conference of the year featuring industry leaders, cutting-edge innovations, and networking opportunities.",
    category: "Technology",
    date: "2025-11-15",
    time: "09:00 AM",
    location: "Nairobi Convention Centre",
    price: 2500,
    image: null,
    organizerId: "org001",
    organizerName: "Tech Events Kenya",
    isFlagged: false,
    flagReason: "",
    attendees: 342,
    capacity: 500,
    tags: ["Technology", "Networking", "Innovation"]
  },
  {
    id: "evt002",
    title: "Jazz Night Live",
    description: "An evening of smooth jazz featuring local and international artists. Enjoy great music, food, and drinks.",
    category: "Music",
    date: "2025-11-20",
    time: "07:00 PM",
    location: "The Alchemist Bar",
    price: 1500,
    image: null,
    organizerId: "org002",
    organizerName: "Live Music Productions",
    isFlagged: false,
    flagReason: "",
    attendees: 89,
    capacity: 150,
    tags: ["Music", "Jazz", "Entertainment"]
  },
  {
    id: "evt003",
    title: "Food Festival Nairobi",
    description: "Celebrate culinary diversity with over 50 food vendors, cooking demonstrations, and live entertainment.",
    category: "Food & Drink",
    date: "2025-12-01",
    time: "11:00 AM",
    location: "Uhuru Gardens",
    price: 500,
    image: null,
    organizerId: "org001",
    organizerName: "Tech Events Kenya",
    isFlagged: false,
    flagReason: "",
    attendees: 567,
    capacity: 1000,
    tags: ["Food", "Festival", "Family Friendly"]
  },
  {
    id: "evt004",
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to top investors. Network with entrepreneurs and VCs.",
    category: "Business",
    date: "2025-11-25",
    time: "02:00 PM",
    location: "iHub Nairobi",
    price: 1000,
    image: null,
    organizerId: "org003",
    organizerName: "Startup Hub",
    isFlagged: true,
    flagReason: "Pending verification of event details",
    attendees: 45,
    capacity: 100,
    tags: ["Business", "Startups", "Networking"]
  },
  {
    id: "evt005",
    title: "Yoga in the Park",
    description: "Join us for a relaxing morning of yoga, meditation, and wellness activities in beautiful surroundings.",
    category: "Sports & Wellness",
    date: "2025-11-18",
    time: "06:30 AM",
    location: "Karura Forest",
    price: 0,
    image: null,
    organizerId: "org004",
    organizerName: "Wellness Warriors",
    isFlagged: false,
    flagReason: "",
    attendees: 23,
    capacity: 50,
    tags: ["Wellness", "Yoga", "Outdoor", "Free"]
  },
  {
    id: "evt006",
    title: "Art Exhibition: Modern Africa",
    description: "Explore contemporary African art from emerging and established artists. Opening reception with artist talks.",
    category: "Arts & Culture",
    date: "2025-12-05",
    time: "05:00 PM",
    location: "Nairobi National Museum",
    price: 800,
    image: null,
    organizerId: "org002",
    organizerName: "Live Music Productions",
    isFlagged: false,
    flagReason: "",
    attendees: 112,
    capacity: 200,
    tags: ["Art", "Culture", "Exhibition"]
  }
];

export function EventsProvider({ children }) {
  // Initialize state from localStorage or use initialEvents
  const [events, setEvents] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedEvents = localStorage.getItem('fomo_events');
      if (savedEvents) {
        try {
          return JSON.parse(savedEvents);
        } catch (error) {
          console.error('Error parsing saved events:', error);
          return initialEvents;
        }
      }
    }
    return initialEvents;
  });

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fomo_events', JSON.stringify(events));
    }
  }, [events]);

  // Get all events (with optional filtering for non-flagged)
  const getAllEvents = (includesFlagged = true) => {
    if (includesFlagged) {
      return events;
    }
    return events.filter(event => !event.isFlagged);
  };

  // Get event by ID
  const getEventById = (eventId) => {
    return events.find(event => event.id === eventId);
  };

  // Get events by organizer ID
  const getEventsByOrganizer = (organizerId) => {
    return events.filter(event => event.organizerId === organizerId);
  };

  // Create new event
  const createEvent = (eventData) => {
    const newEvent = {
      id: `evt${String(events.length + 1).padStart(3, '0')}`,
      ...eventData,
      isFlagged: false,
      flagReason: "",
      attendees: 0,
      createdAt: new Date().toISOString()
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
    return newEvent;
  };

  // Update existing event
  const updateEvent = (eventId, updatedData) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, ...updatedData, updatedAt: new Date().toISOString() }
          : event
      )
    );
  };

  // Delete event
  const deleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  // Flag event (moderator only)
  const flagEvent = (eventId, reason = "") => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, isFlagged: true, flagReason: reason }
          : event
      )
    );
  };

  // Unflag event (moderator only)
  const unflagEvent = (eventId) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, isFlagged: false, flagReason: "" }
          : event
      )
    );
  };

  // Check if user owns event
  const isEventOwner = (eventId, userId) => {
    const event = getEventById(eventId);
    return event && event.organizerId === userId;
  };

  // Reset to initial events (useful for testing)
  const resetEvents = () => {
    setEvents(initialEvents);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fomo_events');
    }
  };

  const value = {
    events,
    getAllEvents,
    getEventById,
    getEventsByOrganizer,
    createEvent,
    updateEvent,
    deleteEvent,
    flagEvent,
    unflagEvent,
    isEventOwner,
    resetEvents
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}
