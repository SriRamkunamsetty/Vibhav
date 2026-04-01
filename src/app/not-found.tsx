"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Home, Compass, Map } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background overflow-hidden relative">
      {/* Background Anomalies */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute h-[600px] w-[600px] bg-primary/10 rounded-full blur-[120px] -top-40 -left-40 pointer-events-none"
      />
      
      <div className="z-10 w-full max-w-2xl px-4">
        <div className="text-center space-y-12">
          {/* Large Error Indicator */}
          <div className="relative inline-block group">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-[180px] font-black leading-none bg-gradient-to-b from-white to-white/5 bg-clip-text text-transparent group-hover:tracking-widest transition-all duration-700"
            >
              404
            </motion.h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <span className="h-0.5 w-12 bg-primary"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary whitespace-nowrap">Space Anomaly Detected</span>
              <span className="h-0.5 w-12 bg-primary"></span>
            </div>
          </div>

          <div className="space-y-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white uppercase tracking-widest">You've Drifted Off Course</h2>
            <p className="text-sm text-zinc-400 leading-relaxed font-medium">
              The coordinates you provided point to an undiscovered dimension. Return to primary systems to continue your exploration.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button size="lg" className="gap-2 h-14 px-8 rounded-2xl shadow-2xl shadow-primary/20">
                <Home className="h-5 w-5" /> Return Home
              </Button>
            </Link>
            
            <Link href="/shop">
              <Button variant="outline" size="lg" className="gap-2 h-14 px-8 rounded-2xl bg-card/20 backdrop-blur-xl border-glass-border">
                <Compass className="h-5 w-5" /> Explore Shop
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Coordinate Labels */}
      <div className="fixed bottom-12 left-12 flex items-center gap-4 opacity-30 select-none hidden md:flex">
        <Map className="h-4 w-4 text-zinc-500" />
        <div className="space-y-1">
          <p className="text-[8px] font-mono text-zinc-500">LAT: 04° 04' 04" N</p>
          <p className="text-[8px] font-mono text-zinc-500">LNG: 40° 40' 40" W</p>
        </div>
      </div>
    </div>
  );
}
