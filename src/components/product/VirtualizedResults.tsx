"use client";

import React, { useEffect, useRef } from "react";
import { useInfiniteHits, useInstantSearch } from "react-instantsearch";
import { VirtuosoGrid } from "react-virtuoso";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Star, ShoppingCart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackProductView, trackAddToCart } from "@/lib/analytics";

export const VirtualizedResults = () => {
  const { hits, isLastPage, showMore } = useInfiniteHits();
  const { results } = useInstantSearch();
  
  const loadMore = () => {
    if (!isLastPage) showMore();
  };

  useEffect(() => {
    if (hits.length > 0) {
      hits.forEach((hit) => trackProductView(hit));
    }
  }, [hits]);

  if (results && results.nbHits === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center text-zinc-600">
          🔍
        </div>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No Results Found</p>
        <p className="text-xs text-zinc-600">Try adjusting your filters or broadening your search.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-250px)] w-full">
      <VirtuosoGrid
        data={hits}
        totalCount={results?.nbHits || 0}
        endReached={loadMore}
        overscan={20}
        useWindowScroll={true}
        listClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        itemContent={(index, hit: any) => (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 10) * 0.05 }}
              className="group"
            >
              <GlassCard className="h-full flex flex-col p-4 group-hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5 mb-4 group-hover:scale-[1.02] transition-all duration-500">
                  <img src={hit.image} alt={hit.name} className="object-cover w-full h-full" />
                  {hit.featured && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-[10px] font-black uppercase tracking-widest rounded-md shadow-lg italic">
                      Elite
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold truncate group-hover:text-primary transition-all">{hit.name}</h4>
                    <span className="text-xs font-bold text-primary font-mono">${hit.price}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{hit.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1 text-zinc-500">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-bold">{hit.rating || 0}</span>
                  </div>
                  
                  <MagneticButton 
                    onClick={() => trackAddToCart(hit)}
                    className="h-8 px-4 text-[10px] gap-2"
                  >
                    <ShoppingCart className="h-3 w-3" /> Add
                  </MagneticButton>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>
        )}
        components={{
          Footer: () => (
            <div className="py-10 flex justify-center w-full">
              {!isLastPage && (
                <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-widest">Optimizing Results...</span>
                </div>
              )}
            </div>
          )
        }}
      />
    </div>
  );
};
