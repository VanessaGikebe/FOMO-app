
"use client";

import React, { useEffect } from "react";
// MOCK useRouter:
const useRouter = () => ({
    push: (path) => console.log(`Navigating to: ${path}`),
    // Add other necessary router methods if needed
});

export default function ModeratorOrganiserEventRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main manage organiser list since this page requires an Organiser ID
    router.push('/m-manageOrganiser');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="py-12 px-6 flex-grow">
        <div className="max-w-6xl mx-auto text-center bg-white p-10 rounded-xl shadow-lg border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Organiser Events</h1>
          <p className="text-gray-600">Organiser ID missing. Redirecting to Manage Organisers...</p>
        </div>
      </div>    </div>
  );
}