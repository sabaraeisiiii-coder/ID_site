"use client";

/**
 * InventoryTable — client wrapper for the admin inventory list.
 *
 * Renders the DataTable with inline stock editing (number Input + Save button
 * per row) and expandable variant rows (ChevronDown toggle).
 *
 * Inline edit is visual only — clicking Save shows a toast confirmation but
 * does not persist (no API in this demo).
 */

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Save, Pencil, AlertTriangle } from "lucide-react";
import type { InventoryRow } from "@/domains/inventory";
import { StockStatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { toPersianDigits } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface InventoryTableRow extends InventoryRow {
  image?: string;
  href?: string;
}

export interface InventoryTableProps {
  rows: InventoryTableRow[];
}

export function InventoryTable({ rows }: InventoryTableProps) {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const [stockEdits, setStockEdits] = React.useState<Record<string, string>>({});

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStockChange = (id: string, value: string) => {
    setStockEdits((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = (row: InventoryTableRow) => {
    const next = stockEdits[row.productId];
    if (next === undefined) {
      toast.info("تغییری برای ذخیره وجود ندارد");
      return;
    }
    toast.success(`موجودی «${row.title}» به‌روزرسانی شد`, {
      description: `مقدار جدید: ${toPersianDigits(Number(next) || 0)} عدد`,
    });
    setStockEdits((prev) => {
      const copy = { ...prev };
      delete copy[row.productId];
      return copy;
    });
  };

  if (rows.length === 0) {
    return (
      <div
        className="rounded-lg border border-border bg-surface"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <EmptyState
          icon={AlertTriangle}
          title="موردی یافت نشد"
          description="هیچ محصولی با این فیلتر وجود ندارد."
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-border bg-surface overflow-hidden"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary">
            <tr>
              <th className="w-8 py-3 px-3 text-xs font-semibold text-foreground-secondary text-start" />
              <th className="py-3 px-4 text-xs font-semibold text-foreground-secondary text-start">محصول</th>
              <th className="py-3 px-4 text-xs font-semibold text-foreground-secondary text-start">دسته</th>
              <th className="py-3 px-4 text-xs font-semibold text-foreground-secondary text-center">موجودی فعلی</th>
              <th className="py-3 px-4 text-xs font-semibold text-foreground-secondary text-center">آستانه</th>
              <th className="py-3 px-4 text-xs font-semibold text-foreground-secondary text-start">وضعیت</th>
              <th className="py-3 px-4 text-xs font-semibold text-foreground-secondary text-end">ویرایش موجودی</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const hasVariants = (row.variants?.length ?? 0) > 0;
              const isOpen = expanded.has(row.productId);
              const stockValue = stockEdits[row.productId] ?? String(row.stock);
              const isDirty = stockEdits[row.productId] !== undefined;

              return (
                <React.Fragment key={row.productId}>
                  <tr className="border-b border-border last:border-0 hover:bg-surface-secondary/50 transition-colors">
                    <td className="py-3 px-3 text-center">
                      {hasVariants ? (
                        <button
                          type="button"
                          onClick={() => toggle(row.productId)}
                          aria-label={isOpen ? "بستن تنوع‌ها" : "باز کردن تنوع‌ها"}
                          aria-expanded={isOpen}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-tertiary hover:text-foreground transition-colors"
                          style={{ borderRadius: "var(--radius-md)" }}
                        >
                          <ChevronDown
                            size={15}
                            strokeWidth={2}
                            className={cn("transition-transform", isOpen && "rotate-180")}
                          />
                        </button>
                      ) : null}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="relative h-10 w-10 shrink-0 overflow-hidden bg-surface-secondary"
                          style={{ borderRadius: "var(--radius-md)" }}
                        >
                          {row.image ? (
                            <Image
                              src={row.image}
                              alt={row.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <Link
                            href={row.href ?? "#"}
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate"
                          >
                            {row.title}
                          </Link>
                          <span className="text-[11px] text-foreground-tertiary font-mono" dir="ltr">
                            {row.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-foreground-secondary">{row.category}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm font-medium tabular-nums" dir="ltr">
                        {toPersianDigits(row.stock)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-xs text-foreground-tertiary tabular-nums" dir="ltr">
                        {toPersianDigits(row.threshold)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StockStatusBadge status={row.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Input
                          type="number"
                          min={0}
                          value={stockValue}
                          onChange={(e) => handleStockChange(row.productId, e.target.value)}
                          className="h-8 w-20 bg-surface-secondary border-transparent text-center tabular-nums"
                          aria-label={`موجودی ${row.title}`}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant={isDirty ? "default" : "outline"}
                          className="h-8 px-2.5"
                          onClick={() => handleSave(row)}
                          disabled={!isDirty}
                        >
                          <Save size={13} strokeWidth={2} />
                          <span className="text-xs">ذخیره</span>
                        </Button>
                        <Link
                          href={row.href ?? "#"}
                          aria-label="ویرایش محصول"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary hover:text-foreground transition-colors"
                          style={{ borderRadius: "var(--radius-md)" }}
                        >
                          <Pencil size={14} strokeWidth={1.75} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                  {hasVariants && isOpen ? (
                    <tr className="bg-surface-tertiary/30">
                      <td colSpan={7} className="py-2 px-4">
                        <div className="flex flex-col gap-1.5 ps-8">
                          <p className="text-[11px] font-medium text-foreground-tertiary mb-1">
                            تنوع‌های محصول
                          </p>
                          {row.variants!.map((v) => (
                            <div
                              key={v.id}
                              className="flex items-center justify-between gap-3 rounded-md px-3 py-2 bg-surface border border-border"
                              style={{ borderRadius: "var(--radius-md)" }}
                            >
                              <span className="text-sm text-foreground-secondary">{v.value}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] text-foreground-tertiary">موجودی:</span>
                                <span
                                  className={cn(
                                    "text-sm font-medium tabular-nums",
                                    v.stock === 0 && "text-error",
                                  )}
                                  dir="ltr"
                                >
                                  {toPersianDigits(v.stock)}
                                </span>
                                <StockStatusBadge
                                  status={
                                    v.stock <= 0
                                      ? "out"
                                      : v.stock <= row.threshold
                                        ? "low"
                                        : "in"
                                  }
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
