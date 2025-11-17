"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, getDocs, addDoc, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';
import { flagEventAPI, unflagEventAPI, deleteEventAPI } from '../lib/api';

const EventsContext = createContext();

// Start with no hard-coded events. Frontend will load events from Firestore in realtime.
const initialEvents = [];

export function EventsProvider({ children }) {
  // Load events; start with built-in data on the server and hydrate on client.
  const [events, setEvents] = useState(initialEvents);

  // Subscribe to Firestore `events` collection on client mount. If Firestore is unreachable
  // we keep the initialEvents/local changes as a fallback.
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
    if (data.start_date) {
      try {
        const d = (typeof data.start_date.toDate === 'function') ? data.start_date.toDate() : new Date(data.start_date);
        date = d.toISOString().split('T')[0];
        // show HH:MM
        const hhmm = d.toTimeString().split(' ')[0].slice(0,5);
        time = hhmm;
      } catch (e) {
        // ignore and keep existing date/time values
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
      // keep raw for debugging or advanced UI needs
      _raw: data,
    };
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const col = collection(db, 'events');
    let unsub = () => {};
    try {
      unsub = onSnapshot(col, (snapshot) => {
        const docs = snapshot.docs.map(d => normalizeEvent(d.id, d.data()));
        setEvents(docs);
      }, (err) => {
        // Firestore permission errors are expected if using backend API
        // Frontend will fetch data through backend endpoints instead
        console.warn('Firestore events subscription unavailable (using backend API instead):', err?.code || err?.message);
      });
    } catch (err) {
      console.warn('Realtime events subscription failed, using backend API fallback:', err);
      // keep initialEvents - backend API will provide data
    }
    return () => unsub();
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

  // Create new event (writes to Firestore). Returns created event object.
  const createEvent = async (eventData) => {
    try {
      const payload = {
        ...eventData,
        isFlagged: false,
        flagReason: "",
        attendees: 0,
        createdAt: serverTimestamp()
      };
      const ref = await addDoc(collection(db, 'events'), payload);

      // ensure we also set canonical fields used elsewhere (event_id, organizer_id)
      const organizerIdValue = payload.organizerId || payload.organizer_id || null;
      await setDoc(doc(db, 'events', ref.id), { event_id: ref.id, organizer_id: organizerIdValue }, { merge: true });

      // Build a normalized created object to return immediately; onSnapshot will sync canonical data
      const createdRaw = { ...payload, event_id: ref.id, organizer_id: organizerIdValue };
      const created = normalizeEvent(ref.id, createdRaw);
      return created;
    } catch (err) {
      console.error('Failed to create event in Firestore, falling back to local create:', err);
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
    }
  };

  // Update existing event (writes to Firestore)
  const updateEvent = async (eventId, updatedData) => {
    try {
      const ref = doc(db, 'events', eventId);
      await updateDoc(ref, { ...updatedData, updatedAt: serverTimestamp() });
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
