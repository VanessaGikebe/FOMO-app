"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { updateUserRole, getCurrentUser } from "@/lib/api";
import { Footer } from "@/components";

export default function OrganizerSetupPage() {
  const { currentUser, getAuthToken } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const checkUserInfo = async () => {
      if (!currentUser?.uid) return;
      
      setLoading(true);
      try {
        const token = await getAuthToken();
        const info = await getCurrentUser(token);
        
        if (info.uid) {
          setUserInfo(info);
          if (info.role === "organizer") {
            setMessage("✅ You are already set up as an organizer!");
            setIsError(false);
          } else {
            setMessage(`Current role: ${info.role || "not set"}. Click below to upgrade to organizer.`);
            setIsError(false);
          }
        } else {
          setMessage("Could not load user info. Please try again.");
          setIsError(true);
        }
      } catch (err) {
        console.error("Error checking user:", err);
        setMessage("Error loading user information");
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    checkUserInfo();
  }, [currentUser]);

  const handleSetupOrganizer = async () => {
    if (!currentUser?.uid) {
      setMessage("Please log in first");
      setIsError(true);
      return;
    }

    setLoading(true);
    setMessage("");
    
    try {
      const token = await getAuthToken();
      const result = await updateUserRole(currentUser.uid, "organizer", token);

      if (result.error) {
        setMessage(`Error: ${result.error}`);
        setIsError(true);
      } else if (result.success) {
        setMessage("✅ Successfully set up as organizer! Refreshing...");
        setIsError(false);
        setUserInfo({ ...userInfo, role: "organizer" });
        
        // Refresh page after 2 seconds
        setTimeout(() => {
          window.location.href = "/eo-dashboard";
        }, 2000);
      } else {
        setMessage("Setup completed! Your role has been updated.");
        setIsError(false);
        setUserInfo({ ...userInfo, role: "organizer" });
      }
    } catch (err) {
      console.error("Setup error:", err);
      setMessage(`Error: ${err.message}`);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Organizer Setup</h1>
              <p className="text-gray-600">Verify your account and enable organizer features</p>
            </div>

            {/* User Info */}
            {currentUser && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                <div className="space-y-2">
                  <p className="text-gray-700"><strong>Email:</strong> {currentUser.email}</p>
                  <p className="text-gray-700"><strong>Name:</strong> {currentUser.name || "Not set"}</p>
                  <p className="text-gray-700"><strong>User ID:</strong> <code className="bg-white px-2 py-1 rounded">{currentUser.uid}</code></p>
                  <p className="text-gray-700"><strong>Current Role:</strong> <span className={`font-semibold ${userInfo?.role === 'organizer' ? 'text-green-600' : 'text-orange-600'}`}>{userInfo?.role || "not set"}</span></p>
                </div>
              </div>
            )}

            {/* Status Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${isError ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                <p className={isError ? 'text-red-700' : 'text-green-700'}>{message}</p>
              </div>
            )}

            {/* Setup Button */}
            {userInfo?.role !== "organizer" && (
              <div className="mb-6">
                <button
                  onClick={handleSetupOrganizer}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Setting up..." : "Enable Organizer Features"}
                </button>
              </div>
            )}

            {/* Next Steps */}
            {userInfo?.role === "organizer" && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">✅ You're ready to go!</h3>
                <p className="text-green-800 mb-4">You can now create, edit, and manage events as an organizer.</p>
                <a href="/eo-dashboard" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Go to Dashboard
                </a>
              </div>
            )}

            {/* Manual Setup Instructions */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Manual Setup (Alternative)</h3>
              <p className="text-blue-800 text-sm mb-4">
                If the button above doesn't work, you can manually update your role in Firestore:
              </p>
              <ol className="text-blue-800 text-sm space-y-2 list-decimal list-inside">
                <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                <li>Select project: <strong>fomo-app-8ebae</strong></li>
                <li>Go to Firestore Database → <strong>users</strong> collection</li>
                <li>Find document with ID: <code className="bg-white px-1 rounded">{currentUser?.uid}</code></li>
                <li>Add/edit field: <strong>role</strong> = <code className="bg-white px-1 rounded">"organizer"</code></li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
