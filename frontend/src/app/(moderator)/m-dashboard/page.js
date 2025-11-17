"use client";

import { Footer } from "@/components";
import { Eye, X, CheckCircle, Flag, EyeOff, Calendar, PartyPopper, AlertTriangle } from "lucide-react";

// Component for the Moderator Metric/Stat Cards
const MetricCard = ({ title, value, Icon, iconColor, valueColor }) => (
  <div className="w-full sm:w-1/3 p-2">
    <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4 border-2 border-orange-50 hover:border-[#FF6B35] transition-all">
      <div className="flex items-center space-x-3">
        <div
          className={`flex-shrink-0 rounded-full p-2`}
          style={{ backgroundColor: iconColor }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
      </div>
      <div>
        <p className={`text-4xl font-bold`} style={{ color: valueColor }}>
          {value}
        </p>
      </div>
    </div>
  </div>
);

// Component for an individual Event Card with Moderator actions
const EventCard = ({ category, title, date, time, description }) => (
  <div className="w-full sm:w-1/3 p-2 flex-shrink-0">
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-50 hover:border-[#FF6B35] transition-all hover:shadow-xl">
      <div className="relative pt-[65%] bg-gradient-to-br from-orange-50 to-teal-50 border-b border-gray-100">
        <div className="absolute top-4 right-4 bg-[#FF6B35] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
          {category}
        </div>
        {/* Replacing emoji with a simple icon placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <PartyPopper className="w-12 h-12" />
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center text-sm font-medium text-gray-700 mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            {date} | {time}
          </div>
        </div>
        <div className="flex space-x-2 pt-4 border-t border-gray-100 mt-auto">
          {/* <button className="flex-1 bg-black text-white text-sm py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold">
            View Event
          </button> */}
          <button className="flex-1  bg-[#FF6B35] text-white text-sm py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold">
            Flag Event
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Component for Quick Action Buttons
const QuickActionButton = ({ title, Icon }) => (
  <button className="w-full sm:w-1/5 p-2 flex-shrink-0">
    <div className="bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-purple-50 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center transition-all duration-200 h-32 border-2 border-purple-100 hover:border-[#FF6B35] hover:scale-105">
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] rounded-full p-2 mb-2">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-900">{title}</span>
    </div>
  </button>
);

// --- Main Dashboard Component ---
export default function ModeratorDashboard() {
  const eventsToReview = [
    { category: "Technology", title: "Tech Summit 2025" },
    { category: "Music", title: "Live Music Gala" },
    { category: "Food & Drink", title: "Gourmet Food Fair" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50">
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* 1. Moderator Insights Section (Metrics) */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Moderator Insights
            </h2>
            <p className="text-gray-600 mb-6">
              Track approvals, declines, and overall moderation activity
            </p>
            <div className="flex flex-wrap -m-2">
              <MetricCard
                title="Viewers"
                value="24"
                Icon={Eye}
                iconColor="#FF6B35"
                valueColor="#FF6B35"
              />
              <MetricCard
                title="Denied"
                value="17"
                Icon={X}
                iconColor="#FF6B35"
                valueColor="#FF6B35"
              />
              <MetricCard
                title="Validated"
                value="132"
                Icon={CheckCircle}
                iconColor="#FF6B35"
                valueColor="#FF6B35"
              />
            </div>
          </section>

          {/* 2. Events to Moderate Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#FF6B35] mb-1">
              Events to Moderate
            </h2>
            <p className="text-gray-600 mb-6">
              Review new event submissions for compliance and content quality
            </p>
            <div className="flex flex-wrap -m-2">
              {eventsToReview.map((event, index) => (
                <EventCard
                  key={index}
                  category={event.category}
                  title={event.title}
                  description={`Review the submission details for the ${event.title} to ensure it meets all community standards and legal requirements.`}
                  date="2025-11-20"
                  time="10:00 AM"
                />
              ))}
            </div>
          </section>

          {/* 3. Quick Actions Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Quick Actions
            </h2>
            <p className="text-gray-600 mb-6">
              Streamline your moderation workflow with easy one-step actions
            </p>
            <div className="flex flex-wrap -m-2">
              <QuickActionButton title="View Event" Icon={Eye} />
              <QuickActionButton title="Flag Event" Icon={Flag} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
