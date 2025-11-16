"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Footer() {
  const { currentUser } = useUser();
  const pathname = usePathname();
  const [userType, setUserType] = useState("public");

  useEffect(() => {
    // Determine user type based on the current pathname
    console.log("Footer: Current pathname:", pathname);

    if (pathname.startsWith("/eg-")) {
      setUserType("eventGoer");
      console.log("Footer: Set userType to eventGoer based on path");
    } else if (pathname.startsWith("/eo-")) {
      setUserType("eventOrganiser");
      console.log("Footer: Set userType to eventOrganiser based on path");
    } else if (pathname.startsWith("/m-")) {
      setUserType("moderator");
      console.log("Footer: Set userType to moderator based on path");
    } else {
      setUserType("public");
      console.log("Footer: Set userType to public based on path");
    }
  }, [pathname]); // Update when pathname changes

  // Quick Links based on user type
  const getQuickLinks = () => {
    console.log("Footer: Getting quick links for userType:", userType);
    switch (userType) {
      case "eventGoer":
        return [
          { label: "Dashboard", href: "/eg-dashboard" },
          { label: "Events", href: "/eg-events" },
          { label: "My Events", href: "/eg-myEvents" },
          { label: "Notifications", href: "/eg-notifications" },
          { label: "Profile", href: "/eg-profile" },
        ];

      case "eventOrganiser":
        return [
          { label: "Dashboard", href: "/eo-dashboard" },
          { label: "Manage Events", href: "/eo-manageEvents" },
          { label: "Profile", href: "/eo-profile" },
        ];

      case "moderator":
        return [
          { label: "Dashboard", href: "/m-dashboard" },
          { label: "Manage Events", href: "/m-manageEvent" },
          { label: "Manage Organisers", href: "/m-manageOrganiser" },
          { label: "Profile", href: "/m-profile" },
        ];

      default: // public
        return [
          { label: "Home", href: "/" },
          { label: "Events", href: "/p-events" },
          { label: "About", href: "/p-about" },
          { label: "Sign Up", href: "/signup" },
          { label: "Log In", href: "/login" },
        ];
    }
  };

  const quickLinks = getQuickLinks();

  console.log(
    "Footer: Rendering with userType:",
    userType,
    "links:",
    quickLinks
  );

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </div>
              <h1 className="bg-gradient-to-r from-[#00D9C0] via-[#6C5CE7] to-[#FF6B35] bg-clip-text text-transparent text-xl font-bold">
                FOMO
              </h1>
            </div>
            <p className="text-sm text-gray-800 mb-2 font-medium">
              Email: info@fomo.com
            </p>
            <p className="text-sm text-gray-800 font-medium">
              Phone No: 0712345678
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold bg-gradient-to-r from-[#00D9C0] to-[#6C5CE7] bg-clip-text text-transparent mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold bg-gradient-to-r from-[#6C5CE7] to-[#FF6B35] bg-clip-text text-transparent mb-4">
              Social Media
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  X
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  YouTube
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h3 className="font-bold bg-gradient-to-r from-[#FF6B35] to-[#00D9C0] bg-clip-text text-transparent mb-4">
              Legal Policies
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm text-gray-600 pt-8 border-t border-gray-200">
          ©2025 FOMO. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
