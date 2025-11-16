"use client";

import { Footer } from "@/components";

// MOCK useRouter: Replacing import { useRouter } from "next/navigation"
const useRouter = () => ({
  push: (path) => console.log(`Navigating to: ${path}`),
  // Add other necessary router methods if needed
});
import React, { useState, useMemo } from "react";

// --- Organiser Row Component ---
// Added 'id' and 'router' props
const OrganiserRow = ({ id, name, email, router }) => {
  // Handler for navigating to the organiser's event list
  const handleViewEvents = () => {
    // Navigates to the dynamic route for the specific organiser
    router.push(`/m-view_organiserEvent/${id}`);
  };

  return (
    <div className="w-full bg-white p-4 my-2 border border-gray-200 rounded-xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between transition hover:shadow-md">
      {/* Organiser Info */}
      <div className="flex flex-col md:flex-row md:space-x-8 flex-grow mb-4 md:mb-0">
        <div className="w-full md:w-1/3 mb-1 md:mb-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500 md:hidden">Organiser Name</p>
        </div>
        <div className="w-full md:w-1/3">
          <p className="text-sm text-gray-600 truncate">{email}</p>
          <p className="text-xs text-gray-500 md:hidden">Email Address</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 w-full md:w-auto flex-shrink-0">
        {/* View Events Button (Dark) - Now uses the click handler */}
        <button
          onClick={handleViewEvents}
          className="flex-1 md:flex-none bg-gray-900 text-white text-sm py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-150 ease-in-out font-semibold"
        >
          View Events
        </button>
        {/* Flag User Button (Red) */}
        <button className="flex-1 md:flex-none bg-red-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-red-700 transition duration-150 ease-in-out font-semibold">
          Flag User
        </button>
      </div>
    </div>
  );
};

// --- Pagination Component ---
const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPagesToShow = 10;

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

  const pages = [...Array(endPage + 1 - startPage).keys()].map(
    (i) => startPage + i
  );

  const PageButton = ({ page, isActive, label }) => (
    <button
      onClick={() => onPageChange(page)}
      disabled={isActive}
      className={`
                px-4 py-2 mx-1 rounded-lg transition duration-150 ease-in-out 
                text-sm font-medium
                ${
                  isActive
                    ? "bg-gray-900 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }
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
          className="flex items-center px-4 py-2 mx-1 text-gray-500 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
          Previous
        </button>

        {/* Page Numbers */}
        {pages.map((page) => (
          <PageButton key={page} page={page} isActive={page === currentPage} />
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 mx-1 text-gray-500 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next
          <svg
            className="w-5 h-5 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  );
};

// --- Main Dashboard Component ---

export default function ManageOrganisers() {
  const router = useRouter(); // Initialize router
  const [currentPage, setCurrentPage] = useState(1);

  // Set a small page limit for testing the pagination interface
  const ITEMS_PER_PAGE = 3;

  // --- Dummy Data (Enough for two pages) ---
  const allOrganisers = useMemo(
    () => [
      { id: "global-tech", name: "Global Tech Co.", email: "tech@global.com" },
      { id: "art-space", name: "City Art Space", email: "art@city.org" },
      {
        id: "food-trucks",
        name: "Gourmet Food Trucks",
        email: "gourmet@trucks.net",
      },
      {
        id: "fitness-pro",
        name: "Fitness Pros Inc.",
        email: "admin@fitness.com",
      },
      { id: "local-band", name: "The Local Band", email: "band@music.live" },
      {
        id: "health-plus",
        name: "Health Plus Clinic",
        email: "clinic@health.net",
      },
      // { id: "test-user", name: "Another Organizer", email: "test@org.com" }, // Uncomment for a third page
    ],
    []
  );
  // const allOrganisers = []; // Uncomment this line to test the "Empty State"

  // Calculate current items to display
  const currentOrganisers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allOrganisers.slice(startIndex, endIndex);
  }, [allOrganisers, currentPage, ITEMS_PER_PAGE]);

  const handlePageChange = (page) => {
    // Ensure page stays within bounds
    const totalPages = Math.ceil(allOrganisers.length / ITEMS_PER_PAGE);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Main Header/Search Area --- */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Moderate Organisers
          </h1>
          <p className="text-gray-600 mt-1">
            Manage organiser accounts for verified, high-quality event
            publication
          </p>

          {/* Search Input (Placeholder for functionality) */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search for an organiser by name or email..."
              className="w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </header>

      {/* --- Main Organiser List Content --- */}
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Headers for Desktop View */}
          <div className="hidden md:flex flex-row md:space-x-8 text-sm font-bold text-gray-700 uppercase mb-4 px-4">
            <p className="w-1/3">Organiser Name</p>
            <p className="w-1/3">Organiser Email Address</p>
            <p className="w-1/3 text-right pr-4">Actions</p>
          </div>

          {/* Empty State */}
          {allOrganisers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-lg border border-gray-200">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m-9 1v10a2 2 0 002 2h10a2 2 0 002-2v-10a2 2 0 00-2-2H4a2 2 0 00-2 2z"
                ></path>
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No organisers to moderate
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                There are currently no new organiser accounts awaiting review.
              </p>
            </div>
          ) : (
            // Organiser Rows
            <div className="space-y-3">
              {currentOrganisers.map((organiser) => (
                <OrganiserRow
                  key={organiser.id}
                  id={organiser.id} // Pass the ID
                  name={organiser.name}
                  email={organiser.email}
                  router={router} // Pass the router instance
                />
              ))}
            </div>
          )}

          {/* Pagination - This is the corrected and integrated component */}
          <Pagination
            totalItems={allOrganisers.length}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {/* --- Mock Footer Component --- */}
      <Footer />
    </div>
  );
}
