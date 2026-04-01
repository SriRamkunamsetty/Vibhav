"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Upload, FileJson, FileSpreadsheet, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import { db } from "@/lib/firebase/config";
import { collection, writeBatch, doc, serverTimestamp } from "firebase/firestore";

const BATCH_SIZE = 500;

export const BulkUploadUI = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus("uploading");
    setProgress(0);

    const isJson = file.name.endsWith(".json");
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        let products: any[] = [];
        
        if (isJson) {
          products = JSON.parse(event.target?.result as string);
        } else {
          const results = Papa.parse(event.target?.result as string, { header: true, dynamicTyping: true });
          products = results.data;
        }

        await processUpload(products);
        setStatus("success");
      } catch (err: any) {
        setErrorMessage(err.message);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const processUpload = async (data: any[]) => {
    const total = data.length;
    const colRef = collection(db, "products");

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const chunk = data.slice(i, i + BATCH_SIZE);

      chunk.forEach((item) => {
        const docRef = doc(colRef); // Generate new ID
        batch.set(docRef, {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      setProgress(Math.round(((i + chunk.length) / total) * 100));
    }
  };

  return (
    <GlassCard className="max-w-2xl mx-auto p-10 border-dashed border-2 border-primary/20 hover:border-primary/50 transition-all bg-card/20">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
          <Upload className="h-10 w-10 text-primary" />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bulk Product Ingestion</h2>
          <p className="text-zinc-400 mt-2">Upload your inventory in JSON or CSV format (max 5000 items per file).</p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700 text-[10px] text-zinc-400">
            <FileJson className="h-3 w-3" /> JSON Format
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700 text-[10px] text-zinc-400">
            <FileSpreadsheet className="h-3 w-3" /> CSV Format
          </div>
        </div>

        {status === "idle" && (
          <div className="relative group">
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Button size="lg" className="h-12 px-10">Select Data File</Button>
          </div>
        )}

        {status === "uploading" && (
          <div className="w-full space-y-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-zinc-500">
              <span>Optimizing Batches...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-primary animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs font-medium">Syncing with Firestore & Algolia</span>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto" />
            <p className="text-green-400 font-bold">Successfully ingested inventory!</p>
            <Button variant="outline" onClick={() => setStatus("idle")}>Upload more</Button>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-red-500 font-bold">Upload Failed</p>
            <p className="text-xs text-zinc-500">{errorMessage}</p>
            <Button variant="outline" onClick={() => setStatus("idle")}>Try again</Button>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
