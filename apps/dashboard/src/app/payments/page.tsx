import Link from "next/link";
import { Search, CreditCard, Eye, Download, Filter } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { paymentService, type Payment } from "@/domains/payment";
import { formatPrice, formatNumber, formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_TABS = [
  { label: "همه", value: "all" },
  { label: "موفق", value: "paid" },
  { label: "در انتظار", value: "pending" },
  { label: "ناموفق", value: "failed" },
  { label: "بازگشت خورده", value: "refunded" },
] as const;

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const allPayments = await paymentService.list();

  const counts: Record<string, number> = { all: allPayments.length };
  for (const p of allPayments) {
    counts[p.status] = (counts[p.status] ?? 0) + 1;
  }

  const payments =
    status === "all"
      ? allPayments
      : allPayments.filter((p) => p.status === status);

  const buildHref = (value: string) =>
    `/payments?status=${value}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`;

  const columns: Column<Payment>[] = [
    {
      key: "reference",
      header: "مرجع",
      width: "200px",
      cell: (p) => (
        <Link
          href={`/payments/${p.id}`}
          className="font-mono text-xs font-medium text-foreground hover:text-primary transition-colors"
          dir="ltr"
        >
          {p.reference}
        </Link>
      ),
    },
    {
      key: "orderNumber",
      header: "سفارش",
      width: "140px",
      cell: (p) => (
        <Link
          href={`/orders/${p.orderId}`}
          className="font-mono text-xs text-foreground-secondary hover:text-primary transition-colors"
          dir="ltr"
        >
          {p.orderNumber}
        </Link>
      ),
    },
    {
      key: "amount",
      header: "مبلغ",
      width: "160px",
      align: "end",
      cell: (p) => (
        <span className="text-sm font-semibold" dir="ltr">
          {formatPrice(p.amount)}
        </span>
      ),
    },
    {
      key: "gateway",
      header: "درگاه",
      width: "120px",
      cell: (p) => (
        <span className="text-sm text-foreground-secondary">{p.gateway}</span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      width: "130px",
      cell: (p) => <PaymentStatusBadge status={p.status} />,
    },
    {
      key: "createdAt",
      header: "تاریخ",
      width: "120px",
      align: "end",
      cell: (p) => (
        <span className="text-xs text-foreground-secondary" dir="ltr">
          {formatDateShort(p.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "60px",
      align: "end",
      cell: (p) => (
        <Link
          href={`/payments/${p.id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary hover:text-foreground transition-colors"
          aria-label="مشاهده پرداخت"
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
        items={[{ label: "داشبورد", href: "/" }, { label: "پرداخت‌ها" }]}
      />

      <PageHeader
        title="پرداخت‌ها"
        description={`${formatNumber(allPayments.length)} تراکنش در مجموع`}
        actions={
          <Button variant="outline" size="sm">
            <Download size={14} strokeWidth={1.75} />
            خروجی
          </Button>
        }
      />

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
              placeholder="جستجوی کد پیگیری یا شماره سفارش..."
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

      {payments.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={CreditCard}
            title="پرداختی یافت نشد"
            description="هیچ تراکنشی با این فیلتر وجود ندارد."
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={payments}
          rowHref={(p) => `/payments/${p.id}`}
          getRowKey={(p) => p.id}
          density="comfortable"
          stickyHeader
        />
      )}
    </div>
  );
}
