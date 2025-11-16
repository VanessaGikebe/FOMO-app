'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SignIn() { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [label, setLabel] = useState('experience_seeker'); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Attempting sign in:', { email, label, password });

    // Simulate API call delay
    setTimeout(() => {
        setIsLoading(false);
        console.log('Sign in attempt finished.');
    }, 1500);
  };
  
  // Base classes for consistent input/select styling
  const inputBaseClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors";

  // Base classes for consistent button styling
  const buttonBaseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";

  // Check if both email and password fields have content
  const isFormValid = email.trim() !== '' && password.trim() !== '';

  // Determine the dynamic class set for the Log In button
  const loginButtonClasses = `${buttonBaseClasses} w-full transition-all ${
    (isLoading || isFormValid)
    ? 'bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white hover:shadow-lg hover:scale-105' // Enabled / Loading State: Orange Gradient
    : 'bg-white text-gray-400 border-2 border-gray-300 cursor-not-allowed' // Disabled State: Gray Outline
  }`;

  return (
    // Outer container for centering
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50 flex items-center justify-center p-4 font-sans">
      
      {/* Main form container: border-foreground (black) applied, rounded corners */}
      <div className="w-full max-w-sm p-6 bg-white rounded-xl border-2 border-purple-200 shadow-xl">
        
        {/* Centered Logo and FOMO text */}
        <div className="flex flex-col items-center mb-4">
            {/* Logo image */}
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#6C5CE7] rounded-xl flex items-center justify-center">
                <span className="text-3xl">📸</span>
            </div>
            <h1 className="bg-gradient-to-r from-[#FF6B35] via-[#6C5CE7] to-[#00D9C0] bg-clip-text text-transparent text-4xl mt-3 font-bold">FOMO</h1>
        </div>

        {/* Sign In text */}
        <h3 className="text-2xl font-bold text-gray-900 mb-8">Sign In</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`${inputBaseClasses} bg-background border-2 border-purple-200 text-foreground placeholder:text-muted-foreground focus:border-[#6C5CE7]`}
            />
          </div>

          {/* 2. Account Type (Native Select) */}
          <div className="space-y-2">
            <label htmlFor="label" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Account Type
            </label>
            <select
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              required
              // Apply inputBaseClasses for consistency, override bg to white, add mt-1 for spacing
              className={`${inputBaseClasses} mt-1 bg-white border-2 border-purple-200 focus:border-[#6C5CE7]`}
            >
                <option value="experience_seeker">Experience Seeker</option>
                <option value="event_organiser">Event Organiser</option>
                <option value="moderator">Moderator</option>
            </select>
          </div>

          {/* 3. Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`${inputBaseClasses} bg-background border-2 border-purple-200 text-foreground placeholder:text-muted-foreground focus:border-[#6C5CE7]`}
            />
          </div>
          
          {/* Forgot password aligned to the left (Native Link) */}
          <div className="text-left">
            <a href="#" className="text-sm text-[#6C5CE7] hover:text-[#5B4BCF] hover:underline font-medium transition-colors">
              Forgot password?
            </a>
          </div>

          {/* Log In Button (Dynamic Styling) */}
          <button
            type="submit"
            // Button is disabled if loading OR if the form is NOT valid
            disabled={isLoading || !isFormValid} 
            // Use the dynamic classes defined above
            className={loginButtonClasses}
          >
            {isLoading ? (
              <>
                {/* Spinner is white, as the button style will be black-filled when isLoading is true */}
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : "Log In"}
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

          {/* Continue With Google Button (Outline with Black Border) */}
          <button
            type="button"
            // Use buttonBaseClasses and specify outline styles
            className={`${buttonBaseClasses} w-full border-2 border-purple-200 bg-white text-foreground hover:bg-purple-50 hover:border-[#6C5CE7] transition-all`}
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

        {/* Don't have an account? Link */}
          <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#FF6B35] hover:text-[#E55A2B] hover:underline font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
