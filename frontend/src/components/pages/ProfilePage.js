"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import Footer from "../UI Components/Footer";
import Button from "../UI Components/Button";

// Default user data fallback - only essential fields from Firebase
const defaultUser = {
  name: "Guest User",
  email: "guest@example.com",
  phone: "",
  bio: "",
  avatar: null,
  joinedDate: "January 2024",
  location: "",
  interests: []
};

export default function ProfilePage() {
  const { currentUser } = useUser();
  const [userData, setUserData] = useState(defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [newInterest, setNewInterest] = useState("");

  // Update user data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const updatedUserData = {
        ...defaultUser,
        name: currentUser.name || currentUser.email || "Guest User",
        email: currentUser.email || "guest@example.com",
        joinedDate: currentUser.raw?.createdAt 
          ? new Date(currentUser.raw.createdAt.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
          : "January 2024",
      };
      setUserData(updatedUserData);
      setFormData(updatedUserData);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving profile:", formData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData(userData);
    setNewInterest("");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-6xl">
              {formData.avatar ? (
                <img src={formData.avatar} alt={formData.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>👤</span>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{formData.name}</h1>
              <p className="text-gray-300 mb-4">{formData.email}</p>
              <p className="text-gray-400 text-sm">Member since {formData.joinedDate}</p>
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-gray-700 hover:text-black"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Profile Stats - Placeholder for real data from Firestore */}
      <section className="py-8 px-6 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-4xl font-bold text-gray-900">0</p>
              <p className="text-gray-600 mt-2">Events Attended</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-4xl font-bold text-gray-900">0</p>
              <p className="text-gray-600 mt-2">Upcoming Events</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <p className="text-4xl font-bold text-gray-900">0</p>
              <p className="text-gray-600 mt-2">Favorite Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Details */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>

            <div className="space-y-6">
              {/* Two-column grid for Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.email}</p>
                  )}
                </div>
              </div>

              {/* Two-column grid for Phone and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.phone}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.location}</p>
                  )}
                </div>
              </div>

              {/* Bio - full width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{formData.bio}</p>
                )}
              </div>

              {/* Interests - full width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests
                </label>
                
                {isEditing ? (
                  <div className="space-y-3">
                    {/* Add new interest input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a new interest..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddInterest}
                        className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Display interests with remove option */}
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest, index) => (
                        <span 
                          key={index} 
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm flex items-center gap-2"
                        >
                          {interest}
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(index)}
                            className="text-red-500 hover:text-red-700 font-bold"
                            aria-label="Remove interest"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {formData.interests.map((interest, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-4">
                  <Button variant="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
