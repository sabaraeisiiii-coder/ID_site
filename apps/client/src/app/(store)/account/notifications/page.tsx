/**
 * Notifications page — Server Component.
 * Lists account notifications with type-icon + unread indicator.
 */

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

import { customerService } from "@/domains/customer";
import { notificationService, type NotificationType } from "@/domains/notification";
import { Section, Stack } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { AccountNav } from "@/components/store/account-nav";
import { formatRelative } from "@/lib/format";
import { NotificationsToolbar } from "./notifications-toolbar";

export const dynamic = "force-dynamic";

interface TypeMeta {
  icon: LucideIcon;
  bg: string;
  color: string;
  label: string;
}

const typeMeta: Record<NotificationType, TypeMeta> = {
  order: {
    icon: ShoppingCart,
    bg: "var(--color-brand-50)",
    color: "var(--color-brand-700)",
    label: "سفارش",
  },
  payment: {
    icon: CreditCard,
    bg: "var(--color-success-50)",
    color: "var(--color-success-700)",
    label: "پرداخت",
  },
  shipment: {
    icon: Truck,
    bg: "var(--color-info-50)",
    color: "var(--color-info-700)",
    label: "ارسال",
  },
  system: {
    icon: Info,
    bg: "var(--surface-secondary)",
    color: "var(--foreground-secondary)",
    label: "سیستم",
  },
  promo: {
    icon: Tag,
    bg: "var(--color-warning-50)",
    color: "var(--color-warning-700)",
    label: "تخفیف",
  },
  review: {
    icon: Bell,
    bg: "var(--color-brand-50)",
    color: "var(--color-brand-700)",
    label: "نظر",
  },
};

function NotificationRow({
  id,
  type,
  title,
  body,
  isRead,
  createdAt,
  link,
}: {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}) {
  const meta = typeMeta[type] ?? typeMeta.system;
  const Icon = meta.icon;

  const inner = (
    <>
      {/* Icon */}
      <span
        className="inline-flex items-center justify-center w-10 h-10 shrink-0"
        style={{
          borderRadius: "var(--radius-md)",
          background: meta.bg,
          color: meta.color,
        }}
      >
        <Icon size={18} strokeWidth={1.75} />
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-medium px-1.5 py-0.5"
            style={{
              borderRadius: "var(--radius-md)",
              background: meta.bg,
              color: meta.color,
            }}
          >
            {meta.label}
          </span>
          <p className="text-sm font-semibold truncate">{title}</p>
        </div>
        <p className="text-sm text-foreground-secondary line-clamp-2">{body}</p>
        <p className="text-xs text-foreground-tertiary nums-persian mt-0.5">
          {formatRelative(createdAt)}
        </p>
      </div>
    </>
  );

  const className = "relative flex items-start gap-4 p-4 bg-surface border border-border transition-colors hover:border-border-strong";
  const style: React.CSSProperties = {
    borderRadius: "var(--radius-lg)",
    transitionDuration: "var(--duration-fast)",
  };

  if (link) {
    return (
      <Link href={link} className={className} style={style}>
        {!isRead ? (
          <span
            className="absolute top-3 inset-inline-end-3 w-2 h-2 rounded-full"
            style={{ background: "var(--primary)" }}
            aria-label="خوانده‌نشده"
          />
        ) : null}
        {inner}
      </Link>
    );
  }

  return (
    <article className={className} style={style}>
      {!isRead ? (
        <span
          className="absolute top-3 inset-inline-end-3 w-2 h-2 rounded-full"
          style={{ background: "var(--primary)" }}
          aria-label="خوانده‌نشده"
        />
      ) : null}
      {inner}
    </article>
  );
}

export default async function NotificationsPage() {
  const [user, notifications] = await Promise.all([
    customerService.getCurrent(),
    notificationService.listAccount(),
  ]);

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <main className="bg-background">
      <Section spacing="md" containerSize="default">
        <Stack gap={6}>
          <Breadcrumb
            items={[
              { label: "حساب کاربری", href: "/account" },
              { label: "اعلان‌ها" },
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div
                className="sticky top-6 bg-surface border border-border p-4"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <div className="flex items-center gap-3 pb-4 mb-3 border-b border-border">
                  <span
                    className="inline-flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground text-sm font-semibold"
                    style={{ borderRadius: "var(--radius-full)" }}
                  >
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{user.fullName}</p>
                    <p className="text-xs text-foreground-tertiary truncate">{user.role}</p>
                  </div>
                </div>
                <AccountNav />
              </div>
            </aside>

            {/* Main */}
            <div className="flex flex-col gap-6 min-w-0">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl sm:text-2xl font-bold">اعلان‌ها</h1>
                <p className="text-sm text-foreground-secondary">
                  جدیدترین اخبار، سفارش‌ها و پرداخت‌های شما.
                </p>
              </div>

              {notifications.length === 0 ? (
                <div
                  className="bg-surface border border-border"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  <EmptyState
                    icon={Bell}
                    title="اعلانی ندارید"
                    description="اعلان‌های جدید اینجا نمایش داده می‌شن."
                  />
                </div>
              ) : (
                <>
                  <NotificationsToolbar unreadCount={unreadCount} />

                  <ul className="flex flex-col gap-3">
                    {notifications.map((n) => (
                      <li key={n.id}>
                        <NotificationRow
                          id={n.id}
                          type={n.type}
                          title={n.title}
                          body={n.body}
                          isRead={n.isRead}
                          createdAt={n.createdAt}
                          link={n.link}
                        />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </Stack>
      </Section>
    </main>
  );
}
