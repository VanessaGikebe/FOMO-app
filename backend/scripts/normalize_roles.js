const admin = require('firebase-admin');
const { join } = require('path');

async function normalizeRole(raw) {
  const r = (raw || '').toString().toLowerCase();
  if (r.includes('organis') || r.includes('organizer') || r.includes('organiser')) return 'organizer';
  if (r.includes('moder')) return 'moderator';
  if (r.includes('experience') || r.includes('seeker') || r.includes('attend') || r.includes('attendee')) return 'attendee';
  return 'attendee';
}

async function main() {
  // Load service account
  const serviceAccount = require(join(__dirname, '..', 'src', 'serviceAccountKey.json'));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

  const db = admin.firestore();
  const usersRef = db.collection('users');

  console.log('Scanning users collection...');
  const snapshot = await usersRef.get();
  console.log(`Found ${snapshot.size} users`);

  let updated = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const rawRole = data.role || data.type || '';
    const norm = await normalizeRole(rawRole);
    if (data.role !== norm) {
      await doc.ref.set({ role: norm }, { merge: true });
      updated += 1;
      console.log(`Updated ${doc.id}: role ${rawRole} -> ${norm}`);
    }
  }

  console.log(`Done. Updated ${updated} documents.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Migration failed', err);
  process.exit(1);
});
