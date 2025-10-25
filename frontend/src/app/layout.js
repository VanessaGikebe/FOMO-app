import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EventsProvider } from "@/contexts/EventsContext";
import { UserProvider } from "@/contexts/UserContext";
import DevTools from "@/components/DevTools";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FOMO - Find Your Next Event",
  description: "Discover and attend amazing events",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EventsProvider>
          <UserProvider>
            {children}
            <DevTools />
          </UserProvider>
        </EventsProvider>
      </body>
    </html>
  );
}
