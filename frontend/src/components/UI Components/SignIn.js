"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../../lib/firebaseClient';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getDashboardForRole } from '@/utils/roleHelpers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;

      // Ensure Firestore user doc exists (create if missing) — match Google flow
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          fullName: cred.user.displayName || '',
          email: cred.user.email || email,
          role: 'Experience Seeker',
          createdAt: serverTimestamp(),
        });
      }

      // Ask backend to upsert the user (keeps backend in sync & returns canonical data)
      let data = null;
      try {
        const idToken = await cred.user.getIdToken();
        const res = await fetch(`${API_URL}/auth/upsert`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) data = await res.json();
      } catch (err) {
        // Network failure or backend down — proceed using Firestore/local fallback
        console.warn('Failed to call backend /auth/upsert:', err);
      }

      const role = data?.role || (snap.exists() ? snap.data().role : 'Experience Seeker');
      router.push(getDashboardForRole(role));
    } catch (err) {
      console.error('Sign in failed', err);
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          fullName: result.user.displayName || '',
          email: result.user.email || '',
          role: 'Experience Seeker',
          createdAt: serverTimestamp(),
        });
      }
      let data = null;
      try {
        const idToken = await result.user.getIdToken();
        const res = await fetch(`${API_URL}/auth/upsert`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (res.ok) data = await res.json();
      } catch (err) {
        console.warn('Failed to call backend /auth/upsert:', err);
      }
      const role = data?.role || 'Experience Seeker';
      router.push(getDashboardForRole(role));
    } catch (err) {
      console.error('Google sign-in failed', err);
      setIsLoading(false);
    }
  };

  // Base styles
  const inputBaseClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors";
  const buttonBaseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

  const isFormValid = email.trim() !== '' && password.trim() !== '';
  const loginButtonClasses = `${buttonBaseClasses} w-full transition-colors ${isLoading || isFormValid ? 'bg-foreground text-white hover:bg-gray-800' : 'bg-white text-foreground border border-foreground'}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl border border-foreground">
        <div className="flex flex-col items-center mb-4">
          <img src="https://via.placeholder.com/64x64.png?text=Logo" alt="Logo" className="w-16 h-16 object-cover rounded-xl" />
          <h1 className="text-foreground text-4xl mt-3 font-normal">FOMO</h1>
        </div>

        <h3 className="text-2xl font-normal text-foreground mb-8">Sign In</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none text-foreground">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={`${inputBaseClasses} bg-background border-border text-foreground placeholder:text-muted-foreground`} />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none text-foreground">Password</label>
            <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className={`${inputBaseClasses} bg-background border-border text-foreground placeholder:text-muted-foreground`} />
          </div>

          <button type="submit" disabled={isLoading || !isFormValid} className={loginButtonClasses}>{isLoading ? 'Logging in...' : 'Log In'}</button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-muted-foreground">OR</span></div>
          </div>

          <button type="button" className={`${buttonBaseClasses} w-full border border-foreground bg-white text-foreground hover:bg-gray-50 transition-colors`} onClick={handleGoogle}>
            <svg className="w-5 h-5 mr-2 text-foreground" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/></svg>
            Continue With Google
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">Don't have an account? <Link href="/signup" className="text-foreground hover:underline font-medium">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}
