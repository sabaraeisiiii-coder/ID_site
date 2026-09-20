import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/format";

/**
 * Pagination — RTL-aware page navigation.
 * Server Component friendly: takes a `buildHref` returning a string URL.
 */

export interface PaginationProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
  /** Max pages to show in the window. Default 5. */
  windowSize?: number;
  className?: string;
}

export function Pagination({
  page, totalPages, buildHref, windowSize = 5, className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Compute the window of pages to show around current.
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, page - half);
  const end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      role="navigation"
      aria-label="صفحه‌بندی"
      className={cn("flex items-center gap-1", className)}
    >
      {/* Prev (RTL: chevron-right pointing to lower page) */}
      <PageLink
        href={hasPrev ? buildHref(page - 1) : undefined}
        ariaLabel="صفحه قبل"
        disabled={!hasPrev}
      >
        <ChevronRight size={16} strokeWidth={2} />
      </PageLink>

      {start > 1 ? (
        <>
          <PageLink href={buildHref(1)}>۱</PageLink>
          {start > 2 ? <span className="px-1 text-foreground-tertiary">…</span> : null}
        </>
      ) : null}

      {pages.map((p) => (
        <PageLink key={p} href={buildHref(p)} active={p === page}>
          {toPersianDigits(p)}
        </PageLink>
      ))}

      {end < totalPages ? (
        <>
          {end < totalPages - 1 ? <span className="px-1 text-foreground-tertiary">…</span> : null}
          <PageLink href={buildHref(totalPages)}>
            {toPersianDigits(totalPages)}
          </PageLink>
        </>
      ) : null}

      <PageLink
        href={hasNext ? buildHref(page + 1) : undefined}
        ariaLabel="صفحه بعد"
        disabled={!hasNext}
      >
        <ChevronLeft size={16} strokeWidth={2} />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href, active, disabled, ariaLabel, children,
}: {
  href?: string;
  active?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const base = cn(
    "inline-flex min-w-9 h-9 items-center justify-center px-2 rounded-md text-sm font-medium transition-colors",
    active
      ? "bg-primary text-primary-foreground"
      : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground",
    disabled && "opacity-40 pointer-events-none",
  );
  if (!href || disabled) {
    return (
      <span className={base} aria-disabled={disabled} aria-label={ariaLabel}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={base} aria-label={ariaLabel} aria-current={active ? "page" : undefined}>
      {children}
    </Link>
  );
}
