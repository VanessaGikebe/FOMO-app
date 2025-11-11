"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function EventGoerLayout({ children }) {
  const { login, currentUser } = useUser();

  useEffect(() => {
    // Auto-login as eventGoer for development/testing
    console.log("EventGoer Layout: Current user:", currentUser);
    if (!currentUser || currentUser.type !== "eventGoer") {
      login("eventGoer");
      console.log("EventGoer Layout: Logged in as eventGoer");
    }
  }, []);

  return (
    <>
      <Navbar userType="eventGoer" />
      {children}
    </>
  );
}
