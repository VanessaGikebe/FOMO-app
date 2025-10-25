"use client";

import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useEvents } from "@/contexts/EventsContext";
import { useRouter } from "next/navigation";

export default function EventCard({ event, userType = "public", userId = null }) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useUser();
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
    organizerId
  } = event;

  // Determine the link based on user type
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

  // Check if current user owns this event
  const isOwner = userId && organizerId === userId;

  // Check if event is favorited
  const favorited = isFavorite(id);

  // Handle favorite toggle
  const handleFavoriteToggle = (e) => {
    e.preventDefault(); // Prevent navigation to event details
    e.stopPropagation();
    
    if (favorited) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  // Handle edit button click
  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/eo-edit_event_page/${id}`);
  };

  // Handle delete button click
  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteEvent(id);
      alert(`Event "${title}" has been deleted successfully!`);
    }
  };

  // Handle flag button click (moderator only)
  const handleFlagClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const reason = prompt(`Please provide a reason for flagging "${title}":`);
    if (reason !== null && reason.trim() !== "") {
      flagEvent(id, reason);
      alert(`Event "${title}" has been flagged successfully!`);
    } else if (reason !== null) {
      alert("Flag reason is required.");
    }
  };

  // Handle unflag button click (moderator only)
  const handleUnflagClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (confirm(`Remove flag from "${title}"?`)) {
      unflagEvent(id);
      alert(`Event "${title}" has been unflagged successfully!`);
    }
  };

  return (
    <Link href={getEventLink()}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 cursor-pointer">
        {/* Event Image */}
        <div className="relative h-48 bg-gray-200">
          {image ? (
            // Use regular img tag for base64 images (Next.js Image component requires special config for base64)
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">🎉</span>
            </div>
          )}
          
          {/* Favorite Button (EventGoer only) */}
          {userType === "eventGoer" && (
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-3 left-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform"
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <span className="text-xl">
                {favorited ? "❤️" : "🤍"}
              </span>
            </button>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {/* Category Badge */}
            {category && (
              <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                {category}
              </span>
            )}
            
            {/* Flagged Badge (for organiser and moderator) */}
            {isFlagged && (userType === "eventOrganiser" || userType === "moderator") && (
              <span 
                className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium cursor-help"
                title={event.flagReason ? `Reason: ${event.flagReason}` : "Event has been flagged"}
              >
                ⚠ Flagged
              </span>
            )}
            
            {/* Owner Badge (for organisers viewing their own events) */}
            {isOwner && userType === "eventOrganiser" && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
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
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {description}
            </p>
          )}

          <div className="space-y-2 mb-4">
            {/* Date & Time */}
            {date && (
              <div className="flex items-center text-gray-700 text-sm">
                <span className="mr-2">📅</span>
                <span>{date} {time && `at ${time}`}</span>
              </div>
            )}

            {/* Location */}
            {location && (
              <div className="flex items-center text-gray-700 text-sm">
                <span className="mr-2">📍</span>
                <span className="line-clamp-1">{location}</span>
              </div>
            )}

            {/* Attendees */}
            {attendees !== undefined && (
              <div className="flex items-center text-gray-700 text-sm">
                <span className="mr-2">👥</span>
                <span>{attendees} attending</span>
              </div>
            )}
          </div>

          {/* Flag Reason Display (for moderators and organisers) */}
          {isFlagged && event.flagReason && (userType === "eventOrganiser" || userType === "moderator") && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs font-semibold text-red-900 mb-1">Flag Reason:</p>
              <p className="text-xs text-red-700">{event.flagReason}</p>
            </div>
          )}

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-lg font-bold text-gray-900">
              {price === 0 || price === "Free" ? "Free" : `KES ${price}`}
            </div>
            
            {/* Show Edit and Delete buttons if organiser owns this event */}
            {isOwner && userType === "eventOrganiser" ? (
              <div className="flex gap-2">
                <button 
                  onClick={handleEditClick}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  title="Edit event"
                >
                   Edit
                </button>
                <button 
                  onClick={handleDeleteClick}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  title="Delete event"
                >
                   Delete
                </button>
              </div>
            ) : userType === "moderator" ? (
              /* Show Flag/Unflag and Delete buttons for moderators */
              <div className="flex gap-2">
                {isFlagged ? (
                  <button 
                    onClick={handleUnflagClick}
                    className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    title="Remove flag"
                  >
                    ✓ Unflag
                  </button>
                ) : (
                  <button 
                    onClick={handleFlagClick}
                    className="bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                    title="Flag event"
                  >
                    ⚠ Flag
                  </button>
                )}
                {isFlagged && (
                  <button 
                    onClick={handleDeleteClick}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    title="Delete flagged event"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            ) : (
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                View Details
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
