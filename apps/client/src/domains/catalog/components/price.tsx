import * as React from "react";
import { cn } from "@/lib/utils";
import { formatPrice, formatNumber, toPersianDigits } from "@/lib/format";

/**
 * Price — semantic price display.
 * Reads from commerce tokens (--price-current, --price-old, --discount-*).
 */

export interface PriceProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  oldValue?: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showOld?: boolean;
  showDiscount?: boolean;
  align?: "start" | "center" | "end";
}

const sizeClass = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
} as const;

export function Price({
  value, oldValue, currency = "تومان", size = "md",
  showOld = true, showDiscount = true, align = "start", className, ...rest
}: PriceProps) {
  const hasOld = !!oldValue && oldValue > value;
  const discount = hasOld ? Math.round(((oldValue! - value) / oldValue!) * 100) : 0;

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-2",
        align === "center" && "justify-center",
        align === "end" && "justify-end",
        className,
      )}
      {...rest}
    >
      <span className={cn("text-price nums-persian", sizeClass[size])}>
        {formatPrice(value, currency)}
      </span>
      {hasOld && showOld ? (
        <span className="text-price-old text-xs sm:text-sm">
          {formatNumber(oldValue!)} {currency}
        </span>
      ) : null}
      {hasOld && showDiscount && discount > 0 ? (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ background: "var(--discount-bg)", color: "var(--discount-text)" }}>
          {toPersianDigits(discount)}٪ تخفیف
        </span>
      ) : null}
    </div>
  );
}
