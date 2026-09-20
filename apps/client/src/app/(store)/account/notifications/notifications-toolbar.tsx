"use client";

/**
 * NotificationsToolbar — visual filter tabs + mark-all-read button.
 * Local state for active filter; mark-all-read triggers a toast.
 */

import * as React from "react";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type NotificationFilter =
  | "all" | "unread" | "order" | "payment" | "system";

const FILTERS: { key: NotificationFilter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "unread", label: "خوانده‌نشده" },
  { key: "order", label: "سفارش‌ها" },
  { key: "payment", label: "پرداخت‌ها" },
  { key: "system", label: "سیستم" },
];

export function NotificationsToolbar({ unreadCount }: { unreadCount: number }) {
  const [active, setActive] = React.useState<NotificationFilter>("all");

  function handleMarkAll() {
    toast.success("همه اعلان‌ها خوانده شدند.");
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const isActive = active === f.key;
          const badge =
            f.key === "unread" && unreadCount > 0
              ? ` (${unreadCount})`
              : "";
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setActive(f.key)}
              aria-pressed={isActive}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface border border-border text-foreground-secondary hover:text-foreground hover:border-border-strong",
              )}
              style={{
                borderRadius: "var(--radius-full)",
                transitionDuration: "var(--duration-fast)",
              }}
            >
              {f.label}
              {badge ? (
                <span className="nums-persian opacity-80">{badge}</span>
              ) : null}
            </button>
          );
        })}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleMarkAll}
        disabled={unreadCount === 0}
      >
        <CheckCheck size={14} strokeWidth={1.75} />
        علامت‌گذاری همه به‌عنوان خوانده‌شده
      </Button>
    </div>
  );
}
