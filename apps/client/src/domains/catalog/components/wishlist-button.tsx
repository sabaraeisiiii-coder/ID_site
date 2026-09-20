import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/domains/cart/store";

/**
 * WishlistButton — heart toggle.
 * Uses zustand store; persists to localStorage.
 */

export interface WishlistButtonProps {
  productId: string;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "text";
  className?: string;
}

const sizeMap = { sm: 16, md: 18, lg: 22 } as const;

export function WishlistButton({
  productId, size = "md", variant = "icon", className,
}: WishlistButtonProps) {
  const hasHydrated = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const storedIsWishlisted = useWishlistStore((s) => s.has(productId));
  // Zustand restores localStorage before a client render. Keep the server's
  // deterministic empty-state UI through hydration, then reveal saved state.
  const isWishlisted = hasHydrated && storedIsWishlisted;
  const toggle = useWishlistStore((s) => s.toggle);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
  };

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={handle}
        aria-pressed={isWishlisted}
        className={cn(
          "inline-flex items-center gap-2 text-sm font-medium transition-colors",
          isWishlisted ? "text-primary" : "text-foreground-secondary hover:text-foreground",
          className,
        )}
      >
        <Heart size={sizeMap[size]} strokeWidth={1.75}
          fill={isWishlisted ? "var(--primary)" : "none"}
          style={isWishlisted ? { color: "var(--primary)" } : undefined}
        />
        {isWishlisted ? "در علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={isWishlisted ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      aria-pressed={isWishlisted}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-all",
        "h-9 w-9 bg-surface/95 backdrop-blur border border-border",
        "hover:border-border-hover hover:shadow-sm",
        isWishlisted && "border-primary",
        className,
      )}
    >
      <Heart size={sizeMap[size]} strokeWidth={1.75}
        fill={isWishlisted ? "var(--primary)" : "none"}
        style={isWishlisted ? { color: "var(--primary)" } : { color: "var(--foreground-secondary)" }}
      />
    </button>
  );
}
