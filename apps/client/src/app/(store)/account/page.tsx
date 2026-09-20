/**
 * Account Dashboard — Server Component.
 * Greets the current user, shows 4 stat cards, recent orders (3 last),
 * and a CTA to view all orders.
 */

import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  MapPin,
  Bell,
  ArrowLeft,
  Package,
  TrendingUp,
} from "lucide-react";

import { customerService } from "@/domains/customer";
import { orderService } from "@/domains/order";
import { notificationService } from "@/domains/notification";

import { Section, Container, Stack, Grid } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { AccountNav } from "@/components/store/account-nav";
import { WishlistCount } from "@/components/store/wishlist-count";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { formatPrice, formatDate, toPersianDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: typeof ShoppingBag;
  href: string;
}

function StatCard({ label, value, icon: Icon, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 p-5 bg-surface border border-border transition-all hover:border-border-strong"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <div className="flex items-center justify-between">
        <span
          className="inline-flex items-center justify-center w-10 h-10"
          style={{
            borderRadius: "var(--radius-md)",
            background: "var(--surface-secondary)",
            color: "var(--foreground-secondary)",
          }}
        >
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <ArrowLeft
          size={14}
          className="text-foreground-tertiary opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ transitionDuration: "var(--duration-fast)" }}
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-bold leading-none nums-persian">{value}</span>
        <span className="text-xs text-foreground-tertiary">{label}</span>
      </div>
    </Link>
  );
}

export default async function AccountDashboardPage() {
  const [user, orders, addresses, notifications] = await Promise.all([
    customerService.getCurrent(),
    orderService.listForUser("u1"),
    customerService.listAddresses("u1"),
    notificationService.listAccount(),
  ]);

  const recentOrders = orders.slice(0, 3);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <main className="bg-background">
      <Section spacing="md" containerSize="default">
        <Stack gap={6}>
          <Breadcrumb
            items={[
              { label: "حساب کاربری" },
            ]}
          />

          {/* 2-col grid: sidebar + main */}
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
              {/* Greeting */}
              <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-surface border border-border"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="inline-flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground text-lg font-semibold shrink-0"
                    style={{ borderRadius: "var(--radius-full)" }}
                  >
                    {initials}
                  </span>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold leading-tight">
                      سلام، {user.firstName} 👋
                    </h1>
                    <p className="text-sm text-foreground-secondary mt-1">
                      خوش آمدید به پنل حساب کاربری شما.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stat cards */}
              <Grid cols={2} colsMd={4} gap={4}>
                <StatCard
                  label="سفارش‌ها"
                  value={toPersianDigits(orders.length)}
                  icon={ShoppingBag}
                  href="/account/orders"
                />
                <StatCard
                  label="علاقه‌مندی‌ها"
                  value={<WishlistCount />}
                  icon={Heart}
                  href="/account/wishlist"
                />
                <StatCard
                  label="آدرس‌ها"
                  value={toPersianDigits(addresses.length)}
                  icon={MapPin}
                  href="/account/addresses"
                />
                <StatCard
                  label="اعلان‌های خوانده‌نشده"
                  value={toPersianDigits(unreadCount)}
                  icon={Bell}
                  href="/account/notifications"
                />
              </Grid>

              {/* Recent orders */}
              <section
                className="flex flex-col bg-surface border border-border"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <header className="flex items-center justify-between gap-3 px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Package size={18} strokeWidth={1.75} className="text-foreground-secondary" />
                    <h2 className="text-base font-semibold">سفارش‌های اخیر</h2>
                  </div>
                  <Link
                    href="/account/orders"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    مشاهده همه
                  </Link>
                </header>

                {recentOrders.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <p className="text-sm text-foreground-tertiary">
                      هنوز سفارشی ثبت نکرده‌اید.
                    </p>
                  </div>
                ) : (
                  <ul className="flex flex-col divide-y divide-border">
                    {recentOrders.map((order) => {
                      const itemCount = order.items.reduce(
                        (n, it) => n + it.quantity,
                        0,
                      );
                      return (
                        <li key={order.id}>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 hover:bg-surface-secondary transition-colors"
                            style={{ transitionDuration: "var(--duration-fast)" }}
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <div
                                className="flex flex-col items-center justify-center w-12 h-12 shrink-0"
                                style={{
                                  borderRadius: "var(--radius-md)",
                                  background: "var(--surface-secondary)",
                                }}
                              >
                                <span className="text-[10px] text-foreground-tertiary leading-none mb-0.5">
                                  سفارش
                                </span>
                                <span className="text-xs font-semibold nums-persian leading-none">
                                  {order.number.replace("ORD-", "")}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {order.number}
                                </p>
                                <p className="text-xs text-foreground-tertiary nums-persian">
                                  {formatDate(order.createdAt)} ·{" "}
                                  {toPersianDigits(itemCount)} کالا
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4">
                              <OrderStatusBadge status={order.status} />
                              <span className="text-sm font-semibold text-foreground nums-persian">
                                {formatPrice(order.total)}
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {recentOrders.length > 0 ? (
                  <div className="px-6 py-3 border-t border-border">
                    <Link
                      href="/account/orders"
                      className="text-xs font-medium text-foreground-secondary hover:text-foreground inline-flex items-center gap-1"
                    >
                      <TrendingUp size={12} strokeWidth={1.75} />
                      مشاهده و پیگیری همه سفارش‌ها
                    </Link>
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </Stack>
      </Section>
    </main>
  );
}
