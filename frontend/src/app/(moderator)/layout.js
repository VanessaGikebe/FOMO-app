"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function ModeratorLayout({ children }) {
  const { login, currentUser } = useUser();

  useEffect(() => {
    // Auto-login as moderator for development/testing
    console.log("Moderator Layout: Current user:", currentUser);
    if (!currentUser || currentUser.type !== "moderator") {
      login("moderator");
      console.log("Moderator Layout: Logged in as moderator");
    }
  }, []);

  return (
    <>
      <Navbar userType="moderator" />
      {children}
    </>
  );
}
