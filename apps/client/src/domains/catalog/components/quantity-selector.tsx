import * as React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/format";

/**
 * QuantitySelector — +/- stepper with safe bounds.
 */

export interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
  className?: string;
}

const sizeClass = {
  sm: { btn: "h-8 w-8", input: "h-8 w-10 text-sm", icon: 14 },
  md: { btn: "h-10 w-10", input: "h-10 w-12 text-base", icon: 16 },
} as const;

export function QuantitySelector({
  value, min = 1, max = 99, step = 1, onChange, size = "md", className,
}: QuantitySelectorProps) {
  const cfg = sizeClass[size];
  return (
    <div
      className={cn("inline-flex items-stretch overflow-hidden border border-border", className)}
      style={{ borderRadius: "var(--radius-md)" }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        aria-label="کاهش"
        className={cn(
          "inline-flex items-center justify-center text-foreground-secondary",
          "hover:bg-surface-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none",
          cfg.btn,
        )}
      >
        <Minus size={cfg.icon} strokeWidth={2} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={toPersianDigits(value)}
        readOnly
        aria-label="تعداد"
        className={cn(
          "border-0 bg-surface text-center font-medium text-foreground",
          "border-x border-border focus:outline-none focus:ring-2 focus:ring-primary/30",
          cfg.input,
        )}
        style={{ fontVariantNumeric: "tabular-nums" }}
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
        aria-label="افزایش"
        className={cn(
          "inline-flex items-center justify-center text-foreground-secondary",
          "hover:bg-surface-secondary transition-colors disabled:opacity-40 disabled:pointer-events-none",
          cfg.btn,
        )}
      >
        <Plus size={cfg.icon} strokeWidth={2} />
      </button>
    </div>
  );
}
