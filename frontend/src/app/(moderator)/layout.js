"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function ModeratorLayout({ children }) {
  const { login, currentUser } = useUser();

  useEffect(() => {
    // Auto-login as moderator for development/testing
    if (!currentUser || currentUser.type !== "moderator") {
      login("moderator");
    }
  }, []);

  return (
    <>
      <Navbar userType="moderator" />
      {children}
    </>
  );
}
