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

// Copy all docs from sourceCol to targetCol (will skip if target has doc with same id)
async function copyCollection(db, sourceCol, targetCol) {
  const srcRef = db.collection(sourceCol);
  const targetRef = db.collection(targetCol);
  console.log(`Checking source collection '${sourceCol}'`);
  const snapshot = await srcRef.get();
  if (snapshot.empty) {
    console.log(`Source collection '${sourceCol}' is empty or does not exist; skipping.`);
    return;
  }

  console.log(`Found ${snapshot.size} documents in '${sourceCol}'. Copying to '${targetCol}'...`);
  let copied = 0;
  for (const doc of snapshot.docs) {
    const id = doc.id;
    const targetDoc = await targetRef.doc(id).get();
    if (targetDoc.exists) {
      console.log(`- Skipping ${id}: already exists in '${targetCol}'`);
      continue;
    }
    await targetRef.doc(id).set(doc.data());
    copied++;
    console.log(`- Copied ${id}`);
  }
  console.log(`Copied ${copied} docs from '${sourceCol}' to '${targetCol}'.`);
}

async function main() {
  initAdmin();
  const db = admin.firestore();

  // Map of problematic capitalized -> expected lowercase
  const mapping = [
    { src: 'Events', dst: 'events' },
    { src: 'Tickets', dst: 'tickets' },
    { src: 'User_Roles', dst: 'user_roles' },
  ];

  for (const { src, dst } of mapping) {
    try {
      await copyCollection(db, src, dst);
    } catch (err) {
      console.error(`Failed to copy ${src} -> ${dst}:`, err.message);
    }
  }

  console.log('Done. Review your console and Firestore to confirm the new collections.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Copy failed', err);
  process.exit(1);
});
