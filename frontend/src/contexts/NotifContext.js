"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useEvents } from "./EventsContext";
import { useUser } from "./UserContext";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const { getEventById, cartItems } = useEvents();
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('fomo_notifications');
        if (saved) {
          setNotifications(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Error loading notifications:', err);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fomo_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Generate reminders for favorites and cart items
  const generateNotifications = () => {
    const favoriteIds = currentUser?.favorites || [];
    const cartEventIds = (cartItems || []).map(ci => ci.eventId).filter(Boolean);
    if (favoriteIds.length === 0 && cartEventIds.length === 0) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day comparison

    const newNotifications = [];

  // Combine favorite and cart event IDs (deduped)
  const allEventIds = Array.from(new Set([...favoriteIds, ...cartEventIds]));

    allEventIds.forEach(eventId => {
      const event = getEventById(eventId);
      if (!event || !event.date) return;

      // Parse event date and guard invalid dates
      const eventDate = new Date(event.date);
      if (isNaN(eventDate)) return;
      eventDate.setHours(0, 0, 0, 0);

      // Calculate days difference
      const timeDiff = eventDate - today;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // Build message based on days remaining
      let message = "";
      let type = "";

      if (daysDiff === 0) {
        message = `Your event "${event.title}" is happening today at ${event.time}!`;
        type = "today";
      } else if (daysDiff === 1) {
        message = `Your event "${event.title}" is tomorrow at ${event.time}!`;
        type = "tomorrow";
      } else if (daysDiff === 2) {
        message = `Your event "${event.title}" is in 2 days (${event.date}) at ${event.time}!`;
        type = "two_days";
      }

      // Only create notification if event is within 2 days
      if (message && daysDiff >= 0 && daysDiff <= 2) {
        const notificationId = `${eventId}-${type}`;
        newNotifications.push({
          id: notificationId,
          eventId: event.id,
          eventTitle: event.title,
          eventVenue: event.location,
          eventDate: event.date,
          eventTime: event.time,
          eventDescription: event.description,
          message,
          type,
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    });

  // Add new notifications avoiding duplicates
    if (newNotifications.length > 0) {
      setNotifications(prev => {
        const existingIds = new Set(prev.map(n => n.id));
        const toAdd = newNotifications.filter(n => !existingIds.has(n.id));
        if (toAdd.length === 0) return prev;
        // Prepend newest notifications
        return [...toAdd, ...prev];
      });
    }
  };

  // Run generation on mount and when favorites/cart change
  useEffect(() => {
    if (currentUser?.type === "eventGoer") {
      generateNotifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.type, JSON.stringify(currentUser?.favorites || []), JSON.stringify((cartItems || []).map(ci => ci.eventId))]);

  // Add a notification programmatically
  const addNotification = (notification) => {
    const notif = {
      id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      eventId: notification.eventId || null,
      eventTitle: notification.eventTitle || notification.title || '',
      eventVenue: notification.eventVenue || '',
      eventDate: notification.eventDate || null,
      eventTime: notification.eventTime || null,
      eventDescription: notification.eventDescription || notification.body || '',
      message: notification.message || notification.body || '',
      type: notification.type || 'info',
      isRead: notification.isRead || false,
      createdAt: notification.createdAt || new Date().toISOString(),
      meta: notification.meta || null
    };
    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      if (existingIds.has(notif.id)) return prev;
      return [notif, ...prev];
    });
    return notif;
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  // Delete a notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fomo_notifications');
    }
  };

  // Get unread count
  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  // Get all notifications sorted by date (newest first)
  const getAllNotifications = () => {
    return [...notifications].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  const value = {
    notifications: getAllNotifications(),
    unreadCount: getUnreadCount(),
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    generateNotifications, // Expose this to manually trigger notification check
    addNotification
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}