import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  category: z.string(),
  stock: z.number().int().nonnegative(),
  reserved_stock: z.number().int().nonnegative().default(0),
  images: z.array(z.string().url()),
  rating: z.number().min(0).max(5).default(0),
  numReviews: z.number().int().nonnegative().default(0),
  featured: z.boolean().default(false),
  _searchFields: z.record(z.string(), z.any()).optional(),
  createdAt: z.any(),
  updatedAt: z.any(),
});

export type Product = z.infer<typeof ProductSchema>;

export const CartItemSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string().url(),
  quantity: z.number().int().positive(),
  addedAt: z.any(),
});

export type CartItem = z.infer<typeof CartItemSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(CartItemSchema),
  totalAmount: z.number().positive(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "PAID",
    "FAILED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  idempotencyKey: z.string(),
  shippingAddress: z.object({
    fullName: z.string(),
    address: z.string(),
    city: z.string(),
    zipCode: z.string(),
    phone: z.string(),
  }),
  createdAt: z.any(),
});

export type Order = z.infer<typeof OrderSchema>;

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  role: z.enum(["CUSTOMER", "ADMIN"]).default("CUSTOMER"),
  wishlist: z.array(z.string()).default([]),
  createdAt: z.any(),
});

export type User = z.infer<typeof UserSchema>;
