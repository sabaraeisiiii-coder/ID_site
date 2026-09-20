import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * PageHeader — title + description + optional actions row.
 * Used at the top of every admin page + most storefront pages.
 */

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title, description, eyebrow, actions, className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-medium text-foreground-tertiary uppercase tracking-wider mb-1">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-xl sm:text-2xl font-bold leading-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-foreground-secondary mt-1">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2 shrink-0">{actions}</div>
      ) : null}
    </div>
  );
}
