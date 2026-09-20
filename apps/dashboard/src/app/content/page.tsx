import Link from "next/link";
import { FileText, Plus, Eye } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { contentService, type ContentPage } from "@/domains/content";
import { formatDateShort, formatRelative } from "@/lib/format";

export const dynamic = "force-dynamic";

const columns: Column<ContentPage>[] = [
  {
    key: "title",
    header: "عنوان",
    cell: (p) => (
      <Link
        href={`/content/${p.id}`}
        className="font-medium text-foreground hover:text-primary transition-colors"
      >
        {p.title}
      </Link>
    ),
  },
  {
    key: "slug",
    header: "slug",
    cell: (p) => (
      <span
        className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-mono text-foreground-secondary"
        style={{ background: "var(--surface-secondary)" }}
        dir="ltr"
      >
        /pages/{p.slug}
      </span>
    ),
  },
  {
    key: "status",
    header: "وضعیت",
    width: "120px",
    cell: (p) => <EntityStatusBadge status={p.status} />,
  },
  {
    key: "updatedAt",
    header: "آخرین به‌روزرسانی",
    width: "180px",
    align: "end",
    cell: (p) => (
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-xs text-foreground">{formatDateShort(p.updatedAt)}</span>
        <span className="text-[11px] text-foreground-tertiary">{formatRelative(p.updatedAt)}</span>
      </div>
    ),
  },
  {
    key: "actions",
    header: "",
    width: "60px",
    align: "end",
    cell: (p) => (
      <Link
        href={`/content/${p.id}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary hover:text-foreground transition-colors"
        aria-label="مشاهده"
      >
        <Eye size={16} strokeWidth={1.75} />
      </Link>
    ),
  },
];

export default async function AdminContentPage() {
  const pages = await contentService.list();

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[{ label: "داشبورد", href: "/" }, { label: "محتوا" }]}
      />

      <PageHeader
        title="محتوا"
        description={`${pages.length} صفحه محتوایی`}
        actions={
          <Button asChild size="sm">
            <Link href="/content/new">
              <Plus size={14} strokeWidth={2} />
              صفحه جدید
            </Link>
          </Button>
        }
      />

      {pages.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={FileText}
            title="صفحه‌ای وجود ندارد"
            description="اولین صفحه محتوای خود را بسازید."
            action={
              <Button asChild size="sm">
                <Link href="/content/new">
                  <Plus size={14} strokeWidth={2} />
                  صفحه جدید
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={pages}
          rowHref={(p) => `/content/${p.id}`}
          getRowKey={(p) => p.id}
          density="comfortable"
        />
      )}
    </div>
  );
}
