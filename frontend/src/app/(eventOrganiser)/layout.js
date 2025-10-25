"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function EventOrganiserLayout({ children }) {
  const { login, currentUser } = useUser();

  useEffect(() => {
    // Auto-login as eventOrganiser for development/testing
    if (!currentUser || currentUser.type !== "eventOrganiser") {
      login("eventOrganiser");
    }
  }, []);

  return (
    <>
      <Navbar userType="eventOrganiser" />
      {children}
    </>
  );
}
