"use client";

import { useRouter, useParams } from "next/navigation";
import { useEvents } from "@/contexts/EventsContext";
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from "react";
import { getEventDetails, getEventsByOrganizer } from '@/lib/api';
import EventForm from "@/components/UI Components/EventForm";
import { Footer } from "@/components";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  
  const { getEventById, updateEvent } = useEvents();
  const event = getEventById(eventId);
  const { getAuthToken } = useUser();
  const [remoteEvent, setRemoteEvent] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(false);

  // If event isn't in the client context (e.g. newly created/unapproved),
  // try to fetch it directly from the backend so organisers can edit drafts.
  useEffect(() => {
    let mounted = true;
    const fetchRemote = async () => {
      if (event) return; // already have it
      if (!eventId) return;
      setLoadingRemote(true);
      try {
        // Try fetching single event first
        const ev = await getEventDetails(eventId).catch(() => null);
        if (ev && mounted) {
          setRemoteEvent(ev);
          setLoadingRemote(false);
          return;
        }

        // As a fallback, try fetching organiser events and find the id
        const organiserEvents = await getEventsByOrganizer(ev?.organizerId || "").catch(() => null);
        if (Array.isArray(organiserEvents)) {
          const found = organiserEvents.find(e => e.id === eventId);
          if (found && mounted) setRemoteEvent(found);
        }
      } catch (err) {
        console.warn('Failed to fetch remote event:', err);
      } finally {
        if (mounted) setLoadingRemote(false);
      }
    };

    fetchRemote();
    return () => { mounted = false; };
  }, [event, eventId]);

  const resolvedEvent = event || remoteEvent;

  if (!resolvedEvent && loadingRemote) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading event...</h1>
          <p className="text-gray-600">Fetching event data from the server...</p>
        </div>
      </div>
    );
  }

  if (!resolvedEvent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-4">This event may be a draft or was not found. If you just created it, try refreshing or visiting Manage Events.</p>
          <button 
            onClick={() => router.push("/eo-manageEvents")}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData) => {
    // Get auth token for organizer update
    let authToken = null;
    try {
      authToken = await getAuthToken();
    } catch (err) {
      console.error('Failed to get auth token for update:', err);
      alert('Authentication failed. Please refresh the page and try again.');
      return;
    }

    // Update the event (pass auth token so backend RolesGuard validates organizer)
    await updateEvent(eventId, formData, authToken);

    // Show success message
    alert(`Event "${formData.title}" updated successfully!`);

    // Redirect to manage events page
    router.push("/eo-manageEvents");
  };

  const handleCancel = () => {
    router.push("/eo-manageEvents");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Event</h1>
            <p className="text-gray-600 mb-8">Update your event details</p>
            
            <EventForm 
              initialData={resolvedEvent}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={true}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
