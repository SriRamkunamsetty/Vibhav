import { 
  collection, 
  query, 
  where, 
  limit, 
  startAfter, 
  getDocs, 
  doc, 
  getDoc,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Product, ProductSchema } from "@/types";

const PRODUCTS_COLLECTION = "products";

export const getProducts = async (
  pageSize: number = 8,
  lastVisible: QueryDocumentSnapshot<DocumentData> | null = null,
  category?: string
) => {
  let q = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy("createdAt", "desc"),
    limit(pageSize)
  );

  if (category && category !== "All") {
    q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("category", "==", category),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
  }

  if (lastVisible) {
    q = query(q, startAfter(lastVisible));
  }

  const querySnapshot = await getDocs(q);
  const products: Product[] = [];
  
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // Validate with Zod
    const result = ProductSchema.safeParse({ id: doc.id, ...data });
    if (result.success) {
      products.push(result.data);
    } else {
      console.error("Product validation failed:", result.error);
    }
  });

  return {
    products,
    lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
  };
};

export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const result = ProductSchema.safeParse({ id: docSnap.id, ...docSnap.data() });
    return result.success ? result.data : null;
  }
  return null;
};

// Bulk Initializer (for demoing 5000+ items scale)
export const bulkInitializeProducts = async (products: Partial<Product>[]) => {
  const batch = writeBatch(db);
  products.forEach((product) => {
    const docRef = doc(collection(db, PRODUCTS_COLLECTION));
    batch.set(docRef, {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
  await batch.commit();
};
