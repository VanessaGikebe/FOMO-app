"use client";

import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const { currentUser } = useUser();
  const pathname = usePathname();
  const [userType, setUserType] = useState("public");

  useEffect(() => {
    // Determine user type based on the current pathname
    console.log("Footer: Current pathname:", pathname);
    
    if (pathname.startsWith('/eg-')) {
      setUserType("eventGoer");
      console.log("Footer: Set userType to eventGoer based on path");
    } else if (pathname.startsWith('/eo-')) {
      setUserType("eventOrganiser");
      console.log("Footer: Set userType to eventOrganiser based on path");
    } else if (pathname.startsWith('/m-')) {
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
          { label: "Profile", href: "/eg-profile" }
        ];
      
      case "eventOrganiser":
        return [
          { label: "Dashboard", href: "/eo-dashboard" },
          { label: "Manage Events", href: "/eo-manageEvents" },
          { label: "Profile", href: "/eo-profile" }
        ];
      
      case "moderator":
        return [
          { label: "Dashboard", href: "/m-dashboard" },
          { label: "Manage Events", href: "/m-manageEvent" },
          { label: "Manage Organisers", href: "/m-manageOrganiser" },
          { label: "Profile", href: "/m-profile" }
        ];
      
      default: // public
        return [
          { label: "Home", href: "/" },
          { label: "Events", href: "/p-events" },
          { label: "About", href: "/p-about" },
          { label: "Sign Up", href: "/signup" },
          { label: "Log In", href: "/login" }
        ];
    }
  };

  const quickLinks = getQuickLinks();

  console.log("Footer: Rendering with userType:", userType, "links:", quickLinks);

  return (
    <footer className="bg-gradient-to-br from-teal-50 via-purple-50 to-orange-50 border-t border-gray-200 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00D9C0] to-[#6C5CE7] rounded-lg flex items-center justify-center">
                <span className="text-xl">📸</span>
              </div>
              <h1 className="bg-gradient-to-r from-[#00D9C0] via-[#6C5CE7] to-[#FF6B35] bg-clip-text text-transparent text-xl font-bold">FOMO</h1>
            </div>
            <p className="text-sm text-gray-800 mb-2 font-medium">Email: info@fomo.com</p>
            <p className="text-sm text-gray-800 font-medium">Phone No: 0712345678</p>
          </div>

          {/* Quick Links - Dynamic based on user type */}
          <div>
            <h3 className="font-bold bg-gradient-to-r from-[#00D9C0] to-[#6C5CE7] bg-clip-text text-transparent mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href} 
                    className="text-gray-700 hover:text-[#00D9C0] transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold bg-gradient-to-r from-[#6C5CE7] to-[#FF6B35] bg-clip-text text-transparent mb-4">Social Media</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-700 hover:text-[#6C5CE7] transition-colors font-medium">Facebook</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-[#6C5CE7] transition-colors font-medium">Instagram</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-[#6C5CE7] transition-colors font-medium">X</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-[#6C5CE7] transition-colors font-medium">LinkedIn</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-[#6C5CE7] transition-colors font-medium">YouTube</Link></li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h3 className="font-bold bg-gradient-to-r from-[#FF6B35] to-[#00D9C0] bg-clip-text text-transparent mb-4">Legal Policies</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-700 hover:text-[#FF6B35] transition-colors font-medium">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-[#FF6B35] transition-colors font-medium">Privacy Policy</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-[#FF6B35] transition-colors font-medium">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="text-center text-sm text-gray-800 pt-8 border-t border-gray-200 font-medium">
          ©2025 FOMO. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

