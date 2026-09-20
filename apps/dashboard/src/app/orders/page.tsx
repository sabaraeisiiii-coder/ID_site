import Link from "next/link";
import { Search, ShoppingCart, Eye, Download, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterTabs } from "@/components/admin/filter-tabs";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { orderService, type Order } from "@/domains/order";
import {
  formatPrice,
  formatNumber,
  formatDateShort,
  toPersianDigits,
} from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  { label: "همه", value: "all" },
  { label: "در انتظار", value: "pending" },
  { label: "در حال پردازش", value: "processing" },
  { label: "ارسال شده", value: "shipped" },
  { label: "تحویل شده", value: "delivered" },
  { label: "لغو شده", value: "cancelled" },
] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const allOrders = await orderService.list();

  // Count by status for the filter tabs
  const counts: Record<string, number> = { all: allOrders.length };
  for (const o of allOrders) {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  }

  // Apply filter (visual only — full list still rendered if "all")
  const orders =
    status === "all" ? allOrders : allOrders.filter((o) => o.status === status);

  const buildHref = (value: string) =>
    `/orders?status=${value}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`;

  const columns: Column<Order>[] = [
    {
      key: "number",
      header: "شماره",
      width: "140px",
      interactive: true,
      cell: (o) => (
        <Link
          href={`/orders/${o.id}`}
          className="font-mono text-xs font-medium text-foreground hover:text-primary transition-colors"
          dir="ltr"
        >
          {o.number}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "مشتری",
      cell: (o) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-foreground">
            {o.customer.name}
          </span>
          <span
            className="text-[11px] text-foreground-tertiary"
            dir="ltr"
          >
            {o.customer.phone}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "تاریخ",
      width: "120px",
      cell: (o) => (
        <span className="text-xs text-foreground-secondary" dir="ltr">
          {formatDateShort(o.createdAt)}
        </span>
      ),
    },
    {
      key: "items",
      header: "آیتم‌ها",
      width: "80px",
      align: "center",
      cell: (o) => (
        <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-md px-1.5 text-xs font-medium"
          style={{
            background: "var(--surface-secondary)",
            color: "var(--foreground-secondary)",
          }}
        >
          {toPersianDigits(o.items.length)}
        </span>
      ),
    },
    {
      key: "total",
      header: "مبلغ کل",
      width: "160px",
      align: "end",
      cell: (o) => (
        <span className="text-sm font-semibold" dir="ltr">
          {formatPrice(o.total)}
        </span>
      ),
    },
    {
      key: "status",
      header: "وضعیت سفارش",
      width: "140px",
      cell: (o) => <OrderStatusBadge status={o.status} />,
    },
    {
      key: "paymentStatus",
      header: "پرداخت",
      width: "120px",
      cell: (o) => <PaymentStatusBadge status={o.paymentStatus} />,
    },
    {
      key: "actions",
      header: "",
      width: "60px",
      align: "end",
      cell: (o) => (
        <Link
          href={`/orders/${o.id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary hover:text-foreground transition-colors"
          aria-label="مشاهده سفارش"
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
        items={[{ label: "داشبورد", href: "/" }, { label: "سفارش‌ها" }]}
      />

      <PageHeader
        title="سفارش‌ها"
        description={`${formatNumber(allOrders.length)} سفارش در مجموع`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download size={14} strokeWidth={1.75} />
              خروجی
            </Button>
          </>
        }
      />

      {/* Filters + search */}
      <div className="flex flex-col gap-3">
        <FilterTabs
          items={STATUS_TABS.map((t) => ({
            label: t.label,
            value: t.value,
            count: counts[t.value] ?? 0,
          }))}
          activeValue={status}
          buildHref={buildHref}
        />

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              strokeWidth={1.75}
              className="absolute inset-inline-start-3 top-1/2 -translate-y-1/2 text-foreground-tertiary pointer-events-none"
            />
            <Input
              type="search"
              placeholder="جستجو بر اساس شماره سفارش یا نام مشتری..."
              defaultValue={params.q ?? ""}
              className="h-9 ps-9 pe-3 text-sm bg-surface-secondary border-transparent"
            />
          </div>
          <Button variant="outline" size="sm" className="sm:ms-auto">
            <Filter size={14} strokeWidth={1.75} />
            فیلتر پیشرفته
          </Button>
        </div>
      </div>

      {/* Table */}
      {orders.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={ShoppingCart}
            title="سفارشی یافت نشد"
            description="هیچ سفارشی با این فیلتر وجود ندارد."
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={orders}
          rowHref={(o) => `/orders/${o.id}`}
          getRowKey={(o) => o.id}
          density="comfortable"
          stickyHeader
        />
      )}
    </div>
  );
}
