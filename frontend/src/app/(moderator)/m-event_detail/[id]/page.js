"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useEvents } from "@/contexts/EventsContext";
import { EventDetailsPage } from "@/components";
import { getEventDetails } from "@/lib/api";

export default function ModeratorEventDetailsPage() {
  const params = useParams();
  const { getEventById, events } = useEvents();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const eventId = params.id;

  useEffect(() => {
    const loadEvent = async () => {
      setIsLoading(true);
      
      // First try to get from context
      const event = getEventById(eventId);
      if (event) {
        setCurrentEvent(event);
        setIsLoading(false);
        return;
      }

      // If not in context, fetch from API
      try {
        const fetchedEvent = await getEventDetails(eventId);
        if (fetchedEvent) {
          setCurrentEvent(fetchedEvent);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId, events, getEventById]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <EventDetailsPage 
      eventData={currentEvent} 
      userType="moderator"
      eventId={eventId}
    />
  );
}
