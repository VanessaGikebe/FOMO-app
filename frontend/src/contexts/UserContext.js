"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';
import { roleToType } from '@/lib/roleUtils';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
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
      } catch (err) {
        console.error('Failed to load user doc from Firestore', err);
        setCurrentUser({ uid: fbUser.uid, email: fbUser.email, name: fbUser.displayName, type: 'public' });
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err) {
      console.error('Sign out failed', err);
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
