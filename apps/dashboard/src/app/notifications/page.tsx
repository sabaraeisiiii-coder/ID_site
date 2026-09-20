import Link from "next/link";
import {
  Bell,
  ShoppingCart,
  CreditCard,
  Truck,
  Info,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { MarkAllReadButton } from "@/components/admin/mark-all-read-button";
import { notificationService, type NotificationType } from "@/domains/notification";
import { formatRelative, toPersianDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ tab?: string }>;
}

const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  order: ShoppingCart,
  payment: CreditCard,
  shipment: Truck,
  system: Info,
  promo: Tag,
  review: Bell,
};

const TYPE_TONE: Record<NotificationType, { bg: string; color: string }> = {
  order: { bg: "var(--color-brand-50)", color: "var(--color-brand-700)" },
  payment: { bg: "var(--color-success-50)", color: "var(--color-success-700)" },
  shipment: { bg: "var(--color-info-50)", color: "var(--color-info-700)" },
  system: { bg: "var(--surface-tertiary)", color: "var(--foreground-secondary)" },
  promo: { bg: "var(--color-warning-50)", color: "var(--color-warning-700)" },
  review: { bg: "var(--color-brand-50)", color: "var(--color-brand-700)" },
};

const TABS = [
  { label: "همه", value: "all" },
  { label: "خوانده‌نشده", value: "unread" },
  { label: "سفارش", value: "order" },
  { label: "پرداخت", value: "payment" },
  { label: "سیستم", value: "system" },
] as const;

export default async function AdminNotificationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const tab = params.tab ?? "all";
  const all = await notificationService.listAdmin();

  const counts: Record<string, number> = {
    all: all.length,
    unread: all.filter((n) => !n.isRead).length,
    order: all.filter((n) => n.type === "order").length,
    payment: all.filter((n) => n.type === "payment").length,
    system: all.filter((n) => n.type === "system").length,
  };

  let items = all;
  if (tab === "unread") items = all.filter((n) => !n.isRead);
  else if (tab !== "all") items = all.filter((n) => n.type === tab);

  const buildHref = (value: string) => `/notifications?tab=${value}`;

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[{ label: "داشبورد", href: "/" }, { label: "اعلان‌ها" }]}
      />

      <PageHeader
        title="اعلان‌ها"
        description={`${toPersianDigits(counts.unread)} اعلان خوانده‌نشده از ${toPersianDigits(all.length)} مورد`}
        actions={<MarkAllReadButton />}
      />

      <FilterTabs
        items={TABS.map((t) => ({
          label: t.label,
          value: t.value,
          count: counts[t.value] ?? 0,
        }))}
        activeValue={tab}
        buildHref={buildHref}
      />

      {items.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={Bell}
            title="اعلانی وجود ندارد"
            description="در این بخش اعلان‌های مدیریتی نمایش داده می‌شوند."
          />
        </div>
      ) : (
        <div
          className="rounded-lg border border-border bg-surface overflow-hidden"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <ul>
            {items.map((n, idx) => {
              const Icon = TYPE_ICON[n.type] ?? Bell;
              const tone = TYPE_TONE[n.type];
              const itemContent = (
                <>
                  {/* Unread dot */}
                  {!n.isRead ? (
                    <span
                      className="absolute top-5 inset-inline-end-4 h-2 w-2 rounded-full"
                      style={{ background: "var(--color-brand-500)" }}
                      aria-label="خوانده‌نشده"
                    />
                  ) : null}

                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md shrink-0"
                    style={{
                      background: tone.bg,
                      color: tone.color,
                      borderRadius: "var(--radius-md)",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-foreground">{n.title}</p>
                      <span className="text-[11px] text-foreground-tertiary shrink-0">
                        {formatRelative(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground-secondary mt-1 leading-relaxed">{n.body}</p>
                  </div>
                </>
              );
              return (
                <li
                  key={n.id}
                  className="relative"
                  style={{
                    borderBottom:
                      idx < items.length - 1 ? "1px solid var(--border)" : "none",
                  }}
                >
                  {n.link ? (
                    <Link
                      href={n.link}
                      className="flex items-start gap-4 px-5 py-4 hover:bg-surface-secondary/50 transition-colors"
                    >
                      {itemContent}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-4 px-5 py-4">
                      {itemContent}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
