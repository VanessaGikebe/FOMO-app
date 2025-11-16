"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNotifications } from "@/contexts/NotifContext";

export default function Navbar({ userType = "public" }) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

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
      showNotifications: true,
      profileLink: "/eg-profile",
      notificationsLink: "/eg-notifications",
    },
    eventOrganiser: {
      logo: "FOMO",
      links: [
        { label: "Dashboard", href: "/eo-dashboard" },
        { label: "Manage Events", href: "/eo-manageEvents" },
      ],
      showProfile: true,
      showNotifications: false,
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
      showNotifications: false,
      profileLink: "/m-profile",
    },
  };

  const config = navigationConfig[userType];

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <nav className="bg-white border-b-2 border-gradient-to-r from-[#FF6B35] via-[#6C5CE7] to-[#00D9C0] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF6B35] to-[#6C5CE7] rounded flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg">📸</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] via-[#6C5CE7] to-[#00D9C0] bg-clip-text text-transparent">{config.logo}</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {config.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all relative ${
                  isActive(link.href)
                    ? "text-[#FF6B35] font-bold"
                    : "text-gray-600 hover:text-[#FF6B35]"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#6C5CE7]"></span>
                )}
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
                        ? "bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                        : "text-gray-600 hover:text-[#FF6B35] text-sm font-medium transition-colors"
                    }
                  >
                    {button.label}
                  </Link>
                ))}
              </>
            )}

            {/* Notifications Bell (for event goers only) */}
            {config.showNotifications && (
              <Link
                href={config.notificationsLink}
                className="relative w-10 h-10 bg-gradient-to-br from-orange-50 to-purple-50 rounded-full flex items-center justify-center hover:from-orange-100 hover:to-purple-100 transition-all hover:scale-110 border border-orange-200"
                title="Notifications"
                aria-label="Notifications"
              >
                <span className="text-xl" aria-hidden>🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg" aria-live="polite">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Profile Icon (for authenticated users) */}
            {config.showProfile && (
              <>
                <Link
                  href={config.profileLink}
                  className="w-10 h-10 bg-gradient-to-br from-purple-50 to-teal-50 rounded-full flex items-center justify-center hover:from-purple-100 hover:to-teal-100 transition-all hover:scale-110 border border-purple-200"
                  title="Profile"
                >
                  <span className="text-xl">👤</span>
                </Link>
                <Link href="/Home" className="bg-gradient-to-r from-[#6C5CE7] to-[#5B4BCF] text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:scale-105 transition-all duration-200">
                    Sign Out
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
