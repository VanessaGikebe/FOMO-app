"use client";

import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

// Mock users data - in production, this would come from authentication
const mockUsers = {
  public: null, // Not logged in
  eventGoer: {
    id: "user001",
    name: "John Doe",
    email: "john@example.com",
    type: "eventGoer",
    favorites: [],
    cart: []
  },
  eventOrganiser: {
    id: "org001",
    name: "Tech Events Kenya",
    email: "info@techevents.co.ke",
    type: "eventOrganiser"
  },
  moderator: {
    id: "mod001",
    name: "Sarah Admin",
    email: "admin@fomo.co.ke",
    type: "moderator"
  }
};

export function UserProvider({ children }) {
  // Initialize state from localStorage or use null
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('fomo_current_user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          return null;
        }
      }
    }
    return null;
  });

  // Save currentUser to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('fomo_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('fomo_current_user');
      }
    }
  }, [currentUser]);

  const login = (userType) => {
    setCurrentUser(mockUsers[userType]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    return currentUser !== null;
  };

  const getUserType = () => {
    return currentUser?.type || "public";
  };

  const getUserId = () => {
    return currentUser?.id || null;
  };

  // Add event to favorites (eventGoer only)
  const addToFavorites = (eventId) => {
    if (currentUser?.type === "eventGoer") {
      setCurrentUser(prev => ({
        ...prev,
        favorites: [...new Set([...prev.favorites, eventId])]
      }));
    }
  };

  // Remove from favorites
  const removeFromFavorites = (eventId) => {
    if (currentUser?.type === "eventGoer") {
      setCurrentUser(prev => ({
        ...prev,
        favorites: prev.favorites.filter(id => id !== eventId)
      }));
    }
  };

  // Check if event is in favorites
  const isFavorite = (eventId) => {
    return currentUser?.favorites?.includes(eventId) || false;
  };

  // Add to cart (eventGoer only)
  const addToCart = (eventId) => {
    if (currentUser?.type === "eventGoer") {
      setCurrentUser(prev => ({
        ...prev,
        cart: [...prev.cart, eventId]
      }));
    }
  };

  // Remove from cart
  const removeFromCart = (eventId) => {
    if (currentUser?.type === "eventGoer") {
      setCurrentUser(prev => ({
        ...prev,
        cart: prev.cart.filter(id => id !== eventId)
      }));
    }
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated,
    getUserType,
    getUserId,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToCart,
    removeFromCart
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
