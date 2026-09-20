"use client";

/**
 * OrdersFilterTabs — visual-only filter pill row.
 * Holds local active state but does not filter the list (decorative).
 */

import * as React from "react";
import { cn } from "@/lib/utils";

export type OrdersFilter = "all" | "pending" | "processing" | "shipped" | "delivered";

const FILTERS: { key: OrdersFilter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "pending", label: "در انتظار" },
  { key: "processing", label: "در حال پردازش" },
  { key: "shipped", label: "ارسال شده" },
  { key: "delivered", label: "تحویل شده" },
];

export function OrdersFilterTabs() {
  const [active, setActive] = React.useState<OrdersFilter>("all");

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {FILTERS.map((f) => {
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-surface border border-border text-foreground-secondary hover:text-foreground hover:border-border-strong",
            )}
            style={{
              borderRadius: "var(--radius-full)",
              transitionDuration: "var(--duration-fast)",
            }}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
