import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, FolderTree, Hash } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { catalogService } from "@/domains/catalog/service";
import type { Category } from "@/domains/catalog/types";
import { toPersianDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await catalogService.listCategories();

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "نام دسته",
      cell: (c) => (
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="relative h-10 w-10 shrink-0 overflow-hidden bg-surface-secondary"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            {c.image ? (
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate">{c.name}</span>
            {c.description ? (
              <span className="text-[11px] text-foreground-tertiary truncate max-w-xs">
                {c.description}
              </span>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      header: "نشانک",
      cell: (c) => (
        <span className="text-xs font-mono text-foreground-secondary" dir="ltr">
          {c.slug}
        </span>
      ),
    },
    {
      key: "productCount",
      header: "تعداد محصولات",
      align: "center",
      cell: (c) => (
        <span
          className="inline-flex min-w-7 h-7 items-center justify-center rounded-full px-2 text-xs font-medium tabular-nums"
          style={{
            background: "var(--surface-secondary)",
            color: "var(--foreground-secondary)",
            borderRadius: "var(--radius-md)",
          }}
        >
          {toPersianDigits(c.productCount ?? 0)}
        </span>
      ),
    },
    {
      key: "order",
      header: "ترتیب نمایش",
      align: "center",
      cell: (c) => (
        <span className="inline-flex items-center gap-1 text-xs text-foreground-tertiary">
          <Hash size={11} strokeWidth={2} />
          {toPersianDigits(c.order ?? 0)}
        </span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      cell: (c) => <EntityStatusBadge status={c.status} />,
    },
    {
      key: "actions",
      header: "",
      align: "end",
      cell: (c) => (
        <Link
          href={`/categories/${c.id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
          aria-label={`ویرایش ${c.name}`}
          style={{ borderRadius: "var(--radius-md)" }}
        >
          <Pencil size={15} strokeWidth={1.75} />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-3"
        items={[{ label: "داشبورد", href: "/" }, { label: "دسته‌بندی‌ها" }]}
      />

      <PageHeader
        title="مدیریت دسته‌بندی‌ها"
        description={`${categories.length} دسته‌بندی تعریف شده`}
        actions={
          <Button asChild>
            <Link href="/categories/new">
              <Plus size={16} strokeWidth={2} />
              دسته جدید
            </Link>
          </Button>
        }
      />

      {categories.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={FolderTree}
            title="دسته‌بندی‌ای تعریف نشده"
            description="اولین دسته‌بندی فروشگاه را ایجاد کنید تا محصولات در آن دسته‌بندی شوند."
            action={
              <Button asChild>
                <Link href="/categories/new">
                  <Plus size={16} strokeWidth={2} />
                  افزودن دسته
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={categories}
          rowHref={(c) => `/categories/${c.id}`}
          getRowKey={(c) => c.id}
          density="comfortable"
        />
      )}
    </div>
  );
}
