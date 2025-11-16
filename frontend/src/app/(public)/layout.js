"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function PublicLayout({ children }) {
  const { logout, currentUser } = useUser();

  useEffect(() => {
    // Always ensure user is logged out for public pages
    console.log("Public Layout: Current user:", currentUser);
    logout();
    console.log("Public Layout: Logged out user");
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <>
      <Navbar userType="public" />
      {children}
    </>
  );
}
