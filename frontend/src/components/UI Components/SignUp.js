"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebaseClient';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getDashboardForRole } from '@/utils/roleHelpers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function mapLabelToRole(label) {
  const s = String(label || '').toLowerCase();
  if (s.includes('organis') || s.includes('organizer') || s.includes('event organiser') || s.includes('event_organiser')) return 'Event Organiser';
  if (s.includes('moderator') || s.includes('mod')) return 'moderator';
  return 'Experience Seeker';
}

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [label, setLabel] = useState('Experience Seeker'); 
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      const role = mapLabelToRole(label);

      // Create Firestore user doc
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        fullName: fullName || cred.user.displayName || '',
        email: email,
        role,
        createdAt: serverTimestamp(),
      });

      // Optionally sync with backend (upsert)
      try {
        const idToken = await cred.user.getIdToken();
        await fetch(`${API_URL}/auth/upsert`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
        });
      } catch (err) {
        console.warn('Failed to call backend /auth/upsert:', err);
      }

      // After signup, sign out and redirect to sign-in so user can log in
      await signOut(auth);
      router.push('/signin');
    } catch (err) {
      console.error('Sign up failed', err);
      setIsLoading(false);
    }
  };
  
  // Base classes for consistent input/select styling
  const inputBaseClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors";

  // Base classes for consistent button styling
  const buttonBaseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";


  return (
    // Outer container for centering
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
      
      {/* Main form container: border-foreground (black) applied, rounded corners */}
      <div className="w-full max-w-sm p-6 bg-white rounded-xl border border-foreground">
        
        {/* Centered Logo and FOMO text */}
        <div className="flex flex-col items-center mb-6">
            {/* Logo image */}
            <img 
                src="https://via.placeholder.com/64x64.png?text=Logo" // Placeholder image URL
                alt="Logo" 
                className="w-16 h-16 object-cover rounded-xl"
            />
            <h1 className="text-foreground text-4xl mt-3 font-normal">FOMO</h1>
        </div>

        {/* Sign Up text */}
        <h3 className="text-2xl font-normal text-foreground mb-8">Sign Up</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={`${inputBaseClasses} bg-background border-border text-foreground placeholder:text-muted-foreground`}
            />
          </div>

          {/* 2. Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`${inputBaseClasses} bg-background border-border text-foreground placeholder:text-muted-foreground`}
            />
          </div>

          {/* 3. Account Type (Simple Native Select) */}
          <div className="space-y-2">
            <label htmlFor="label" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Account Type
            </label>
            <select
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              // Custom styles applied: mt-1 for margin, bg-white, and consistent input styling
              className="mt-1 h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
            >
                <option value="Experience Seeker">Experience Seeker</option>
                <option value="Event Organiser">Event Organiser</option>
                <option value="moderator">Moderator</option>
            </select>
          </div>

          {/* 4. Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputBaseClasses} bg-background border-border text-foreground placeholder:text-muted-foreground`}
            />
          </div>

          {/* 5. Confirm Password */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`${inputBaseClasses} bg-background border-border text-foreground placeholder:text-muted-foreground`}
            />
          </div>
          
          {/* Already have an account? Link */}
          <div className="text-left pt-2">
        <p className="text-muted-foreground text-sm font-medium">
          Already have an account?{" "}
          <Link href="/signin" className="text-foreground hover:underline transition-colors">
            Sign In
          </Link>
        </p>
          </div>
          

          {/* Sign Up Button (Black Border and Text) */}
          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword || !password}
            // Inlined base styles + outline variant styles
            className={`${buttonBaseClasses} w-full border border-foreground bg-white text-foreground hover:bg-gray-50 hover:text-foreground transition-colors`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing Up...
              </>
            ) : "Sign Up"}
          </button>

          {/* OR Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">OR</span>
            </div>
          </div>

          {/* Continue With Google Button (Google logo black) */}
          <button
            type="button"
            // Inlined base styles + outline variant styles
            className={`${buttonBaseClasses} w-full border border-foreground bg-white text-foreground hover:bg-gray-50 hover:text-foreground transition-colors`}
          >
            {/* Google Logo SVG - Set to text-foreground (black) */}
            <svg className="w-5 h-5 mr-2 text-foreground" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue With Google
          </button>
        </form>
      </div>
    </div>
  );
}
