"use client";

import React from "react";
import { motion } from "framer-motion";

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 space-y-12">
      {/* Hero Skeleton */}
      <div className="max-w-4xl space-y-6">
        <div className="h-4 w-32 bg-white/5 rounded-full overflow-hidden relative">
          <Shimmer />
        </div>
        <div className="h-16 w-full max-w-2xl bg-white/5 rounded-2xl overflow-hidden relative">
          <Shimmer />
        </div>
        <div className="h-4 w-full max-w-lg bg-white/5 rounded-full overflow-hidden relative">
          <Shimmer />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 4, 8].map((i) => (
          <div key={i} className="aspect-[4/5] bg-card/20 rounded-3xl border border-glass-border p-4 space-y-4 overflow-hidden relative">
            <div className="aspect-square bg-white/5 rounded-2xl relative overflow-hidden">
              <Shimmer />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 bg-white/5 rounded-full relative overflow-hidden">
                <Shimmer />
              </div>
              <div className="h-3 w-1/2 bg-white/5 rounded-full relative overflow-hidden">
                <Shimmer />
              </div>
            </div>
            <Shimmer />
          </div>
        ))}
      </div>

      {/* Floating System Status */}
      <div className="fixed bottom-8 right-8 flex items-center gap-3 px-4 py-2 bg-card/40 backdrop-blur-xl border border-glass-border rounded-full shadow-2xl">
        <div className="h-2 w-2 bg-primary rounded-full animate-ping" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Synchronizing Environment...</span>
      </div>
    </div>
  );
}

function Shimmer() {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "100%" }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
    />
  );
}
