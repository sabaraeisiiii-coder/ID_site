"use client";

/**
 * SortSelect — sort dropdown for the products listing.
 * Updates `?sort=` query param via router.push.
 */

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SortSelectProps {
  className?: string;
}

const OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "popular", label: "محبوب‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
  { value: "discount", label: "بیشترین تخفیف" },
];

export function SortSelect({ className }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const current = sp.get("sort") ?? "newest";

  const handleChange = (next: string) => {
    const params = new URLSearchParams(sp.toString());
    if (next === "newest" || !next) params.delete("sort");
    else params.set("sort", next);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="text-xs text-foreground-tertiary hidden sm:inline">مرتب‌سازی:</span>
      <Select value={current} onValueChange={handleChange}>
        <SelectTrigger
          size="sm"
          className="h-9 min-w-40 bg-surface border-border"
          style={{ borderRadius: "var(--radius-md)" }}
          aria-label="مرتب‌سازی"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
