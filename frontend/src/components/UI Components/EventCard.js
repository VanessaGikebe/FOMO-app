import Link from "next/link";
import Image from "next/image";

export default function EventCard({ event }) {
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
    attendees
  } = event;

  return (
    <Link href={`/event_details/${id}`}>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200 cursor-pointer">
        {/* Event Image */}
        <div className="relative h-48 bg-gray-200">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-4xl">🎉</span>
            </div>
          )}
          {/* Category Badge */}
          {category && (
            <div className="absolute top-3 right-3">
              <span className="bg-black text-white px-3 py-1 rounded-full text-xs font-medium">
                {category}
              </span>
            </div>
          )}
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
                <span>{location}</span>
              </div>
            )}

            {/* Attendees */}
            {attendees && (
              <div className="flex items-center text-gray-700 text-sm">
                <span className="mr-2">👥</span>
                <span>{attendees} attending</span>
              </div>
            )}
          </div>

          {/* Price and Action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-lg font-bold text-gray-900">
              {price === 0 || price === "Free" ? "Free" : `$${price}`}
            </div>
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
