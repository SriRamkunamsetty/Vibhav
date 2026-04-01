import { db } from "@/lib/firebase/config";
import { ProductSchema, Product } from "@/types";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { useState } from "react";

export const useProductCRUD = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = async (data: Partial<Product>) => {
    setLoading(true);
    try {
      const colRef = collection(db, "products");
      await addDoc(colRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: Partial<Product>) => {
    setLoading(true);
    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    try {
      const docRef = doc(db, "products", id);
      await deleteDoc(docRef);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return { addProduct, updateProduct, deleteProduct, loading, error };
};
