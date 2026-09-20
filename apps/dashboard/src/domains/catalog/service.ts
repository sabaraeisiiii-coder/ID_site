/**
 * Catalog domain — service layer.
 * Architecture: Component → Service → Mock Data (current) → API (future).
 */

import { products, categories } from "./mock-data";
import type { Category, Product, SortOption } from "./types";
import { getDiscountPercent, getStockStatus, isOnSale } from "./types";

export interface ProductQuery {
  categoryId?: string;
  search?: string;
  onSale?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
  status?: Product["status"];
}

export interface ProductQueryResult {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function sortItems(items: Product[], sort?: SortOption): Product[] {
  if (!sort) return items;
  const arr = [...items];
  switch (sort) {
    case "newest":
      return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "popular":
      return arr.sort((a, b) => b.ratingCount - a.ratingCount);
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "discount":
      return arr.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
    default: return arr;
  }
}

export const catalogService = {
  async listProducts(query: ProductQuery = {}): Promise<ProductQueryResult> {
    const {
      categoryId, search, onSale, sort, page = 1, pageSize = 12, status = "active",
    } = query;
    let items = products.filter((p) => p.status === status);
    if (categoryId) items = items.filter((p) => p.categoryId === categoryId);
    if (onSale) items = items.filter((p) => isOnSale(p));
    if (search) {
      const q = search.trim().toLowerCase();
      items = items.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.titleLatin?.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q));
    }
    items = sortItems(items, sort);
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    return {
      items: items.slice(start, start + pageSize),
      total, page: safePage, pageSize, totalPages,
    };
  },

  async listFeatured(limit = 8): Promise<Product[]> {
    return products.filter((p) => p.isFeatured).slice(0, limit);
  },
  async listNewArrivals(limit = 8): Promise<Product[]> {
    return products.filter((p) => p.isNew).slice(0, limit);
  },
  async getBySlug(slug: string): Promise<Product | null> {
    return products.find((p) => p.slug === slug) ?? null;
  },
  async getById(id: string): Promise<Product | null> {
    return products.find((p) => p.id === id) ?? null;
  },
  async listRelated(productId: string, limit = 4): Promise<Product[]> {
    const current = products.find((p) => p.id === productId);
    if (!current) return [];
    return products
      .filter((p) => p.id !== productId && p.categoryId === current.categoryId)
      .slice(0, limit);
  },

  async listCategories(): Promise<Category[]> {
    return [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return categories.find((c) => c.slug === slug) ?? null;
  },
  async getCategoryById(id: string): Promise<Category | null> {
    return categories.find((c) => c.id === id) ?? null;
  },

  getStockStatus,
  getDiscountPercent,
  isOnSale,
};
