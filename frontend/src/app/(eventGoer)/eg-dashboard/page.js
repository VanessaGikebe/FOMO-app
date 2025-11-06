import { Footer } from "@/components";

// --- Utility Components for Reusability ---

// Component for an individual event card with the new design and text formatting
const EventCard = ({ category = "Category", title = "Event Title", venue = "Event Venue", time = "Event Time", description = "Join us for the biggest tech conference of the year featuring industry leaders, cutting-edge innovation..." }) => (
  // Outer container: w-1/3 on large screens for 3 cards per row, using p-4 for spacing
  <div className="w-full sm:w-1/2 lg:w-1/3 p-4 flex-shrink-0">
    {/* Inner Card: Background, rounded corners, shadow */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
      {/* 1. Image/Visual Placeholder Section (Matches the large gray box) */}
      <div className="bg-gray-100 relative pt-[56.25%]"> {/* pt-[56.25%] creates a 16:9 aspect ratio */}

        {/* Category Tag (Top Right) */}
        <div className="absolute top-4 right-4 bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {category}
        </div>

        {/* Centered Emoji Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
           {/* Replace this with an actual image in production or a complex SVG */}
           <span className="text-5xl">🎉</span> 
        </div>
      </div>
      
      {/* 2. Text Content Section (Matches the text formatting of Tech Summit 2025) */}
      <div className="p-6">
        {/* Title: Tech Summit 2025 style (text-2xl or text-3xl, font-bold) */}
        <h3 className="text-3xl font-bold text-gray-900 mb-2">{title}</h3>
        
        {/* Description/Venue: Smaller, regular text */}
        <p className="text-gray-700 mb-4 leading-relaxed">
          {description}
        </p>

        {/* Date/Time: Small text with icon */}
        <div className="text-base text-gray-600 flex items-center space-x-2 mb-6">
          {/* Calendar Icon Placeholder */}
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          <span className="font-medium">{venue} | {time}</span> 
        </div>

        {/* View Event Button (Full width) */}
        <button className="w-full bg-gray-800 text-white text-sm py-2.5 rounded-lg hover:bg-gray-700 transition duration-150 ease-in-out font-semibold">
          View Event
        </button>
      </div>
    </div>
  </div>
);

// Component for a section of event cards
const EventSection = ({ title, description, count }) => {
    // Generate dummy data based on count
    const dummyEvents = Array.from({ length: count }).map((_, index) => ({
        category: ["Technology", "Music", "Food & Drink", "Art"][index % 4],
        title: ["Tech Summit 2025", "Live Music Gala", "Gourmet Food Fair", "Modern Art Show"][index % 4],
        venue: "2025-11-01",
        time: "09:00 AM",
        description: "Join us for the biggest tech conference of the year featuring industry leaders, cutting-edge innovation...",
    }));

    return (
        <section className="mb-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            <p className="text-gray-600 mb-8">{description}</p>
            {/* Flex container for cards: justify-center for centering, -mx-4 for negative margin to compensate for card padding */}
            <div className="flex flex-wrap justify-center -mx-4">
                {dummyEvents.map((event, index) => (
                    <EventCard 
                        key={index} 
                        category={event.category}
                        title={event.title}
                        venue={event.venue}
                        time={event.time}
                        description={event.description}
                    />
                ))}
            </div>
        </section>
    );
};

// --- Main Dashboard Component ---

export default function EventGoerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* The Header/Nav from the previous response would go here */}

      {/* --- Main Dashboard Content --- */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Recommended Events Section (4 cards requested initially, but layout shows 3 per row) */}
          <EventSection 
            title="Recommended Events" 
            description="Review scheduled events to refine marketing and update key details"
            count={3} // This will render 4 cards: a full row of 3 and one card centered below
          />
          
          <hr className="my-10 border-gray-200" />

          {/* Upcoming Events Section */}
          <EventSection 
            title="Upcoming Events" 
            description="Review scheduled events to refine marketing and update key details"
            count={3} 
          />
          
          <hr className="my-10 border-gray-200" />

          {/* My Events Section */}
          <EventSection 
            title="My Events" 
            description="Review scheduled events to refine marketing and update key details"
            count={3} 
          />
        </div>
      </main>

      {/* --- Footer Component --- */}
      <Footer />
    </div>
  );
}