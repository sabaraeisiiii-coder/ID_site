"use client";

/**
 * MegaMenu — hover dropdown for categories in the desktop header.
 * Lists categories + featured products of the hovered category.
 */

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { catalogService } from "@/domains/catalog/service";
import type { Category, Product } from "@/domains/catalog/types";
import { formatPrice } from "@/lib/format";

export function MegaMenu() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [active, setActive] = React.useState<string | null>(null);
  const [featuredByCat, setFeaturedByCat] = React.useState<Record<string, Product[]>>({});
  const [open, setOpen] = React.useState(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    catalogService.listCategories().then((cats) => {
      setCategories(cats);
      if (cats[0]) setActive(cats[0].id);
    });
  }, []);

  const handleEnterCat = (id: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive(id);
    setOpen(true);
    if (!featuredByCat[id]) {
      catalogService.listProducts({ categoryId: id, pageSize: 3 }).then((res) => {
        setFeaturedByCat((prev) => ({ ...prev, [id]: res.items }));
      });
    }
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };

  return (
    <div className="relative" onMouseLeave={handleLeave}>
      <button
        type="button"
        onMouseEnter={() => handleEnterCat(active ?? categories[0]?.id ?? "")}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-surface-secondary transition-colors"
      >
        دسته‌بندی‌ها
      </button>

      {open && categories.length > 0 ? (
        <div
          onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); }}
          className="absolute top-full mt-2 z-dropdown start-0"
          style={{ zIndex: "var(--z-dropdown)" }}
        >
          <div
            className="grid grid-cols-[200px_1fr] gap-0 w-[680px] bg-surface border border-border shadow-lg overflow-hidden"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            {/* Categories list */}
            <div className="border-e border-border py-2 bg-surface-secondary">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/products?categoryId=${c.id}`}
                  onMouseEnter={() => handleEnterCat(c.id)}
                  className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-surface"
                  style={{
                    background: active === c.id ? "var(--surface)" : "transparent",
                    color: active === c.id ? "var(--foreground)" : "var(--foreground-secondary)",
                  }}
                >
                  <span>{c.name}</span>
                  <span className="text-xs text-foreground-tertiary nums-persian">{c.productCount}</span>
                </Link>
              ))}
            </div>

            {/* Featured products */}
            <div className="p-4">
              <p className="text-xs text-foreground-tertiary uppercase tracking-wider mb-3">
                {categories.find((c) => c.id === active)?.name}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {(featuredByCat[active ?? ""] ?? []).map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="group flex flex-col gap-2"
                    onClick={() => setOpen(false)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-surface-secondary"
                      style={{ borderRadius: "var(--radius-md)" }}>
                      <Image src={p.images[0]?.url ?? ""} alt={p.title} fill
                        sizes="120px" className="object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <p className="text-xs line-clamp-2 leading-snug">{p.title}</p>
                    <p className="text-xs font-semibold text-price nums-persian">{formatPrice(p.price)}</p>
                  </Link>
                ))}
              </div>
              <Link
                href={`/products${active ? `?categoryId=${active}` : ""}`}
                onClick={() => setOpen(false)}
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                مشاهده همه
                <ChevronLeft size={12} />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
