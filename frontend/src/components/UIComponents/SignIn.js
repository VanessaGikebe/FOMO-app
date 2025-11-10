'use client';
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // 1️⃣ Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) throw new Error("User data not found in Firestore");

      const { role } = userDoc.data();
      console.log("✅ Signed in as:", role);

      // 3️⃣ Redirect based on role
      switch (role) {
        case "organizer":
          router.push("/eo-dashboard");
          break;
        case "moderator":
          router.push("/m-dashboard");
          break;
        default:
          router.push("/eg-dashboard");
          break;
      }
    } catch (error) {
      console.error("❌ Sign in error:", error);
      setErrorMessage("Invalid credentials or user data not found. Please try again.");
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

        <h3 className="text-2xl font-semibold text-[#1C1C1C] mb-3">Sign In</h3>
        {errorMessage && <p className="text-red-600 text-sm mb-4">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1C1C1C]">Email</label>
            <input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#D9D9D9] text-[#1C1C1C] placeholder-[#A1A1A1] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1C1C1C] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-[#1C1C1C]">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-[#D9D9D9] text-[#1C1C1C] placeholder-[#A1A1A1] rounded-md px-3 py-2 focus:ring-2 focus:ring-[#1C1C1C] outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1C1C1C] text-white py-2 rounded-md hover:bg-[#2E2E2E] transition-colors"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-[#1C1C1C]">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#1C1C1C] hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
