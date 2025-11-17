"use client";

import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useEvents } from "@/contexts/EventsContext";
import { useRouter } from "next/navigation";
import {
  PartyPopper,
  Heart,
  Calendar,
  MapPin,
  Users,
  AlertTriangle,
  Check,
  Trash2,
} from "lucide-react";

export default function EventCard({
  event,
  userType = "public",
  userId = null,
}) {
  const { isFavorite, addToFavorites, removeFromFavorites, currentUser } = useUser();
  const { deleteEvent, flagEvent, unflagEvent } = useEvents();
  const router = useRouter();

  const {
    id,
    title,
    date,
    time,
    location,
    price,
    category,
    image,
    description,
    attendees,
    isFlagged,
    organizerId,
  } = event;

  const getEventLink = () => {
    switch (userType) {
      case "eventGoer":
        return `/eg-events/${id}`;
      case "eventOrganiser":
        return `/eo-event_details/${id}`;
      case "moderator":
        return `/m-event_detail/${id}`;
      default:
        return `/p-events/${id}`;
    }
  };

  const isOwner = userId && organizerId === userId;
  const favorited = isFavorite(id);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorited) removeFromFavorites(id);
    else addToFavorites(id);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/eo-edit_event_page/${id}`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      deleteEvent(id, currentUser?.uid);
      alert(`Event "${title}" has been deleted successfully!`);
    }
  };

  const handleFlagClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const reason = prompt(`Please provide a reason for flagging "${title}":`);
    if (reason !== null && reason.trim() !== "") {
      flagEvent(id, reason, currentUser?.uid);
      alert(`Event "${title}" has been flagged successfully!`);
    } else if (reason !== null) alert("Flag reason is required.");
  };

  const handleUnflagClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Remove flag from "${title}"?`)) {
      unflagEvent(id, currentUser?.uid);
      alert(`Event "${title}" has been unflagged successfully!`);
    }
  };

  return (
    <Link href={getEventLink()}>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-orange-50 hover:border-[#FF6B35] cursor-pointer hover:scale-[1.02] duration-200">
        {/* Event Image */}
        <div className="relative h-48 bg-gradient-to-br from-orange-50 to-purple-50">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <PartyPopper className="w-12 h-12" />
            </div>
          )}

          {/* Favorite Button */}
          {userType === "eventGoer" && (
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
              aria-label={
                favorited ? "Remove from favorites" : "Add to favorites"
              }
            >
              {favorited ? (
                <Heart className="w-5 h-5 text-red-600" />
              ) : (
                <Heart className="w-5 h-5 text-gray-400" />
              )}
            </button>
          )}

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {category && (
              <span className="bg-[#FF6B35] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                {category}
              </span>
            )}
            {isFlagged &&
              (userType === "eventOrganiser" || userType === "moderator") && (
                <span
                  className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium cursor-help"
                  title={
                    event.flagReason
                      ? `Reason: ${event.flagReason}`
                      : "Event has been flagged"
                  }
                >
                  <AlertTriangle className="w-3 h-3 inline mr-1" /> Flagged
                </span>
              )}
            {isOwner && userType === "eventOrganiser" && (
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                Your Event
              </span>
            )}
          </div>
        </div>

        {/* Event Details */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-gray-700 text-sm mb-4 line-clamp-2 font-medium">
              {description}
            </p>
          )}

          <div className="space-y-2 mb-4">
            {date && (
              <div className="flex items-center text-gray-700 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>
                  {date} {time && `at ${time}`}
                </span>
              </div>
            )}
            {location && (
              <div className="flex items-center text-gray-700 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="line-clamp-1">{location}</span>
              </div>
            )}
            {attendees !== undefined && (
              <div className="flex items-center text-gray-700 text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span>{attendees} attending</span>
              </div>
            )}
          </div>

          {isFlagged &&
            event.flagReason &&
            (userType === "eventOrganiser" || userType === "moderator") && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-semibold text-red-900 mb-1">
                  Flag Reason:
                </p>
                <p className="text-xs text-red-700">{event.flagReason}</p>
              </div>
            )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-lg font-bold text-gray-900">
              {price === 0 || price === "Free" ? "Free" : `KES ${price}`}
            </div>

            {isOwner && userType === "eventOrganiser" ? (
              <div className="flex gap-2">
                <button
                  onClick={handleEditClick}
                  className="bg-gradient-to-r from-[#6C5CE7] to-[#5B4BCF] text-white px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                  title="Edit event"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                  title="Delete event"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                </button>
              </div>
            ) : userType === "moderator" ? (
              <div className="flex gap-2">
                {isFlagged ? (
                  <button
                    onClick={handleUnflagClick}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                    title="Remove flag"
                  >
                    <Check className="w-4 h-4 inline mr-1" /> Unflag
                  </button>
                ) : (
                  <button
                    onClick={handleFlagClick}
                    className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                    title="Flag event"
                  >
                    <AlertTriangle className="w-4 h-4 inline mr-1" /> Flag
                  </button>
                )}
                {isFlagged && (
                  <button
                    onClick={handleDeleteClick}
                    className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                    title="Delete flagged event"
                  >
                    <Trash2 className="w-4 h-4 inline mr-1" /> Delete
                  </button>
                )}
              </div>
            ) : (
              <button className="bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200">
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
