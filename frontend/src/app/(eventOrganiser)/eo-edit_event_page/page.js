"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { getEventDetails, updateOrganizerEvent, deleteOrganizerEvent } from "@/lib/api";
import EventForm from "@/components/UI Components/EventForm";

export default function EventOrganiserEditEventPage() {
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
