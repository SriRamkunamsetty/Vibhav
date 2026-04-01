import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

/**
 * VidhavSri Bulk Product Uploader
 * 
 * Usage:
 * 1. Place 'serviceAccountKey.json' in the root directory.
 * 2. Run: npx tsx scripts/bulkUpload.ts
 */

const BATCH_SIZE = 500;
const COLLECTION_ID = 'products';
const DATA_PATH = path.join(__dirname, 'products_10k.json');
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('❌ Error: serviceAccountKey.json not found in root directory.');
  console.log('Please download it from Firebase Console -> Project Settings -> Service Accounts.');
  process.exit(1);
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadInBatches(data: any[]) {
  const totalCount = data.length;
  let successCount = 0;
  let failureCount = 0;

  console.log(`🚀 Starting bulk upload of ${totalCount} products...`);

  for (let i = 0; i < totalCount; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = data.slice(i, i + BATCH_SIZE);

    chunk.forEach((item) => {
      // Use existing ID if provided, or generate new doc UID
      const docRef = item.id 
        ? db.collection(COLLECTION_ID).doc(item.id) 
        : db.collection(COLLECTION_ID).doc();
      
      const { id, ...rest } = item;
      batch.set(docRef, {
        ...rest,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    });

    try {
      await commitWithRetry(batch);
      successCount += chunk.length;
      console.log(`✅ Processed: ${successCount}/${totalCount} (${Math.round((successCount/totalCount)*100)}%)`);
    } catch (error) {
      console.error(`❌ Batch failed at index ${i}:`, error);
      failureCount += chunk.length;
    }
  }

  console.log('\n--- Final Result ---');
  console.log(`Total: ${totalCount}`);
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failureCount}`);
  console.log('--------------------');
}

async function commitWithRetry(batch: admin.firestore.WriteBatch, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await batch.commit();
      return;
    } catch (error) {
      if (attempt === retries) throw error;
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⚠️ Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

// Read and Parse Data
try {
  const rawData = fs.readFileSync(DATA_PATH, 'utf8');
  const products = JSON.parse(rawData);
  uploadInBatches(products);
} catch (error) {
  console.error('❌ Failed to read or parse products_5k.json:', error);
}
