import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * StatusBadge — generic pill with intent color.
 * Domain-specific badges extend this (OrderStatusBadge, PaymentStatusBadge, ...).
 */

export type BadgeIntent =
  | "neutral" | "primary" | "success" | "warning" | "error" | "info" | "muted";

export interface StatusBadgeProps {
  intent?: BadgeIntent;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const intentStyles: Record<BadgeIntent, React.CSSProperties> = {
  neutral: { background: "var(--surface-secondary)", color: "var(--foreground-secondary)" },
  primary: { background: "var(--color-brand-50)", color: "var(--color-brand-700)" },
  success: { background: "var(--color-success-50)", color: "var(--color-success-700)" },
  warning: { background: "var(--color-warning-50)", color: "var(--color-warning-700)" },
  error: { background: "var(--color-error-50)", color: "var(--color-error-700)" },
  info: { background: "var(--color-info-50)", color: "var(--color-info-700)" },
  muted: { background: "var(--surface-tertiary)", color: "var(--foreground-tertiary)" },
};

export function StatusBadge({
  intent = "neutral", children, className, dot = false,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-max shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium leading-none",
        className,
      )}
      style={intentStyles[intent]}
    >
      {dot ? (
        <span className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: "currentColor", opacity: 0.9 }} />
      ) : null}
      {children}
    </span>
  );
}

/* ---------- Domain-specific status badges ---------- */

export type OrderStatus =
  | "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

const orderStatusMap: Record<OrderStatus, { label: string; intent: BadgeIntent }> = {
  pending: { label: "در انتظار", intent: "warning" },
  paid: { label: "پرداخت شده", intent: "info" },
  processing: { label: "در حال پردازش", intent: "info" },
  shipped: { label: "ارسال شده", intent: "primary" },
  delivered: { label: "تحویل شده", intent: "success" },
  cancelled: { label: "لغو شده", intent: "error" },
  refunded: { label: "بازگشت داده شده", intent: "muted" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = orderStatusMap[status];
  return <StatusBadge intent={cfg.intent} dot>{cfg.label}</StatusBadge>;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

const paymentStatusMap: Record<PaymentStatus, { label: string; intent: BadgeIntent }> = {
  pending: { label: "در انتظار", intent: "warning" },
  paid: { label: "موفق", intent: "success" },
  failed: { label: "ناموفق", intent: "error" },
  refunded: { label: "بازگشت خورده", intent: "muted" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = paymentStatusMap[status];
  return <StatusBadge intent={cfg.intent} dot>{cfg.label}</StatusBadge>;
}

export type EntityStatus = "draft" | "active" | "archived";

const entityStatusMap: Record<EntityStatus, { label: string; intent: BadgeIntent }> = {
  draft: { label: "پیش‌نویس", intent: "muted" },
  active: { label: "فعال", intent: "success" },
  archived: { label: "بایگانی", intent: "neutral" },
};

export function EntityStatusBadge({ status }: { status: EntityStatus }) {
  const cfg = entityStatusMap[status];
  return <StatusBadge intent={cfg.intent} dot>{cfg.label}</StatusBadge>;
}

export type UserStatus = "active" | "suspended" | "pending";

const userStatusMap: Record<UserStatus, { label: string; intent: BadgeIntent }> = {
  active: { label: "فعال", intent: "success" },
  suspended: { label: "معلق", intent: "error" },
  pending: { label: "در انتظار", intent: "warning" },
};

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const cfg = userStatusMap[status];
  return <StatusBadge intent={cfg.intent} dot>{cfg.label}</StatusBadge>;
}

export type StockStatus = "in" | "low" | "out";

const stockStatusMap: Record<StockStatus, { label: string; intent: BadgeIntent }> = {
  in: { label: "موجود", intent: "success" },
  low: { label: "موجودی محدود", intent: "warning" },
  out: { label: "ناموجود", intent: "muted" },
};

export function StockStatusBadge({ status }: { status: StockStatus }) {
  const cfg = stockStatusMap[status];
  return <StatusBadge intent={cfg.intent} dot>{cfg.label}</StatusBadge>;
}
