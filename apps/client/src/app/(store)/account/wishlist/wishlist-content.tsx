"use client";

/**
 * WishlistContent — client component for the wishlist page.
 * Reads wishlist IDs from the persisted store, fetches products on mount,
 * renders ProductGrid + clear-all + empty state.
 */

import * as React from "react";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useWishlistStore } from "@/domains/cart/store";
import { catalogService } from "@/domains/catalog/service";
import type { Product } from "@/domains/catalog/types";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { ProductGrid } from "@/components/store/product-grid";
import { Button } from "@/components/ui/button";

export function WishlistContent() {
  const ids = useWishlistStore((s) => s.ids);
  const clear = useWishlistStore((s) => s.clear);

  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  // Defer rendering until after hydration so the persisted store has
  // reloaded from localStorage.
  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    let active = true;
    if (!mounted) return;

    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(ids.map((id) => catalogService.getById(id)))
      .then((results) => {
        if (!active) return;
        const filtered = results.filter((p): p is Product => p !== null);
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setProducts([]);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ids, mounted]);

  const showEmpty = mounted && !loading && products.length === 0;
  const showList = mounted && !loading && products.length > 0;

  function handleClearAll() {
    clear();
    toast.success("لیست علاقه‌مندی‌ها پاک شد.");
  }

  return (
    <div className="flex flex-col gap-6 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl sm:text-2xl font-bold">علاقه‌مندی‌های من</h1>
          <p className="text-sm text-foreground-secondary">
            محصولات مورد علاقه‌ات اینجا ذخیره می‌شن.
          </p>
        </div>
        {showList ? (
          <ConfirmDialog
            trigger={
              <Button type="button" variant="outline" size="sm">
                <Trash2 size={14} strokeWidth={1.75} />
                حذف همه
              </Button>
            }
            title="پاک کردن لیست علاقه‌مندی‌ها؟"
            description="همه محصولات از لیست علاقه‌مندی‌های شما حذف می‌شوند."
            confirmLabel="حذف همه"
            intent="destructive"
            onConfirm={handleClearAll}
          />
        ) : null}
      </div>

      {/* Loading skeleton */}
      {mounted && loading ? <LoadingSkeleton variant="grid" count={8} /> : null}

      {/* Empty state */}
      {showEmpty ? (
        <div
          className="bg-surface border border-border"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={Heart}
            title="لیست علاقه‌مندی‌های شما خالی است"
            description="محصولات مورد علاقه‌ات اینجا ذخیره می‌شن."
            action={
              <Button asChild>
                <Link href="/products">
                  <Heart size={16} strokeWidth={1.75} />
                  مشاهده محصولات
                </Link>
              </Button>
            }
          />
        </div>
      ) : null}

      {/* Wishlist grid */}
      {showList ? <ProductGrid products={products} /> : null}
    </div>
  );
}
