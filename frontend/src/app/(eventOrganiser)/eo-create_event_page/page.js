"use client";

import { useRouter } from "next/navigation";
import { useEvents } from "@/contexts/EventsContext";
import { useUser } from "@/contexts/UserContext";
import EventForm from "@/components/UIComponents/EventForm";
import { Footer } from "@/components";

export default function CreateEventPage() {
  const router = useRouter();
  const { createEvent } = useEvents();
  const { currentUser } = useUser();

  const handleSubmit = (formData) => {
    // Add organizer info to the event
    const eventData = {
      ...formData,
      organizerId: currentUser?.id || "org001",
      organizerName: currentUser?.name || "Tech Events Kenya",
      image: null
    };

    // Create the event
    const newEvent = createEvent(eventData);
    
    // Show success message
    alert(`Event "${newEvent.title}" created successfully!`);
    
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
