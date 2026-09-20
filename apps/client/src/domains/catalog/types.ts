/**
 * Catalog domain — types for products, categories, brands.
 */

export type ProductStatus = "active" | "draft" | "archived";
export type StockStatus = "in" | "low" | "out";
export type SortOption =
  | "newest" | "popular" | "price-asc" | "price-desc" | "discount";

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isSecondary?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  swatch?: string;
  stock: number;
  priceDelta?: number;
}

export interface ProductAttribute {
  label: string;
  value: string;
}

export type BadgeType = "new" | "sale" | "bestseller" | "limited" | "out" | "featured";

export interface ProductBadge {
  type: BadgeType;
  label?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  titleLatin?: string;
  description: string;
  brand: string;
  category: string;
  categoryId: string;
  price: number;
  comparePrice?: number;
  currency?: string;
  sku: string;
  status: ProductStatus;
  stock: number;
  stockThreshold?: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  rating: number;
  ratingCount: number;
  badges?: ProductBadge[];
  isFeatured?: boolean;
  isNew?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  parentId: string | null;
  image?: string;
  productCount?: number;
  status: "active" | "draft";
  order?: number;
}

export function getStockStatus(p: Product): StockStatus {
  if (p.stock <= 0) return "out";
  if (p.stockThreshold && p.stock <= p.stockThreshold) return "low";
  return "in";
}

export function getDiscountPercent(p: Product): number {
  if (!p.comparePrice || p.comparePrice <= p.price) return 0;
  return Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100);
}

export function isOnSale(p: Product): boolean {
  return !!p.comparePrice && p.comparePrice > p.price;
}
