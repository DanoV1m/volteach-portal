import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Resolve Firebase Service Account
let serviceAccount = null;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (err) {
    console.error('Failed to parse service account JSON from environment:', err);
  }
} else {
  // Look for a local service account key for local testing
  const localKeyPath = path.join(__dirname, '../../serviceAccountKey.json');
  if (fs.existsSync(localKeyPath)) {
    try {
      const rawKey = fs.readFileSync(localKeyPath, 'utf8');
      serviceAccount = JSON.parse(rawKey);
    } catch (e) {
      console.error('Failed to read local serviceAccountKey.json:', e);
    }
  }
}

if (!serviceAccount) {
  console.error('Error: Firebase service account credentials not found.');
  console.error('Please set FIREBASE_SERVICE_ACCOUNT env var or place serviceAccountKey.json in the project root.');
  process.exit(1);
}

// Initialize Admin App
const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

// Helpers for CSV writing with UTF-8 BOM
const BOM = '\uFEFF';

function escapeCSV(val) {
  if (val === undefined || val === null) return '';
  let str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    str = str.replace(/"/g, '""');
    return `"${str}"`;
  }
  return str;
}

async function syncUsers() {
  console.log('Fetching users from Firestore...');
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  
  let csvContent = BOM + 'UID,שם מלא,אימייל,מוסד לימודים,תאריך רישום\n';
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const createdDate = data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : '';
    csvContent += [
      escapeCSV(data.uid),
      escapeCSV(data.displayName),
      escapeCSV(data.email),
      escapeCSV(data.institutionKey || ''),
      escapeCSV(createdDate)
    ].join(',') + '\n';
  });

  const destPath = path.join(__dirname, '../../admin_database/users_registry.csv');
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.writeFileSync(destPath, csvContent, 'utf8');
  console.log(`Users synced successfully. Written to ${destPath}`);
}

async function syncResources() {
  console.log('Fetching community resources from Firestore...');
  const resRef = db.collection('community_resources');
  const snapshot = await resRef.get();
  
  let csvContent = BOM + 'מזהה קובץ,כותרת,מוסד,קורס,קטגוריה,קישור לדרייב,הצבעות,מעלה,תאריך העלאה\n';
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const createdDate = data.createdAt ? new Date(data.createdAt.seconds * 1000).toISOString() : '';
    csvContent += [
      escapeCSV(data.id),
      escapeCSV(data.title),
      escapeCSV(data.institutionKey),
      escapeCSV(data.courseTitle),
      escapeCSV(data.category),
      escapeCSV(data.webViewLink),
      escapeCSV(data.upvotes || 0),
      escapeCSV(data.contributorName),
      escapeCSV(createdDate)
    ].join(',') + '\n';
  });

  const destPath = path.join(__dirname, '../../admin_database/resources_registry.csv');
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.writeFileSync(destPath, csvContent, 'utf8');
  console.log(`Resources synced successfully. Written to ${destPath}`);
}

async function run() {
  try {
    await syncUsers();
    await syncResources();
    console.log('Synchronization complete.');
    process.exit(0);
  } catch (err) {
    console.error('Synchronization failed:', err);
    process.exit(1);
  }
}

run();
