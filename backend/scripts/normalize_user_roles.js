const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function loadServiceAccountFromFile(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function initAdmin() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({ credential: admin.credential.cert(parsed) });
      return;
    } catch (err) {
      console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', err.message);
    }
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const p = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const sa = loadServiceAccountFromFile(p);
    if (sa) {
      admin.initializeApp({ credential: admin.credential.cert(sa) });
      return;
    }
  }

  const possible = path.resolve(process.cwd(), 'serviceAccountKey.json');
  const possible2 = path.resolve(__dirname, '..', 'serviceAccountKey.json');
  const sa = loadServiceAccountFromFile(possible) || loadServiceAccountFromFile(possible2);
  if (sa) {
    admin.initializeApp({ credential: admin.credential.cert(sa) });
    return;
  }

  console.warn('No service account JSON found locally; falling back to Application Default Credentials.');
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}

function mapRole(raw) {
  if (!raw) return 'attendee';
  const r = String(raw).trim().toLowerCase();
  if (r.includes('organis') || r.includes('organizer') || r.includes('organiser')) return 'organizer';
  if (r.includes('moder')) return 'moderator';
  if (r.includes('experience') || r.includes('seeker') || r.includes('attend') || r.includes('attendee')) return 'attendee';
  return 'attendee';
}

async function main() {
  initAdmin();
  const db = admin.firestore();
  const usersRef = db.collection('users');

  console.log('Scanning users collection...');
  const snapshot = await usersRef.get();
  console.log(`Found ${snapshot.size} users`);

  let updated = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const rawRole = data.role || data.type || '';
    const normalized = mapRole(rawRole);
    if (data.role !== normalized) {
      await doc.ref.set({ role: normalized }, { merge: true });
      updated++;
      console.log(`Updated ${doc.id}: '${rawRole}' -> '${normalized}'`);
    }
  }

  console.log(`Done. Updated ${updated} documents.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Normalization failed', err);
  process.exit(1);
});
