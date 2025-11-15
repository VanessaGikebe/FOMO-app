"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function EventGoerLayout({ children }) {
  const { currentUser } = useUser();

  // No automatic dev login here. Use real auth flows for testing.

  return (
    <>
      <Navbar userType="eventGoer" />
      {children}
    </>
  );
}
