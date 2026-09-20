"use client";

/**
 * Cart + Wishlist stores — zustand + persist.
 * Persists to localStorage. Used by cart drawer, cart page, header badge.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./types";

export interface CartState {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, variantId?: string) => void;
  setQuantity: (productId: string, variantId: string | undefined, qty: number) => void;
  increment: (productId: string, variantId?: string) => void;
  decrement: (productId: string, variantId?: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
}

const same = (a: CartItem, productId: string, variantId?: string) =>
  a.productId === productId && a.variantId === variantId;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const idx = s.items.findIndex((x) => same(x, item.productId, item.variantId));
          if (idx >= 0) {
            const next = [...s.items];
            next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
            return { items: next };
          }
          return { items: [item, ...s.items] };
        }),
      remove: (productId, variantId) =>
        set((s) => ({ items: s.items.filter((x) => !same(x, productId, variantId)) })),
      setQuantity: (productId, variantId, qty) =>
        set((s) => ({
          items: s.items.map((x) =>
            same(x, productId, variantId) ? { ...x, quantity: Math.max(1, qty) } : x),
        })),
      increment: (productId, variantId) =>
        set((s) => ({
          items: s.items.map((x) =>
            same(x, productId, variantId) ? { ...x, quantity: x.quantity + 1 } : x),
        })),
      decrement: (productId, variantId) =>
        set((s) => ({
          items: s.items
            .map((x) =>
              same(x, productId, variantId) ? { ...x, quantity: Math.max(0, x.quantity - 1) } : x)
            .filter((x) => x.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, x) => n + x.quantity, 0),
      subtotal: () => get().items.reduce((n, x) => n + x.unitPrice * x.quantity, 0),
    }),
    { name: "ecom.cart", partialize: (s) => ({ items: s.items }) },
  ),
);

export interface WishlistState {
  ids: string[];
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      add: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [id, ...s.ids] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      toggle: (id) =>
        set((s) => s.ids.includes(id)
          ? { ids: s.ids.filter((x) => x !== id) }
          : { ids: [id, ...s.ids] }),
      clear: () => set({ ids: [] }),
    }),
    { name: "ecom.wishlist", partialize: (s) => ({ ids: s.ids }) },
  ),
);
