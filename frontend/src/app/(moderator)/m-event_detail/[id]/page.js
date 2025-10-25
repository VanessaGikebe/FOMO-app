"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useEvents } from "@/contexts/EventsContext";
import { EventDetailsPage } from "@/components";

export default function ModeratorEventDetailsPage() {
  const params = useParams();
  const { getEventById, events } = useEvents();
  const [currentEvent, setCurrentEvent] = useState(null);
  
  const eventId = params.id;

  // Update event whenever events change
  useEffect(() => {
    const event = getEventById(eventId);
    setCurrentEvent(event);
  }, [events, eventId, getEventById]);

  return (
    <EventDetailsPage 
      eventData={currentEvent} 
      userType="moderator"
      eventId={eventId}
    />
  );
}
