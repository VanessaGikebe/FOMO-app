"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, getDocs, addDoc, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import { getAllEvents as fetchAllEvents, getEventDetails, createOrganizerEvent, updateOrganizerEvent as updateEventAPI, deleteOrganizerEvent } from '../lib/api';
import { flagEventAPI, unflagEventAPI, deleteEventAPI } from '../lib/api';

const EventsContext = createContext();

// Start with no hard-coded events. Frontend will load events from backend API.
const initialEvents = [];

export function EventsProvider({ children }) {
  // Load events from backend API
  const [events, setEvents] = useState(initialEvents);
  const [loading, setLoading] = useState(true);

  // Fetch events from backend API on mount
  // Helper to normalize event documents coming from various sources
  const normalizeEvent = (docId, data = {}) => {
    // prefer explicit ids, fall back to docId
    const id = docId || data.id || data.event_id || data.eventId || '';
    const title = data.title || data.name || '';
    const description = data.description || data.details || '';
    const category = data.category || data.category_name || '';
    const price = (data.price !== undefined) ? data.price : (data.price_paid !== undefined ? data.price_paid : 0);
    const capacity = data.capacity ?? data.max_capacity ?? 0;
    const attendees = data.attendees ?? data.attendee_count ?? 0;

    // date/time normalization: support separate fields or a Firestore Timestamp (start_date)
    let date = data.date || '';
    let time = data.time || '';
    
    // Handle Firestore timestamp objects that come from backend
    if (data.start_date) {
      try {
        let d;
        // Check if it's a Firestore timestamp with _seconds
        if (data.start_date._seconds) {
          d = new Date(data.start_date._seconds * 1000);
        } else if (typeof data.start_date.toDate === 'function') {
          d = data.start_date.toDate();
        } else {
          d = new Date(data.start_date);
        }
        date = d.toISOString().split('T')[0];
        // show HH:MM
        const hhmm = d.toTimeString().split(' ')[0].slice(0,5);
        time = hhmm;
      } catch (e) {
        console.warn('Failed to parse start_date:', data.start_date, e);
      }
    }

    const location = data.location || data.venue || data.venue_name || '';
    const organizerId = data.organizerId || data.organizer_id || data.user_id || data.userId || '';
    const organizerName = data.organizerName || data.organizer_name || data.organizer || '';
    const image = data.image || data.image_url || null;
    const isFlagged = data.isFlagged ?? data.is_flagged ?? false;
    const flagReason = data.flagReason ?? data.flag_reason ?? '';
    const tags = data.tags || [];

    return {
      id,
      title,
      description,
      category,
      date,
      time,
      location,
      price,
      image,
      organizerId,
      organizerName,
      isFlagged,
      flagReason,
      attendees,
      capacity,
      tags,
    };
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Fetch events from backend API
    const loadEvents = async () => {
      console.log('🔄 Loading events from backend API...');
      setLoading(true);
      try {
        const fetchedEvents = await fetchAllEvents();
        console.log('✅ Fetched events from backend:', fetchedEvents);
        const normalized = fetchedEvents.map(event => normalizeEvent(event.id, event));
        console.log('✅ Normalized events:', normalized);
        setEvents(normalized);
      } catch (error) {
        console.error('❌ Failed to load events from backend:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();

    // Optional: Set up polling to refresh events periodically (every 30 seconds)
    const intervalId = setInterval(loadEvents, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

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

  // Create new event (via backend API). Returns created event object.
  const createEvent = async (eventData, authToken = null) => {
    try {
      const result = await createOrganizerEvent(eventData, authToken);
      
      // Refresh events list after creation
      const updatedEvents = await fetchAllEvents();
      const normalized = updatedEvents.map(event => normalizeEvent(event.id, event));
      setEvents(normalized);
      
      return result;
    } catch (err) {
      console.error('Failed to create event via backend:', err);
      throw err;
    }
  };

  // Update existing event (via backend API)
  const updateEvent = async (eventId, updatedData, authToken = null) => {
    try {
      await updateEventAPI(eventId, updatedData, authToken);
      
      // Refresh events list after update
      const updatedEvents = await fetchAllEvents();
      const normalized = updatedEvents.map(event => normalizeEvent(event.id, event));
      setEvents(normalized);
      
      return true;
    } catch (err) {
      console.error('Failed to update event in Firestore, applying local patch:', err);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, ...updatedData, updatedAt: new Date().toISOString() }
            : event
        )
      );
      return false;
    }
  };

  // Delete event (via backend API for moderator operations)
  const deleteEvent = async (eventId, userId = null) => {
    try {
      // Try backend first if we have user ID
      if (userId) {
        const result = await deleteEventAPI(eventId, userId);
        if (result.error) {
          console.warn('Backend delete failed, falling back to Firestore:', result.error);
          // Fall back to direct Firestore delete
          await deleteDoc(doc(db, 'events', eventId));
        }
      } else {
        // No user ID, use direct Firestore delete
        await deleteDoc(doc(db, 'events', eventId));
      }
      return true;
    } catch (err) {
      console.error('Failed to delete event:', err);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      return false;
    }
  };

  // Flag event (moderator only) - via backend API
  const flagEvent = async (eventId, reason = "", userId = null) => {
    try {
      if (!userId) {
        console.warn('No user ID provided for flag operation');
        // Still try to update locally
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, isFlagged: true, flagReason: reason }
              : event
          )
        );
        return false;
      }

      const result = await flagEventAPI(eventId, reason, userId);
      
      if (result.error) {
        console.error('Backend flag failed:', result.error);
        // Fall back to direct Firestore update
        await updateDoc(doc(db, 'events', eventId), { 
          isFlagged: true, 
          flagReason: reason,
          flaggedBy: userId,
          flaggedAt: new Date(),
        });
      }

      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, isFlagged: true, flagReason: reason, flaggedBy: userId }
            : event
        )
      );
      return true;
    } catch (err) {
      console.error('Failed to flag event:', err);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, isFlagged: true, flagReason: reason }
            : event
        )
      );
      return false;
    }
  };

  // Unflag event (moderator only) - via backend API
  const unflagEvent = async (eventId, userId = null) => {
    try {
      if (!userId) {
        console.warn('No user ID provided for unflag operation');
        // Still try to update locally
        setEvents(prevEvents => 
          prevEvents.map(event => 
            event.id === eventId 
              ? { ...event, isFlagged: false, flagReason: "" }
              : event
          )
        );
        return false;
      }

      const result = await unflagEventAPI(eventId, userId);
      
      if (result.error) {
        console.error('Backend unflag failed:', result.error);
        // Fall back to direct Firestore update
        await updateDoc(doc(db, 'events', eventId), { 
          isFlagged: false, 
          flagReason: "",
          unflaggedBy: userId,
          unflaggedAt: new Date(),
        });
      }

      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, isFlagged: false, flagReason: "", unflaggedBy: userId }
            : event
        )
      );
      return true;
    } catch (err) {
      console.error('Failed to unflag event:', err);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, isFlagged: false, flagReason: "" }
            : event
        )
      );
      return false;
    }
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

  // Cart state
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
    loading,
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
