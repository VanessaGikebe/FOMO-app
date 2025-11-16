"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function EventGoerLayout({ children }) {
  const { currentUser } = useUser();

  // Use real auth flows for production

  return (
    <>
      <Navbar userType="eventGoer" />
      {children}
    </>
  );
}
