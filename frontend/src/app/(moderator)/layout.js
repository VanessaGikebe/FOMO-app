"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { useUser } from "@/contexts/UserContext";

export default function ModeratorLayout({ children }) {
  const { currentUser } = useUser();

  return (
    <>
      <Navbar userType="moderator" />
      {children}
    </>
  );
}
