import * as React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * ErrorState — reusable inline error display.
 * Used by error boundaries and async data fetching wrappers.
 */

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "خطایی رخ داد",
  description = "هنگام بارگذاری این بخش مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className,
      )}
    >
      <span
        className="inline-flex h-14 w-14 items-center justify-center rounded-full mb-4"
        style={{
          background: "var(--color-error-50)",
          color: "var(--color-error-700)",
        }}
      >
        <AlertTriangle size={26} strokeWidth={1.5} />
      </span>
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-sm text-foreground-secondary max-w-sm">{description}</p>
      {onRetry ? (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-5">
          <RotateCcw size={14} className="me-2" />
          تلاش مجدد
        </Button>
      ) : null}
    </div>
  );
}
