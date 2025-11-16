"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useEvents } from "@/contexts/EventsContext";
import Button from "../UI Components/Button";
import {
  Calendar,
  MapPin,
  Users,
  Building2,
  AlertTriangle,
  Trash2,
  Pencil,
  ArrowLeft,
  Check,
  ImageIcon,
} from "lucide-react";

export default function EventDetailsPage({
  eventData,
  userType = "public",
  eventId = null,
}) {
  const router = useRouter();
  const { currentUser } = useUser();
  const { deleteEvent, flagEvent, unflagEvent, isEventOwner, addToCart } =
    useEvents();

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Event Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The event you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const isOwner = isEventOwner(eventId || event.id, currentUser?.id);

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

  const handleAddToCart = () => {
    if (userType === "public") {
      alert("Please sign in to purchase tickets!");
      return;
    }
    const result = addToCart(event.id, selectedTickets);
    if (result?.ok)
      alert(`Added ${result.finalQty ?? selectedTickets} ticket(s) to cart!`);
    else {
      const reason = result?.reason || "error";
      if (reason === "sold_out")
        alert("Sorry, tickets for this event are sold out.");
      else if (reason === "max_reached")
        alert("Could not add more tickets — max reached.");
      else if (reason === "not_found") alert("Event not found.");
      else alert("Could not add tickets.");
    }
  };

  const handleUpdateTicketLimit = () =>
    alert(`Ticket limit updated to ${ticketLimit}!`);

  const handleSendMessage = () => {
    if (!moderatorMessage.trim()) return alert("Please enter a message.");
    alert(`Message sent to moderator: "${moderatorMessage}"`);
    setModeratorMessage("");
    setShowMessageBox(false);
  };

  const handleFlag = () => {
    if (!flagReason.trim()) return alert("Please provide a reason.");
    flagEvent(event.id, flagReason);
    alert(`Event "${event.title}" has been flagged!`);
    setShowFlagInput(false);
    setFlagReason("");
  };

  const handleUnflag = () => {
    if (confirm(`Remove flag from "${event.title}"?`)) {
      unflagEvent(event.id);
      alert(`Event "${event.title}" has been unflagged!`);
    }
  };

  const handleDelete = () => {
    if (!event.isFlagged) return alert("Only flagged events can be deleted.");
    if (confirm(`Delete "${event.title}"? This cannot be undone.`)) {
      deleteEvent(event.id);
      alert(`Event "${event.title}" has been deleted.`);
      router.push(getBackLink());
    }
  };

  const handleEdit = () => router.push(`/eo-edit_event_page/${event.id}`);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href={getBackLink()}
            className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Events
          </Link>
        </div>
      </div>

      {/* Flag Warning */}
      {userType === "eventOrganiser" && isOwner && event.isFlagged && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 w-6 h-6" />
              <div className="flex-1">
                <p className="font-bold text-red-900 mb-1">
                  Your event has been flagged
                </p>
                <p className="text-sm text-red-700 mb-3">
                  Reason: {event.flagReason}
                </p>
                <button
                  onClick={() => setShowMessageBox(!showMessageBox)}
                  className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  {showMessageBox ? "Hide Message Box" : "Contact Moderator"}
                </button>
              </div>
            </div>

            {showMessageBox && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Message to Moderator:
                </label>
                <textarea
                  value={moderatorMessage}
                  onChange={(e) => setModeratorMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg"
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleSendMessage}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={() => {
                      setShowMessageBox(false);
                      setModeratorMessage("");
                    }}
                    className="bg-gray-300 px-4 py-2 rounded-lg"
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
            {/* Image */}
            <div className="relative h-96 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="text-gray-400 w-20 h-20" />
              )}
            </div>

            {/* Info */}
            <div>
              <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                {event.category}
              </span>

              <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-4">
                {event.title}
              </h1>
              <p className="text-gray-600 text-lg mb-6">{event.description}</p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-gray-700" />
                  <div>
                    <p className="font-semibold">Date & Time</p>
                    <p className="text-gray-600">{event.date}</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-gray-700" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                    {event.address && (
                      <p className="text-sm text-gray-500">{event.address}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-gray-700" />
                  <div>
                    <p className="font-semibold">Attendees</p>
                    <p className="text-gray-600">
                      {event.attendees} / {event.capacity} spots filled
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Building2 className="w-6 h-6 text-gray-700" />
                  <div>
                    <p className="font-semibold">Organized by</p>
                    <p className="text-gray-600">
                      {event.organizerName ||
                        event.organizer ||
                        "Unknown Organizer"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Section */}
              {(userType === "public" || userType === "eventGoer") && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Ticket Price</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {event.price === 0 || event.price === "Free"
                          ? "Free"
                          : `KSh ${event.price}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm">Quantity:</label>
                      <select
                        value={selectedTickets}
                        onChange={(e) =>
                          setSelectedTickets(Number(e.target.value))
                        }
                        className="px-4 py-2 border rounded-lg"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
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
                      : `Add to Cart - KSh ${(
                          event.price * selectedTickets
                        ).toLocaleString()}`}
                  </Button>
                </div>
              )}

              {/* Organiser (Owner) */}
              {userType === "eventOrganiser" && isOwner && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="font-bold mb-4">Event Management</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm">
                        Ticket Capacity Limit:
                      </label>
                      <input
                        type="number"
                        value={ticketLimit}
                        min="1"
                        className="w-full px-4 py-2 border rounded-lg"
                        onChange={(e) => setTicketLimit(Number(e.target.value))}
                      />
                    </div>

                    <button
                      onClick={handleUpdateTicketLimit}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg"
                    >
                      Update Capacity
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={handleEdit}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Pencil className="w-4 h-4" /> Edit Event
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${event.title}"?`)) {
                            deleteEvent(event.id);
                            router.push(getBackLink());
                          }
                        }}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Event
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-12 px-6 bg-white border-t">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">About This Event</h2>
          <div className="prose max-w-none whitespace-pre-line text-gray-700">
            {event.longDescription ||
              event.description ||
              "No detailed description available."}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-4 py-2 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Moderator Section */}
      {userType === "moderator" && (
        <section className="py-8 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <h3 className="text-lg font-bold mb-4">Moderator Actions</h3>

              {event.isFlagged && (
                <button
                  onClick={() => {}}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Unflag
                </button>
              )}

              <div className="space-y-4">
                {!event.isFlagged ? (
                  <div>
                    {!showFlagInput ? (
                      <button
                        onClick={() => setShowFlagInput(true)}
                        className="w-full bg-orange-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-5 h-5" /> Flag This Event
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <label className="text-sm font-medium">
                          Reason for flagging:
                        </label>
                        <textarea
                          value={flagReason}
                          onChange={(e) => setFlagReason(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border rounded-lg"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleFlag}
                            className="flex-1 bg-orange-600 text-white py-2 rounded-lg"
                          >
                            Submit Flag
                          </button>
                          <button
                            onClick={() => {
                              setShowFlagInput(false);
                              setFlagReason("");
                            }}
                            className="flex-1 bg-gray-300 py-2 rounded-lg"
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
                    className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" /> Remove Flag
                  </button>
                )}

                {event.isFlagged && (
                  <button
                    onClick={() => {}}
                    className="w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" /> Delete Event
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
