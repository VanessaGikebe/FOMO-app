// frontend/src/lib/firebaseConfig.js (or .ts)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjvpa-vkUePG_mfCPxSI_TGtagyTscOHE",
  authDomain: "fomo-app-8ebae.firebaseapp.com",
  projectId: "fomo-app-8ebae",
  storageBucket: "fomo-app-8ebae.firebasestorage.app",
  messagingSenderId: "320401047731",
  appId: "1:320401047731:web:9c31be3e7aa1d91df830c6",
  measurementId: "G-MYELRE67ED",
};

// Only initialize once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Export this — so SignUp.js can import it
export const auth = getAuth(app);

export default app;
