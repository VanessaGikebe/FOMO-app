"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import Button from "../UI Components/Button"; // <-- No spaces in folder name
import { UserIcon } from "@heroicons/react/24/solid"; // <-- Heroicons person icon

// Default user data fallback
const defaultUser = {
  name: "Guest User",
  email: "guest@example.com",
  phone: "",
  bio: "",
  avatar: null,
  joinedDate: "January 2024",
  location: "Nairobi, Kenya",
  interests: ["Music", "Technology", "Food & Drink", "Sports"],
  eventsAttended: 15,
  upcomingEvents: 3,
  favoriteEvents: 8,
};

export default function ProfilePage() {
  const { currentUser } = useUser();
  const [userData, setUserData] = useState(defaultUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData);
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    if (currentUser) {
      const updatedUserData = {
        ...defaultUser,
        name: currentUser.name || currentUser.email || "Guest User",
        email: currentUser.email || "guest@example.com",
        joinedDate: currentUser.raw?.createdAt
          ? new Date(
              currentUser.raw.createdAt.seconds * 1000
            ).toLocaleDateString("en-US", { year: "numeric", month: "long" })
          : "January 2024",
      };
      setUserData(updatedUserData);
      setFormData(updatedUserData);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddInterest = () => {
    if (
      newInterest.trim() &&
      !formData.interests.includes(newInterest.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSave = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50">
      {/* Profile Header */}
      <section className="bg-gradient-to-br from-orange-50/80 via-purple-50/80 to-teal-50/80 text-gray-900 py-16 px-6  border-b border-gray-200">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 bg-white border-2 border-black rounded-full flex items-center justify-center">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt={formData.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <UserIcon className="w-20 h-20 text-gray-700" /> // <-- Person icon
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{formData.name}</h1>
            <p className=" text-gray-800 mb-4">{formData.email}</p>
            <p className=" text-gray-800 text-sm">
              Member since {formData.joinedDate}
            </p>
          </div>

          {!isEditing && (
            <Button
              variant="outline"
              className="border-none bg-black text-white hover:bg-[#FF6B35] hover:text-black"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </section>

      {/* Profile Stats */}
      {/* <section className="py-8 px-6 bg-white border-b">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-4xl font-bold text-gray-900">
              {formData.eventsAttended}
            </p>
            <p className="text-gray-600 mt-2">Events Attended</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-4xl font-bold text-gray-900">
              {formData.upcomingEvents}
            </p>
            <p className="text-gray-600 mt-2">Upcoming Events</p>
          </div>
          <div className="text-center p-6 bg-gray-50 rounded-xl">
            <p className="text-4xl font-bold text-gray-900">
              {formData.favoriteEvents}
            </p>
            <p className="text-gray-600 mt-2">Favorite Events</p>
          </div>
        </div>
      </section> */}

      {/* Profile Details */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Profile Information
          </h2>

          <div className="space-y-6">
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Phone & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Bio */}
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

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interests
              </label>
              {isEditing ? (
                <div className="space-y-3">
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
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Save / Cancel */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button variant="cancel" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
