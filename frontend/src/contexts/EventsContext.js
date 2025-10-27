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

  // Cart state: managed here so components (cart page, event details) can interact
  // Cart state is initialized empty on the server and populated on mount from
  // localStorage in a client-only effect to avoid SSR/client markup mismatch.
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage after mount (client-only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fomo_cart');
        if (saved) setCartItems(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing saved cart:', err);
      }
    }
  }, []);

  // Persist cart
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fomo_cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Add to cart. quantity defaults to 1.
  // Returns { ok: boolean, reason?: string, finalQty?: number }
  const addToCart = (eventId, quantity = 1, ticketType = 'Standard') => {
    const ev = getEventById(eventId);
    if (!ev) return { ok: false, reason: 'not_found' };

    // compute tickets available (capacity minus attendees) if data exists
    const ticketsAvailable = Math.max((ev.capacity ?? 0) - (ev.attendees ?? 0), 0);
    // normalize quantity
    const qty = Math.max(1, Number(quantity) || 1);

    // if no tickets available, do not add
    if (ticketsAvailable === 0) {
      return { ok: false, reason: 'sold_out' };
    }

    // Work from the current cart snapshot to compute new cart synchronously
    let result = { ok: false, reason: 'unknown' };
    setCartItems((prev = []) => {
      const existingIndex = prev.findIndex(item => item.eventId === eventId && item.ticketType === ticketType);
      const newCart = [...prev];

      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        const desired = existing.quantity + qty;
        const newQty = Math.min(desired, ticketsAvailable);
        if (newQty === existing.quantity) {
          result = { ok: false, reason: 'max_reached', finalQty: existing.quantity };
          return prev; // no change
        }
        newCart[existingIndex] = { ...existing, quantity: newQty, ticketsAvailable };
        result = { ok: true, finalQty: newQty };
        return newCart;
      }

      const item = {
        id: ev.id,
        eventId: ev.id,
        eventName: ev.title,
        venue: ev.location || ev.venue || '',
        date: ev.date || '',
        time: ev.time || '',
        ticketType,
        ticketsAvailable,
        pricePerTicket: Number(ev.price) || 0,
        quantity: Math.min(qty, ticketsAvailable || qty)
      };

      // only add if final quantity > 0
      if (item.quantity <= 0) {
        result = { ok: false, reason: 'invalid_quantity' };
        return prev;
      }
      newCart.push(item);
      result = { ok: true, finalQty: item.quantity };
      return newCart;
    });
    return result;
  };

  // Update quantity for a cart item. Returns { ok, reason?, finalQty? }
  const updateCartQuantity = (itemId, quantity) => {
    let result = { ok: false, reason: 'unknown' };
    setCartItems((prev = []) => {
      const idx = prev.findIndex(it => it.id === itemId || it.eventId === itemId);
      if (idx === -1) {
        result = { ok: false, reason: 'not_found' };
        return prev;
      }

      const item = prev[idx];
      const ev = getEventById(item.eventId);
      const ticketsAvailable = Math.max((ev?.capacity ?? 0) - (ev?.attendees ?? 0), 0);
      let qty = Math.max(0, Number(quantity) || 0);
      let clamped = false;
      if (qty > ticketsAvailable) {
        qty = ticketsAvailable;
        clamped = true;
      }

      const newCart = prev.map((it, i) => i === idx ? { ...it, quantity: qty, ticketsAvailable } : it);
      result = { ok: true, finalQty: qty, clamped };
      return newCart;
    });
    return result;
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((sum, it) => sum + (Number(it.pricePerTicket) || 0) * (it.quantity || 0), 0);
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
    resetEvents,
    // Cart API
    cartItems,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    clearCart
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
