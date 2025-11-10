'use client';

// MOCK useRouter: Replacing import { useRouter } from "next/navigation"
const useRouter = () => ({
    push: (path) => console.log(`Navigating to: ${path}`),
    // Add other necessary router methods if needed
});
// MOCK Footer: Replacing import { Footer } from "@/components"
const Footer = () => (
    <footer className="bg-gray-800 text-white p-4 mt-12 text-center text-sm">
        <p>&copy; 2024 Event Moderation Panel</p>
    </footer>
);


import React, { useState, useMemo } from 'react';

// Component for an individual Event Card with updated styling and data
const EventCard = ({ title, description, date, time, venue, attendees, price, category }) => (
  <div className="w-full sm:w-1/2 lg:w-1/3 p-4 flex-shrink-0">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-full flex flex-col hover:shadow-xl transition duration-300">
      
      {/* Top Section (Image Placeholder and Category Tag) */}
      <div className="relative bg-gray-50 aspect-video flex items-center justify-center p-6 border-b border-gray-100">
        {/* Category Tag (Top Right) */}
        <span className="absolute top-3 right-3 bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {category}
        </span>
        
        {/* Confetti Emoji/Icon */}
        <span role="img" aria-label="confetti" className="text-4xl">
            🎉
        </span>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col">
        
        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
        
        {/* Metadata */}
        <div className="space-y-2 text-sm text-gray-700 mt-auto">
            {/* Date and Time */}
            <div className="flex items-center">
                <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <span className="font-medium">{date} | {time}</span>
            </div>
            
            {/* Location */}
            <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>{venue}</span>
            </div>
            
            {/* Attendees */}
            <div className="flex items-center">
                <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m14 0h-2M7 20v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a3 3 0 100-2.286 3 3 0 000 2.286zm4-8a3 3 0 100-6 3 3 0 000 6zm7 0a3 3 0 100-6 3 3 0 000 6z"></path></svg>
                <span>{attendees} attending</span>
            </div>
        </div>
      </div>
      
      {/* Footer Actions (Price and Flag Button) */}
      <div className="flex justify-between items-center p-5 border-t border-gray-100 bg-gray-50">
          <span className="text-lg font-extrabold text-gray-900">{price}</span>
          
          {/* Flag Button (Orange) */}
          <button className="bg-orange-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-150 ease-in-out font-semibold shadow-md flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-11l-3 3"></path></svg>
            Flag
          </button>
      </div>
    </div>
  </div>
);


// --- Pagination Component (Unchanged from m-manageOrganiser) ---
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxPagesToShow = 7; // Reduced for better mobile fit

    if (totalPages <= 1) return null;

    let startPage, endPage;
    if (totalPages <= maxPagesToShow) {
        startPage = 1;
        endPage = totalPages;
    } else {
        const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
        
        if (currentPage <= maxPagesBeforeCurrentPage) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    const pages = [...Array(endPage + 1 - startPage).keys()].map(i => startPage + i);

    const PageButton = ({ page, isActive, label }) => (
        <button
            onClick={() => onPageChange(page)}
            disabled={isActive}
            className={`
                px-4 py-2 mx-1 rounded-xl transition duration-150 ease-in-out 
                text-sm font-medium
                ${isActive 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-gray-100'
                }
                shadow-sm
            `}
        >
            {label || page}
        </button>
    );

    return (
        <nav className="flex justify-center mt-12" aria-label="Pagination">
            <div className="flex items-center space-x-1">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center px-4 py-2 mx-1 text-gray-500 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Previous
                </button>

                {/* Page Numbers */}
                {pages.map(page => (
                    <PageButton 
                        key={page} 
                        page={page} 
                        isActive={page === currentPage} 
                    />
                ))}

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-4 py-2 mx-1 text-gray-500 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Next
                    <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
            </div>
        </nav>
    );
};


// --- Main Organiser Events Component ---

export default function OrganiserEvents() {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9; 
    // This ORGANISER_NAME should ideally be loaded from the URL params, 
    // but is mocked here for simplicity in a single-file environment.
    const ORGANISER_NAME = "Global Tech Co."; 

    // --- Enriched Mock Data ---
    const eventData = [
        { title: "Tech Summit 2025", category: "Technology", date: "2025-11-01", time: "09:00 AM", venue: "Nairobi Convention Centre", attendees: 342, price: "KES 2500", description: "Join us for the biggest tech conference of the year featuring industry leaders, cutting-edge innovation and networking opportunities." },
        { title: "Jazz Night Live", category: "Music", date: "2025-11-02", time: "07:00 PM", venue: "The Alchemist Bar", attendees: 89, price: "KES 1500", description: "An evening of smooth jazz featuring local and international artists. Enjoy great music, food, and drinks in a cozy atmosphere." },
        { title: "Food Festival Nairobi", category: "Food & Drink", date: "2025-12-01", time: "11:00 AM", venue: "Uhuru Gardens", attendees: 567, price: "KES 500", description: "Celebrate culinary diversity with over 50 food vendors, cooking demonstrations, and live music. Perfect for food lovers." },
        { title: "AI Workshop Series", category: "Technology", date: "2025-11-15", time: "02:00 PM", venue: "KICC Auditorium", attendees: 120, price: "KES 3500", description: "A deep dive into the latest trends in Artificial Intelligence, machine learning, and neural networks. Limited seating available." },
        { title: "Hip-Hop Dance Battle", category: "Entertainment", date: "2025-12-10", time: "06:30 PM", venue: "National Theatre", attendees: 215, price: "KES 1000", description: "Watch the city's best dance crews compete for the grand prize. High-energy performances and guest DJs." },
        { title: "Craft Beer Tasting", category: "Food & Drink", date: "2025-11-20", time: "05:00 PM", venue: "Local Brewery", attendees: 65, price: "KES 2000", description: "Sample the newest craft beers from local brewers. Includes snacks and a talk on the brewing process." },
        { title: "Startup Pitch Event", category: "Business", date: "2026-01-05", time: "11:00 AM", venue: "Venture Hub", attendees: 95, price: "KES 0 (Free)", description: "Witness the next generation of startups pitch their ideas to a panel of investors. Networking reception to follow." },
        { title: "Classical Music Concert", category: "Music", date: "2026-01-25", time: "08:00 PM", venue: "Symphony Hall", attendees: 410, price: "KES 4000", description: "An evening dedicated to the timeless works of Mozart and Beethoven, performed by the Nairobi Philharmonic Orchestra." },
        { title: "Sustainable Living Expo", category: "Lifestyle", date: "2026-02-14", time: "10:00 AM", venue: "Green Park", attendees: 180, price: "KES 800", description: "Explore eco-friendly products, workshops, and sustainable solutions for modern living. Bring your own reusable bag!" },
        { title: "Digital Marketing Masterclass", category: "Business", date: "2026-02-28", time: "09:00 AM", venue: "Online Webinar", attendees: 75, price: "KES 5000", description: "Learn advanced digital marketing strategies from industry experts to boost your online presence and sales." },
        { title: "Children's Book Fair", category: "Family", date: "2026-03-10", time: "10:00 AM", venue: "City Library", attendees: 250, price: "KES 200", description: "A day filled with storytelling, author signings, and fun activities for kids of all ages." },
        { title: "Yoga Retreat Day", category: "Wellness", date: "2026-03-20", time: "07:00 AM", venue: "Hillside Resort", attendees: 45, price: "KES 6000", description: "A full day of mindfulness, meditation, and guided yoga sessions in a peaceful, natural environment." },
    ];


    const allEvents = eventData; 
    // const allEvents = []; // Uncomment this line to test the "Empty State"

    // Calculate current items to display
    const currentEvents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return allEvents.slice(startIndex, endIndex);
    }, [allEvents, currentPage, ITEMS_PER_PAGE]);

    const handlePageChange = (page) => {
        // Ensure page stays within bounds
        const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE);
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* --- Main Header Area (UPDATED) --- */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">{ORGANISER_NAME}</h1>
                    {/* The line below was updated to use the ORGANISER_NAME variable */}
                    <p className="text-gray-600 mt-1">Events by {ORGANISER_NAME}</p>
                </div>
            </header>

            {/* --- Main Event Grid Content --- */}
            <main className="py-12 px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Empty State */}
                    {allEvents.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1v10a2 2 0 002 2h10a2 2 0 002-2v-10a2 2 0 00-2-2H4a2 2 0 00-2 2z"></path>
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found for this organiser</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                This organiser has not published any events, or their events have been archived.
                            </p>
                        </div>
                    ) : (
                        // Event Grid
                        <div className="flex flex-wrap -m-4 justify-start">
                            {currentEvents.map((event, index) => (
                                <EventCard 
                                    key={index}
                                    title={event.title}
                                    description={event.description}
                                    date={event.date}
                                    time={event.time}
                                    venue={event.venue}
                                    attendees={event.attendees}
                                    price={event.price}
                                    category={event.category}
                                />
                            ))}
                        </div>
                    )}
                    
                    {/* Pagination */}
                    <Pagination
                        totalItems={allEvents.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />

                </div>
            </main>

            {/* --- Footer Component --- */}
            <Footer />
        </div>
    );
}