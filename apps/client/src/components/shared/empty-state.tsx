import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * EmptyState — reusable empty state for any list/grid.
 * icon + title + description + optional CTA.
 */

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** Size variant — "default" for full-page, "sm" for inline cards. */
  size?: "default" | "sm";
}

export function EmptyState({
  icon: Icon, title, description, action, className, size = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "default" ? "py-16 px-6" : "py-10 px-4",
        className,
      )}
    >
      <span
        className="inline-flex items-center justify-center rounded-full mb-4"
        style={{
          width: size === "default" ? 56 : 40,
          height: size === "default" ? 56 : 40,
          background: "var(--surface-secondary)",
          color: "var(--foreground-tertiary)",
        }}
      >
        <Icon size={size === "default" ? 26 : 20} strokeWidth={1.5} />
      </span>
      <h3 className={cn("font-semibold mb-1", size === "default" ? "text-base" : "text-sm")}>
        {title}
      </h3>
      {description ? (
        <p className="text-sm text-foreground-secondary max-w-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
