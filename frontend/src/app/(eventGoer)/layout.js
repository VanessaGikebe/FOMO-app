"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function EventGoerLayout({ children }) {
  const { login, currentUser } = useUser();

  useEffect(() => {
    // Auto-login as eventGoer for development/testing
    if (!currentUser || currentUser.type !== "eventGoer") {
      login("eventGoer");
    }
  }, []);

  return (
    <>
      <Navbar userType="eventGoer" />
      {children}
    </>
  );
}
