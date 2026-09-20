import { notFound } from "next/navigation";
import Link from "next/link";
import * as React from "react";
import {
  ArrowRight,
  CreditCard,
  Receipt,
  ShoppingBag,
  CheckCircle2,
  RotateCcw,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { paymentService } from "@/domains/payment";
import {
  formatPrice,
  formatDate,
  toPersianDigits,
} from "@/lib/format";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPaymentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const payment = await paymentService.getById(id);
  if (!payment) notFound();

  // Build timeline of events — last one is "current", earlier are "done"
  const events: { key: string; label: string; date?: string }[] = [
    { key: "created", label: "ایجاد تراکنش", date: payment.createdAt },
  ];

  if (payment.paidAt) {
    events.push({ key: "paid", label: "پرداخت موفق", date: payment.paidAt });
  }

  if (payment.status === "pending") {
    events.push({ key: "pending", label: "در انتظار پرداخت" });
  }

  if (payment.status === "failed") {
    events.push({ key: "failed", label: "پرداخت ناموفق" });
  }

  if (payment.status === "refunded") {
    events.push({ key: "refunded", label: "بازگشت وجه" });
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "پرداخت‌ها", href: "/payments" },
          { label: payment.reference },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/payments"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary hover:text-foreground transition-colors"
            aria-label="بازگشت"
          >
            <ArrowRight size={18} strokeWidth={1.75} />
          </Link>
          <PaymentStatusBadge status={payment.status} />
          <h1
            className="text-lg sm:text-xl font-bold font-mono"
            dir="ltr"
          >
            {payment.reference}
          </h1>
        </div>
        <Button variant="outline" size="sm">
          <Receipt size={14} strokeWidth={1.75} />
          چاپ رسید
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — amount + details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount card */}
          <section
            className="rounded-lg border border-border bg-surface overflow-hidden"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <div
              className="p-6 flex items-center justify-between"
              style={{ background: "var(--surface-secondary)" }}
            >
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-foreground-tertiary">
                  مبلغ تراکنش
                </span>
                <span
                  className="text-3xl font-bold"
                  dir="ltr"
                >
                  {formatPrice(payment.amount)}
                </span>
              </div>
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-md"
                style={{
                  background: "var(--color-brand-50)",
                  color: "var(--color-brand-700)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <CreditCard size={22} strokeWidth={1.75} />
              </span>
            </div>

            {/* Detail rows */}
            <dl className="divide-y divide-border">
              <DetailRow label="کد پیگیری" value={payment.reference} mono />
              <DetailRow label="درگاه پرداخت" value={payment.gateway} />
              {payment.cardPan ? (
                <DetailRow label="شماره کارت" value={payment.cardPan} mono />
              ) : null}
              <DetailRow
                label="تاریخ ایجاد"
                value={`${formatDate(payment.createdAt)} ${toPersianDigits(
                  new Date(payment.createdAt).toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                )}`}
              />
              {payment.paidAt ? (
                <DetailRow
                  label="تاریخ پرداخت"
                  value={`${formatDate(payment.paidAt)} ${toPersianDigits(
                    new Date(payment.paidAt).toLocaleTimeString("fa-IR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  )}`}
                />
              ) : null}
              <DetailRow
                label="وضعیت تراکنش"
                value={
                  <PaymentStatusBadge status={payment.status} />
                }
              />
            </dl>
          </section>

          {/* Transaction timeline */}
          <section
            className="rounded-lg border border-border bg-surface p-6"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <h2 className="text-sm font-semibold mb-4">زمان‌لاین تراکنش</h2>
            <ol className="flex flex-col gap-0">
              {events.map((ev, i) => {
                const isLast = i === events.length - 1;
                const isDone = !isLast;
                const Icon = isDone
                  ? CheckCircle2
                  : ev.key === "refunded" || ev.key === "failed"
                    ? RotateCcw
                    : Clock;
                return (
                  <li
                    key={ev.key}
                    className="flex gap-3 relative"
                  >
                    {!isLast ? (
                      <span
                        className="absolute top-7 bottom-0 inset-inline-start-3 w-0.5"
                        style={{ background: "var(--border)" }}
                      />
                    ) : null}
                    <span
                      className="relative z-10 inline-flex h-6 w-6 items-center justify-center rounded-full shrink-0 mt-0.5"
                      style={{
                        background: isDone
                          ? "var(--color-success-500)"
                          : ev.key === "failed"
                            ? "var(--color-error-500)"
                            : ev.key === "refunded"
                              ? "var(--foreground-tertiary)"
                              : "var(--primary)",
                        color: "var(--surface)",
                      }}
                    >
                      <Icon size={14} strokeWidth={2} />
                    </span>
                    <div className="flex-1 pb-6">
                      <p className="text-sm font-medium text-foreground">
                        {ev.label}
                      </p>
                      {ev.date ? (
                        <p
                          className="text-xs text-foreground-tertiary mt-0.5"
                          dir="ltr"
                        >
                          {formatDate(ev.date)} ·{" "}
                          {toPersianDigits(
                            new Date(ev.date).toLocaleTimeString("fa-IR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                          )}
                        </p>
                      ) : (
                        <p className="text-xs text-foreground-tertiary mt-0.5">
                          در انتظار
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        {/* RIGHT — linked order + meta */}
        <div className="space-y-4">
          <LinkedOrderCard
            orderNumber={payment.orderNumber}
            orderId={payment.orderId}
          />

          <section
            className="rounded-lg border border-border bg-surface"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <header className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <Clock size={14} strokeWidth={1.75} className="text-foreground-secondary" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-secondary">
                متاداده
              </h3>
            </header>
            <dl className="p-4 flex flex-col gap-2.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-foreground-secondary">شناسه پرداخت</dt>
                <dd className="font-mono text-xs text-foreground" dir="ltr">
                  {payment.id}
                </dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="text-foreground-secondary">نوع تراکنش</dt>
                <dd className="text-foreground">پرداخت سفارش</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="text-foreground-secondary">ارز</dt>
                <dd className="text-foreground">تومان</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-3.5">
      <dt className="text-sm text-foreground-secondary">{label}</dt>
      <dd
        className={`text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}
        dir={mono ? "ltr" : undefined}
      >
        {value}
      </dd>
    </div>
  );
}

function LinkedOrderCard({
  orderNumber,
  orderId,
}: {
  orderNumber: string;
  orderId: string;
}) {
  const Icon: LucideIcon = ShoppingBag;
  return (
    <Link
      href={`/orders/${orderId}`}
      className="block rounded-lg border border-border bg-surface p-4 hover:bg-surface-secondary transition-colors group"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-md shrink-0"
          style={{
            background: "var(--color-brand-50)",
            color: "var(--color-brand-700)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-foreground-tertiary">
            سفارش مرتبط
          </p>
          <p className="font-mono text-sm font-medium text-foreground group-hover:text-primary transition-colors" dir="ltr">
            {orderNumber}
          </p>
        </div>
        <ArrowRight
          size={16}
          strokeWidth={1.75}
          className="text-foreground-tertiary group-hover:text-foreground transition-colors shrink-0"
        />
      </div>
    </Link>
  );
}
