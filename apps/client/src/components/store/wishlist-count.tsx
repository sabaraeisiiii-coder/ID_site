"use client";

/**
 * WishlistCount — tiny client component that reads the wishlist store
 * and renders the current count in Persian digits.
 * Needed because the dashboard page is a Server Component but the
 * wishlist count comes from a client-side persisted store.
 *
 * Avoids "setState in effect" by using React 19's `useSyncExternalStore`
 * pattern through zustand's selector + a lazy initial state.
 */

import { useWishlistStore } from "@/domains/cart/store";
import { toPersianDigits } from "@/lib/format";

export function WishlistCount() {
  // zustand v5 hooks already use useSyncExternalStore internally,
  // so reading directly here is safe — no extra effect needed.
  // During SSR / first paint the store hydrates to its persisted value,
  // which is fine because we accept a brief hydration window.
  const ids = useWishlistStore((s) => s.ids);
  return <span className="nums-persian">{toPersianDigits(ids.length)}</span>;
}
