"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useEvents } from "@/contexts/EventsContext";
import Footer from "../UI Components/Footer";
import Button from "../UI Components/Button";

export default function EventDetailsPage({ 
  eventData, 
  userType = "public",
  eventId = null 
}) {
  const router = useRouter();
  const { currentUser, addToCart } = useUser();
  const { deleteEvent, flagEvent, unflagEvent, isEventOwner } = useEvents();
  
  const [selectedTickets, setSelectedTickets] = useState(1);
  const [ticketLimit, setTicketLimit] = useState(eventData?.capacity || 100);
  const [showFlagInput, setShowFlagInput] = useState(false);
  const [flagReason, setFlagReason] = useState("");
  const [moderatorMessage, setModeratorMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);

  const event = eventData;

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const isOwner = isEventOwner(eventId || event.id, currentUser?.id);

  // Get back link based on user type
  const getBackLink = () => {
    switch (userType) {
      case "eventGoer":
        return "/eg-events";
      case "eventOrganiser":
        return "/eo-manageEvents";
      case "moderator":
        return "/m-manageEvent";
      default:
        return "/p-events";
    }
  };

  // Handle ticket purchase/add to cart
  const handleAddToCart = () => {
    if (userType === "public") {
      alert("Please sign in to purchase tickets!");
      return;
    }
    addToCart(event.id, selectedTickets);
    alert(`Added ${selectedTickets} ticket(s) to cart!`);
  };

  // Handle ticket limit update (organiser only)
  const handleUpdateTicketLimit = () => {
    alert(`Ticket limit updated to ${ticketLimit}!`);
    // In real app, this would update the event capacity
  };

  // Handle send message to moderator
  const handleSendMessage = () => {
    if (!moderatorMessage.trim()) {
      alert("Please enter a message.");
      return;
    }
    alert(`Message sent to moderator: "${moderatorMessage}"`);
    setModeratorMessage("");
    setShowMessageBox(false);
  };

  // Handle flag event (moderator only)
  const handleFlag = () => {
    if (!flagReason.trim()) {
      alert("Please provide a reason for flagging this event.");
      return;
    }
    flagEvent(event.id, flagReason);
    alert(`Event "${event.title}" has been flagged successfully!`);
    setShowFlagInput(false);
    setFlagReason("");
  };

  // Handle unflag event (moderator only)
  const handleUnflag = () => {
    if (confirm(`Remove flag from "${event.title}"?`)) {
      unflagEvent(event.id);
      alert(`Event "${event.title}" has been unflagged successfully!`);
    }
  };

  // Handle delete event (moderator only)
  const handleDelete = () => {
    if (!event.isFlagged) {
      alert("Only flagged events can be deleted by moderators.");
      return;
    }
    if (confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
      deleteEvent(event.id);
      alert(`Event "${event.title}" has been deleted successfully!`);
      router.push(getBackLink());
    }
  };

  // Handle edit event (organiser only)
  const handleEdit = () => {
    router.push(`/eo-edit_event_page/${event.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href={getBackLink()} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
            ← Back to Events
          </Link>
        </div>
      </div>

      {/* Flag Warning (for event organiser if event is flagged) */}
      {userType === "eventOrganiser" && isOwner && event.isFlagged && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-start gap-3">
              <span className="text-red-600 text-2xl">⚠️</span>
              <div className="flex-1">
                <p className="font-bold text-red-900 mb-1">Your event has been flagged by a moderator</p>
                <p className="text-sm text-red-700 mb-3">Reason: {event.flagReason}</p>
                <button
                  onClick={() => setShowMessageBox(!showMessageBox)}
                  className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {showMessageBox ? "Hide Message Box" : "Contact Moderator"}
                </button>
              </div>
            </div>
            
            {/* Message Box */}
            {showMessageBox && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Message to Moderator:
                </label>
                <textarea
                  value={moderatorMessage}
                  onChange={(e) => setModeratorMessage(e.target.value)}
                  placeholder="Explain why your event should be unflagged..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-900 mb-3"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSendMessage}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => {
                      setShowMessageBox(false);
                      setModeratorMessage("");
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Header */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Image */}
            <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden">
              {event.image ? (
                // Use regular img tag for base64 images
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-8xl">🎉</span>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div>
              {/* Category Badge */}
              <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>

              <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
                {event.title}
              </h1>

              <p className="text-gray-600 text-lg mb-6">
                {event.description}
              </p>

              {/* Event Details Grid */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="font-semibold text-gray-900">Date & Time</p>
                    <p className="text-gray-600">{event.date}</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                    {event.address && <p className="text-sm text-gray-500">{event.address}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-semibold text-gray-900">Attendees</p>
                    <p className="text-gray-600">{event.attendees} / {event.capacity} spots filled</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <p className="font-semibold text-gray-900">Organized by</p>
                    <p className="text-gray-600">{event.organizerName || event.organizer || "Unknown Organizer"}</p>
                  </div>
                </div>
              </div>

              {/* Action Section - Dynamic based on user type */}
              {/* PUBLIC & EVENT GOER: Ticket Purchase */}
              {(userType === "public" || userType === "eventGoer") && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Ticket Price</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {event.price === 0 || event.price === "Free" ? "Free" : `KSh ${event.price}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700">Quantity:</label>
                      <select
                        value={selectedTickets}
                        onChange={(e) => setSelectedTickets(Number(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    size="large" 
                    className="w-full"
                    onClick={handleAddToCart}
                  >
                    {userType === "public" 
                      ? "Sign In to Purchase" 
                      : `Add to Cart - KSh ${(event.price * selectedTickets).toLocaleString()}`
                    }
                  </Button>
                </div>
              )}

              {/* EVENT ORGANISER (OWNER): Ticket Limit Management */}
              {userType === "eventOrganiser" && isOwner && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold text-gray-900 mb-4">Event Management</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ticket Capacity Limit:
                      </label>
                      <input
                        type="number"
                        value={ticketLimit}
                        onChange={(e) => setTicketLimit(Number(e.target.value))}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                      />
                    </div>
                    <button
                      onClick={handleUpdateTicketLimit}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Update Capacity
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={handleEdit}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        ✏️ Edit Event
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${event.title}"?`)) {
                            deleteEvent(event.id);
                            router.push(getBackLink());
                          }
                        }}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        🗑️ Delete Event
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* EVENT ORGANISER (NOT OWNER): Show ticket info */}
              {userType === "eventOrganiser" && !isOwner && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-sm text-gray-600 mb-2">Ticket Price</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {event.price === 0 || event.price === "Free" ? "Free" : `KSh ${event.price}`}
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    This event is managed by another organizer.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Event Description */}
      <section className="py-12 px-6 bg-white border-t">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {event.longDescription || event.description || "No detailed description available."}
          </div>

          {/* Tags */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags && event.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODERATOR ACTIONS SECTION */}
      {userType === "moderator" && (
        <section className="py-8 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Moderator Actions</h3>
              
              {/* Flag Status */}
              {event.isFlagged && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 text-xl">⚠️</span>
                    <div className="flex-1">
                      <p className="font-semibold text-red-900">This event has been flagged</p>
                      <p className="text-sm text-red-700 mt-1">Reason: {event.flagReason}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="space-y-4">
                {/* Flag/Unflag Section */}
                {!event.isFlagged ? (
                  <div>
                    {!showFlagInput ? (
                      <button
                        onClick={() => setShowFlagInput(true)}
                        className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <span>⚠️</span>
                        <span>Flag This Event</span>
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Reason for flagging:
                        </label>
                        <textarea
                          value={flagReason}
                          onChange={(e) => setFlagReason(e.target.value)}
                          placeholder="Enter reason for flagging this event..."
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleFlag}
                            className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                          >
                            Submit Flag
                          </button>
                          <button
                            onClick={() => {
                              setShowFlagInput(false);
                              setFlagReason("");
                            }}
                            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleUnflag}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✓</span>
                    <span>Remove Flag</span>
                  </button>
                )}
                
                {/* Delete Button (only for flagged events) */}
                {event.isFlagged && (
                  <button
                    onClick={handleDelete}
                    className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>🗑️</span>
                    <span>Delete Flagged Event</span>
                  </button>
                )}
              </div>

              {/* Info Note */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Events must be flagged before they can be deleted. 
                  Flagging notifies the event organizer and hides the event from public view.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
