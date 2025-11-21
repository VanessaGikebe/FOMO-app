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
      if (!currentUser?.uid) {
        setError("You must be logged in to create an event");
        setIsSubmitting(false);
        return;
      }

      // Get auth token - this is required for the backend to verify your identity
      let authToken = null;
      try {
        authToken = await getAuthToken();
        if (!authToken) {
          setError("Could not get authentication token. Please try logging out and back in.");
          setIsSubmitting(false);
          return;
        }
        console.log('✅ Auth token obtained');
      } catch (tokenErr) {
        console.error('Failed to get auth token:', tokenErr);
        setError("Authentication failed. Please refresh the page and try again.");
        setIsSubmitting(false);
        return;
      }
      
      const eventData = {
        ...formData,
        organizerId: currentUser.uid,
        organizerName: currentUser.name || '',
        image: null
      };

      console.log('Creating event with auth token...');
      
      // Create event via API
      const response = await createOrganizerEvent(eventData, authToken);
      
      if (response && response.id) {
        alert(`Event "${response.title || eventData.title}" created successfully!`);
        // Redirect to the edit page for the newly created event so the organiser
        // can immediately confirm details or update the image if needed.
        router.push(`/eo-edit_event_page/${response.id}`);
      } else {
        setError(response?.error || 'Failed to create event');
      }
    } catch (err) {
      console.error('Failed to create event:', err);

      // Detect common permission error and show a friendlier, actionable message
      const msg = (err && err.message) ? err.message.toString().toLowerCase() : '';
      if (msg.includes('insufficient permissions') || msg.includes('forbidden') || msg.includes('403')) {
        setError(
          'You do not have permission to create events. Make sure your account has the "organizer" role in the users collection (Firestore) or ask an admin to grant you organizer privileges.'
        );
      } else {
        setError(err.message || 'Failed to create event. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/eo-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50">
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Event</h1>
              <p className="text-gray-600">Fill in the details to create your event</p>
            </div>
            
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
