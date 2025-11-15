import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Initialize firebase-admin using a safe, runtime-first strategy:
// 1) Use GOOGLE_SERVICE_ACCOUNT_JSON env (JSON string)
// 2) Use GOOGLE_APPLICATION_CREDENTIALS env (path to JSON file)
// 3) Use local serviceAccountKey.json at repo root (convenience for dev)
// 4) Fallback to application default credentials (ADC)

function loadServiceAccountFromFile(filePath: string) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as admin.ServiceAccount;
  } catch (err) {
    return null;
  }
}

let credential: admin.credential.Credential | undefined;

// 1) JSON string in env
if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
  try {
    const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON as string) as admin.ServiceAccount;
    credential = admin.credential.cert(parsed);
  } catch (err) {
    console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', err);
  }
}

// 2) GOOGLE_APPLICATION_CREDENTIALS path
if (!credential && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  const p = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const sa = loadServiceAccountFromFile(p);
  if (sa) credential = admin.credential.cert(sa);
}

// 3) local serviceAccountKey.json at repo root
if (!credential) {
  const possible = path.resolve(process.cwd(), 'serviceAccountKey.json');
  const sa = loadServiceAccountFromFile(possible);
  if (sa) credential = admin.credential.cert(sa);
}

// 4) fallback to application default credentials
if (!credential) {
  console.warn('No Firebase service account JSON found; falling back to application default credentials.');
  credential = admin.credential.applicationDefault();
}

if (!admin.apps.length) {
  admin.initializeApp({ credential });
}

export { admin };
