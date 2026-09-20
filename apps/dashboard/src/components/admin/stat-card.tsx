import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * StatCard — KPI display card for admin dashboards & reports.
 * Shows label, value, optional icon, optional delta (trend) and description.
 */
export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  /** Visual accent for the icon. Defaults to the primary brand color. */
  intent?: "primary" | "success" | "warning" | "info" | "error";
  /** Accepts a preformatted trend or a numeric percentage for dashboard KPIs. */
  delta?: number | { value: string; trend: "up" | "down" | "neutral" };
  /** Short supporting copy; `description` is retained for existing callers. */
  hint?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export function StatCard({
  label, value, icon: Icon, intent = "primary", delta, hint, description, className,
}: StatCardProps) {
  const trend = normalizeTrend(delta);
  const supportingText = hint ?? description;
  const iconColor = {
    primary: { background: "var(--color-brand-50)", color: "var(--color-brand-700)" },
    success: { background: "var(--color-success-50)", color: "var(--color-success-700)" },
    warning: { background: "var(--color-warning-50)", color: "var(--color-warning-700)" },
    info: { background: "var(--color-info-50)", color: "var(--color-info-700)" },
    error: { background: "var(--color-error-50)", color: "var(--color-error-700)" },
  }[intent];

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-5 flex flex-col gap-3",
        "transition-shadow hover:shadow-sm",
        className,
      )}
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-foreground-secondary">{label}</p>
        {Icon ? (
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0"
            style={{
              ...iconColor,
              borderRadius: "var(--radius-md)",
            }}
          >
            <Icon size={18} strokeWidth={1.75} />
          </span>
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-2xl font-bold leading-none">{value}</p>
        {trend ? (
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className="inline-flex items-center gap-0.5 text-xs font-medium"
              style={{
                color:
                  trend.trend === "up"
                    ? "var(--color-success-700)"
                    : trend.trend === "down"
                      ? "var(--color-error-700)"
                      : "var(--foreground-tertiary)",
              }}
            >
              {trend.trend === "up" ? <TrendingUp size={13} aria-hidden /> : null}
              {trend.trend === "down" ? <TrendingDown size={13} aria-hidden /> : null}
              {trend.trend === "neutral" ? <Minus size={13} aria-hidden /> : null}
              <span>{trend.value}</span>
            </span>
            {supportingText ? (
              <span className="text-xs text-foreground-tertiary">{supportingText}</span>
            ) : null}
          </div>
        ) : supportingText ? (
          <p className="text-xs text-foreground-tertiary mt-1">{supportingText}</p>
        ) : null}
      </div>
    </div>
  );
}

function normalizeTrend(delta: StatCardProps["delta"]): { value: string; trend: "up" | "down" | "neutral" } | null {
  if (delta === undefined) return null;
  if (typeof delta !== "number") return delta;

  return {
    value: `${Math.abs(delta).toLocaleString("fa-IR", { maximumFractionDigits: 1 })}٪`,
    trend: delta > 0 ? "up" : delta < 0 ? "down" : "neutral",
  };
}
