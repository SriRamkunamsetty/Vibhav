import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import algoliasearch from "algoliasearch";
import { z } from "zod";

admin.initializeApp();

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || "";
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY || "";
const ALGOLIA_INDEX_NAME = "products";

const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
const index = client.initIndex(ALGOLIA_INDEX_NAME);

// Strict Schema for Search Indexing
const ProductSyncSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  category: z.string(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()),
  rating: z.number().min(0).max(5),
  numReviews: z.number().int().nonnegative(),
  featured: z.boolean(),
  updatedAt: z.any().optional(),
});

/**
 * Real-time Sync: Triggered on every Firestore Product Write.
 */
export const syncProductToAlgolia = onDocumentWritten("products/{productId}", async (event) => {
  const productId = event.params.productId;
  const snapshot = event.data;
  const db = admin.firestore();

  if (!snapshot) return;

  // Handle Deletion
  if (!snapshot.after.exists) {
    try {
      await index.deleteObject(productId);
      console.log(`✅ Fixed: Product ${productId} deleted from Algolia`);
    } catch (error) {
      console.error(`❌ Algolia Deletion Failed for ${productId}:`, error);
    }
    return;
  }

  // Handle Create/Update
  const rawData = snapshot.after.data();
  if (!rawData) return;

  // 1. STRICT SCHEMA VALIDATION
  const result = ProductSyncSchema.safeParse(rawData);

  if (!result.success) {
    const errorLog = {
      productId,
      errors: result.error.errors,
      payload: rawData,
      failedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    // Log to Firestore for Admin Review
    await db.collection("failed_syncs").doc(productId).set(errorLog);
    console.error(`🛑 Validation Failed for ${productId}. Document stored in failed_syncs.`);
    return;
  }

  const { data } = result;

  try {
    // 2. TRANSFORM FOR SEARCH
    const algoliaObject = {
      objectID: productId,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      image: data.images[0] || "",
      rating: data.rating,
      numReviews: data.numReviews,
      featured: data.featured,
      updatedAt: data.updatedAt?._seconds || Math.floor(Date.now() / 1000),
    };

    await index.saveObject(algoliaObject);
    
    // Cleanup if previously failed
    await db.collection("failed_syncs").doc(productId).delete().catch(() => null);
    
    console.log(`✅ Synced Hardened Product ${productId}`);
  } catch (error) {
    console.error(`❌ Algolia Sync Failed for ${productId}:`, error);
  }
});
