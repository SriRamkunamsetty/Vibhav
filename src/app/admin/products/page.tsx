"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Product, ProductSchema } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Edit, Trash2, Plus, Download, Filter, Loader2 } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useProductCRUD } from "@/hooks/useProductCRUD";

const columnHelper = createColumnHelper<Product>();

export default function AdminProductsPage() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { deleteProduct } = useProductCRUD();

  // Real-time Subscriptions for 5000+ items (with limit for initial view)
  useEffect(() => {
    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc"),
      limit(100) // Initial limit, can be expanded or paginated
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const products: Product[] = [];
      snapshot.forEach((doc) => {
        const result = ProductSchema.safeParse({ id: doc.id, ...doc.data() });
        if (result.success) products.push(result.data);
      });
      setData(products);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[80px] block">{info.getValue()}</span>,
      }),
      columnHelper.accessor("name", {
        header: "Product",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => <span className="font-bold text-primary">${info.getValue()}</span>,
      }),
      columnHelper.accessor("stock", {
        header: "Stock",
        cell: (info) => (
          <span className={info.getValue() < 10 ? "text-red-400 font-bold" : "text-zinc-400"}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:text-red-400"
              onClick={() => deleteProduct(info.row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    [deleteProduct]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 60,
    overscan: 20,
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-zinc-400 animate-pulse">Loading Inventory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card/30 p-4 rounded-xl border border-glass-border backdrop-blur-md">
        <div className="flex gap-4">
          <Button variant="secondary" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="secondary" className="gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
        
        <MagneticButton className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </MagneticButton>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div ref={tableContainerRef} className="max-h-[600px] overflow-auto relative">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-20 bg-card border-b border-glass-border shadow-md">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            
            <tbody className="relative" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                  <tr
                    key={row.id}
                    className="absolute w-full border-b border-glass-border/50 hover:bg-white/5 transition-all group"
                    style={{
                      top: 0,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm align-middle h-[60px]">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && (
            <div className="px-6 py-20 text-center text-zinc-500">
              No products found. Start by adding one or using the bulk uploader.
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
