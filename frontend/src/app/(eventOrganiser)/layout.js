"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function EventOrganiserLayout({ children }) {
  const { login, currentUser } = useUser();

  useEffect(() => {
    // Auto-login as eventOrganiser for development/testing
    console.log("EventOrganiser Layout: Current user:", currentUser);
    if (!currentUser || currentUser.type !== "eventOrganiser") {
      login("eventOrganiser");
      console.log("EventOrganiser Layout: Logged in as eventOrganiser");
    }
  }, []);

  return (
    <>
      <Navbar userType="eventOrganiser" />
      {children}
    </>
  );
}
