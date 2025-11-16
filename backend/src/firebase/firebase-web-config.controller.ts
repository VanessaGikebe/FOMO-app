import { Controller, Get } from '@nestjs/common';

// Public endpoint to serve the Firebase Web App config to the frontend.
// This keeps web-config values in backend-managed env vars (Option B).
@Controller('config')
export class FirebaseWebConfigController {
  @Get('firebase')
  getFirebaseConfig() {
    // Only expose public (web) config keys. These should be set in the backend
    // environment (for example when deploying) so the frontend can fetch them.
    const cfg = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || null,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || null,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || null,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || null,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || null,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || null,
    };

    return cfg;
  }
}
