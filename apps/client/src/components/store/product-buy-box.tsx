"use client";

/**
 * ProductBuyBox — purchase panel for the PDP.
 * Composed from existing catalog components: Price, Rating, StockStatusBadge,
 * WishlistButton, AddToCartButton, QuantitySelector.
 *
 * Variant chips: swatches for colors, text chips for sizes/other.
 * Trust badges row at the bottom.
 */

import * as React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product, ProductVariant } from "@/domains/catalog/types";
import { getDiscountPercent, getStockStatus } from "@/domains/catalog/types";
import { Price, Rating, StockStatusBadge } from "@/domains/catalog/components";
import { WishlistButton, AddToCartButton, QuantitySelector } from "@/domains/catalog/components";

export interface ProductBuyBoxProps {
  product: Product;
  className?: string;
}

export function ProductBuyBox({ product, className }: ProductBuyBoxProps) {
  const stockStatus = getStockStatus(product);
  const inStock = stockStatus !== "out";

  const variants = product.variants ?? [];
  const inStockVariants = variants.filter((v) => v.stock > 0);
  const [selectedVariantId, setSelectedVariantId] = React.useState<string | undefined>(
    inStockVariants[0]?.id ?? variants[0]?.id,
  );
  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const variantMaxStock = selectedVariant ? selectedVariant.stock : product.stock;

  const [qty, setQty] = React.useState(1);
  React.useEffect(() => setQty(1), [selectedVariantId]);

  const discountPercent = getDiscountPercent(product);

  // Group variants by name (color, size, etc.)
  const variantGroups = React.useMemo(() => {
    const map = new Map<string, ProductVariant[]>();
    variants.forEach((v) => {
      const list = map.get(v.name) ?? [];
      list.push(v);
      map.set(v.name, list);
    });
    return Array.from(map.entries());
  }, [variants]);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Brand */}
      <div className="flex items-center gap-2">
        <Link
          href={`/products?brand=${encodeURIComponent(product.brand)}`}
          className="text-xs font-medium uppercase tracking-wider text-foreground-tertiary hover:text-primary transition-colors"
          style={{ transitionDuration: "var(--duration-fast)" }}
        >
          {product.brand}
        </Link>
        <span className="text-foreground-tertiary text-xs">·</span>
        <span className="text-xs text-foreground-tertiary nums-persian font-mono" dir="ltr">
          {product.sku}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
        {product.title}
      </h1>
      {product.titleLatin ? (
        <p className="text-sm text-foreground-tertiary -mt-3" dir="ltr">
          {product.titleLatin}
        </p>
      ) : null}

      {/* Rating + Stock */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Rating value={product.rating} count={product.ratingCount} size="md" />
        <StockStatusBadge status={stockStatus} />
      </div>

      {/* Price */}
      <div
        className="flex items-baseline gap-3 py-4 border-y border-border"
      >
        <Price
          value={product.price}
          oldValue={product.comparePrice}
          size="xl"
          showOld
          showDiscount
        />
        {discountPercent > 0 ? (
          <span className="text-xs text-foreground-tertiary nums-persian ms-auto">
            شما {discountPercent}٪ سود می‌کنید
          </span>
        ) : null}
      </div>

      {/* Short description */}
      <p className="text-sm text-foreground-secondary leading-relaxed">
        {product.description}
      </p>

      {/* Variant chips */}
      {variantGroups.length > 0 ? (
        <div className="flex flex-col gap-3">
          {variantGroups.map(([name, list]) => (
            <div key={name} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-foreground-secondary">
                  {name}:{" "}
                  <span className="text-foreground font-medium">
                    {selectedVariant?.name === name ? selectedVariant.value : list[0]?.value}
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {list.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  const disabled = v.stock <= 0;
                  return v.swatch ? (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => !disabled && setSelectedVariantId(v.id)}
                      disabled={disabled}
                      aria-label={`${name}: ${v.value}`}
                      aria-pressed={isSelected}
                      className={cn(
                        "relative size-9 rounded-full transition-all",
                        "border-2 disabled:opacity-40 disabled:cursor-not-allowed",
                        isSelected ? "border-primary" : "border-border hover:border-border-strong",
                      )}
                      style={{ background: v.swatch }}
                    >
                      {isSelected ? (
                        <span
                          className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-primary"
                          style={{ borderRadius: "var(--radius-full)" }}
                        />
                      ) : null}
                    </button>
                  ) : (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => !disabled && setSelectedVariantId(v.id)}
                      disabled={disabled}
                      aria-label={`${name}: ${v.value}`}
                      aria-pressed={isSelected}
                      className={cn(
                        "inline-flex items-center justify-center min-w-10 h-9 px-3 text-sm font-medium transition-all",
                        "border disabled:opacity-40 disabled:cursor-not-allowed disabled:line-through",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-foreground-secondary hover:border-border-strong hover:text-foreground",
                      )}
                      style={{ borderRadius: "var(--radius-md)" }}
                    >
                      {v.value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Quantity + Add to cart */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-foreground-secondary">تعداد:</span>
          <QuantitySelector
            value={qty}
            min={1}
            max={Math.max(1, variantMaxStock)}
            onChange={setQty}
            size="md"
          />
          {variantMaxStock <= 5 && inStock ? (
            <span
              className="text-xs nums-persian"
              style={{ color: "var(--color-warning-700)" }}
            >
              تنها {variantMaxStock} عدد در انبار باقی مانده
            </span>
          ) : null}
        </div>

        <AddToCartButton
          product={product}
          variantId={selectedVariantId}
          quantity={qty}
          disabled={!inStock}
          size="lg"
          className="w-full"
        />

        <WishlistButton
          productId={product.id}
          variant="text"
          size="md"
          className="self-center"
        />
      </div>

      {/* Trust badges */}
      <div
        className="grid grid-cols-3 gap-2 py-4 border-t border-border"
      >
        <TrustBadge icon={Truck} label="ارسال سریع" sub="۲ تا ۴ روز" />
        <TrustBadge icon={ShieldCheck} label="ضمانت اصالت" sub="تضمین اصلی" />
        <TrustBadge icon={RefreshCw} label="بازگشت ۷ روزه" sub="بدون شرط" />
      </div>
    </div>
  );
}

/* ---------- Trust badge ---------- */
function TrustBadge({
  icon: Icon, label, sub,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  label: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span
        className="inline-flex items-center justify-center size-9"
        style={{
          borderRadius: "var(--radius-full)",
          background: "var(--surface-secondary)",
          color: "var(--foreground-secondary)",
        }}
      >
        <Icon size={16} strokeWidth={1.75} />
      </span>
      <div className="flex flex-col">
        <span className="text-xs font-medium leading-tight">{label}</span>
        <span className="text-[10px] text-foreground-tertiary leading-tight">{sub}</span>
      </div>
    </div>
  );
}
