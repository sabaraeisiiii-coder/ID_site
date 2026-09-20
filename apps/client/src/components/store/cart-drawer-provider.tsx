"use client";

/**
 * CartDrawerProvider — context + sheet for the cart drawer.
 * Any component can call `useCart().openCart()` to open the cart drawer.
 */

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/shared/empty-state";
import { useCartStore } from "@/domains/cart/store";
import { QuantitySelector } from "@/domains/catalog/components";
import { formatPrice, formatNumber } from "@/lib/format";

interface CartDrawerContextValue {
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartDrawerContext = React.createContext<CartDrawerContextValue | null>(null);

export function CartDrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(
    () => ({
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      toggleCart: () => setOpen((v) => !v),
    }),
    [open],
  );
  return (
    <CartDrawerContext.Provider value={value}>
      {children}
      <CartSheet open={open} onOpenChange={setOpen} />
    </CartDrawerContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartDrawerContext);
  if (!ctx) throw new Error("useCart must be used inside <CartDrawerProvider>");
  return ctx;
}

function CartSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartStore((s) => s.items.reduce((n, x) => n + x.unitPrice * x.quantity, 0));
  const count = useCartStore((s) => s.items.reduce((n, x) => n + x.quantity, 0));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-5 py-4 border-b border-border shrink-0">
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ShoppingBag size={18} strokeWidth={1.75} />
              سبد خرید
              {count > 0 ? (
                <span className="text-xs text-foreground-tertiary nums-persian">({count} کالا)</span>
              ) : null}
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 overflow-y-auto">
            <EmptyState
              icon={ShoppingBag}
              title="سبد خرید شما خالی است"
              description="برای شروع خرید، محصولات مورد علاقه‌ات را به سبد اضافه کن."
              action={
                <Button asChild onClick={() => onOpenChange(false)}>
                  <Link href="/products">مشاهده محصولات</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex gap-3">
                  <Link
                    href={`/product/${item.snapshot.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="relative shrink-0 w-16 h-20 overflow-hidden bg-surface-secondary"
                    style={{ borderRadius: "var(--radius-md)" }}
                  >
                    {item.snapshot.image ? (
                      <Image src={item.snapshot.image} alt={item.snapshot.title} fill
                        sizes="64px" className="object-cover" />
                    ) : null}
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <Link
                      href={`/product/${item.snapshot.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="text-sm font-medium leading-snug line-clamp-2 hover:text-primary transition-colors"
                    >
                      {item.snapshot.title}
                    </Link>
                    {item.snapshot.variantValue ? (
                      <p className="text-xs text-foreground-tertiary">{item.snapshot.variantValue}</p>
                    ) : null}
                    <p className="text-sm font-semibold text-price nums-persian">
                      {formatPrice(item.unitPrice)}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <QuantitySelector
                        value={item.quantity}
                        size="sm"
                        onChange={(q) => setQuantity(item.productId, item.variantId, q)}
                      />
                      <button
                        type="button"
                        onClick={() => remove(item.productId, item.variantId)}
                        aria-label="حذف"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:text-error transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="shrink-0 border-t border-border p-5 space-y-4 bg-surface">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground-secondary">جمع کل</span>
                <span className="text-lg font-bold text-price nums-persian">{formatPrice(subtotal)}</span>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" onClick={() => onOpenChange(false)}>
                  <Link href="/cart">مشاهده سبد</Link>
                </Button>
                <Button asChild onClick={() => onOpenChange(false)}>
                  <Link href="/checkout">تسویه حساب</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
