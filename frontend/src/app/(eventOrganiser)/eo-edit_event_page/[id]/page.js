"use client";

import { useRouter, useParams } from "next/navigation";
import { useEvents } from "@/contexts/EventsContext";
import EventForm from "@/components/UI Components/EventForm";
import { Footer } from "@/components";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;
  
  const { getEventById, updateEvent } = useEvents();
  const event = getEventById(eventId);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
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

  const handleSubmit = (formData) => {
    // Update the event
    updateEvent(eventId, formData);
    
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
              initialData={event}
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
