"use client";

/**
 * MobileFiltersButton — opens a Sheet containing the FilterSidebar.
 * Shows a count badge for the number of active filters.
 */

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { FilterSidebar } from "./filter-sidebar";
import { toPersianDigits } from "@/lib/format";
import type { Category } from "@/domains/catalog/types";
import { cn } from "@/lib/utils";

export interface MobileFiltersButtonProps {
  categories: Category[];
  brands: string[];
  priceBounds?: { min: number; max: number };
  className?: string;
}

export function MobileFiltersButton({
  categories, brands, priceBounds, className,
}: MobileFiltersButtonProps) {
  const [open, setOpen] = React.useState(false);
  const sp = useSearchParams();

  const activeCount = React.useMemo(() => {
    let n = 0;
    if (sp.get("categoryId")) n += 1;
    n += sp.getAll("brand").length;
    if (sp.get("onSale") === "true") n += 1;
    if (sp.get("minPrice")) n += 1;
    if (sp.get("maxPrice")) n += 1;
    return n;
  }, [sp]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("relative lg:hidden", className)}
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <SlidersHorizontal size={16} strokeWidth={1.75} />
          فیلترها
          {activeCount > 0 ? (
            <span
              className="inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none nums-persian"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {toPersianDigits(activeCount)}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-sm p-0 flex flex-col">
        <SheetHeader className="px-5 py-4 border-b border-border shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <SlidersHorizontal size={16} strokeWidth={1.75} />
            فیلترها
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-5">
          <FilterSidebar
            categories={categories}
            brands={brands}
            priceBounds={priceBounds}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
