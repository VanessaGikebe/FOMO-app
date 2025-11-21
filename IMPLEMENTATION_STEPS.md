
# Organizer Pages - Implementation Steps

## 🎯 Phase 1: Add API Functions to Frontend

### Step 1.1: Update `src/lib/api.js`

Add these organizer event management functions:

```javascript
/**
 * Create a new event
 * @param {Object} eventData - Event details
 * @param {string} authToken - Firebase auth token (optional)
 * @returns {Promise<Object>} - Created event with ID
 */
export async function createOrganizerEvent(eventData, authToken = null) {
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(eventData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create event: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get event by ID
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Event details
 */
export async function getEventDetails(eventId) {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch event: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update an existing event
 * @param {string} eventId - Event ID
 * @param {Object} updateData - Updated event details
 * @param {string} authToken - Firebase auth token (optional)
 * @returns {Promise<Object>} - Updated event
 */
export async function updateOrganizerEvent(eventId, updateData, authToken = null) {
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(updateData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update event: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Delete an event
 * @param {string} eventId - Event ID
 * @param {string} authToken - Firebase auth token (optional)
 * @returns {Promise<Object>} - Deletion confirmation
 */
export async function deleteOrganizerEvent(eventId, authToken = null) {
  const headers = {
    "Content-Type": "application/json"
  };
  
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "DELETE",
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to delete event: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get event metrics
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Event metrics (visits, sales, etc.)
 */
export async function getEventMetrics(eventId) {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/metrics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    console.warn(`Failed to fetch metrics for event ${eventId}`);
    return null;
  }

  return response.json();
}

/**
 * Search events with filters
 * @param {Object} filters - Search filters
 * @returns {Promise<Array>} - Filtered events
 */
export async function searchEvents(filters) {
  const queryParams = new URLSearchParams(filters);
  const response = await fetch(
    `${API_BASE_URL}/events/search/filter?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to search events: ${response.statusText}`);
  }

  return response.json();
}
```

---

## 🎯 Phase 2: Update Dashboard Page

### Step 2.1: Update `src/app/(eventOrganiser)/eo-dashboard/page.js`

Replace the hardcoded metrics with real data fetching:

```javascript
"use client";

import { Footer } from "@/components";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEvents } from '@/contexts/EventsContext';
import { useUser } from '@/contexts/UserContext';
import EventCardComponent from '@/components/UI Components/EventCard';
import { getEventMetrics } from '@/lib/api';

// --- Utility Components ---

const MetricCard = ({ title, value, iconPath, isLoading = false }) => (
  <div className="w-full sm:w-1/3 p-2">
    <div className="bg-gray-100 rounded-lg shadow-sm p-4 flex items-center space-x-4">
      <div className="flex-shrink-0 bg-gray-300 rounded-full p-2">
        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {!isLoading && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />}
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">
          {isLoading ? "..." : value}
        </p>
      </div>
    </div>
  </div>
);

const QuickActionButton = ({ title, iconPath, onClick }) => (
  <button onClick={onClick} className="w-full sm:w-1/4 p-2 flex-shrink-0">
    <div className="bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm p-4 flex flex-col items-center justify-center transition duration-150 ease-in-out h-32">
      <div className="bg-gray-300 rounded-full p-2 mb-2">
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} />
        </svg>
      </div>
      <span className="text-sm font-medium text-gray-900">{title}</span>
    </div>
  </button>
);

// --- Main Dashboard Component ---

export default function EventOrganiserDashboard() {
  const { getEventsByOrganizer, events } = useEvents();
  const { getUserId } = useUser();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [metrics, setMetrics] = useState({
    totalVisits: 0,
    ticketsSold: 0,
    conversionRate: 0,
    isLoading: true
  });
  const router = useRouter();

  // Fetch organizer's events on mount
  useEffect(() => {
    const uid = getUserId();
    if (!uid) return;
    const list = getEventsByOrganizer(uid) || [];
    setUpcomingEvents(list);

    // Fetch metrics for first event if available
    if (list.length > 0) {
      fetchMetrics(list);
    } else {
      setMetrics(prev => ({ ...prev, isLoading: false }));
    }
  }, [events, getUserId]);

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
    <div className="min-h-screen bg-gray-50">
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* 1. Digital Event Metrics Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Digital Event Metrics</h2>
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
          
          {/* 2. My Upcoming Events Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">My Upcoming Events</h2>
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
                <p className="text-gray-500 p-4">No upcoming events yet. Create your first event!</p>
              )}
            </div>
          </section>
          
          {/* 3. Quick Actions Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Quick Actions</h2>
            <p className="text-gray-600 mb-6">Streamline your workflow with easy one-step actions</p>
            
            <div className="flex flex-wrap -m-2">
              <QuickActionButton 
                title="View Events" 
                iconPath="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                onClick={() => router.push('/eo-manageEvents')}
              />
              <QuickActionButton 
                title="Create Event" 
                iconPath="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                onClick={() => router.push('/eo-create_event_page')}
              />
              <QuickActionButton 
                title="Edit Event" 
                iconPath="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-9-9h5m-5 0a2 2 0 00-2 2v5m2-5h5m-5 0L19 7"
                onClick={() => router.push('/eo-manageEvents')}
              />
              <QuickActionButton 
                title="Delete Event" 
                iconPath="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                onClick={() => router.push('/eo-manageEvents')}
              />
            </div>
          </section>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
```

---

## 🎯 Phase 3: Update Create Event Page

### Step 3.1: Update `src/app/(eventOrganiser)/eo-create_event_page/page.js`

```javascript
"use client";

import { useRouter } from "next/navigation";
import { useEvents } from "@/contexts/EventsContext";
import { useUser } from "@/contexts/UserContext";
import EventForm from "@/components/UI Components/EventForm";
import { Footer } from "@/components";
import { useState } from "react";
import { createOrganizerEvent } from "@/lib/api";

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent } = useEvents();
  const { currentUser, getAuthToken } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare event data
      const eventData = {
        ...formData,
        organizerId: currentUser?.uid || null,
        organizerName: currentUser?.displayName || currentUser?.email || 'Unknown',
        createdAt: new Date().toISOString(),
        isFlagged: false,
        approved: false,
        attendeeCount: 0
      };

      // Get auth token if available
      const token = getAuthToken?.();

      // Try to create via backend API first
      try {
        const result = await createOrganizerEvent(eventData, token);
        console.log('Event created via API:', result);
        
        // Also update local Firestore to keep in sync
        await createEvent(eventData);
        
        alert(`Event "${result.title || eventData.title}" created successfully!`);
        router.push("/eo-manageEvents");
      } catch (apiErr) {
        console.warn('API creation failed, falling back to Firestore:', apiErr);
        
        // Fallback: Create directly in Firestore
        const newEvent = await createEvent(eventData);
        alert(`Event "${newEvent.title || eventData.title}" created successfully!`);
        router.push("/eo-manageEvents");
      }
    } catch (err) {
      console.error('Failed to create event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/eo-manageEvents");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Event</h1>
            <p className="text-gray-600 mb-8">Fill in the details to create your event</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            <EventForm 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={false}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
```

---

## 🎯 Phase 4: Implement Edit Event Page

### Step 4.1: Create `src/app/(eventOrganiser)/eo-edit_event_page/page.js`

```javascript
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEvents } from "@/contexts/EventsContext";
import { useUser } from "@/contexts/UserContext";
import EventForm from "@/components/UI Components/EventForm";
import { Footer } from "@/components";
import { getEventDetails, updateOrganizerEvent } from "@/lib/api";

export default function EditEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  
  const { getEventById, updateEvent } = useEvents();
  const { currentUser, getAuthToken } = useUser();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load event details on mount
  useEffect(() => {
    if (!eventId) {
      setError("No event ID provided");
      setIsLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setIsLoading(true);
        
        // Try to get from API first
        try {
          const eventData = await getEventDetails(eventId);
          setEvent(eventData);
        } catch (apiErr) {
          console.warn('API fetch failed, using local context:', apiErr);
          
          // Fallback to local context
          const localEvent = getEventById(eventId);
          if (!localEvent) {
            throw new Error('Event not found');
          }
          setEvent(localEvent);
        }
      } catch (err) {
        console.error('Failed to load event:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId, getEventById]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const updateData = {
        ...formData,
        updatedAt: new Date().toISOString()
      };

      const token = getAuthToken?.();

      // Try API first
      try {
        const result = await updateOrganizerEvent(eventId, updateData, token);
        console.log('Event updated via API:', result);
        
        // Also update local context
        await updateEvent(eventId, updateData);
        
        alert("Event updated successfully!");
        router.push("/eo-manageEvents");
      } catch (apiErr) {
        console.warn('API update failed, falling back to Firestore:', apiErr);
        
        // Fallback to local update
        await updateEvent(eventId, updateData);
        alert("Event updated successfully!");
        router.push("/eo-manageEvents");
      }
    } catch (err) {
      console.error('Failed to update event:', err);
      setError(err.message || 'Failed to update event. Please try again.');
      alert(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/eo-manageEvents");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Error</h1>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => router.push("/eo-manageEvents")}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Event</h1>
            <p className="text-gray-600 mb-8">Update your event details</p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {event && (
              <EventForm 
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isEditing={true}
                initialData={event}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
```

---

## 🎯 Phase 5: Backend Metrics Endpoint

### Step 5.1: Add to `backend/src/events/events.service.ts`

```typescript
// Add this method to EventsService class
async getEventMetrics(eventId: string) {
  const eventRef = this.db.collection('events').doc(eventId);
  const eventSnap = await eventRef.get();
  
  if (!eventSnap.exists) {
    throw new NotFoundException('Event not found');
  }

  const eventData = eventSnap.data();
  
  // Query orders for this event to get ticket sales
  const ordersSnapshot = await this.db.collection('orders')
    .where('items', 'array-contains', { eventId })
    .get();

  let totalTicketsSold = 0;
  let totalRevenue = 0;

  ordersSnapshot.forEach(doc => {
    const order = doc.data();
    order.items?.forEach(item => {
      if (item.eventId === eventId) {
        totalTicketsSold += item.quantity || 0;
        totalRevenue += (item.quantity * item.pricePerTicket) || 0;
      }
    });
  });

  return {
    visits: eventData.views || 0,
    ticketsSold: totalTicketsSold,
    revenue: totalRevenue,
    attendees: eventData.attendeeCount || 0,
    conversionRate: (eventData.views || 0) > 0 
      ? Math.round((totalTicketsSold / (eventData.views || 1)) * 100)
      : 0
  };
}
```

### Step 5.2: Add to `backend/src/events/events.controller.ts`

```typescript
@Get(':id/metrics')
async getEventMetrics(@Param('id') id: string) {
  return this.eventsService.getEventMetrics(id);
}
```

---

## ✅ Testing Checklist

- [ ] Backend is running: `npm run start:dev` (port 3002)
- [ ] Frontend is running: `npm run dev` (port 3000)
- [ ] Create new event successfully
- [ ] Event appears on dashboard
- [ ] Edit event successfully
- [ ] Delete event with confirmation
- [ ] Metrics display correctly
- [ ] Error handling works
- [ ] Loading states display

---

## 📝 Testing Commands (Backend)

```powershell
# Create event
$body = @{
    title = "Tech Summit 2025"
    description = "Join us for the biggest tech conference"
    date = "2025-12-01"
    time = "09:00 AM"
    location = "Nairobi Convention Centre"
    category = "Technology"
    capacity = 500
    price = 5000
    organizerId = "org123"
    organizerName = "Tech Events Inc"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3002/events" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"

# Get events
Invoke-RestMethod -Uri "http://localhost:3002/events" -Method GET

# Update event (replace {id})
Invoke-RestMethod -Uri "http://localhost:3002/events/{id}" `
  -Method PATCH `
  -Body '{"title": "Updated Title"}' `
  -ContentType "application/json"

# Delete event
Invoke-RestMethod -Uri "http://localhost:3002/events/{id}" -Method DELETE

# Get metrics
Invoke-RestMethod -Uri "http://localhost:3002/events/{id}/metrics" -Method GET
```

