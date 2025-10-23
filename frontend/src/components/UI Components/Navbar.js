"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ userType = "public" }) {
  const pathname = usePathname();

  // Define navigation items based on user type
  const navigationConfig = {
    public: {
      logo: "FOMO",
      links: [
        { label: "Home", href: "/Home" },
        { label: "Events", href: "/p-events" },
        { label: "About", href: "/p-about" },
      ],
      authButtons: [
        { label: "Sign In", href: "/signin", variant: "text" },
        { label: "Sign Up", href: "/signup", variant: "primary" },
      ],
    },
    eventGoer: {
      logo: "FOMO",
      links: [
        { label: "Dashboard", href: "/eg-dashboard" },
        { label: "Events", href: "/eg-events" },
        { label: "Favourites", href: "/eg-favourites" },
        { label: "Cart", href: "/eg-cart" },
      ],
      showProfile: true,
      profileLink: "/profile",
    },
    eventOrganiser: {
      logo: "FOMO",
      links: [
        { label: "Dashboard", href: "/eo-dashboard" },
        { label: "Manage Events", href: "/eo-manageEvents" },
      ],
      showProfile: true,
      profileLink: "/eo-profile",
    },
    moderator: {
      logo: "FOMO",
      links: [
        { label: "Dashboard", href: "/m-dashboard" },
        { label: "Manage Events", href: "/m-manageEvent" },
        { label: "Manage Organisers", href: "/m-manageOrganiser" },
      ],
      showProfile: true,
      profileLink: "/m-profile",
    },
  };

  const config = navigationConfig[userType];

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-lg">📸</span>
            </div>
            <span className="text-xl font-bold text-gray-900">{config.logo}</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {config.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Auth Buttons (for public) */}
            {config.authButtons && (
              <>
                {config.authButtons.map((button) => (
                  <Link
                    key={button.href}
                    href={button.href}
                    className={
                      button.variant === "primary"
                        ? "bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                        : "text-gray-600 hover:text-gray-900 text-sm font-medium"
                    }
                  >
                    {button.label}
                  </Link>
                ))}
              </>
            )}

            {/* Profile Icon (for authenticated users) */}
            {config.showProfile && (
              <>
                <Link
                  href={config.profileLink}
                  className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                  title="Profile"
                >
                  <span className="text-xl">👤</span>
                </Link>
                <button className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
