"use client";

import { useRouter } from "next/navigation";
import { useEvents } from "@/contexts/EventsContext";
import { useUser } from "@/contexts/UserContext";
import EventForm from "@/components/UI Components/EventForm";
import { Footer } from "@/components";

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent } = useEvents();
  const { currentUser } = useUser();

  const handleSubmit = async (formData) => {
    // Add organizer info to the event
    const eventData = {
      ...formData,
      
      organizerId: currentUser?.uid || null,
      organizerName: currentUser?.name || '',
      image: null
    };

    try {
      // Create the event (writes to Firestore)
      const newEvent = await createEvent(eventData);

      // Show success message
      alert(`Event "${newEvent.title || eventData.title}" created successfully!`);

      // Redirect to manage events page
      router.push("/eo-manageEvents");
    } catch (err) {
      console.error('Failed to create event', err);
      alert('Failed to create event. Please try again.');
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
            
            <EventForm 
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={false}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
