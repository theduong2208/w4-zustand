import { PRODUCTS as INITIAL_PRODUCTS } from "@/data/products";
import type { Product } from "@/types/product";

export interface ExtendedProduct extends Product {
  stock: number;
  status: "active" | "inactive";
  updatedAt?: string;
  updatedBy?: string;
}

// In-memory data store for server actions and pages
let productsStore: ExtendedProduct[] = INITIAL_PRODUCTS.map((p, idx) => ({
  ...p,
  stock: 15 + idx * 5,
  status: "active" as const,
}));

export function getAllProducts(): ExtendedProduct[] {
  return productsStore;
}

export function getProductById(id: string): ExtendedProduct | undefined {
  return productsStore.find((p) => p.id === id);
}

export function updateStock(id: string, newStock: number, updatedBy: string): ExtendedProduct | null {
  const prod = productsStore.find((p) => p.id === id);
  if (!prod) return null;
  prod.stock = Math.max(0, newStock);
  prod.updatedAt = new Date().toLocaleTimeString("vi-VN");
  prod.updatedBy = updatedBy;
  return prod;
}

export function deleteProduct(id: string): boolean {
  const initialLen = productsStore.length;
  productsStore = productsStore.filter((p) => p.id !== id);
  return productsStore.length < initialLen;
}

export function resetProducts(): void {
  productsStore = INITIAL_PRODUCTS.map((p, idx) => ({
    ...p,
    stock: 15 + idx * 5,
    status: "active" as const,
  }));
}
