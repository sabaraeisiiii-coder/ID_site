"use client";

/**
 * Cart page — Client Component.
 * Uses useCartStore for line items + subtotal.
 * Renders: continue shopping link, 2-col layout (items + summary).
 * Coupon input + apply uses discountService.validate(code, subtotal).
 */

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Trash2, ArrowLeft, Tag, Loader2, X,
} from "lucide-react";
import { toast } from "sonner";

import { Section, Container, Stack, Inline } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/domains/cart/store";
import type { CartItem } from "@/domains/cart/types";
import { QuantitySelector, Price } from "@/domains/catalog/components";
import { discountService, type ApplyCouponResult } from "@/domains/discount";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  const subtotal = items.reduce((n, x) => n + x.unitPrice * x.quantity, 0);
  const count = items.reduce((n, x) => n + x.quantity, 0);

  // Coupon state
  const [couponCode, setCouponCode] = React.useState("");
  const [couponResult, setCouponResult] = React.useState<ApplyCouponResult | null>(null);
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [appliedCode, setAppliedCode] = React.useState<string>("");

  // Reset coupon if subtotal changes (so user re-validates)
  React.useEffect(() => {
    if (appliedCode && couponResult?.success) {
      // re-validate silently
      discountService.validate(appliedCode, subtotal).then((r) => {
        if (!r.success) {
          setAppliedCode("");
          setCouponResult(null);
        } else {
          setCouponResult(r);
        }
      });
    }
  }, [subtotal, appliedCode, couponResult?.success]);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    try {
      const result = await discountService.validate(code, subtotal);
      setCouponResult(result);
      if (result.success) {
        setAppliedCode(code);
        toast.success("کد تخفیف اعمال شد", {
          description: `تخفیف: ${formatPrice(result.discountAmount ?? 0)}`,
        });
      } else {
        toast.error("کد تخفیف نامعتبر است", { description: result.message });
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCode("");
    setCouponResult(null);
    setCouponCode("");
  };

  const handleRemoveItem = (productId: string, variantId: string | undefined, title: string) => {
    remove(productId, variantId);
    toast.success("محصول از سبد حذف شد", { description: title });
  };

  const discountAmount = couponResult?.success ? couponResult.discountAmount ?? 0 : 0;
  const total = Math.max(0, subtotal - discountAmount);

  if (items.length === 0) {
    return (
      <main className="bg-background min-h-screen">
        <Section spacing="md" containerSize="default">
          <Stack gap={6}>
            <Breadcrumb items={[{ label: "سبد خرید" }]} />
            <div
              className="bg-surface border border-border"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <EmptyState
                icon={ShoppingBag}
                title="سبد خرید شما خالی است"
                description="برای شروع خرید، محصولات مورد علاقه‌تان را به سبد اضافه کنید."
                action={
                  <Button asChild size="lg">
                    <Link href="/products">
                      مشاهده محصولات
                      <ArrowLeft size={14} />
                    </Link>
                  </Button>
                }
              />
            </div>
          </Stack>
        </Section>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <Section spacing="md" containerSize="default">
        <Stack gap={6}>
          <Breadcrumb items={[{ label: "سبد خرید" }]} />

          {/* Page header + continue shopping */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">سبد خرید</h1>
              <p className="text-sm text-foreground-secondary mt-1 nums-persian">
                {count} کالا در سبد شما
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/products">
                ادامه خرید
                <ArrowLeft size={14} />
              </Link>
            </Button>
          </div>

          {/* 2-col layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
            {/* Cart items */}
            <div className="flex flex-col gap-3 min-w-0">
              {items.map((item) => (
                <CartLineItem
                  key={`${item.productId}-${item.variantId ?? ""}`}
                  item={item}
                  onSetQuantity={(q) => setQuantity(item.productId, item.variantId, q)}
                  onRemove={() => handleRemoveItem(item.productId, item.variantId, item.snapshot.title)}
                />
              ))}
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-6">
              <div
                className="bg-surface border border-border p-6"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <Stack gap={5}>
                  <h2 className="text-base font-semibold">خلاصه سفارش</h2>

                  {/* Coupon */}
                  {appliedCode && couponResult?.success ? (
                    <div
                      className="flex items-center justify-between gap-2 p-3"
                      style={{
                        borderRadius: "var(--radius-md)",
                        background: "var(--color-success-50)",
                        border: "1px solid var(--color-success-200)",
                      }}
                    >
                      <Inline gap={2} className="min-w-0">
                        <Tag size={14} style={{ color: "var(--color-success-700)" }} />
                        <span
                          className="text-xs font-medium truncate nums-persian"
                          style={{ color: "var(--color-success-700)" }}
                          dir="ltr"
                        >
                          {appliedCode}
                        </span>
                      </Inline>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        aria-label="حذف کد تخفیف"
                        className="inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-surface-secondary"
                        style={{ color: "var(--color-success-700)" }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-foreground-secondary">
                        کد تخفیف دارید؟
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleApplyCoupon();
                            }
                          }}
                          placeholder="مثلاً WELCOME10"
                          dir="ltr"
                          className="text-start font-mono text-sm"
                          style={{ borderRadius: "var(--radius-md)" }}
                          disabled={couponLoading}
                        />
                        <Button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          variant="outline"
                          className="shrink-0"
                        >
                          {couponLoading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            "اعمال"
                          )}
                        </Button>
                      </div>
                      {couponResult && !couponResult.success ? (
                        <p className="text-xs" style={{ color: "var(--color-error-700)" }}>
                          {couponResult.message}
                        </p>
                      ) : null}
                    </div>
                  )}

                  <Separator />

                  {/* Totals */}
                  <Stack gap={3}>
                    <SummaryRow label="جمع کالاها" value={formatPrice(subtotal)} />
                    {discountAmount > 0 ? (
                      <SummaryRow
                        label="تخفیف"
                        value={`− ${formatPrice(discountAmount)}`}
                        valueClass="text-price-old"
                      />
                    ) : null}
                    <SummaryRow
                      label="هزینه ارسال"
                      value={<span className="text-foreground-tertiary">پرداخت در مرحله بعد</span>}
                    />
                  </Stack>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">مبلغ قابل پرداخت</span>
                    <span className="text-xl font-bold nums-persian">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    className="w-full h-12"
                    onClick={() => router.push("/checkout")}
                  >
                    ادامه فرآیند خرید
                    <ArrowLeft size={16} />
                  </Button>

                  {/* Trust note */}
                  <p className="text-xs text-foreground-tertiary text-center leading-relaxed">
                    با ادامه فرآیند خرید، شما{" "}
                    <Link href="/pages/terms" className="hover:underline" style={{ color: "var(--primary)" }}>
                      قوانین فروشگاه
                    </Link>{" "}
                    را می‌پذیرید.
                  </p>
                </Stack>
              </div>
            </aside>
          </div>
        </Stack>
      </Section>
    </main>
  );
}

/* ---------- Cart line item ---------- */

function CartLineItem({
  item, onSetQuantity, onRemove,
}: {
  item: CartItem;
  onSetQuantity: (q: number) => void;
  onRemove: () => void;
}) {
  const lineTotal = item.unitPrice * item.quantity;
  return (
    <div
      className="flex flex-col sm:flex-row gap-4 p-4 bg-surface border border-border"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      {/* Thumbnail */}
      <Link
        href={`/product/${item.snapshot.slug}`}
        className="relative shrink-0 w-full sm:w-24 h-32 sm:h-32 overflow-hidden bg-surface-secondary"
        style={{ borderRadius: "var(--radius-md)" }}
      >
        {item.snapshot.image ? (
          <Image
            src={item.snapshot.image}
            alt={item.snapshot.title}
            fill
            sizes="(max-width: 640px) 100px, 96px"
            className="object-cover"
          />
        ) : null}
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <Link
          href={`/product/${item.snapshot.slug}`}
          className="text-sm sm:text-base font-medium leading-snug line-clamp-2 hover:text-primary transition-colors"
          style={{ transitionDuration: "var(--duration-fast)" }}
        >
          {item.snapshot.title}
        </Link>
        {item.snapshot.variantValue ? (
          <p className="text-xs text-foreground-tertiary">{item.snapshot.variantValue}</p>
        ) : null}

        <div className="mt-auto flex items-end justify-between flex-wrap gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-foreground-tertiary">قیمت واحد:</span>
            <Price value={item.unitPrice} size="sm" showOld={false} showDiscount={false} />
          </div>
          <div className="flex items-center gap-3">
            <QuantitySelector
              value={item.quantity}
              size="sm"
              onChange={onSetQuantity}
            />
            <span className="text-sm font-semibold nums-persian">
              {formatPrice(lineTotal)}
            </span>
            <ConfirmDialog
              trigger={
                <button
                  type="button"
                  aria-label="حذف از سبد"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground-tertiary hover:text-error transition-colors"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  <Trash2 size={16} />
                </button>
              }
              title="حذف از سبد خرید؟"
              description={`«${item.snapshot.title}» از سبد شما حذف می‌شود.`}
              confirmLabel="حذف"
              cancelLabel="انصراف"
              intent="destructive"
              onConfirm={onRemove}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Summary row ---------- */
function SummaryRow({
  label, value, valueClass,
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-foreground-secondary">{label}</span>
      <span className={`text-sm font-medium nums-persian ${valueClass ?? ""}`}>{value}</span>
    </div>
  );
}
