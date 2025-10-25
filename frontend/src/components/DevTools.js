"use client";

import { useEvents } from "@/contexts/EventsContext";
import { useUser } from "@/contexts/UserContext";
import { useState } from "react";

export default function DevTools() {
  const { resetEvents } = useEvents();
  const { logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleResetAll = () => {
    if (confirm("Are you sure you want to reset all data? This will clear all events and log you out.")) {
      resetEvents();
      logout();
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      alert("All data has been reset! Refresh the page.");
      window.location.reload();
    }
  };

  const handleClearLocalStorage = () => {
    if (confirm("Clear all localStorage data?")) {
      localStorage.clear();
      alert("localStorage cleared! Refresh the page.");
      window.location.reload();
    }
  };

  const handleViewLocalStorage = () => {
    const events = localStorage.getItem('fomo_events');
    const user = localStorage.getItem('fomo_current_user');
    console.log("📦 localStorage Data:");
    console.log("Events:", events ? JSON.parse(events) : "None");
    console.log("Current User:", user ? JSON.parse(user) : "None");
    alert("Check the browser console (F12) to see localStorage data!");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors text-sm font-medium"
      >
        🛠️ Dev Tools
      </button>

      {/* Dev Tools Panel */}
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-72">
          <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b">Developer Tools</h3>
          
          <div className="space-y-2">
            <button
              onClick={handleViewLocalStorage}
              className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded text-sm text-blue-900 transition-colors"
            >
              📊 View localStorage Data
            </button>
            
            <button
              onClick={handleResetAll}
              className="w-full text-left px-3 py-2 bg-orange-50 hover:bg-orange-100 rounded text-sm text-orange-900 transition-colors"
            >
              🔄 Reset to Initial Data
            </button>
            
            <button
              onClick={handleClearLocalStorage}
              className="w-full text-left px-3 py-2 bg-red-50 hover:bg-red-100 rounded text-sm text-red-900 transition-colors"
            >
              🗑️ Clear All Data
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-3 pt-2 border-t">
            These tools help you manage localStorage data during development.
          </p>
        </div>
      )}
    </div>
  );
}
