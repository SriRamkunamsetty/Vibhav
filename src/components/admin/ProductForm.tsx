"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductSchema, Product } from "@/types";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useProductCRUD } from "@/hooks/useProductCRUD";

type ProductFormValues = Omit<Product, "id" | "createdAt" | "updatedAt">;

interface ProductFormProps {
  initialData?: Product;
  onSuccess: () => void;
}

export const ProductForm = ({ initialData, onSuccess }: ProductFormProps) => {
  const { addProduct, updateProduct, loading } = useProductCRUD();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema.omit({ id: true, createdAt: true, updatedAt: true })) as any,
    defaultValues: initialData || {
      name: "",
      description: "",
      price: 0,
      category: "Electronics",
      stock: 0,
      images: [""],
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (initialData?.id) {
      await updateProduct(initialData.id, data);
    } else {
      await addProduct(data);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 p-4 bg-card/50 rounded-lg">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-zinc-500">Product Name</label>
        <Input {...register("name")} placeholder="Premium Watch..." />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-zinc-500">Description</label>
        <textarea 
          {...register("description")} 
          className="flex min-h-[100px] w-full rounded-md border border-glass-border bg-glass-bg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-md"
          placeholder="Detailed description..."
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-zinc-500">Price ($)</label>
          <Input type="number" {...register("price", { valueAsNumber: true })} />
          {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-zinc-500">Stock</label>
          <Input type="number" {...register("stock", { valueAsNumber: true })} />
          {errors.stock && <p className="text-xs text-red-500">{errors.stock.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-zinc-500">Category</label>
        <select 
          {...register("category")}
          className="flex h-10 w-full rounded-md border border-glass-border bg-glass-bg px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary backdrop-blur-md"
        >
          <option value="Electronics">Electronics</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Fashion">Fashion</option>
          <option value="Home Decor">Home Decor</option>
        </select>
      </div>

      <Button type="submit" className="w-full h-12" disabled={loading}>
        {loading ? "Saving..." : initialData ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
};
