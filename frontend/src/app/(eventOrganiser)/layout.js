"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function EventOrganiserLayout({ children }) {
  const { currentUser } = useUser();

  // Rely on explicit authentication flows

  return (
    <>
      <Navbar userType="eventOrganiser" />
      {children}
    </>
  );
}
