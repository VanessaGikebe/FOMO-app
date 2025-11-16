"use client";

import { useNotifications } from "@/contexts/NotifContext";
import { useRouter } from "next/navigation";
import Button from "@/components/UI Components/Button";
import { Bell, BellRing } from "lucide-react"; // ✅ Lucide icons

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
  } = useNotifications();
  const router = useRouter();

  const handleMarkAsRead = (notificationId) => {
    markAsRead(notificationId);
  };

  const handleEventClick = (eventId) => {
    router.push(`/eg-events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Notifications
              </h1>
              <p className="text-gray-600">Never Miss a Moment</p>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-3">
                {unreadCount > 0 && (
                  <Button variant="outline" onClick={markAllAsRead}>
                    Mark All as Read
                  </Button>
                )}
                <Button variant="secondary" onClick={clearAllNotifications}>
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="mb-4 text-gray-400">
                  <Bell className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-600 text-lg mb-2">
                  No notifications yet
                </p>
                <p className="text-gray-500 text-sm">
                  Add events to your favorites to get reminders!
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onEventClick={handleEventClick}
                />
              ))
            )}
          </div>
        </div>
      </div>    </div>
  );
}

// Notification Card Component
function NotificationCard({ notification, onMarkAsRead, onEventClick }) {
  return (
    <div
      className={`bg-white rounded-lg border p-6 transition-all ${
        notification.isRead
          ? "border-gray-200 opacity-75"
          : "border-gray-300 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        {/* Left Section - Event Details */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              {notification.eventTitle}
            </h3>
            {!notification.isRead && (
              <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                <BellRing className="w-3 h-3" />
                NEW
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="font-semibold text-gray-900">Venue: </span>
              <span className="text-gray-600">{notification.eventVenue}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Date: </span>
              <span className="text-gray-600">{notification.eventDate}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Time: </span>
              <span className="text-gray-600">{notification.eventTime}</span>
            </div>
          </div>

          <p className="text-gray-700">{notification.eventDescription}</p>
        </div>

        {/* Right Section - Action Button */}
        <Button
          variant="primary"
          onClick={() => {
            if (!notification.isRead) {
              onMarkAsRead(notification.id);
            }
            onEventClick(notification.eventId);
          }}
        >
          Mark As Read
        </Button>
      </div>
    </div>
  );
}
