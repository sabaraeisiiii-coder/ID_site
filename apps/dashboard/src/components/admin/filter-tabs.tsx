import Link from "next/link";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/format";

/**
 * FilterTabs — visual filter pill bar used at the top of admin lists.
 * Server Component: takes the current active value (from searchParams) + a
 * buildHref function (returns the URL for that filter value).
 */
export interface FilterTabItem {
  label: string;
  value: string;
  count?: number;
}

export interface FilterTabsProps {
  items: FilterTabItem[];
  activeValue: string;
  buildHref: (value: string) => string;
  className?: string;
}

export function FilterTabs({ items, activeValue, buildHref, className }: FilterTabsProps) {
  return (
    <div
      className={cn("flex items-center gap-1 overflow-x-auto", className)}
      role="tablist"
      aria-label="فیلترها"
    >
      {items.map((item) => {
        const active = item.value === activeValue;
        return (
          <Link
            key={item.value}
            href={buildHref(item.value)}
            role="tab"
            aria-selected={active}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground",
            )}
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            <span>{item.label}</span>
            {typeof item.count === "number" ? (
              <span
                className={cn(
                  "inline-flex min-w-5 h-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold",
                  active
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-surface-tertiary text-foreground-tertiary",
                )}
              >
                {toPersianDigits(item.count)}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
