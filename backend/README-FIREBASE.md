# Firebase setup for backend

This project uses the Firebase Admin SDK in the backend (NestJS) to manage Authentication and Firestore.

Follow these steps to configure local development:

1. Create a Firebase project
   - Go to https://console.firebase.google.com and create a project (or use an existing one).

2. Enable Authentication providers
   - In Firebase Console -> Authentication -> Sign-in method
   - Enable Email/Password and Google providers. Add authorized domains (e.g., `localhost` or `localhost:3001` for Next.js).

3. Generate a Service Account Key (for Admin SDK)
   - In Firebase Console -> Project Settings -> Service accounts
   - Click "Generate new private key" and download the JSON file.
   - For local development, place the file at `backend/src/serviceAccountKey.json` (the backend loads this path from `src/main.ts`).
   - IMPORTANT: Do NOT commit this file. Add it to `.gitignore`.

4. Environment variables
   - Frontend: create `frontend/.env.local` with the client-side Firebase config (replace values with your project's keys):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...your_api_key...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
NEXT_PUBLIC_API_URL=http://localhost:3000
```

   - Backend: no extra env vars are required for the Admin SDK when using the service account JSON. The backend bootstrap (`backend/src/main.ts`) expects the service account at `src/serviceAccountKey.json`.

5. Run the apps
   - Backend (default port 3000):
     ```powershell
     cd backend
     npm install
     npm run start:dev
     ```

   - Frontend (choose a different port than backend, e.g. 3001):
     ```powershell
     cd frontend
     npm install
     npx next dev -p 3001
     ```

6. Testing
   - Use the Sign Up / Sign In UI in the frontend. After signing up or signing in, the frontend calls the backend `/auth/upsert` endpoint which will create/merge a document under Firestore `users/{uid}`.
   - Inspect Firestore in the Firebase Console to see `users` collection.

8. Normalize existing user roles (optional)
   - If you previously created users with non-canonical role strings, a migration script is included to normalize `users.{uid}.role` to one of `attendee`, `organizer`, or `moderator`.
   - Place your `serviceAccountKey.json` at `backend/src/serviceAccountKey.json` and run:

```powershell
cd backend
node scripts/normalize_roles.js
```

    - The script will scan the `users` collection and update the `role` field where necessary.

## Admin helper scripts

Several admin scripts are provided under `backend/scripts` to help inspect and seed Firestore. They use the same service-account runtime loading as the backend.

- List root collections and sample docs:
   ```powershell
   cd backend
   npm run admin:list-collections
   ```

- Normalize user roles (maps UI labels -> canonical `attendee|organizer|moderator`):
   ```powershell
   cd backend
   npm run admin:normalize-roles
   ```

- Copy capitalized collections into lowercase equivalents (safe copy):
   ```powershell
   cd backend
   npm run admin:copy-case-fix
   ```

- Seed Firestore with sample data (creates the collections described in the project spec):
   ```powershell
   cd backend
   npm run admin:seed-firestore
   ```

All of these scripts expect the service account JSON to be made available the same way as the backend (set `GOOGLE_APPLICATION_CREDENTIALS` to the path, or place `serviceAccountKey.json` at the repo root or `backend/src`).

7. Security
   - In production, do NOT store service account JSON in the repo. Use environment-based credentials or secret managers.
   - Protect your backend endpoints appropriately (the project includes a `FirebaseAuthGuard` and a `RolesGuard` you can use with `@UseGuards`).

If anything fails (missing credentials, permission errors), check backend console logs for Firebase Admin errors and ensure the service account has access to the project and Firestore API is enabled.
