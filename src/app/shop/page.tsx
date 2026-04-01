"use client";

import React, { useState, Suspense } from "react";
import { algoliasearch } from "algoliasearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { DiscoverySidebar } from "@/components/product/DiscoverySidebar";
import { VirtualizedResults } from "@/components/product/VirtualizedResults";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { SearchBox } from "react-instantsearch";
import { trackSearch } from "@/lib/analytics";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || ""
);

function ShopContent() {
  const [indexName, setIndexName] = useState("products");
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      trackSearch(query);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
      <InstantSearchNext
        searchClient={searchClient}
        indexName={indexName}
        routing
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <DiscoverySidebar />
          </aside>

          {/* Search Content */}
          <div className="flex-1 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full max-w-md group">
                <SearchBox
                  placeholder="Seach products, gadgets..."
                  classNames={{
                    root: "w-full",
                    form: "relative",
                    input: "w-full bg-card/20 backdrop-blur-md border border-glass-border rounded-xl px-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm",
                    submit: "absolute left-4 top-1/2 -translate-y-1/2",
                    reset: "absolute right-4 top-1/2 -translate-y-1/2",
                    submitIcon: "h-4 w-4 text-zinc-500",
                    resetIcon: "h-3 w-3 text-zinc-400"
                  }}
                />
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto">
                <select
                  onChange={(e) => setIndexName(e.target.value)}
                  className="bg-card/20 border border-glass-border rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  <option value="products">Newest First</option>
                  <option value="products_price_asc">Price: Low to High</option>
                  <option value="products_price_desc">Price: High to Low</option>
                </select>
                
                <button className="md:hidden flex items-center gap-2 bg-card/20 border border-glass-border rounded-lg px-4 py-2 text-xs font-bold uppercase text-zinc-400">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </button>
              </div>
            </header>

            {/* Results Grid */}
            <VirtualizedResults />
          </div>
        </div>
      </InstantSearchNext>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ShopContent />
    </Suspense>
  );
}
