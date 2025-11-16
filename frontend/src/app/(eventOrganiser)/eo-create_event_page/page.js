"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { createOrganizerEvent } from "@/lib/api";
import EventForm from "@/components/UI Components/EventForm";

export default function CreateEventPage() {
  const router = useRouter();
  const { currentUser, getAuthToken } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setError(null);
    setIsSubmitting(true);

    try {
      const authToken = await getAuthToken();
      
      const eventData = {
        ...formData,
        organizerId: currentUser?.uid || null,
        organizerName: currentUser?.name || '',
        image: null
      };

      // Create event via API
      const response = await createOrganizerEvent(eventData, authToken);
      
      if (response && response.id) {
        alert(`Event "${response.title || eventData.title}" created successfully!`);
        router.push("/eo-dashboard");
      } else {
        setError(response?.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Failed to create event:', err);
      setError(err.message || 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/eo-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Event</h1>
            <p className="text-gray-600 mb-8">Fill in the details to create your event</p>
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
            
            <EventForm 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={false}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </div>    </div>
  );
}
