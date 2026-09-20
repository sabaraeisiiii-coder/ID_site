import Link from "next/link";
import {
  ShoppingBag, ShoppingCart, Package, AlertTriangle,
  ArrowLeft, CreditCard, TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { OrderStatusBadge, PaymentStatusBadge, StockStatusBadge } from "@/components/shared/status-badge";
import { catalogService } from "@/domains/catalog/service";
import { inventoryService } from "@/domains/inventory";
import { orderService, type Order } from "@/domains/order";
import { paymentService, type Payment } from "@/domains/payment";
import { formatPrice, formatNumber, toPersianDigits, formatRelative } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productsResult, categories, orders, payments, lowStock] = await Promise.all([
    catalogService.listProducts({ pageSize: 50, status: "active" }),
    catalogService.listCategories(),
    orderService.list(),
    paymentService.list(),
    inventoryService.lowStock(),
  ]);

  // KPIs
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalSales = paidOrders.reduce((acc, o) => acc + o.total, 0);
  const ordersCount = orders.length;
  const activeProducts = productsResult.total;
  const lowStockCount = lowStock.length;

  // Recent (5)
  const recentOrders = orders.slice(0, 5);
  const recentPayments = payments.slice(0, 5);

  // Order columns
  const orderColumns: Column<Order>[] = [
    {
      key: "number",
      header: "شماره سفارش",
      cell: (o) => (
        <Link
          href={`/orders/${o.id}`}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {o.number}
        </Link>
      ),
    },
    {
      key: "customer",
      header: "مشتری",
      cell: (o) => (
        <div className="flex flex-col">
          <span className="text-sm text-foreground">{o.customer.name}</span>
          <span className="text-[11px] text-foreground-tertiary" dir="ltr">{o.customer.phone}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      cell: (o) => <OrderStatusBadge status={o.status} />,
    },
    {
      key: "total",
      header: "مبلغ",
      align: "end",
      cell: (o) => (
        <span className="text-sm font-medium" dir="ltr">{formatPrice(o.total)}</span>
      ),
    },
    {
      key: "createdAt",
      header: "تاریخ",
      align: "end",
      cell: (o) => (
        <span className="text-xs text-foreground-tertiary">{formatRelative(o.createdAt)}</span>
      ),
    },
  ];

  // Payment columns
  const paymentColumns: Column<Payment>[] = [
    {
      key: "reference",
      header: "کد پیگیری",
      cell: (p) => (
        <Link
          href={`/payments/${p.id}`}
          className="font-mono text-xs text-foreground hover:text-primary transition-colors"
          dir="ltr"
        >
          {p.reference}
        </Link>
      ),
    },
    {
      key: "orderNumber",
      header: "سفارش",
      cell: (p) => (
        <Link
          href={`/orders/${p.orderId}`}
          className="text-sm text-foreground hover:text-primary transition-colors"
        >
          {p.orderNumber}
        </Link>
      ),
    },
    {
      key: "gateway",
      header: "درگاه",
      cell: (p) => <span className="text-sm text-foreground-secondary">{p.gateway}</span>,
    },
    {
      key: "status",
      header: "وضعیت",
      cell: (p) => <PaymentStatusBadge status={p.status} />,
    },
    {
      key: "amount",
      header: "مبلغ",
      align: "end",
      cell: (p) => (
        <span className="text-sm font-medium" dir="ltr">{formatPrice(p.amount)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-3"
        items={[{ label: "داشبورد" }]}
      />

      <PageHeader
        title="داشبورد مدیریت"
        description="نمای کلی از وضعیت فروشگاه در یک نگاه"
        actions={
          <Link
            href="/reports"
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium border border-border bg-surface hover:bg-surface-secondary transition-colors"
          >
            <TrendingUp size={16} strokeWidth={1.75} />
            گزارش‌ها
          </Link>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={ShoppingBag}
          intent="primary"
          label="فروش کل"
          value={<span dir="ltr">{formatPrice(totalSales)}</span>}
          delta={12.4}
          hint="در ۳۰ روز گذشته"
        />
        <StatCard
          icon={ShoppingCart}
          intent="info"
          label="سفارش‌ها"
          value={<span dir="ltr">{formatNumber(ordersCount)}</span>}
          delta={5.2}
          hint="از کل سفارش‌ها"
        />
        <StatCard
          icon={Package}
          intent="success"
          label="محصولات فعال"
          value={<span dir="ltr">{formatNumber(activeProducts)}</span>}
          hint={`در ${toPersianDigits(categories.length)} دسته`}
        />
        <StatCard
          icon={AlertTriangle}
          intent="warning"
          label="هشدار موجودی"
          value={<span dir="ltr">{formatNumber(lowStockCount)}</span>}
          delta={-1.8}
          hint="محصول با موجودی محدود / ناموجود"
        />
      </div>

      {/* Recent orders + payments */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="rounded-lg border border-border bg-surface" style={{ borderRadius: "var(--radius-lg)" }}>
          <header className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} strokeWidth={1.75} className="text-foreground-secondary" />
              <h2 className="text-sm font-semibold">سفارش‌های اخیر</h2>
            </div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-1 text-xs text-foreground-secondary hover:text-foreground transition-colors"
            >
              مشاهده همه
              <ArrowLeft size={12} strokeWidth={2} />
            </Link>
          </header>
          <DataTable
            columns={orderColumns}
            rows={recentOrders}
            density="compact"
            getRowKey={(o) => o.id}
          />
        </section>

        <section className="rounded-lg border border-border bg-surface" style={{ borderRadius: "var(--radius-lg)" }}>
          <header className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <CreditCard size={16} strokeWidth={1.75} className="text-foreground-secondary" />
              <h2 className="text-sm font-semibold">پرداخت‌های اخیر</h2>
            </div>
            <Link
              href="/payments"
              className="inline-flex items-center gap-1 text-xs text-foreground-secondary hover:text-foreground transition-colors"
            >
              مشاهده همه
              <ArrowLeft size={12} strokeWidth={2} />
            </Link>
          </header>
          <DataTable
            columns={paymentColumns}
            rows={recentPayments}
            density="compact"
            getRowKey={(p) => p.id}
          />
        </section>
      </div>

      {/* Low stock alert */}
      <section className="rounded-lg border border-border bg-surface" style={{ borderRadius: "var(--radius-lg)" }}>
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} strokeWidth={1.75} className="text-foreground-secondary" />
            <h2 className="text-sm font-semibold">هشدار موجودی</h2>
            <span
              className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-medium"
              style={{
                background: "var(--color-warning-50)",
                color: "var(--color-warning-700)",
              }}
            >
              {toPersianDigits(lowStockCount)}
            </span>
          </div>
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1 text-xs text-foreground-secondary hover:text-foreground transition-colors"
          >
            مدیریت موجودی
            <ArrowLeft size={12} strokeWidth={2} />
          </Link>
        </header>
        {lowStock.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm text-foreground-secondary">همه محصولات موجودی کافی دارند.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {lowStock.map((row) => (
              <li
                key={row.productId}
                className="grid grid-cols-[minmax(0,1fr)_7rem_8rem] items-start gap-4 px-5 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col min-w-0">
                    <Link
                      href={`/products/${row.productId}`}
                      className="block text-sm font-medium leading-5 text-foreground hover:text-primary transition-colors truncate"
                    >
                      {row.title}
                    </Link>
                    <span className="block text-[11px] leading-5 text-foreground-tertiary" dir="ltr">
                      {row.sku} · {row.category}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                    <p className="text-xs leading-5 text-foreground-tertiary">موجودی فعلی</p>
                    <p className="text-sm font-semibold leading-5" dir="ltr">
                      {toPersianDigits(row.stock)} / {toPersianDigits(row.threshold)}
                    </p>
                </div>
                <div className="flex h-10 items-end">
                  <StockStatusBadge status={row.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
