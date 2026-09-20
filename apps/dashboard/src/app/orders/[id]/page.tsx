import { notFound } from "next/navigation";
import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  Printer,
  Phone,
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
import { Breadcrumb } from "@/components/shared/breadcrumb";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { orderService } from "@/domains/order";
import { paymentService } from "@/domains/payment";
import {
  formatPrice,
  formatDate,
  formatDateShort,
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
    pending: 0,
    paid: 1,
    processing: 2,
    shipped: 3,
    delivered: 4,
    cancelled: -1,
    refunded: -1,
  };
  const idx = order[status] ?? 0;
  return idx < 0 ? 0 : idx;
}

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const order = await orderService.getById(id);
  if (!order) notFound();

  const payment = await paymentService.getByOrder(order.id);
  const currentStep = stepIndex(order.status);
  const isCancelled = order.status === "cancelled" || order.status === "refunded";

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "سفارش‌ها", href: "/orders" },
          { label: order.number },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/orders"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary hover:text-foreground transition-colors"
              aria-label="بازگشت"
            >
              <ArrowRight size={18} strokeWidth={1.75} />
            </Link>
            <h1
              className="text-xl sm:text-2xl font-bold font-mono"
              dir="ltr"
            >
              {order.number}
            </h1>
            <OrderStatusBadge status={order.status} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
          <p className="text-sm text-foreground-secondary">
            ثبت در {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm">
            <Printer size={14} strokeWidth={1.75} />
            چاپ
          </Button>
          <Button size="sm">
            <RotateCcw size={14} strokeWidth={1.75} />
            تغییر وضعیت
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <section
        className="rounded-lg border border-border bg-surface p-6"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <h2 className="text-sm font-semibold mb-5">مراحل سفارش</h2>
        {isCancelled ? (
          <div
            className="flex items-center gap-3 rounded-md p-4"
            style={{
              background: "var(--color-error-50)",
              color: "var(--color-error-700)",
            }}
          >
            <RotateCcw size={18} strokeWidth={1.75} />
            <p className="text-sm font-medium">
              این سفارش {order.status === "cancelled" ? "لغو شده" : "بازگشت داده شده"} است.
            </p>
          </div>
        ) : (
          <ol className="flex items-center justify-between gap-2">
            {STEPS.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <li key={step.key} className="flex-1 flex flex-col items-center text-center relative">
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

      {/* Main 2-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — items + totals (spans 2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <section
            className="rounded-lg border border-border bg-surface overflow-hidden"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <header className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Package size={16} strokeWidth={1.75} className="text-foreground-secondary" />
                <h2 className="text-sm font-semibold">اقلام سفارش</h2>
                <span
                  className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-medium"
                  style={{
                    background: "var(--surface-secondary)",
                    color: "var(--foreground-secondary)",
                  }}
                >
                  {toPersianDigits(order.items.length)}
                </span>
              </div>
            </header>

            {/* Items list */}
            <ul className="divide-y divide-border">
              {order.items.map((item, idx) => {
                const lineTotal = item.unitPrice * item.quantity;
                return (
                  <li
                    key={`${item.productId}-${idx}`}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div
                      className="shrink-0 h-14 w-14 rounded-md overflow-hidden bg-surface-secondary"
                      style={{ borderRadius: "var(--radius-md)" }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        {item.variant ? (
                          <span className="text-xs text-foreground-tertiary">
                            {item.variant}
                          </span>
                        ) : null}
                        <span
                          className="text-xs text-foreground-tertiary font-mono"
                          dir="ltr"
                        >
                          {toPersianDigits(item.quantity)} × {formatPrice(item.unitPrice, "")}
                        </span>
                      </div>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="text-sm font-semibold" dir="ltr">
                        {formatPrice(lineTotal)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Totals */}
            <div className="px-5 py-4 bg-surface-secondary/50">
              <dl className="flex flex-col gap-2 max-w-xs ms-auto">
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-foreground-secondary">جمع کل</dt>
                  <dd className="font-medium" dir="ltr">{formatPrice(order.subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-foreground-secondary">تخفیف</dt>
                  <dd
                    className="font-medium"
                    dir="ltr"
                    style={{ color: "var(--color-error-700)" }}
                  >
                    {order.discount > 0 ? "−" : ""}{formatPrice(order.discount)}
                  </dd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-foreground-secondary">هزینه ارسال</dt>
                  <dd className="font-medium" dir="ltr">
                    {order.shipping === 0 ? "رایگان" : formatPrice(order.shipping)}
                  </dd>
                </div>
                <Separator className="my-1" />
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-semibold">مبلغ نهایی</dt>
                  <dd className="text-base font-bold" dir="ltr">
                    {formatPrice(order.total)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>

        {/* RIGHT — info cards */}
        <div className="space-y-4">
          {/* Customer */}
          <InfoCard icon={User} title="مشتری">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    background: "var(--color-brand-50)",
                    color: "var(--color-brand-700)",
                  }}
                >
                  {order.customer.name.charAt(0)}
                </span>
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/customers?u=${order.customer.id}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate"
                  >
                    {order.customer.name}
                  </Link>
                  <span className="text-xs text-foreground-tertiary" dir="ltr">
                    {order.customer.email ?? "—"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground-secondary">
                <Phone size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
                <span dir="ltr">{order.customer.phone}</span>
              </div>
            </div>
          </InfoCard>

          {/* Address */}
          <InfoCard icon={MapPin} title="آدرس ارسال">
            <div className="flex flex-col gap-2 text-sm">
              <p className="font-medium text-foreground">{order.address.fullName}</p>
              <p className="text-foreground-secondary">{order.address.line1}</p>
              <p className="text-foreground-secondary">
                {order.address.city}، {order.address.province}
              </p>
              <p className="text-xs text-foreground-tertiary font-mono" dir="ltr">
                کد پستی: {order.address.postalCode}
              </p>
            </div>
          </InfoCard>

          {/* Shipping */}
          <InfoCard icon={Truck} title="روش ارسال">
            <div className="flex flex-col gap-1.5 text-sm">
              <p className="font-medium text-foreground">{order.shippingMethod}</p>
              <p className="text-foreground-secondary" dir="ltr">
                {order.shipping === 0 ? "ارسال رایگان" : formatPrice(order.shipping)}
              </p>
            </div>
          </InfoCard>

          {/* Payment */}
          <InfoCard icon={CreditCard} title="پرداخت">
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary">وضعیت</span>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>
              {payment ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-secondary">درگاه</span>
                    <span className="text-foreground">{payment.gateway}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground-secondary">کد پیگیری</span>
                    <Link
                      href={`/payments/${payment.id}`}
                      className="font-mono text-xs text-foreground hover:text-primary transition-colors"
                      dir="ltr"
                    >
                      {payment.reference}
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-xs text-foreground-tertiary">
                  هنوز پرداختی برای این سفارش ثبت نشده است.
                </p>
              )}
            </div>
          </InfoCard>

          {/* Meta */}
          <InfoCard icon={Clock} title="اطلاعات زمانی">
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-foreground-secondary">ثبت سفارش</dt>
                <dd className="text-foreground" dir="ltr">{formatDateShort(order.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-foreground-secondary">ساعت ثبت</dt>
                <dd className="text-foreground" dir="ltr">
                  {toPersianDigits(new Date(order.createdAt).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }))}
                </dd>
              </div>
            </dl>
          </InfoCard>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-lg border border-border bg-surface"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <header className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Icon size={14} strokeWidth={1.75} className="text-foreground-secondary" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
          {title}
        </h3>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}
