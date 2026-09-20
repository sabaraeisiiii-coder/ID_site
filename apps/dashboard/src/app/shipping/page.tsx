import Link from "next/link";
import { Plus, Eye, Truck, Clock, GripVertical } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { shippingService, type ShippingMethod } from "@/domains/shipping";
import { formatPrice, formatNumber, toPersianDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminShippingPage() {
  const methods = await shippingService.list();

  const columns: Column<ShippingMethod>[] = [
    {
      key: "sortOrder",
      header: "",
      width: "40px",
      align: "center",
      cell: (m) => (
        <span className="inline-flex items-center gap-1 text-foreground-tertiary">
          <GripVertical size={14} strokeWidth={1.5} className="opacity-40" />
          {toPersianDigits(m.sortOrder)}
        </span>
      ),
    },
    {
      key: "name",
      header: "نام روش",
      cell: (m) => (
        <Link
          href={`/shipping/${m.id}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0"
            style={{
              background: "var(--color-brand-50)",
              color: "var(--color-brand-700)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <Truck size={16} strokeWidth={1.75} />
          </span>
          <span className="text-sm font-medium text-foreground">{m.name}</span>
        </Link>
      ),
    },
    {
      key: "description",
      header: "توضیحات",
      cell: (m) => (
        <span className="text-sm text-foreground-secondary line-clamp-1">
          {m.description}
        </span>
      ),
    },
    {
      key: "price",
      header: "قیمت",
      width: "140px",
      align: "end",
      cell: (m) => (
        <span className="text-sm font-semibold" dir="ltr">
          {m.price === 0 ? "رایگان" : formatPrice(m.price)}
        </span>
      ),
    },
    {
      key: "estimatedDays",
      header: "زمان تحویل",
      width: "140px",
      cell: (m) => (
        <span
          className="inline-flex items-center gap-1.5 text-xs text-foreground-secondary"
        >
          <Clock size={12} strokeWidth={1.75} className="text-foreground-tertiary" />
          {m.estimatedDays}
        </span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      width: "120px",
      cell: (m) => <EntityStatusBadge status={m.status} />,
    },
    {
      key: "actions",
      header: "",
      width: "60px",
      align: "end",
      cell: (m) => (
        <Link
          href={`/shipping/${m.id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary hover:text-foreground transition-colors"
          aria-label="ویرایش روش ارسال"
        >
          <Eye size={16} strokeWidth={1.75} />
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[{ label: "داشبورد", href: "/" }, { label: "روش‌های ارسال" }]}
      />

      <PageHeader
        title="روش‌های ارسال"
        description={`${formatNumber(methods.length)} روش ارسال پیکربندی شده`}
        actions={
          <Button asChild size="sm">
            <Link href="/shipping/new">
              <Plus size={14} strokeWidth={1.75} />
              روش جدید
            </Link>
          </Button>
        }
      />

      {methods.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={Truck}
            title="روش ارسالی یافت نشد"
            description="هنوز هیچ روش ارسالی پیکربندی نشده است."
            action={
              <Button asChild size="sm">
                <Link href="/shipping/new">
                  <Plus size={14} strokeWidth={1.75} />
                  افزودن روش ارسال
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={methods}
          rowHref={(m) => `/shipping/${m.id}`}
          getRowKey={(m) => m.id}
          density="comfortable"
          stickyHeader
        />
      )}
    </div>
  );
}
