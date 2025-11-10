'use client';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('attendee');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    try {
      // 1️⃣ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Update display name
      await updateProfile(user, { displayName: fullName });

      // 3️⃣ Store role in Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        role,
        createdAt: serverTimestamp()
      });

      console.log("✅ Signup success:", { email, role });
      setSuccessMessage("✅ Account created successfully! Redirecting to Sign In...");

      setTimeout(() => router.push("/signin"), 2000);
    } catch (error) {
      console.error("❌ Signup error:", error);
      setSuccessMessage("❌ " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl border border-[#D9D9D9] shadow-sm">
        <div className="flex flex-col items-center mb-4">
          <img src="https://placehold.co/64x64?text=Logo" alt="Logo" className="w-16 h-16 object-cover rounded-xl" />
          <h1 className="text-[#1C1C1C] text-4xl mt-3 font-normal">FOMO</h1>
        </div>

        <h3 className="text-2xl font-semibold text-[#1C1C1C] mb-3">Sign Up</h3>
        {successMessage && (
          <p className={`text-sm mb-4 ${successMessage.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {successMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1C1C1C]">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
              className="w-full border border-[#D9D9D9] text-[#1C1C1C] placeholder-[#A1A1A1] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1C1C1C] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1C1C1C]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-[#D9D9D9] text-[#1C1C1C] placeholder-[#A1A1A1] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1C1C1C] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1C1C1C]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-[#D9D9D9] text-[#1C1C1C] placeholder-[#A1A1A1] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1C1C1C] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1C1C1C]">Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-[#D9D9D9] text-[#1C1C1C] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1C1C1C] outline-none"
            >
              <option value="attendee">Experience Seeker</option>
              <option value="organizer">Event Organizer</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1C1C1C] text-white py-2 rounded-md hover:bg-[#2E2E2E] transition-colors"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-[#1C1C1C]">
            Already have an account?{" "}
            <Link href="/signin" className="text-[#1C1C1C] hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
