/**
 * Order detail page — Server Component.
 * Fetches order by id, renders a 5-step timeline + items/totals + info cards.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MapPin,
  Truck,
  CreditCard,
  Package,
  User,
  Clock,
  CheckCircle2,
  Circle,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

import { customerService } from "@/domains/customer";
import { orderService } from "@/domains/order";
import { Section, Stack } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";
import { AccountNav } from "@/components/store/account-nav";
import { Separator } from "@/components/ui/separator";
import {
  formatDate,
  formatPrice,
  toPersianDigits,
} from "@/lib/format";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const STEPS = [
  { key: "pending", label: "ثبت سفارش" },
  { key: "paid", label: "پرداخت" },
  { key: "processing", label: "در حال پردازش" },
  { key: "shipped", label: "ارسال شده" },
  { key: "delivered", label: "تحویل شده" },
] as const;

function stepIndex(status: string): number {
  const order: Record<string, number> = {
    pending: 0, paid: 1, processing: 2, shipped: 3, delivered: 4,
    cancelled: -1, refunded: -1,
  };
  const idx = order[status] ?? 0;
  return idx < 0 ? 0 : idx;
}

function InfoCard({
  icon: Icon, title, children,
}: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return (
    <section
      className="bg-surface border border-border p-5"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <header className="flex items-center gap-2 pb-3 mb-3 border-b border-border">
        <span
          className="inline-flex items-center justify-center w-8 h-8"
          style={{
            borderRadius: "var(--radius-md)",
            background: "var(--surface-secondary)",
            color: "var(--foreground-secondary)",
          }}
        >
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function InfoRow({
  label, value, dir, mono,
}: { label: string; value: React.ReactNode; dir?: "ltr" | "rtl"; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-foreground-tertiary">{label}</span>
      <span
        className={`text-sm font-medium text-foreground ${mono ? "font-mono" : ""} nums-persian`}
        dir={dir ?? "rtl"}
      >
        {value}
      </span>
    </div>
  );
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await orderService.getById(id);
  if (!order) notFound();

  const user = await customerService.getCurrent();
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  const currentStep = stepIndex(order.status);
  const isCancelled = order.status === "cancelled" || order.status === "refunded";

  const addressLine = [
    order.address.line1,
    order.address.city,
    order.address.province,
  ].filter(Boolean).join("، ");

  return (
    <main className="bg-background">
      <Section spacing="md" containerSize="default">
        <Stack gap={6}>
          <Breadcrumb
            items={[
              { label: "حساب کاربری", href: "/account" },
              { label: "سفارش‌ها", href: "/account/orders" },
              { label: order.number },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div
                className="sticky top-6 bg-surface border border-border p-4"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <div className="flex items-center gap-3 pb-4 mb-3 border-b border-border">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground text-sm font-semibold"
                    style={{ borderRadius: "var(--radius-full)" }}
                  >
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{user.fullName}</p>
                    <p className="text-xs text-foreground-tertiary truncate">{user.role}</p>
                  </div>
                </div>
                <AccountNav />
              </div>
            </aside>

            {/* Main */}
            <div className="flex flex-col gap-6 min-w-0">
              {/* Header */}
              <div className="flex flex-col gap-3">
                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-1.5 text-xs text-foreground-tertiary hover:text-foreground transition-colors w-fit"
                  style={{ transitionDuration: "var(--duration-fast)" }}
                >
                  <ArrowRight size={14} strokeWidth={1.75} />
                  بازگشت به سفارش‌ها
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold font-mono" dir="ltr">
                      {order.number}
                    </h1>
                    <p className="text-sm text-foreground-secondary nums-persian">
                      ثبت در {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <OrderStatusBadge status={order.status} />
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <section
                className="bg-surface border border-border p-6"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <h2 className="text-sm font-semibold mb-5">مراحل سفارش</h2>
                {isCancelled ? (
                  <div
                    className="flex items-center gap-3 p-4"
                    style={{
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-error-50)",
                      color: "var(--color-error-700)",
                    }}
                  >
                    <RotateCcw size={18} strokeWidth={1.75} />
                    <p className="text-sm font-medium">
                      این سفارش{" "}
                      {order.status === "cancelled" ? "لغو شده" : "بازگشت داده شده"}{" "}
                      است.
                    </p>
                  </div>
                ) : (
                  <ol className="flex items-center justify-between gap-2">
                    {STEPS.map((step, i) => {
                      const done = i < currentStep;
                      const active = i === currentStep;
                      return (
                        <li
                          key={step.key}
                          className="flex-1 flex flex-col items-center text-center relative"
                        >
                          {i < STEPS.length - 1 ? (
                            <span
                              className="absolute top-4 inset-inline-end-1/2 w-full h-0.5 -z-0"
                              style={{
                                background: done
                                  ? "var(--color-success-500)"
                                  : "var(--border)",
                              }}
                            />
                          ) : null}
                          <span
                            className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 mb-2"
                            style={{
                              borderColor: done
                                ? "var(--color-success-500)"
                                : active
                                  ? "var(--primary)"
                                  : "var(--border)",
                              background: done
                                ? "var(--color-success-500)"
                                : active
                                  ? "var(--primary)"
                                  : "var(--surface)",
                              color: done || active
                                ? "var(--surface)"
                                : "var(--foreground-tertiary)",
                            }}
                          >
                            {done ? (
                              <CheckCircle2 size={16} strokeWidth={2.25} />
                            ) : active ? (
                              <Clock size={16} strokeWidth={2.25} />
                            ) : (
                              <Circle size={10} strokeWidth={2} />
                            )}
                          </span>
                          <span
                            className="text-xs font-medium"
                            style={{
                              color: active
                                ? "var(--foreground)"
                                : done
                                  ? "var(--foreground-secondary)"
                                  : "var(--foreground-tertiary)",
                            }}
                          >
                            {step.label}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>

              {/* 2-col grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: items + totals */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <section
                    className="bg-surface border border-border overflow-hidden"
                    style={{ borderRadius: "var(--radius-lg)" }}
                  >
                    <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Package size={16} strokeWidth={1.75} className="text-foreground-secondary" />
                        <h2 className="text-sm font-semibold">اقلام سفارش</h2>
                        <span
                          className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-medium nums-persian"
                          style={{
                            borderRadius: "var(--radius-full)",
                            background: "var(--surface-secondary)",
                            color: "var(--foreground-secondary)",
                          }}
                        >
                          {toPersianDigits(order.items.length)}
                        </span>
                      </div>
                    </header>

                    <ul className="divide-y divide-border">
                      {order.items.map((item, idx) => {
                        const lineTotal = item.unitPrice * item.quantity;
                        return (
                          <li
                            key={`${item.productId}-${idx}`}
                            className="flex items-center gap-4 px-5 py-4"
                          >
                            <div
                              className="shrink-0 h-14 w-14 overflow-hidden bg-surface-secondary"
                              style={{ borderRadius: "var(--radius-md)" }}
                            >
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  width={56}
                                  height={56}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {item.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 mt-0.5">
                                {item.variant ? (
                                  <span className="text-xs text-foreground-tertiary">
                                    {item.variant}
                                  </span>
                                ) : null}
                                <span
                                  className="text-xs text-foreground-tertiary nums-persian font-mono"
                                  dir="ltr"
                                >
                                  {toPersianDigits(item.quantity)} × {formatPrice(item.unitPrice, "")}
                                </span>
                              </div>
                            </div>
                            <div className="text-end shrink-0">
                              <p
                                className="text-sm font-semibold nums-persian"
                                dir="ltr"
                              >
                                {formatPrice(lineTotal)}
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <div
                      className="px-5 py-4"
                      style={{ background: "var(--surface-secondary)" }}
                    >
                      <dl className="flex flex-col gap-2 max-w-xs ms-auto">
                        <div className="flex items-center justify-between text-sm">
                          <dt className="text-foreground-secondary">جمع کل</dt>
                          <dd className="font-medium nums-persian" dir="ltr">
                            {formatPrice(order.subtotal)}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <dt className="text-foreground-secondary">تخفیف</dt>
                          <dd
                            className="font-medium nums-persian"
                            dir="ltr"
                            style={{ color: "var(--color-error-700)" }}
                          >
                            {order.discount > 0 ? "−" : ""}
                            {formatPrice(order.discount)}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <dt className="text-foreground-secondary">هزینه ارسال</dt>
                          <dd className="font-medium nums-persian" dir="ltr">
                            {order.shipping === 0 ? "رایگان" : formatPrice(order.shipping)}
                          </dd>
                        </div>
                        <Separator className="my-1" />
                        <div className="flex items-center justify-between">
                          <dt className="text-sm font-semibold">مبلغ نهایی</dt>
                          <dd className="text-base font-bold nums-persian" dir="ltr">
                            {formatPrice(order.total)}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </section>
                </div>

                {/* Right: info cards */}
                <div className="flex flex-col gap-4">
                  <InfoCard icon={User} title="اطلاعات مشتری">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center text-sm font-semibold"
                        style={{
                          borderRadius: "var(--radius-full)",
                          background: "var(--color-brand-50)",
                          color: "var(--color-brand-700)",
                        }}
                      >
                        {order.customer.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {order.customer.name}
                        </p>
                        {order.customer.email ? (
                          <p className="text-xs text-foreground-tertiary truncate" dir="ltr">
                            {order.customer.email}
                          </p>
                        ) : null}
                      </div>
                    </div>
                    <InfoRow
                      label="شماره تماس"
                      value={toPersianDigits(order.customer.phone)}
                      dir="ltr"
                      mono
                    />
                  </InfoCard>

                  <InfoCard icon={MapPin} title="آدرس تحویل">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-sm font-medium">{order.address.fullName}</p>
                      <p className="text-xs text-foreground-secondary nums-persian" dir="ltr">
                        {toPersianDigits(order.address.phone)}
                      </p>
                      <p className="text-sm text-foreground-secondary leading-6">
                        {addressLine}
                      </p>
                      <p className="text-xs text-foreground-tertiary nums-persian" dir="ltr">
                        کد پستی: {toPersianDigits(order.address.postalCode)}
                      </p>
                    </div>
                  </InfoCard>

                  <InfoCard icon={Truck} title="روش ارسال">
                    <InfoRow label="روش" value={order.shippingMethod} />
                    <InfoRow
                      label="هزینه"
                      value={order.shipping === 0 ? "رایگان" : formatPrice(order.shipping)}
                      dir="ltr"
                    />
                  </InfoCard>

                  <InfoCard icon={CreditCard} title="اطلاعات پرداخت">
                    <InfoRow label="وضعیت" value={<PaymentStatusBadge status={order.paymentStatus} />} />
                    <InfoRow label="درگاه" value="زرین‌پال" />
                    <InfoRow
                      label="کد پیگیری"
                      value={toPersianDigits(`ZP-${order.number.replace("ORD-", "")}91`)}
                      dir="ltr"
                      mono
                    />
                  </InfoCard>
                </div>
              </div>
            </div>
          </div>
        </Stack>
      </Section>
    </main>
  );
}
