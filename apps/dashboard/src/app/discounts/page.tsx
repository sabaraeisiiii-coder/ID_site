import Link from "next/link";
import { Plus, Eye, Ticket } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { discountService, type Discount } from "@/domains/discount";
import { formatPrice, formatNumber, toPersianDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

const ENTITY_LABEL: Record<Discount["status"], string> = {
  active: "فعال",
  draft: "پیش‌نویس",
  expired: "منقضی شده",
};

export default async function AdminDiscountsPage() {
  const discounts = await discountService.list();

  const columns: Column<Discount>[] = [
    {
      key: "code",
      header: "کد تخفیف",
      width: "180px",
      cell: (d) => (
        <Link
          href={`/discounts/${d.id}`}
          className="inline-flex items-center rounded-md px-2 py-1 font-mono text-xs font-semibold tracking-wider hover:opacity-80 transition-opacity"
          style={{
            background: "var(--color-brand-50)",
            color: "var(--color-brand-700)",
            borderRadius: "var(--radius-md)",
          }}
          dir="ltr"
        >
          {d.code}
        </Link>
      ),
    },
    {
      key: "description",
      header: "توضیحات",
      cell: (d) => (
        <span className="text-sm text-foreground-secondary line-clamp-1">
          {d.description}
        </span>
      ),
    },
    {
      key: "type",
      header: "نوع",
      width: "110px",
      cell: (d) => (
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            background:
              d.type === "percentage"
                ? "var(--color-info-50)"
                : "var(--surface-secondary)",
            color:
              d.type === "percentage"
                ? "var(--color-info-700)"
                : "var(--foreground-secondary)",
          }}
        >
          {d.type === "percentage" ? "درصدی" : "مبلغی"}
        </span>
      ),
    },
    {
      key: "value",
      header: "مقدار",
      width: "100px",
      align: "end",
      cell: (d) => (
        <span className="text-sm font-medium" dir="ltr">
          {d.type === "percentage"
            ? `${toPersianDigits(d.value)}٪`
            : formatPrice(d.value, "")}
        </span>
      ),
    },
    {
      key: "minOrder",
      header: "حداقل سفارش",
      width: "130px",
      align: "end",
      cell: (d) =>
        d.minOrder ? (
          <span className="text-xs text-foreground-secondary" dir="ltr">
            {formatPrice(d.minOrder, "")}
          </span>
        ) : (
          <span className="text-xs text-foreground-tertiary">—</span>
        ),
    },
    {
      key: "maxDiscount",
      header: "سقف تخفیف",
      width: "130px",
      align: "end",
      cell: (d) =>
        d.maxDiscount ? (
          <span className="text-xs text-foreground-secondary" dir="ltr">
            {formatPrice(d.maxDiscount, "")}
          </span>
        ) : (
          <span className="text-xs text-foreground-tertiary">—</span>
        ),
    },
    {
      key: "usage",
      header: "استفاده",
      width: "150px",
      cell: (d) => {
        const limit = d.usageLimit ?? 0;
        const used = d.usedCount;
        const pct = limit > 0 ? Math.min(100, (used / limit) * 100) : 0;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-medium text-foreground" dir="ltr">
                {toPersianDigits(used)}
                {limit > 0 ? (
                  <span className="text-foreground-tertiary">
                    {" / "}
                    {toPersianDigits(limit)}
                  </span>
                ) : (
                  <span className="text-foreground-tertiary"> / ∞</span>
                )}
              </span>
            </div>
            {limit > 0 ? (
              <Progress value={pct} className="h-1.5" />
            ) : (
              <div
                className="h-1.5 w-full rounded-full"
                style={{ background: "var(--color-success-200, var(--color-success-50))" }}
              />
            )}
          </div>
        );
      },
    },
    {
      key: "status",
      header: "وضعیت",
      width: "120px",
      cell: (d) => {
        // Discount has "expired" status which EntityStatusBadge doesn't cover —
        // fall back to a custom pill when expired.
        if (d.status === "expired") {
          return (
            <span
              className="inline-flex w-max shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium leading-none"
              style={{
                background: "var(--color-warning-50)",
                color: "var(--color-warning-700)",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "currentColor", opacity: 0.9 }}
              />
              {ENTITY_LABEL.expired}
            </span>
          );
        }
        return <EntityStatusBadge status={d.status} />;
      },
    },
    {
      key: "actions",
      header: "",
      width: "60px",
      align: "end",
      cell: (d) => (
        <Link
          href={`/discounts/${d.id}`}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary hover:text-foreground transition-colors"
          aria-label="ویرایش تخفیف"
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
        items={[{ label: "داشبورد", href: "/" }, { label: "تخفیف‌ها" }]}
      />

      <PageHeader
        title="تخفیف‌ها"
        description={`${formatNumber(discounts.length)} کد تخفیف در مجموع`}
        actions={
          <Button asChild size="sm">
            <Link href="/discounts/new">
              <Plus size={14} strokeWidth={1.75} />
              تخفیف جدید
            </Link>
          </Button>
        }
      />

      {discounts.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={Ticket}
            title="تخفیفی یافت نشد"
            description="هنوز هیچ کد تخفیفی ثبت نشده است."
            action={
              <Button asChild size="sm">
                <Link href="/discounts/new">
                  <Plus size={14} strokeWidth={1.75} />
                  ساخت اولین تخفیف
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={discounts}
          rowHref={(d) => `/discounts/${d.id}`}
          getRowKey={(d) => d.id}
          density="comfortable"
          stickyHeader
        />
      )}
    </div>
  );
}
