"use client";

import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { useUser } from "../../contexts/UserContext";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Footer() {
  // 1. Get the user type directly from the context
  const { getUserType } = useUser();
  const userType = getUserType();

  // 2. Your 'getQuickLinks' function now uses the REAL user type
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
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <img src="/FOMO LOGO.png" alt="FOMO Logo" className="w-10 h-10 object-contain"/>
              </div>
              <h1 className="bg-gradient-to-r from-[#FF6B35] via-[#FF6B35] to-[#FF6B35] bg-clip-text text-transparent text-xl font-bold">
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
            <h3 className="font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF6B35] bg-clip-text text-transparent mb-4">
              Quick Links
            </h3>
            {/* 3. THIS IS THE BONUS FIX from before. */}
            {/* This renders your *dynamic* links instead of a hard-coded list. */}
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF6B35] bg-clip-text text-transparent mb-4">
              Social Media
            </h3>
            <ul className="space-y-2">
              {/* ... your social links ... */}
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
            <h3 className="font-bold bg-gradient-to-r from-[#FF6B35] to-[#FF6B35] bg-clip-text text-transparent mb-4">
              Legal Policies
            </h3>
            <ul className="space-y-2">
              {/* ... your legal links ... */}
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