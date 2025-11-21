import { Suspense } from "react";
import { EventDetailsPage } from "@/components";

export default function PublicEventDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <EventDetailsPage />
    </Suspense>
  );
}
