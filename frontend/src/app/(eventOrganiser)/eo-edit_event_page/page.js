"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { getEventDetails, updateOrganizerEvent, deleteOrganizerEvent } from "@/lib/api";
import EventForm from "@/components/UI Components/EventForm";
import { Footer } from "@/components";

export default function EditEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, getAuthToken } = useUser();
  
  const eventId = searchParams.get("id");
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load event details on mount
  useEffect(() => {
    if (!eventId) {
      setError("Event ID not provided");
      setIsLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        const response = await getEventDetails(eventId);
        
        if (response && response.id) {
          // Verify organizer owns this event
          if (response.organizerId !== currentUser?.uid) {
            setError("You don't have permission to edit this event");
          } else {
            setEventData(response);
          }
        } else {
          setError(response?.error || "Event not found");
        }
      } catch (err) {
        console.error("Failed to load event:", err);
        setError("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId, currentUser]);

  const handleSubmit = async (formData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const authToken = await getAuthToken();
      
      const response = await updateOrganizerEvent(eventId, formData, authToken);
      
      if (response && response.id) {
        alert(`Event "${response.title || formData.title}" updated successfully!`);
        router.push("/eo-dashboard");
      } else {
        setError(response?.error || "Failed to update event");
      }
    } catch (err) {
      console.error("Failed to update event:", err);
      setError(err.message || "Failed to update event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    setIsSubmitting(true);
    try {
      const authToken = await getAuthToken();
      
      const response = await deleteOrganizerEvent(eventId, authToken);
      
      if (response && response.success) {
        alert("Event deleted successfully");
        router.push("/eo-dashboard");
      } else {
        setError(response?.error || "Failed to delete event");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Failed to delete event:", err);
      setError(err.message || "Failed to delete event. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/eo-dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <p className="text-gray-600">Loading event details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !eventData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
              <button
                onClick={() => router.push("/eo-dashboard")}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Back to Dashboard
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
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Event</h1>
                <p className="text-gray-600">Update your event details</p>
              </div>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Delete Event
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Event Form */}
            {eventData && (
              <EventForm
                initialData={eventData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isEditing={true}
                isLoading={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
