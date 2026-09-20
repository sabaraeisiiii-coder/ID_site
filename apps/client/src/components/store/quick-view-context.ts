"use client";

/**
 * QuickView context — separate from the provider to avoid circular imports.
 * product-card.tsx imports this hook; quick-view-provider.tsx provides it.
 */

import * as React from "react";

interface QuickViewContextValue {
  open: boolean;
  openQuickView: (productId: string) => void;
  closeQuickView: () => void;
}

export const QuickViewContext = React.createContext<QuickViewContextValue | null>(null);

export function useQuickView(): QuickViewContextValue {
  const ctx = React.useContext(QuickViewContext);
  if (!ctx) throw new Error("useQuickView must be used inside <QuickViewProvider>");
  return ctx;
}
