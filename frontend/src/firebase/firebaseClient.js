// Compatibility re-export so imports using the '@/firebase/*' alias continue to work.
// This file simply re-exports the implementation from `src/lib/firebaseClient.js`.
import app, { auth, db, googleProvider } from '../lib/firebaseClient';

export default app;
export { auth, db, googleProvider };
