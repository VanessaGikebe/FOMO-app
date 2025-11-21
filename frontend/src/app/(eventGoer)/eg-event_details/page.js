import { Suspense } from "react";
import { EventDetailsPage } from "@/components";

export default function EventGoerEventDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading event details...</div>}>
      <EventDetailsPage />
    </Suspense>
  );
}
