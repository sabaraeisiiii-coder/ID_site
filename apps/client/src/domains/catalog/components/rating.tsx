import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/format";

/**
 * Rating — star rating display + review count.
 * Reads accent color from --primary so it follows the active theme.
 */

export interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

const sizeMap = { sm: 12, md: 16, lg: 20 } as const;

export function Rating({
  value, count, size = "sm", showCount = true, className,
}: RatingProps) {
  const safe = Math.max(0, Math.min(5, value));
  const full = Math.floor(safe);
  const hasHalf = safe - full >= 0.25 && safe - full < 0.75;
  const px = sizeMap[size];

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="inline-flex items-center" role="img" aria-label={`امتیاز ${safe} از ۵`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const isFull = i < full;
          const isHalf = i === full && hasHalf;
          return (
            <span key={i} className="relative inline-block" style={{ width: px, height: px }}>
              <Star className="absolute inset-0" size={px} strokeWidth={1.5}
                style={{ color: "var(--border-strong)", fill: "none" }} />
              {(isFull || isHalf) && (
                isHalf ? (
                  <span className="absolute inset-y-0 inline-block overflow-hidden"
                    style={{ width: px / 2 }} aria-hidden>
                    <Star size={px} strokeWidth={1.5}
                      style={{ color: "var(--primary)", fill: "var(--primary)" }} />
                  </span>
                ) : (
                  <Star className="absolute inset-0" size={px} strokeWidth={1.5}
                    style={{ color: "var(--primary)", fill: "var(--primary)" }} />
                )
              )}
            </span>
          );
        })}
      </div>
      <span className="text-xs text-foreground-secondary nums-persian">
        {toPersianDigits(safe.toFixed(1))}
      </span>
      {showCount && typeof count === "number" ? (
        <span className="text-xs text-foreground-tertiary nums-persian">
          ({toPersianDigits(count)})
        </span>
      ) : null}
    </div>
  );
}
