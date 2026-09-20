import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProductBadge } from "../types";

/**
 * ProductBadgePill — sale/new/bestseller/limited/featured/out pill.
 * Reads theme tokens for surface/foreground colors.
 */

export interface ProductBadgePillProps {
  badge: ProductBadge;
  className?: string;
}

const defaults: Record<ProductBadge["type"], { label: string; style: React.CSSProperties }> = {
  new: { label: "جدید", style: { background: "var(--color-info-50)", color: "var(--color-info-700)" } },
  sale: { label: "تخفیف", style: { background: "var(--discount-bg)", color: "var(--discount-text)" } },
  bestseller: { label: "پرفروش", style: { background: "var(--color-warning-50)", color: "var(--color-warning-700)" } },
  limited: { label: "محدود", style: { background: "var(--color-error-50)", color: "var(--color-error-700)" } },
  out: { label: "ناموجود", style: { background: "var(--stock-out-bg)", color: "var(--stock-out-text)" } },
  featured: { label: "ویژه", style: { background: "var(--color-brand-50)", color: "var(--color-brand-700)" } },
};

export function ProductBadgePill({ badge, className }: ProductBadgePillProps) {
  const cfg = defaults[badge.type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium leading-none",
        className,
      )}
      style={cfg.style}
    >
      {badge.label ?? cfg.label}
    </span>
  );
}
