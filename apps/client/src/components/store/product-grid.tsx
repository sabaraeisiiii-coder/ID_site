import * as React from "react";
import { Grid } from "@/design-system/primitives";
import { ProductCard } from "@/domains/catalog/components";
import type { Product } from "@/domains/catalog/types";

/**
 * ProductGrid — responsive grid of ProductCards.
 * 2 cols mobile, 3 cols tablet, 4 cols desktop, 5 cols on wide screens.
 */
export interface ProductGridProps {
  products: Product[];
  /** Show the in-card add-to-cart button. Default true. */
  showAddToCart?: boolean;
  className?: string;
}

export function ProductGrid({
  products,
  showAddToCart = true,
  className,
}: ProductGridProps) {
  if (!products || products.length === 0) return null;
  return (
    <Grid cols={2} colsMd={3} colsLg={4} colsXl={5} gap={4} className={className}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} showAddToCart={showAddToCart} />
      ))}
    </Grid>
  );
}
