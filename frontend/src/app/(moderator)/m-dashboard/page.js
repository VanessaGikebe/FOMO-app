
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components";
import { Eye, X, CheckCircle, Flag, EyeOff, Calendar, PartyPopper, AlertTriangle } from "lucide-react";
import { useEvents } from "@/contexts/EventsContext";
import { useUser } from "@/contexts/UserContext";
import { getFlaggedEventsAPI, getModerationLogsAPI } from "@/lib/api";

// Component for the Moderator Metric/Stat Cards
const MetricCard = ({ title, value, Icon, iconColor, valueColor }) => (
  <div className="w-full sm:w-1/3 p-2">
    <div className="bg-white rounded-lg shadow-lg p-4 flex items-center space-x-4 border-2 border-orange-50 hover:border-[#FF6B35] transition-all">
      <div className="flex items-center space-x-3">
        <div
          className={`flex - shrink - 0 rounded - full p - 2`}
          style={{ backgroundColor: iconColor }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-sm font-medium text-gray-700">{title}</p>
      </div>
      <div>
        <p className={`text - 4xl font - bold`} style={{ color: valueColor }}>
          {value}
        </p>
      </div>
    </div>
  </div>
);

// Component for an individual Event Card with Moderator actions
const EventCard = ({ event, onFlagClick }) => {
  const date = event.date || event.start_date?.toDate?.()?.toISOString().split('T')[0] || 'N/A';
  const time = event.time || '00:00';
  const title = event.title || 'Untitled Event';
  const category = event.category || 'Other';
  const description = event.description || 'No description provided';
  const isFlagged = event.isFlagged || false;

  return (
    <div className="w-full sm:w-1/3 p-2 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-50 hover:border-[#FF6B35] transition-all hover:shadow-xl">
        <div className="relative pt-[65%] bg-gradient-to-br from-orange-50 to-teal-50 border-b border-gray-100">
          <div className={`absolute top-4 right-4 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg ${isFlagged ? 'bg-red-500' : 'bg-[#FF6B35]'}`}>
            {isFlagged ? '🚩 FLAGGED' : category}
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
            <button
              onClick={() => onFlagClick(event)}
              className={`flex-1 text-white text-sm py-2.5 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold ${isFlagged ? 'bg-red-500' : 'bg-[#FF6B35]'}`}
            >
              {isFlagged ? 'Flagged ✓' : 'Flag Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for Quick Action Buttons
const QuickActionButton = ({ title, Icon, onClick }) => (
  <button onClick={onClick} className="w-full sm:w-1/5 p-2 flex-shrink-0">
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
  const router = useRouter();
  const { currentUser } = useUser();
  const { events, flagEvent } = useEvents();

  const [flaggedEvents, setFlaggedEvents] = useState([]);
  const [moderationLogs, setModerationLogs] = useState([]);
  const [stats, setStats] = useState({ viewed: 0, denied: 0, validated: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch flagged events and moderation logs on component mount
  useEffect(() => {
    if (!currentUser) return;

    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch flagged events (initial)
        const flaggedData = await getFlaggedEventsAPI();
        if (!flaggedData.error) {
          setFlaggedEvents(Array.isArray(flaggedData) ? flaggedData : []);
        }

        // Fetch moderation logs to calculate stats
        const logsData = await getModerationLogsAPI();
        if (!logsData.error) {
          const logs = Array.isArray(logsData) ? logsData : [];
          setModerationLogs(logs);

          // Calculate stats from logs
          const flagCount = logs.filter(log => log.action === 'FLAG_EVENT').length;
          const unflagCount = logs.filter(log => log.action === 'UNFLAG_EVENT').length;
          const deleteCount = logs.filter(log => log.action === 'DELETE_EVENT').length;

          setStats({
            viewed: flagCount + unflagCount,
            denied: deleteCount,
            validated: logs.length
          });
        }

        setError(null);
      } catch (err) {
        console.error('Failed to load moderator data:', err);
        setError('Failed to load moderator data');
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => { };
  }, [currentUser]);

  // Keep flaggedEvents in sync with the real-time `events` from EventsContext.
  // This ensures the dashboard reflects unflag actions taken elsewhere (e.g. Manage Events)
  useEffect(() => {
    if (!events || !Array.isArray(events)) return;
    const liveFlagged = events.filter(e => e.isFlagged);
    setFlaggedEvents(liveFlagged);
  }, [events]);

  const handleFlagClick = async (event) => {
    if (!currentUser) {
      alert('Please sign in as a moderator');
      return;
    }

    if (event.isFlagged) {
      alert(`This event is already flagged: ${event.flagReason || 'No reason provided'}`);
      return;
    }

    // Redirect to the Manage Events page where moderator can select the event
    router.push('/m-manageEvent');
  };

  // Quick action: view first flagged event (or notify if none)
  const handleQuickView = () => {
    if (flaggedEvents && flaggedEvents.length > 0) {
      const first = flaggedEvents[0];
      // navigate to public event details page
      router.push(`/eg-events/${encodeURIComponent(first.id)}`);
    } else {
      alert('No flagged events to view');
    }
  };

  // Quick action: flag an event by ID (prompt for ID and reason)
  const handleQuickFlag = async () => {
    if (!currentUser) {
      alert('Please sign in as a moderator');
      return;
    }
    // Redirect to Manage Events so moderator can pick the event from the normal flow
    router.push('/m-manageEvent');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in as a moderator to access this dashboard</p>
          <button
            onClick={() => router.push('/signin')}
            className="bg-[#FF6B35] text-white px-6 py-3 rounded-lg hover:shadow-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

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
                title="Reviewed"
                value={stats.viewed}
                Icon={Eye}
                iconColor="#FF6B35"
                valueColor="#FF6B35"
              />
              <MetricCard
                title="Deleted"
                value={stats.denied}
                Icon={X}
                iconColor="#FF6B35"
                valueColor="#FF6B35"
              />
              <MetricCard
                title="Actions"
                value={stats.validated}
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
              Review and flag events for non-compliance
            </p>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading events...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : flaggedEvents.length > 0 ? (
              <div className="flex flex-wrap -m-2">
                {flaggedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onFlagClick={handleFlagClick}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600">No flagged events at the moment</p>
                <p className="text-sm text-gray-500 mt-2">All events are in good standing</p>
              </div>
            )}
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
              <QuickActionButton title="View Event" Icon={Eye} onClick={handleQuickView} />
              <QuickActionButton title="Flag Event" Icon={Flag} onClick={handleQuickFlag} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

