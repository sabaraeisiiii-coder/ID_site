"use client";

/**
 * Checkout page — Client Component.
 * 3 steps: address selection + shipping method + coupon.
 * Order summary (sticky right) shows items + subtotal + discount + shipping + total.
 * CTA navigates to /payment/result?status=success&order=ORD-XXXXX (mock).
 */

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin, Truck, Tag, Check, Loader2, Plus, X, ArrowLeft, ShoppingBag, ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Section, Container, Stack, Inline } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { useCartStore } from "@/domains/cart/store";
import { customerService, type Address } from "@/domains/customer";
import { shippingService, type ShippingMethod } from "@/domains/shipping";
import { discountService, type ApplyCouponResult } from "@/domains/discount";
import { formatPrice, toPersianDigits } from "@/lib/format";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce((n, x) => n + x.unitPrice * x.quantity, 0);
  const count = items.reduce((n, x) => n + x.quantity, 0);

  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [shippingMethods, setShippingMethods] = React.useState<ShippingMethod[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedAddressId, setSelectedAddressId] = React.useState<string>("");
  const [selectedShippingId, setSelectedShippingId] = React.useState<string>("");
  const [addAddressOpen, setAddAddressOpen] = React.useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = React.useState("");
  const [couponResult, setCouponResult] = React.useState<ApplyCouponResult | null>(null);
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [appliedCode, setAppliedCode] = React.useState<string>("");

  React.useEffect(() => {
    let mounted = true;
    Promise.all([
      customerService.listAddresses("u1"),
      shippingService.listActive(),
    ]).then(([addrs, methods]) => {
      if (!mounted) return;
      setAddresses(addrs);
      setShippingMethods(methods);
      const defaultAddr = addrs.find((a) => a.isDefault) ?? addrs[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      const cheapestMethod = methods.find((m) => m.price === 0) ?? methods[0];
      if (cheapestMethod) setSelectedShippingId(cheapestMethod.id);
      setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  // Re-validate coupon if subtotal changes
  React.useEffect(() => {
    if (!appliedCode) return;
    discountService.validate(appliedCode, subtotal).then((r) => {
      if (!r.success) {
        setAppliedCode("");
        setCouponResult(null);
      } else {
        setCouponResult(r);
      }
    });
  }, [subtotal, appliedCode]);

  const selectedShipping = shippingMethods.find((m) => m.id === selectedShippingId);
  const shippingPrice = selectedShipping?.price ?? 0;

  const discountAmount = couponResult?.success ? couponResult.discountAmount ?? 0 : 0;
  const total = Math.max(0, subtotal - discountAmount) + shippingPrice;

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

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddAddressOpen(false);
    toast.success("آدرس جدید ثبت شد", { description: "آدرس شما در فهرست آدرس‌ها اضافه شد." });
  };

  const handlePay = () => {
    if (!selectedAddressId) {
      toast.error("یک آدرس انتخاب کنید", { description: "برای ادامه، آدرس تحویل را مشخص کنید." });
      return;
    }
    if (!selectedShippingId) {
      toast.error("روش ارسال انتخاب کنید", { description: "برای ادامه، روش ارسال را مشخص کنید." });
      return;
    }
    const orderNum = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    router.push(`/payment/result?status=success&order=${orderNum}`);
  };

  if (items.length === 0) {
    return (
      <main className="bg-background min-h-screen">
        <Section spacing="md" containerSize="default">
          <Stack gap={6}>
            <Breadcrumb items={[{ label: "تسویه حساب" }]} />
            <div
              className="bg-surface border border-border"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <EmptyState
                icon={ShoppingBag}
                title="سبد خرید شما خالی است"
                description="برای ادامه فرآیند خرید، ابتدا محصولاتی را به سبد اضافه کنید."
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
          <Breadcrumb items={[{ label: "سبد خرید", href: "/cart" }, { label: "تسویه حساب" }]} />

          {/* Header */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">تسویه حساب</h1>
              <p className="text-sm text-foreground-secondary mt-1">
                مراحل تکمیل سفارش را دنبال کنید.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/cart">
                بازگشت به سبد
                <ArrowLeft size={14} />
              </Link>
            </Button>
          </div>

          {/* 2-col grid: steps + summary */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
            {/* Steps column */}
            <Stack gap={5} className="min-w-0">
              {/* Step 1 — Address */}
              <CheckoutStepCard
                step={1}
                icon={MapPin}
                title="انتخاب آدرس"
                description="آدرس تحویل سفارش را انتخاب کنید."
              >
                {loading ? (
                  <SkeletonRows count={2} />
                ) : addresses.length === 0 ? (
                  <div className="text-sm text-foreground-tertiary py-3">
                    هیچ آدرسی ثبت نشده است. یک آدرس جدید اضافه کنید.
                  </div>
                ) : (
                  <RadioGroup
                    value={selectedAddressId}
                    onValueChange={setSelectedAddressId}
                    className="gap-3"
                  >
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        htmlFor={`addr-${addr.id}`}
                        className="flex items-start gap-3 p-4 border border-border cursor-pointer hover:border-border-strong transition-colors"
                        style={{
                          borderRadius: "var(--radius-md)",
                          borderColor: addr.id === selectedAddressId ? "var(--primary)" : undefined,
                          background: addr.id === selectedAddressId ? "var(--color-brand-50)" : undefined,
                          transitionDuration: "var(--duration-fast)",
                        }}
                      >
                        <RadioGroupItem
                          id={`addr-${addr.id}`}
                          value={addr.id}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium">{addr.label}</span>
                            {addr.isDefault ? (
                              <Badge variant="secondary" className="text-[10px]">پیش‌فرض</Badge>
                            ) : null}
                          </div>
                          <p className="text-sm text-foreground mt-0.5">{addr.fullName}</p>
                          <p className="text-xs text-foreground-tertiary mt-1 leading-relaxed">
                            {addr.province}، {addr.city}، {addr.line1}
                            {addr.line2 ? `، ${addr.line2}` : ""}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span
                              className="text-xs nums-persian font-mono"
                              dir="ltr"
                              style={{ color: "var(--foreground-tertiary)" }}
                            >
                              {toPersianDigits(addr.phone)}
                            </span>
                            <span
                              className="text-xs nums-persian font-mono"
                              dir="ltr"
                              style={{ color: "var(--foreground-tertiary)" }}
                            >
                              کد پستی: {toPersianDigits(addr.postalCode)}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 self-start"
                  onClick={() => setAddAddressOpen(true)}
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  <Plus size={14} />
                  افزودن آدرس جدید
                </Button>
              </CheckoutStepCard>

              {/* Step 2 — Shipping */}
              <CheckoutStepCard
                step={2}
                icon={Truck}
                title="روش ارسال"
                description="نحوه ارسال سفارش را انتخاب کنید."
              >
                {loading ? (
                  <SkeletonRows count={3} />
                ) : (
                  <RadioGroup
                    value={selectedShippingId}
                    onValueChange={setSelectedShippingId}
                    className="gap-3"
                  >
                    {shippingMethods.map((m) => (
                      <label
                        key={m.id}
                        htmlFor={`ship-${m.id}`}
                        className="flex items-start gap-3 p-4 border cursor-pointer hover:border-border-strong transition-colors"
                        style={{
                          borderRadius: "var(--radius-md)",
                          borderColor: m.id === selectedShippingId ? "var(--primary)" : undefined,
                          background: m.id === selectedShippingId ? "var(--color-brand-50)" : undefined,
                          transitionDuration: "var(--duration-fast)",
                        }}
                      >
                        <RadioGroupItem
                          id={`ship-${m.id}`}
                          value={m.id}
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0 flex items-start justify-between gap-3 flex-wrap">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{m.name}</span>
                              {m.price === 0 ? (
                                <Badge variant="secondary" className="text-[10px]">رایگان</Badge>
                              ) : null}
                            </div>
                            <p className="text-xs text-foreground-tertiary mt-0.5">{m.description}</p>
                            <p className="text-xs text-foreground-secondary mt-1 nums-persian">
                              زمان تحویل: {m.estimatedDays}
                            </p>
                          </div>
                          <span className="text-sm font-semibold nums-persian mt-0.5">
                            {m.price === 0 ? "رایگان" : formatPrice(m.price)}
                          </span>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                )}
              </CheckoutStepCard>

              {/* Step 3 — Coupon */}
              <CheckoutStepCard
                step={3}
                icon={Tag}
                title="کد تخفیف"
                description="در صورت داشتن کد تخفیف، آن را وارد کنید."
              >
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
                      <Check size={14} style={{ color: "var(--color-success-700)" }} />
                      <span
                        className="text-xs font-medium truncate nums-persian"
                        style={{ color: "var(--color-success-700)" }}
                        dir="ltr"
                      >
                        {appliedCode}
                      </span>
                      <span className="text-xs text-foreground-tertiary">
                        ({formatPrice(couponResult.discountAmount ?? 0)} تخفیف)
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
                )}
                {couponResult && !couponResult.success ? (
                  <p className="text-xs mt-2" style={{ color: "var(--color-error-700)" }}>
                    {couponResult.message}
                  </p>
                ) : null}
              </CheckoutStepCard>
            </Stack>

            {/* Order summary (sticky) */}
            <aside className="lg:sticky lg:top-6">
              <div
                className="bg-surface border border-border p-6"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <Stack gap={4}>
                  <h2 className="text-base font-semibold">خلاصه سفارش</h2>

                  {/* Items list (compact) */}
                  <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pe-1">
                    {items.map((item) => (
                      <Link
                        key={`${item.productId}-${item.variantId ?? ""}`}
                        href={`/product/${item.snapshot.slug}`}
                        className="flex items-center gap-3 group"
                      >
                        <div
                          className="relative shrink-0 w-14 h-14 overflow-hidden bg-surface-secondary"
                          style={{ borderRadius: "var(--radius-md)" }}
                        >
                          {item.snapshot.image ? (
                            <Image
                              src={item.snapshot.image}
                              alt={item.snapshot.title}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors" style={{ transitionDuration: "var(--duration-fast)" }}>
                            {item.snapshot.title}
                          </p>
                          {item.snapshot.variantValue ? (
                            <p className="text-[10px] text-foreground-tertiary mt-0.5">
                              {item.snapshot.variantValue}
                            </p>
                          ) : null}
                          <p className="text-[10px] text-foreground-tertiary nums-persian mt-0.5">
                            {toPersianDigits(item.quantity)} عدد × {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                        <span className="text-xs font-semibold nums-persian shrink-0">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <Separator />

                  <Stack gap={2}>
                    <SummaryRow
                      label={`جمع کالاها (${count} کالا)`}
                      value={formatPrice(subtotal)}
                    />
                    {discountAmount > 0 ? (
                      <SummaryRow
                        label="تخفیف"
                        value={`− ${formatPrice(discountAmount)}`}
                        valueClass="text-price-old"
                      />
                    ) : null}
                    <SummaryRow
                      label="هزینه ارسال"
                      value={
                        shippingPrice === 0 ? "رایگان" : formatPrice(shippingPrice)
                      }
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
                    onClick={handlePay}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ShieldCheck size={16} />
                    )}
                    پرداخت
                  </Button>

                  <p className="text-xs text-foreground-tertiary text-center leading-relaxed">
                    با کلیک روی «پرداخت»، به درگاه بانکی منتقل می‌شوید.
                  </p>
                </Stack>
              </div>
            </aside>
          </div>
        </Stack>
      </Section>

      {/* Add address dialog (visual only) */}
      <Dialog open={addAddressOpen} onOpenChange={setAddAddressOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>افزودن آدرس جدید</DialogTitle>
            <DialogDescription>
              آدرس تحویل جدید را وارد کنید. این فرم نسخه نمایشی است.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAddress} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addr-label">عنوان</Label>
                <Input id="addr-label" placeholder="خانه، محل کار..." required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addr-fullname">نام گیرنده</Label>
                <Input id="addr-fullname" placeholder="نام و نام خانوادگی" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addr-phone">شماره تماس</Label>
                <Input id="addr-phone" dir="ltr" placeholder="09123456789" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addr-postal">کد پستی</Label>
                <Input id="addr-postal" dir="ltr" placeholder="1234567890" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addr-province">استان</Label>
                <Input id="addr-province" placeholder="تهران" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="addr-city">شهر</Label>
                <Input id="addr-city" placeholder="تهران" required />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="addr-line1">نشانی</Label>
              <Input id="addr-line1" placeholder="خیابان، پلاک، واحد" required />
            </div>
            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => setAddAddressOpen(false)}>
                انصراف
              </Button>
              <Button type="submit">ثبت آدرس</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

/* ---------- CheckoutStepCard ---------- */
function CheckoutStepCard({
  step, icon: Icon, title, description, children,
}: {
  step: number;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-surface border border-border p-6"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div className="flex items-start gap-4 pb-5 border-b border-border">
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center justify-center size-10 shrink-0"
            style={{
              borderRadius: "var(--radius-full)",
              background: "var(--color-brand-50)",
              color: "var(--primary)",
            }}
          >
            <Icon size={18} strokeWidth={1.75} />
          </span>
          <span
            className="inline-flex items-center justify-center size-6 text-xs font-bold shrink-0 nums-persian"
            style={{
              borderRadius: "var(--radius-full)",
              background: "var(--surface-secondary)",
              color: "var(--foreground-secondary)",
            }}
          >
            {toPersianDigits(step)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold leading-tight">{title}</h3>
          <p className="text-xs text-foreground-tertiary mt-0.5">{description}</p>
        </div>
      </div>
      <div className="pt-5">{children}</div>
    </div>
  );
}

/* ---------- SkeletonRows ---------- */
function SkeletonRows({ count }: { count: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-20 w-full bg-surface-secondary animate-pulse"
          style={{ borderRadius: "var(--radius-md)" }}
        />
      ))}
    </div>
  );
}

/* ---------- SummaryRow ---------- */
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
