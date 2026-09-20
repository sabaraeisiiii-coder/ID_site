"use client";

/**
 * QuickViewProvider — context + dialog for product quick view.
 * Any component can call `useQuickView().openQuickView(productId)` to open it.
 */

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, X } from "lucide-react";
import {
  Dialog, DialogContent, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { catalogService } from "@/domains/catalog/service";
import { Price, Rating, StockStatusBadge, AddToCartButton, QuantitySelector } from "@/domains/catalog/components";
import { getStockStatus, isOnSale } from "@/domains/catalog/types";
import { QuickViewContext, useQuickView } from "./quick-view-context";

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [productId, setProductId] = React.useState<string | null>(null);

  const value = React.useMemo(
    () => ({
      open,
      openQuickView: (id: string) => { setProductId(id); setOpen(true); },
      closeQuickView: () => setOpen(false),
    }),
    [open],
  );

  return (
    <QuickViewContext.Provider value={value}>
      {children}
      <QuickViewDialog open={open} onOpenChange={setOpen} productId={productId} />
    </QuickViewContext.Provider>
  );
}

export { useQuickView };

function QuickViewDialog({
  open, onOpenChange, productId,
}: { open: boolean; onOpenChange: (v: boolean) => void; productId: string | null }) {
  const [product, setProduct] = React.useState<Awaited<ReturnType<typeof catalogService.getById>> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [variantId, setVariantId] = React.useState<string | undefined>(undefined);
  const [qty, setQty] = React.useState(1);

  React.useEffect(() => {
    if (!open || !productId) { setProduct(null); return; }
    setLoading(true);
    setProduct(null);
    catalogService.getById(productId).then((p) => {
      setProduct(p);
      setVariantId(p?.variants?.[0]?.id);
      setQty(1);
      setLoading(false);
    });
  }, [open, productId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden" showCloseButton={false}>
        <DialogTitle className="sr-only">
          {product?.title ?? "مشاهده سریع محصول"}
        </DialogTitle>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-foreground-tertiary" />
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative aspect-[4/5] md:aspect-auto bg-surface-secondary">
              <Image
                src={product.images[0]?.url ?? ""}
                alt={product.images[0]?.alt ?? product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-foreground-tertiary uppercase tracking-wider">{product.brand}</span>
                <button onClick={() => onOpenChange(false)} aria-label="بستن"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary">
                  <X size={16} />
                </button>
              </div>
              <h2 className="text-xl font-bold leading-tight">{product.title}</h2>
              <Rating value={product.rating} count={product.ratingCount} size="md" />
              <StockStatusBadge status={getStockStatus(product)} />
              <div>
                {isOnSale(product) ? (
                  <Price value={product.price} oldValue={product.comparePrice} size="lg" />
                ) : (
                  <Price value={product.price} size="lg" showOld={false} showDiscount={false} />
                )}
              </div>
              <p className="text-sm text-foreground-secondary leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {product.variants && product.variants.length > 0 ? (
                <div>
                  <p className="text-xs font-medium text-foreground-tertiary mb-2">{product.variants[0].name}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVariantId(v.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium border transition-colors"
                        style={{
                          borderColor: variantId === v.id ? "var(--primary)" : "var(--border)",
                          background: variantId === v.id ? "var(--primary)" : "transparent",
                          color: variantId === v.id ? "var(--primary-foreground)" : "var(--foreground-secondary)",
                        }}
                      >
                        {v.value}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex items-center gap-3 mt-2">
                <QuantitySelector value={qty} onChange={setQty} />
                <AddToCartButton
                  product={product}
                  variantId={variantId}
                  quantity={qty}
                  disabled={getStockStatus(product) === "out"}
                  className="flex-1"
                />
              </div>

              <Separator />
              <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
                <Link href={`/product/${product.slug}`}>مشاهده صفحه کامل محصول</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-foreground-tertiary" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
