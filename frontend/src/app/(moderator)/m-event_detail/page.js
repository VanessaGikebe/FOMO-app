"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components";

export default function ModeratorEventDetailPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to manage events since this page requires an event ID
    router.push('/m-manageEvent');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Event Details</h1>
          <p className="text-gray-600">Redirecting to manage events...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
