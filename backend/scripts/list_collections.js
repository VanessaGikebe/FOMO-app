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
  // 1) GOOGLE_SERVICE_ACCOUNT_JSON
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({ credential: admin.credential.cert(parsed) });
      return;
    } catch (err) {
      console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', err.message);
    }
  }

  // 2) GOOGLE_APPLICATION_CREDENTIALS path
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const p = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const sa = loadServiceAccountFromFile(p);
    if (sa) {
      admin.initializeApp({ credential: admin.credential.cert(sa) });
      return;
    }
  }

  // 3) repo-level serviceAccountKey.json
  const possible = path.resolve(process.cwd(), 'serviceAccountKey.json');
  const possible2 = path.resolve(__dirname, '..', 'src', 'serviceAccountKey.json');
  let sa = loadServiceAccountFromFile(possible) || loadServiceAccountFromFile(possible2);
  if (sa) {
    admin.initializeApp({ credential: admin.credential.cert(sa) });
    return;
  }

  // 4) fallback to ADC
  console.warn('No service account JSON found locally; falling back to Application Default Credentials.');
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}

async function main() {
  initAdmin();
  const db = admin.firestore();

  console.log('Listing top-level collections...');
  const collections = await db.listCollections();
  if (!collections.length) {
    console.log('(no root collections found)');
  }
  for (const col of collections) {
    console.log('- ' + col.id);
  }

  // Print a sample doc for the main collections this app expects
  const expected = ['users', 'events', 'favourites'];
  for (const colName of expected) {
    try {
      const colRef = db.collection(colName);
      const snapshot = await colRef.limit(1).get();
      if (snapshot.empty) {
        console.log(`\nCollection '${colName}' exists but is empty (no sample doc).`);
      } else {
        const doc = snapshot.docs[0];
        console.log(`\nSample document from '${colName}' (id=${doc.id}):`);
        console.log(JSON.stringify(doc.data(), null, 2));
      }
    } catch (err) {
      console.log(`\nCould not read collection '${colName}': ${err.message}`);
    }
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to list collections:', err);
  process.exit(1);
});
