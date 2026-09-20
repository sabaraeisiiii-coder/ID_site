"use client";

/**
 * ProductsAdminTable — client wrapper that renders the visual filter toolbar
 * (search + status select + category select) and filters the rows client-side
 * before handing them to the shared DataTable.
 *
 * Pure presentational filtering on the already-loaded server data — no extra
 * round-trip needed.
 */

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil, Package } from "lucide-react";
import type { Product, Category } from "@/domains/catalog/types";
import { getStockStatus, isOnSale, getDiscountPercent } from "@/domains/catalog/types";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EntityStatusBadge, StockStatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatPrice, toPersianDigits } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface ProductsAdminTableProps {
  products: Product[];
  categories: Category[];
}

type StatusFilter = "all" | Product["status"];

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "active", label: "فعال" },
  { value: "draft", label: "پیش‌نویس" },
  { value: "archived", label: "بایگانی" },
];

export function ProductsAdminTable({ products, categories }: ProductsAdminTableProps) {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [categoryId, setCategoryId] = React.useState<string>("all");

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (categoryId !== "all" && p.categoryId !== categoryId) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.titleLatin?.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    });
  }, [products, search, status, categoryId]);

  const columns: Column<Product>[] = [
    {
      key: "title",
      header: "محصول",
      cell: (p) => (
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="relative h-11 w-11 shrink-0 overflow-hidden bg-surface-secondary"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            {p.images[0] ? (
              <Image
                src={p.images[0].url}
                alt={p.images[0].alt}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate">{p.title}</span>
            <span className="text-[11px] text-foreground-tertiary font-mono" dir="ltr">
              {p.sku}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "دسته",
      cell: (p) => <span className="text-sm text-foreground-secondary">{p.category}</span>,
    },
    {
      key: "price",
      header: "قیمت",
      align: "end",
      cell: (p) => (
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-sm font-medium" dir="ltr">{formatPrice(p.price)}</span>
          {isOnSale(p) ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-foreground-tertiary line-through" dir="ltr">
                {formatPrice(p.comparePrice!)}
              </span>
              <span
                className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                style={{
                  background: "var(--color-error-50)",
                  color: "var(--color-error-700)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {toPersianDigits(getDiscountPercent(p))}٪
              </span>
            </div>
          ) : null}
        </div>
      ),
    },
    {
      key: "stock",
      header: "موجودی",
      align: "center",
      cell: (p) => (
        <div className="inline-flex items-center gap-2">
          <span className="text-sm font-medium tabular-nums" dir="ltr">
            {toPersianDigits(p.stock)}
          </span>
          <StockStatusBadge status={getStockStatus(p)} />
        </div>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      cell: (p) => <EntityStatusBadge status={p.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "end",
      cell: (p) => (
        <Link
          href={`/products/${p.id}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
          aria-label={`ویرایش ${p.title}`}
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <Pencil size={15} strokeWidth={1.75} />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filter toolbar */}
      <div
        className="rounded-lg border border-border bg-surface p-3 sm:p-4"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={16}
              strokeWidth={1.75}
              className="absolute inset-inline-start-3 top-1/2 -translate-y-1/2 text-foreground-tertiary pointer-events-none"
            />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی نام، SKU، برند..."
              className="h-9 ps-9 pe-3 bg-surface-secondary border-transparent"
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <SelectTrigger className="h-9 w-full sm:w-44 bg-surface-secondary border-transparent">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-9 w-full sm:w-48 bg-surface-secondary border-transparent">
              <SelectValue placeholder="دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه دسته‌ها</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Count summary */}
      <div className="flex items-center justify-between text-xs text-foreground-tertiary">
        <span>
          نمایش <span className="font-medium text-foreground">{toPersianDigits(filtered.length)}</span> از{" "}
          <span className="font-medium text-foreground">{toPersianDigits(products.length)}</span> محصول
        </span>
        <Button asChild size="sm" className="h-8">
          <Link href="/products/new">
            <Plus size={15} strokeWidth={2} />
            محصول جدید
          </Link>
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        rows={filtered}
        rowHref={(p) => `/products/${p.id}`}
        getRowKey={(p) => p.id}
        density="comfortable"
        emptyState={
          <EmptyState
            icon={Package}
            title="محصولی یافت نشد"
            description="با تغییر فیلترها دوباره تلاش کنید یا محصول جدیدی اضافه کنید."
            action={
              <Button asChild size="sm">
                <Link href="/products/new">
                  <Plus size={15} strokeWidth={2} />
                  افزودن محصول
                </Link>
              </Button>
            }
          />
        }
        className={cn(filtered.length === 0 && "border-transparent")}
      />
    </div>
  );
}
