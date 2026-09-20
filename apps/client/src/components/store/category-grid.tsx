import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Grid } from "@/design-system/primitives";
import { toPersianDigits } from "@/lib/format";
import type { Category } from "@/domains/catalog/types";

/**
 * CategoryGrid — homepage category showcase.
 * Responsive: 2 cols mobile → 3 cols tablet → 6 cols desktop.
 * Each card: square image with hover scale + name + product count.
 */
export interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (!categories || categories.length === 0) return null;
  return (
    <Grid cols={2} colsMd={3} colsLg={6} gap={4}>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`/products?categoryId=${c.id}`}
          className="group flex flex-col gap-3 text-center"
        >
          <div
            className="relative aspect-square overflow-hidden bg-surface-secondary"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            {c.image ? (
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform group-hover:scale-[1.06]"
                style={{ transitionDuration: "var(--duration-normal)" }}
              />
            ) : null}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 55%, color-mix(in oklab, var(--background) 80%, transparent) 100%)",
              }}
              aria-hidden
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
              {c.name}
            </span>
            {typeof c.productCount === "number" ? (
              <span className="text-xs text-foreground-tertiary nums-persian">
                {toPersianDigits(c.productCount)} محصول
              </span>
            ) : null}
          </div>
        </Link>
      ))}
    </Grid>
  );
}
