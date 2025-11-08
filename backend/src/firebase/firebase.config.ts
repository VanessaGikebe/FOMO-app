import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

import serviceAccount from './serviceAccountKey.json';

// Only initialize once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export { admin };
