"use client";

import { FadeIn, Floating } from "@/components/animations/MotionProvider";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MoveRight, ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_-20%,var(--accent)_0%,transparent_50%)]" />
      
      <FadeIn className="max-w-4xl text-center space-y-8">
        <Floating>
          <div className="inline-flex items-center space-x-2 rounded-full border border-glass-border bg-glass-bg px-4 py-1 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>VidhavSri | Production-Ready Ecommerce</span>
          </div>
        </Floating>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 drop-shadow-2xl">
          Elegance in <br /> 
          <span className="text-primary italic">Motion.</span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Experience a revolutionary shopping interface designed with antigravity 
          principles. Fast, scalable, and stunning by design.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          <MagneticButton size="lg" className="h-14 px-10 text-lg group">
            Shop Collection 
            <ShoppingBag className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          </MagneticButton>
          
          <MagneticButton variant="outline" size="lg" className="h-14 px-10 text-lg group">
            Admin Panel 
            <MoveRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </MagneticButton>
        </div>
      </FadeIn>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {[
          { title: "Scalable Storefront", desc: "Built with Next.js 15 for infinite speed.", icon: "⚡" },
          { title: "Secure Payments", desc: "Verified Razorpay flow with idempotency safety.", icon: "🛡️" },
          { title: "Real-time Sync", desc: "Algolia index sync via Cloud Tasks.", icon: "🔄" }
        ].map((feature, idx) => (
          <FadeIn key={idx} transition={{ delay: 0.1 * idx }}>
            <GlassCard className="h-full border-t-2 border-t-primary/20 hover:border-t-primary transition-all">
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-zinc-400 text-sm">{feature.desc}</p>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </main>
  );
}
