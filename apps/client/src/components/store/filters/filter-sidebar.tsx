"use client";

/**
 * FilterSidebar — storefront product filter panel.
 * Reads current state from `useSearchParams` and pushes updates via `router.push`.
 * Used both as a desktop sidebar (sticky) and inside the mobile Sheet.
 */

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toPersianDigits, formatPrice } from "@/lib/format";
import type { Category } from "@/domains/catalog/types";

export interface FilterSidebarProps {
  categories: Category[];
  brands: string[];
  priceBounds?: { min: number; max: number };
  className?: string;
  onNavigate?: () => void;
}

export function FilterSidebar({
  categories, brands, priceBounds, className, onNavigate,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const selectedCategory = sp.get("categoryId") ?? "";
  const selectedBrands = sp.getAll("brand");
  const onSale = sp.get("onSale") === "true";
  const minPrice = sp.get("minPrice") ?? "";
  const maxPrice = sp.get("maxPrice") ?? "";

  const buildUrl = (updates: Record<string, string | string[] | null>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(updates).forEach(([key, value]) => {
      next.delete(key);
      if (value === null || value === "" || (Array.isArray(value) && value.length === 0)) return;
      if (Array.isArray(value)) value.forEach((v) => next.append(key, v));
      else next.set(key, value);
    });
    if (!("page" in updates)) next.delete("page");
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const pushUpdates = (updates: Record<string, string | string[] | null>) => {
    const href = buildUrl(updates);
    router.push(href, { scroll: false });
    onNavigate?.();
  };

  const toggleBrand = (brand: string) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    pushUpdates({ brand: next });
  };

  const clearAll = () => pushUpdates({
    categoryId: null, brand: null, onSale: null, minPrice: null, maxPrice: null,
  });

  // Selected filter chips
  const chips: { label: string; remove: () => void }[] = [];
  if (selectedCategory) {
    const cat = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);
    chips.push({ label: cat?.name ?? selectedCategory, remove: () => pushUpdates({ categoryId: null }) });
  }
  selectedBrands.forEach((b) =>
    chips.push({ label: b, remove: () => pushUpdates({ brand: selectedBrands.filter((x) => x !== b) }) }));
  if (onSale) chips.push({ label: "تخفیف‌دار", remove: () => pushUpdates({ onSale: null }) });
  if (minPrice) chips.push({ label: `از ${formatPrice(Number(minPrice))}`, remove: () => pushUpdates({ minPrice: null }) });
  if (maxPrice) chips.push({ label: `تا ${formatPrice(Number(maxPrice))}`, remove: () => pushUpdates({ maxPrice: null }) });

  const hasActiveFilter = chips.length > 0;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">فیلترها</h3>
        {hasActiveFilter ? (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs text-foreground-tertiary hover:text-foreground transition-colors"
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            <RotateCcw size={12} strokeWidth={1.75} />
            پاک کردن همه
          </button>
        ) : null}
      </div>

      {/* Active filter chips */}
      {hasActiveFilter ? (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={chip.remove}
              className="inline-flex items-center gap-1 ps-2 pe-1.5 py-1 text-xs font-medium border border-border bg-surface-secondary text-foreground-secondary hover:text-foreground hover:border-border-strong transition-colors"
              style={{ borderRadius: "var(--radius-full)" }}
            >
              {chip.label}
              <X size={11} strokeWidth={2.25} />
            </button>
          ))}
        </div>
      ) : null}

      <Separator />

      {/* Categories */}
      <FilterSection title="دسته‌بندی‌ها">
        <RadioGroup
          value={selectedCategory}
          onValueChange={(v) => pushUpdates({ categoryId: v === "all" ? null : v })}
          className="gap-2"
        >
          <FilterRadioItem value="all" label="همه محصولات" count={undefined} />
          {categories.map((c) => (
            <FilterRadioItem
              key={c.id}
              value={c.id}
              label={c.name}
              count={c.productCount}
            />
          ))}
        </RadioGroup>
      </FilterSection>

      <Separator />

      {/* Price range */}
      <FilterSection title="محدوده قیمت">
        <div className="flex items-center gap-2">
          <PriceInput
            placeholder="از"
            value={minPrice}
            bounds={priceBounds?.min}
            onCommit={(v) => pushUpdates({ minPrice: v || null })}
          />
          <span className="text-foreground-tertiary text-xs">—</span>
          <PriceInput
            placeholder="تا"
            value={maxPrice}
            bounds={priceBounds?.max}
            onCommit={(v) => pushUpdates({ maxPrice: v || null })}
          />
        </div>
      </FilterSection>

      <Separator />

      {/* On sale */}
      <FilterSection title="پیشنهادها">
        <label className="flex items-center gap-2.5 cursor-pointer text-sm group">
          <Checkbox
            checked={onSale}
            onCheckedChange={(v) => pushUpdates({ onSale: v ? "true" : null })}
          />
          <span className="text-foreground-secondary group-hover:text-foreground transition-colors" style={{ transitionDuration: "var(--duration-fast)" }}>
            فقط محصولات تخفیف‌دار
          </span>
        </label>
      </FilterSection>

      {brands.length > 0 ? (
        <>
          <Separator />
          <FilterSection title="برندها">
            <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pe-1">
              {brands.map((brand) => {
                const checked = selectedBrands.includes(brand);
                return (
                  <label
                    key={brand}
                    className="flex items-center gap-2.5 cursor-pointer text-sm group"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleBrand(brand)}
                    />
                    <span
                      className={cn(
                        "text-foreground-secondary transition-colors",
                        "group-hover:text-foreground",
                      )}
                      style={{ transitionDuration: "var(--duration-fast)" }}
                    >
                      {brand}
                    </span>
                  </label>
                );
              })}
            </div>
          </FilterSection>
        </>
      ) : null}
    </div>
  );
}

/* ---------- Section ---------- */
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">{title}</h4>
      {children}
    </div>
  );
}

/* ---------- Radio item with count ---------- */
function FilterRadioItem({
  value, label, count,
}: { value: string; label: string; count?: number }) {
  return (
    <Label
      htmlFor={`filter-cat-${value}`}
      dir="ltr"
      className="flex items-center gap-2 cursor-pointer py-0.5 text-sm font-normal group"
    >
      <RadioGroupItem id={`filter-cat-${value}`} value={value} className="shrink-0" />
      {typeof count === "number" ? (
        <span className="min-w-6 shrink-0 text-left text-xs text-foreground-tertiary nums-persian">
          {toPersianDigits(count)}
        </span>
      ) : null}
      <span
        dir="rtl"
        title={label}
        className="min-w-0 flex-1 truncate text-right text-foreground-secondary transition-colors group-hover:text-foreground"
        style={{ transitionDuration: "var(--duration-fast)" }}
      >
        {label}
      </span>
    </Label>
  );
}

/* ---------- Price input ---------- */
function PriceInput({
  value, placeholder, bounds, onCommit,
}: {
  value: string;
  placeholder: string;
  bounds?: number;
  onCommit: (v: string) => void;
}) {
  const [local, setLocal] = React.useState(value);
  React.useEffect(() => setLocal(value), [value]);

  const handleBlur = () => {
    if (local === value) return;
    const num = Number(local.replace(/[^\d]/g, ""));
    onCommit(Number.isFinite(num) && num > 0 ? String(num) : "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <Input
      inputMode="numeric"
      dir="ltr"
      value={local ? toPersianDigits(local) : ""}
      placeholder={placeholder}
      onChange={(e) => setLocal(e.target.value.replace(/[^\d۰-۹]/g, ""))}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="text-start font-mono text-xs h-9"
      style={{ borderRadius: "var(--radius-md)" }}
      aria-label={`${placeholder} قیمت`}
      max={bounds}
    />
  );
}

// Re-export so consumers can clear links to /products
export function ClearFiltersLink({ children }: { children: React.ReactNode }) {
  return <Link href="/products">{children}</Link>;
}

void Button;
