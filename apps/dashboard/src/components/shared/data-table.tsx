import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * DataTable — reusable table layout for admin lists.
 * Server-Component-friendly: takes plain data + render fns, no internal state.
 *
 * Columns define how to render the header and each cell.
 * Rows are objects; cell render fns receive the row.
 */

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  /** Width hint (CSS). */
  width?: string;
  align?: "start" | "center" | "end";
  /** Render the cell. Defaults to row[key]. */
  cell?: (row: T, index: number) => React.ReactNode;
  /** Cell renders its own link or button, so rowHref must not wrap it. */
  interactive?: boolean;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  /** Optional href per row — clicking the row navigates there. */
  rowHref?: (row: T) => string;
  /** Optional empty state node shown when rows.length === 0. */
  emptyState?: React.ReactNode;
  /** Show a subtle skeleton while loading. */
  loading?: boolean;
  loadingRows?: number;
  /** Sticky header on scroll. */
  stickyHeader?: boolean;
  className?: string;
  /** Use row key extractor; defaults to index. */
  getRowKey?: (row: T, index: number) => string;
  /** Compact rows for high-density admin tables. */
  density?: "comfortable" | "compact";
}

export function DataTable<T>({
  columns, rows, rowHref, emptyState, loading, loadingRows = 6,
  stickyHeader = false, className, getRowKey, density = "comfortable",
}: DataTableProps<T>) {
  const rowPad = density === "compact" ? "py-2.5 px-4" : "py-3.5 px-4";

  if (loading) {
    return (
      <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
        <div className="border-b border-border bg-surface-secondary">
          <div className="flex">
            {columns.map((c) => (
              <div key={c.key} className={cn("py-3 px-4 text-xs font-semibold text-foreground-secondary", c.width)} style={{ width: c.width }}>
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
        <div>
          {Array.from({ length: loadingRows }).map((_, i) => (
            <div key={i} className="flex border-b border-border last:border-0">
              {columns.map((c) => (
                <div key={c.key} className={cn(rowPad)} style={{ width: c.width }}>
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rows.length === 0 && emptyState) {
    return (
      <div className={cn("rounded-lg border border-border bg-surface", className)}>
        {emptyState}
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden bg-surface", className)}>
      <div className={cn("overflow-x-auto")}>
        <table className="w-full text-sm">
          <thead className={cn("bg-surface-secondary", stickyHeader && "sticky top-0 z-10")}>
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    "py-3 px-4 text-xs font-semibold text-foreground-secondary text-start whitespace-nowrap",
                    c.align === "center" && "text-center",
                    c.align === "end" && "text-end",
                  )}
                  style={{ width: c.width }}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const key = getRowKey ? getRowKey(row, i) : String(i);
              const href = rowHref ? rowHref(row) : undefined;
              return (
                <tr
                  key={key}
                  className={cn(
                    "border-b border-border last:border-0 transition-colors",
                    href && "cursor-pointer hover:bg-surface-secondary",
                  )}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={cn(
                        rowPad,
                        "text-start align-middle",
                        c.align === "center" && "text-center",
                        c.align === "end" && "text-end",
                      )}
                      style={{ width: c.width }}
                    >
                      {href && c.key !== "actions" && !c.interactive ? (
                        <a href={href} className="block -my-3.5 -mx-4 px-4 py-3.5">
                          {c.cell ? c.cell(row, i) : String((row as Record<string, unknown>)[c.key] ?? "")}
                        </a>
                      ) : (c.cell ? c.cell(row, i) : String((row as Record<string, unknown>)[c.key] ?? ""))}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
