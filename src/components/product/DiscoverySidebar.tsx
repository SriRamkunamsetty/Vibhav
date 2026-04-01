"use client";

import React from "react";
import { 
  RefinementList, 
  RangeInput, 
  Menu, 
  ClearRefinements, 
  CurrentRefinements 
} from "react-instantsearch";
import { GlassCard } from "@/components/ui/GlassCard";
import { Filter, Star, ChevronRight } from "lucide-react";

export const DiscoverySidebar = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Filters</h3>
        <ClearRefinements 
          classNames={{
            button: "text-[10px] uppercase font-bold text-zinc-400 hover:text-primary transition-all",
            disabledButton: "hidden"
          }}
        />
      </div>

      <CurrentRefinements 
        classNames={{
          list: "flex flex-wrap gap-2",
          item: "px-2 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] text-primary flex items-center gap-1",
          label: "hidden",
          category: "font-bold",
          delete: "hover:text-white transition-all cursor-pointer"
        }}
      />

      <section className="space-y-4">
        <label className="text-[11px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
          Category <ChevronRight className="h-3 w-3" />
        </label>
        <RefinementList 
          attribute="category"
          classNames={{
            list: "space-y-1",
            item: "group",
            label: "flex items-center gap-3 cursor-pointer py-1.5",
            checkbox: "h-4 w-4 rounded-md border-glass-border bg-card/20 checked:bg-primary transition-all",
            labelText: "text-sm text-zinc-400 group-hover:text-white transition-all",
            count: "ml-auto text-[10px] text-zinc-500 font-mono bg-white/5 px-2 py-0.5 rounded-full"
          }}
        />
      </section>

      <section className="space-y-4">
        <label className="text-[11px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
          Price Range <ChevronRight className="h-3 w-3" />
        </label>
        <RangeInput 
          attribute="price"
          precision={0}
          classNames={{
            form: "flex items-center gap-3",
            input: "w-full h-8 bg-card/20 border border-glass-border rounded-lg px-2 text-xs focus:ring-1 focus:ring-primary outline-none",
            submit: "hidden",
            separator: "text-zinc-600"
          }}
        />
      </section>

      <section className="space-y-4">
        <label className="text-[11px] font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
          Customer Rating <ChevronRight className="h-3 w-3" />
        </label>
        <Menu 
          attribute="rating"
          classNames={{
            list: "space-y-1",
            item: "group",
            label: "flex items-center gap-2 cursor-pointer py-1.5 text-sm text-zinc-400 group-hover:text-white transition-all",
            count: "ml-auto text-[10px] text-zinc-500 font-mono bg-white/5 px-2 py-0.5 rounded-full"
          }}
        />
      </section>
    </div>
  );
};
