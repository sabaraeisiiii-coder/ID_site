"use client";

import * as React from "react";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCartStore } from "@/domains/cart/store";
import type { Product } from "../types";

/**
 * AddToCartButton — primary CTA on ProductCard + PDP.
 * Uses the cart store; shows loading + success states.
 * Loading state doesn't change button width.
 */

export interface AddToCartButtonProps {
  product: Product;
  variantId?: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline";
  label?: string;
}

const sizeClass = {
  sm: "h-9 text-sm px-3",
  md: "h-11 text-sm px-4",
  lg: "h-12 text-base px-6",
} as const;

export function AddToCartButton({
  product, variantId, quantity = 1, disabled = false, className, size = "md",
  variant = "solid", label,
}: AddToCartButtonProps) {
  const add = useCartStore((s) => s.add);
  const [state, setState] = React.useState<"idle" | "loading" | "success">("idle");

  const handle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || state !== "idle") return;
    setState("loading");
    await new Promise((r) => setTimeout(r, 350));
    add({
      productId: product.id, variantId, quantity,
      unitPrice: product.price,
      snapshot: {
        title: product.title, slug: product.slug,
        image: product.images[0]?.url,
        variantValue: product.variants?.find((v) => v.id === variantId)?.value,
      },
    });
    setState("success");
    toast.success("به سبد خرید اضافه شد", { description: product.title });
    setTimeout(() => setState("idle"), 1400);
  };

  const isSolid = variant === "solid";
  return (
    <button
      type="button"
      onClick={handle}
      disabled={disabled}
      aria-busy={state === "loading"}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all",
        "disabled:opacity-50 disabled:pointer-events-none",
        sizeClass[size],
        isSolid
          ? "bg-primary text-primary-foreground hover:bg-primary-hover"
          : "border border-border bg-surface text-foreground hover:border-border-strong",
        className,
      )}
      style={{ borderRadius: "var(--radius-md)", transitionDuration: "var(--duration-fast)" }}
    >
      {state === "loading" ? (
        <Loader2 className="size-4 animate-spin" />
      ) : state === "success" ? (
        <Check className="size-4" />
      ) : (
        <ShoppingBag className="size-4" strokeWidth={1.75} />
      )}
      <span>{label ?? (state === "success" ? "اضافه شد" : "افزودن به سبد")}</span>
    </button>
  );
}
