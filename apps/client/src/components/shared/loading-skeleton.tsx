import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * LoadingSkeleton — preset skeleton layouts for common page patterns.
 * Variants: "page" (full page chrome), "grid" (product grid), "table", "card".
 */

export interface LoadingSkeletonProps {
  variant?: "page" | "grid" | "table" | "card" | "detail";
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = "page", count = 8, className,
}: LoadingSkeletonProps) {
  if (variant === "grid") {
    return (
      <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-[4/5] w-full rounded-lg" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-3", className)}>
        <Skeleton className="h-10 w-full rounded-md" />
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("rounded-lg border border-border p-5 space-y-3", className)}>
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8", className)}>
        <Skeleton className="aspect-[4/5] w-full rounded-lg" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  // "page" — full chrome
  return (
    <div className={cn("min-h-[60vh] flex items-center justify-center", className)}>
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
