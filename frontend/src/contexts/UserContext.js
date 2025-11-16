"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import { roleToType } from '@/lib/roleUtils';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const tokenRefreshIntervalRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      // Clear any existing token refresh interval
      if (tokenRefreshIntervalRef.current) {
        clearInterval(tokenRefreshIntervalRef.current);
        tokenRefreshIntervalRef.current = null;
      }

      if (!fbUser) {
        setCurrentUser(null);
        return;
      }

      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setCurrentUser({
            uid: fbUser.uid,
            email: data.email || fbUser.email,
            name: data.fullName || fbUser.displayName || '',
            role: data.role || null,
            type: roleToType(data.role),
            raw: data,
          });
        } else {
          // no firestore doc; fallback to minimal info
          setCurrentUser({ uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName, type: 'public' });
        }

        // Set up automatic token refresh every 50 minutes (before 1-hour expiry)
        if (fbUser.uid) {
          tokenRefreshIntervalRef.current = setInterval(async () => {
            try {
              await fbUser.getIdToken(true);
              console.log('🔄 Token auto-refreshed');
            } catch (err) {
              console.warn('Token auto-refresh failed:', err);
            }
          }, 50 * 60 * 1000); // Refresh every 50 minutes
        }
      } catch (err) {
        console.error('Failed to load user doc from Firestore', err);
        setCurrentUser({ uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName, type: 'public' });
      }
    });

    return () => {
      unsub();
      if (tokenRefreshIntervalRef.current) {
        clearInterval(tokenRefreshIntervalRef.current);
      }
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error('Sign out failed', err);
    }
  };

  const getAuthToken = async () => {
    if (!auth.currentUser) {
      console.error('No authenticated user');
      throw new Error('No authenticated user found');
    }

    try {
      console.log('Getting auth token for user:', auth.currentUser.uid);
      // Try with force refresh first
      const token = await auth.currentUser.getIdToken(true);
      console.log('✅ Successfully got auth token');
      return token;
    } catch (err) {
      console.error('Failed to get auth token with force refresh:', err);
      
      // Fallback: try without force refresh (uses cached token)
      try {
        console.log('Trying to get cached token without refresh...');
        const cachedToken = await auth.currentUser.getIdToken(false);
        if (cachedToken) {
          console.log('✅ Got cached auth token');
          return cachedToken;
        }
      } catch (cacheErr) {
        console.error('Failed to get cached token:', cacheErr);
      }
      
      throw err;
    }
  };

  const isAuthenticated = () => currentUser !== null;
  const getUserType = () => currentUser?.type || 'public';
  const getUserId = () => currentUser?.uid || null;

  // Favorites helpers operate on the in-memory currentUser object.
  const addToFavorites = (eventId) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const favs = prev.favorites || [];
      if (favs.includes(eventId)) return prev;
      const updated = { ...prev, favorites: [...favs, eventId] };
      return updated;
    });
  };

  const removeFromFavorites = (eventId) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const favs = prev.favorites || [];
      const updated = { ...prev, favorites: favs.filter((f) => f !== eventId) };
      return updated;
    });
  };

  const isFavorite = (eventId) => (currentUser?.favorites || []).includes(eventId);

  const value = {
    currentUser,
    logout,
    isAuthenticated,
    getUserType,
    getUserId,
    getAuthToken,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
