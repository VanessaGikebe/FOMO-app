"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getEventsByOrganizer } from "@/lib/api";
import { Footer } from "@/components";

// Component for an individual Event Card with updated styling and data
const EventCard = ({ id, title, description, date, time, venue, attendees, price, category, onClick }) => (
    <div onClick={() => onClick && onClick(id)} className="w-full sm:w-1/2 lg:w-1/3 p-4 flex-shrink-0 cursor-pointer">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 h-full flex flex-col hover:shadow-xl transition duration-300 text-left">
      
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
                    <button type="button" className="bg-orange-500 text-white text-sm py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-150 ease-in-out font-semibold shadow-md flex items-center" onClick={(e) => e.stopPropagation()}>
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
    const router = useRouter();
    const params = useParams();
    const organiserId = params?.id || null;

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 9;
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [organiserName, setOrganiserName] = useState(organiserId || 'Organiser');

    useEffect(() => {
        let mounted = true;
        async function loadEvents() {
            if (!organiserId) return;
            setLoading(true);
            const events = await getEventsByOrganizer(organiserId);
            if (!mounted) return;
            if (events && !events.error) {
                setAllEvents(events);
                // try to set organiser name from events payload if available
                if (events.length > 0 && (events[0].organizerName || events[0].organizer)) {
                    setOrganiserName(events[0].organizerName || events[0].organizer);
                }
            } else {
                setAllEvents([]);
            }
            setLoading(false);
        }
        loadEvents();
        return () => { mounted = false; };
    }, [organiserId]);

    const currentEvents = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return allEvents.slice(startIndex, endIndex);
    }, [allEvents, currentPage]);

    const handlePageChange = (page) => {
        const totalPages = Math.ceil(allEvents.length / ITEMS_PER_PAGE);
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const handleEventClick = (eventId) => {
        if (!eventId) return;
        router.push(`/m-event_detail/${encodeURIComponent(eventId)}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">{organiserName}</h1>
                    <p className="text-gray-600 mt-1">Events by {organiserName}</p>
                </div>
            </header>

            <main className="py-12 px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="text-center py-20">Loading events…</div>
                    ) : allEvents.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found for this organiser</h3>
                            <p className="mt-1 text-sm text-gray-500">This organiser has not published any events, or their events have been archived.</p>
                        </div>
                    ) : (
                        <div className="flex flex-wrap -m-4 justify-start">
                            {currentEvents.map((event) => (
                                <EventCard
                                    key={event.event_id || event.id || event._id}
                                    id={event.event_id || event.id || event._id}
                                    title={event.title}
                                    description={event.description}
                                    date={event.date}
                                    time={event.time}
                                    venue={event.venue}
                                    attendees={event.attendees}
                                    price={event.price}
                                    category={event.category}
                                    onClick={handleEventClick}
                                />
                            ))}
                        </div>
                    )}

                    <Pagination
                        totalItems={allEvents.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}