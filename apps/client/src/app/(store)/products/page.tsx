/**
 * Products listing page — Server Component.
 * Reads searchParams, fetches via catalogService, renders filter sidebar + product grid.
 */

import * as React from "react";
import Link from "next/link";
import { SearchX, ArrowLeft, PackageSearch } from "lucide-react";

import { Section, Container, Stack, Inline } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Pagination } from "@/components/shared/pagination";
import { ProductGrid } from "@/components/store/product-grid";
import { FilterSidebar } from "@/components/store/filters/filter-sidebar";
import { SortSelect } from "@/components/store/filters/sort-select";
import { MobileFiltersButton } from "@/components/store/filters/mobile-filters-button";
import { catalogService } from "@/domains/catalog/service";
import type { SortOption } from "@/domains/catalog/types";
import { Button } from "@/components/ui/button";
import { toPersianDigits, formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 9;
const VALID_SORTS: SortOption[] = [
  "newest",
  "popular",
  "price-asc",
  "price-desc",
  "discount",
];

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function single(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const sp = await searchParams;

  const categoryId = single(sp.categoryId) || undefined;
  const search = single(sp.search) || undefined;
  const sortRaw = single(sp.sort);
  const sort: SortOption | undefined =
    sortRaw && VALID_SORTS.includes(sortRaw as SortOption)
      ? (sortRaw as SortOption)
      : undefined;
  const page = Math.max(1, Number(single(sp.page) ?? "1") || 1);
  const onSale = single(sp.onSale) === "true";
  const brands = sp.brand
    ? (Array.isArray(sp.brand) ? sp.brand : [sp.brand]).filter(Boolean)
    : [];
  const minPrice = single(sp.minPrice);
  const maxPrice = single(sp.maxPrice);

  // Fetch all matching products with service filters + categories in parallel.
  // We use pageSize: 999 to get everything then apply brand/price filters + re-paginate.
  const [categories, allResult] = await Promise.all([
    catalogService.listCategories(),
    catalogService.listProducts({
      categoryId,
      search,
      onSale,
      sort,
      pageSize: 999,
    }),
  ]);

  // Derive unique brands + price bounds from all active products
  const allProducts = allResult.items;
  const brandList = Array.from(new Set(allProducts.map((p) => p.brand))).sort(
    (a, b) => a.localeCompare(b, "fa"),
  );
  const prices = allProducts.map((p) => p.price);
  const priceBounds =
    prices.length > 0
      ? { min: Math.min(...prices), max: Math.max(...prices) }
      : { min: 0, max: 0 };

  // Apply brand + price filters server-side
  let filtered = allProducts;
  if (brands.length > 0)
    filtered = filtered.filter((p) => brands.includes(p.brand));
  if (minPrice) {
    const min = Number(minPrice);
    if (Number.isFinite(min)) filtered = filtered.filter((p) => p.price >= min);
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    if (Number.isFinite(max)) filtered = filtered.filter((p) => p.price <= max);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (categoryId) params.set("categoryId", categoryId);
    if (search) params.set("search", search);
    if (sort) params.set("sort", sort);
    if (onSale) params.set("onSale", "true");
    brands.forEach((b) => params.append("brand", b));
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  const hasActiveFilter =
    !!categoryId ||
    !!search ||
    onSale ||
    brands.length > 0 ||
    !!minPrice ||
    !!maxPrice;

  return (
    <main className="bg-background min-h-screen">
      <Section spacing="sm" containerSize="default">
        <Stack gap={6}>
          <Breadcrumb items={[{ label: "محصولات" }]} />

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <Stack gap={1}>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                محصولات
              </h1>
            </Stack>
            <Inline gap={2} className="items-center">
              <MobileFiltersButton
                categories={categories}
                brands={brandList}
                priceBounds={priceBounds}
              />
              <SortSelect />
            </Inline>
          </div>

          {/* 2-col layout: sidebar + main */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 items-start">
            {/* Sidebar (desktop) */}
            <aside
              className="product-filter-sticky hidden lg:block lg:self-start"
              style={{
                top: "calc(var(--header-height-desktop) + var(--space-6))",
              }}
            >
              <div
                className="max-h-[calc(100vh-var(--header-height-desktop)-3rem)] overflow-y-auto bg-surface border border-border p-5 overscroll-contain"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <React.Suspense fallback={<LoadingSkeleton variant="card" />}>
                  <FilterSidebar
                    categories={categories}
                    brands={brandList}
                    priceBounds={priceBounds}
                  />
                </React.Suspense>
              </div>
            </aside>

            {/* Main */}
            <div className="min-w-0">
              {pageItems.length === 0 ? (
                <div
                  className="bg-surface border border-border"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  <EmptyState
                    icon={hasActiveFilter ? SearchX : PackageSearch}
                    title={
                      hasActiveFilter
                        ? "محصولی با این فیلترها یافت نشد"
                        : "محصولی یافت نشد"
                    }
                    description={
                      hasActiveFilter
                        ? "فیلترها را تغییر دهید یا همه فیلترها را پاک کنید."
                        : "در حال حاضر محصولی در فروشگاه موجود نیست."
                    }
                    action={
                      hasActiveFilter ? (
                        <Button asChild>
                          <Link href="/products">
                            <ArrowLeft size={14} className="me-1" />
                            پاک کردن فیلترها
                          </Link>
                        </Button>
                      ) : undefined
                    }
                  />
                </div>
              ) : (
                <Stack gap={8}>
                  <ProductGrid products={pageItems} />

                  <div className="flex justify-center pt-2">
                    <Pagination
                      page={safePage}
                      totalPages={totalPages}
                      buildHref={buildHref}
                    />
                  </div>
                </Stack>
              )}
            </div>
          </div>
        </Stack>
      </Section>
    </main>
  );
}
