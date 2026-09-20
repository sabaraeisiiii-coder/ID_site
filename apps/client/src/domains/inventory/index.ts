/** Inventory domain — derived from catalog products. */

import { products } from "@/domains/catalog/mock-data";

export interface InventoryRow {
  productId: string;
  title: string;
  sku: string;
  category: string;
  stock: number;
  threshold: number;
  status: "in" | "low" | "out";
  variants?: { id: string; value: string; stock: number }[];
}

function status(stock: number, threshold: number): "in" | "low" | "out" {
  if (stock <= 0) return "out";
  if (stock <= threshold) return "low";
  return "in";
}

export const inventoryService = {
  async list(): Promise<InventoryRow[]> {
    return products.map((p) => {
      const threshold = p.stockThreshold ?? 8;
      return {
        productId: p.id, title: p.title, sku: p.sku, category: p.category,
        stock: p.stock, threshold, status: status(p.stock, threshold),
        variants: p.variants?.map((v) => ({ id: v.id, value: v.value, stock: v.stock })),
      };
    });
  },
  async lowStock(): Promise<InventoryRow[]> {
    const all = await this.list();
    return all.filter((r) => r.status !== "in");
  },
  async getById(productId: string): Promise<InventoryRow | null> {
    const all = await this.list();
    return all.find((r) => r.productId === productId) ?? null;
  },
};
