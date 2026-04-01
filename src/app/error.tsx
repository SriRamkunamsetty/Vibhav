"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log specialized error metrics here
    console.error("🌌 Global System Failure:", error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="max-w-md w-full p-8 text-center space-y-6 border-red-500/20 shadow-2xl shadow-red-500/5">
          <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-widest text-white">System Anomaly</h1>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium capitalize">
              {error.message || "A high-dimensional error has occurred. Our engineering team has been notified."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={reset}
              className="w-full gap-2 bg-red-500 hover:bg-red-600 border-none shadow-lg shadow-red-500/20"
            >
              <RefreshCw className="h-4 w-4" /> Reset Environment
            </Button>
            
            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full gap-2 text-zinc-500 hover:text-white">
                <Home className="h-4 w-4" /> Return to Orbit
              </Button>
            </Link>
          </div>
          
          <p className="text-[10px] text-zinc-600 font-mono italic">
            Digest: {error.digest || "UNIDENTIFIED_FAILURE"}
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
