import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Breadcrumb — RTL-friendly breadcrumb trail.
 * Items: { label, href? }[] — last item is rendered as current (no link).
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Show a leading home icon linking to "/". Default true. */
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showHome = true, className }: BreadcrumbProps) {
  const all: BreadcrumbItem[] = showHome
    ? [{ label: "خانه", href: "/" }, ...items]
    : items;

  return (
    <nav aria-label="مسیر" className={cn("flex items-center flex-wrap gap-1", className)}>
      {all.map((item, i) => {
        const isLast = i === all.length - 1;
        return (
          <span key={i} className="inline-flex items-center gap-1">
            {i === 0 && showHome ? (
              <Home size={12} className="text-foreground-tertiary" strokeWidth={2} />
            ) : null}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-xs text-foreground-tertiary hover:text-foreground transition-colors"
                style={{ transitionDuration: "var(--duration-fast)" }}
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-xs font-medium text-foreground">{item.label}</span>
            )}
            {!isLast ? (
              <ChevronLeft size={12} className="text-foreground-tertiary" strokeWidth={2} />
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
