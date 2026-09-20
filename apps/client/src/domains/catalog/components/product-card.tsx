"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "../types";
import { getDiscountPercent, getStockStatus, isOnSale } from "../types";
import { Price } from "./price";
import { Rating } from "./rating";
import { StockStatusBadge } from "./stock-badge";
import { ProductBadgePill } from "./product-badge";
import { WishlistButton } from "./wishlist-button";
import { AddToCartButton } from "./add-to-cart-button";
import { useQuickView } from "@/components/store/quick-view-context";
import { LiquidImageFrame } from "@/components/shared/liquid-image-frame";

/**
 * ProductCard — the core commerce card.
 * Composed of primitives. All visuals come from theme tokens.
 * Image ratio defaults to 4:5.
 * Hover: image scale 1.03 + secondary image reveal + quick actions.
 */

export interface ProductCardProps {
  product: Product;
  className?: string;
  imageRatio?: "4:5" | "1:1" | "3:4";
  hoverSwap?: boolean;
  showAddToCart?: boolean;
  showQuickView?: boolean;
}

const ratioMap = {
  "4:5": "aspect-[4/5]",
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
} as const;

export function ProductCard({
  product, className, imageRatio = "4:5",
  hoverSwap = true, showAddToCart = true, showQuickView = true,
}: ProductCardProps) {
  const stock = getStockStatus(product);
  const onSale = isOnSale(product);
  const href = `/product/${product.slug}`;
  const { openQuickView } = useQuickView();

  const primaryImg = product.images[0];
  const secondaryImg =
    hoverSwap && product.images[1] && product.images[1].isSecondary
      ? product.images[1] : null;

  return (
    <article
      className={cn("group relative flex flex-col transition-all", className)}
      style={{ transitionDuration: "var(--duration-normal)" }}
    >
      <LiquidImageFrame className={cn("relative", ratioMap[imageRatio])}>
      <Link
        href={href}
        className="relative block h-full overflow-hidden bg-surface-secondary"
        style={{ borderRadius: "var(--radius-lg)" }}
        aria-label={product.title}
      >
        {primaryImg ? (
          <Image
            src={primaryImg.url}
            alt={primaryImg.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform group-hover:scale-[1.03]"
            style={{ transitionDuration: "var(--duration-normal)" }}
          />
        ) : null}
        {secondaryImg ? (
          <Image
            src={secondaryImg.url}
            alt={secondaryImg.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 transition-opacity group-hover:opacity-100"
            style={{ transitionDuration: "var(--duration-normal)" }}
          />
        ) : null}

        {/* Badges */}
        {product.badges && product.badges.length > 0 ? (
          <div className="absolute top-3 inset-inline-3 flex flex-col gap-1.5 items-start z-10">
            {product.badges.slice(0, 2).map((b, i) => (
              <ProductBadgePill key={i} badge={b} />
            ))}
          </div>
        ) : null}

        {/* Wishlist */}
        <div className="absolute top-3 inset-inline-end-3 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <WishlistButton productId={product.id} size="sm" />
        </div>

        {/* Quick view overlay */}
        {showQuickView && stock !== "out" ? (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); openQuickView(product.id); }}
            className={cn(
              "absolute bottom-3 inset-inline-3 z-10",
              "inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium",
              "bg-surface/95 backdrop-blur border border-border text-foreground",
              "hover:bg-surface hover:border-border-strong transition-all",
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-2 sm:group-hover:translate-y-0",
            )}
            style={{ borderRadius: "var(--radius-md)" }}
            aria-label="مشاهده سریع"
          >
            <Eye size={14} strokeWidth={1.75} />
            مشاهده سریع
          </button>
        ) : null}

        {/* Stock badge if out/low */}
        {stock !== "in" ? (
          <div className="absolute bottom-3 inset-inline-3 z-10">
            <StockStatusBadge status={stock} />
          </div>
        ) : null}
      </Link>
      </LiquidImageFrame>

      {/* Content */}
      <div className="flex flex-col gap-2 pt-3 sm:pt-4">
        <div className="flex items-center justify-between text-xs text-foreground-tertiary">
          <span className="truncate">{product.brand}</span>
          <span className="nums-persian truncate">{product.sku}</span>
        </div>

        <h3 className="text-sm sm:text-base font-medium leading-snug line-clamp-2 min-h-[2.6em]">
          <Link
            href={href}
            className="text-foreground hover:text-primary transition-colors"
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            {product.title}
          </Link>
        </h3>

        <Rating value={product.rating} count={product.ratingCount} size="sm" />

        <div className="mt-1">
          {stock === "out" ? (
            <span className="text-sm text-foreground-tertiary">ناموجود</span>
          ) : onSale ? (
            <Price value={product.price} oldValue={product.comparePrice} size="md" />
          ) : (
            <Price value={product.price} size="md" showOld={false} showDiscount={false} />
          )}
        </div>

        {showAddToCart ? (
          <div className="mt-3">
            <AddToCartButton product={product} disabled={stock === "out"} className="w-full" />
          </div>
        ) : null}
      </div>
    </article>
  );
}
