/**
 * Orders list page — Server Component.
 * Shows the user's orders as cards with item thumbnails + status badges + total.
 */

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowLeft, Package } from "lucide-react";

import { customerService } from "@/domains/customer";
import { orderService } from "@/domains/order";
import { Section, Stack } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/shared/status-badge";
import { AccountNav } from "@/components/store/account-nav";
import { Button } from "@/components/ui/button";
import {
  formatDate,
  formatPrice,
  toPersianDigits,
} from "@/lib/format";
import { OrdersFilterTabs } from "./orders-filter-tabs";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const [user, orders] = await Promise.all([
    customerService.getCurrent(),
    orderService.listForUser("u1"),
  ]);

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  return (
    <main className="bg-background">
      <Section spacing="md" containerSize="default">
        <Stack gap={6}>
          <Breadcrumb
            items={[
              { label: "حساب کاربری", href: "/account" },
              { label: "سفارش‌ها" },
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h1 className="text-xl sm:text-2xl font-bold">سفارش‌های من</h1>
                  <p className="text-sm text-foreground-secondary nums-persian">
                    {toPersianDigits(orders.length)} سفارش تاکنون ثبت کرده‌اید.
                  </p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/products">
                    <ShoppingBag size={14} strokeWidth={1.75} />
                    شروع خرید
                  </Link>
                </Button>
              </div>

              {orders.length === 0 ? (
                <div
                  className="bg-surface border border-border"
                  style={{ borderRadius: "var(--radius-lg)" }}
                >
                  <EmptyState
                    icon={ShoppingBag}
                    title="هنوز سفارشی ندارید"
                    description="به‌محض ثبت اولین سفارش، آن را اینجا مشاهده خواهید کرد."
                    action={
                      <Button asChild>
                        <Link href="/products">
                          <ShoppingBag size={16} strokeWidth={1.75} />
                          شروع خرید
                        </Link>
                      </Button>
                    }
                  />
                </div>
              ) : (
                <>
                  <OrdersFilterTabs />

                  <ul className="flex flex-col gap-4">
                    {orders.map((order) => {
                      const visibleItems = order.items.slice(0, 3);
                      const extraCount = Math.max(0, order.items.length - 3);
                      const itemCount = order.items.reduce(
                        (n, it) => n + it.quantity,
                        0,
                      );

                      return (
                        <li key={order.id}>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="group flex flex-col gap-4 p-5 bg-surface border border-border transition-colors hover:border-border-strong"
                            style={{
                              borderRadius: "var(--radius-lg)",
                              transitionDuration: "var(--duration-fast)",
                            }}
                          >
                            {/* Top row */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="flex flex-col gap-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <Package
                                    size={16}
                                    strokeWidth={1.75}
                                    className="text-foreground-tertiary"
                                  />
                                  <span
                                    className="text-sm font-semibold font-mono"
                                    dir="ltr"
                                  >
                                    {order.number}
                                  </span>
                                </div>
                                <p className="text-xs text-foreground-tertiary nums-persian">
                                  {formatDate(order.createdAt)} ·{" "}
                                  {toPersianDigits(itemCount)} کالا
                                </p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <OrderStatusBadge status={order.status} />
                                <PaymentStatusBadge status={order.paymentStatus} />
                              </div>
                            </div>

                            {/* Items preview */}
                            <div className="flex items-center gap-3">
                              <div className="flex -space-x-2 space-x-reverse">
                                {visibleItems.map((item, i) => (
                                  <span
                                    key={`${item.productId}-${i}`}
                                    className="relative h-14 w-14 overflow-hidden border-2 border-surface bg-surface-secondary shrink-0"
                                    style={{
                                      borderRadius: "var(--radius-md)",
                                    }}
                                  >
                                    {item.image ? (
                                      <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="56px"
                                        className="object-cover"
                                      />
                                    ) : null}
                                  </span>
                                ))}
                              </div>
                              {extraCount > 0 ? (
                                <span
                                  className="inline-flex items-center justify-center min-w-9 h-9 px-2 text-xs font-medium bg-surface-secondary text-foreground-secondary nums-persian"
                                  style={{
                                    borderRadius: "var(--radius-md)",
                                  }}
                                >
                                  +{toPersianDigits(extraCount)}
                                </span>
                              ) : null}
                              <span className="text-xs text-foreground-tertiary ms-2 truncate">
                                {order.items[0]?.title ?? ""}
                                {itemCount > 1 ? " و بیشتر…" : ""}
                              </span>
                            </div>

                            {/* Bottom row */}
                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
                              <span className="text-xs text-foreground-tertiary">
                                مبلغ کل
                              </span>
                              <div className="flex items-center gap-3">
                                <span
                                  className="text-sm font-bold nums-persian"
                                  dir="ltr"
                                >
                                  {formatPrice(order.total)}
                                </span>
                                <span
                                  className="inline-flex items-center gap-1 text-xs font-medium text-primary"
                                >
                                  مشاهده جزئیات
                                  <ArrowLeft
                                    size={12}
                                    strokeWidth={2}
                                    className="transition-transform group-hover:-translate-x-0.5"
                                  />
                                </span>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
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
