import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Target,
  Package,
  AlertTriangle,
  XCircle,
  BarChart3,
  CreditCard,
  Boxes,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { OrderStatusBadge } from "@/components/shared/status-badge";
import { orderService, type Order } from "@/domains/order";
import { paymentService } from "@/domains/payment";
import { inventoryService } from "@/domains/inventory";
import { catalogService } from "@/domains/catalog/service";
import {
  formatPrice,
  formatNumber,
  toPersianDigits,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const [orders, payments, inventory, productsResult] = await Promise.all([
    orderService.list(),
    paymentService.list(),
    inventoryService.list(),
    catalogService.listProducts({ pageSize: 100, status: "active" }),
  ]);

  // KPIs
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.total, 0);
  const ordersCount = orders.length;
  const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const conversionRate = 3.2; // mock

  // Sales by status
  const byStatus = new Map<string, { count: number; total: number }>();
  for (const o of orders) {
    const cur = byStatus.get(o.status) ?? { count: 0, total: 0 };
    cur.count += 1;
    cur.total += o.total;
    byStatus.set(o.status, cur);
  }
  const statusRows = Array.from(byStatus.entries()).map(([status, v]) => ({
    status,
    ...v,
  }));

  // Top selling products — by quantity across all orders
  const productSales = new Map<string, { id: string; title: string; quantity: number; revenue: number }>();
  for (const o of orders) {
    for (const item of o.items) {
      const cur = productSales.get(item.productId) ?? {
        id: item.productId,
        title: item.title,
        quantity: 0,
        revenue: 0,
      };
      cur.quantity += item.quantity;
      cur.revenue += item.quantity * item.unitPrice;
      productSales.set(item.productId, cur);
    }
  }
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Payment summary by gateway
  const byGateway = new Map<string, { count: number; amount: number }>();
  for (const p of payments) {
    const cur = byGateway.get(p.gateway) ?? { count: 0, amount: 0 };
    cur.count += 1;
    cur.amount += p.amount;
    byGateway.set(p.gateway, cur);
  }

  // Inventory summary
  const inStock = inventory.filter((r) => r.status === "in").length;
  const lowStock = inventory.filter((r) => r.status === "low").length;
  const outStock = inventory.filter((r) => r.status === "out").length;

  // Status table columns
  const statusColumns: Column<{ status: string; count: number; total: number }>[] = [
    {
      key: "status",
      header: "وضعیت",
      cell: (r) => <OrderStatusBadge status={r.status as Order["status"]} />,
    },
    {
      key: "count",
      header: "تعداد",
      width: "100px",
      align: "center",
      cell: (r) => (
        <span className="text-sm font-medium">{toPersianDigits(r.count)}</span>
      ),
    },
    {
      key: "total",
      header: "مبلغ کل",
      width: "180px",
      align: "end",
      cell: (r) => (
        <span className="text-sm font-semibold" dir="ltr">{formatPrice(r.total)}</span>
      ),
    },
  ];

  const topProductColumns: Column<typeof topProducts[number]>[] = [
    {
      key: "title",
      header: "محصول",
      cell: (r) => (
        <Link
          href={`/products/${r.id}`}
          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          {r.title}
        </Link>
      ),
    },
    {
      key: "quantity",
      header: "تعداد فروش",
      width: "120px",
      align: "center",
      cell: (r) => (
        <span className="inline-flex min-w-7 h-6 items-center justify-center rounded-md px-2 text-xs font-medium"
          style={{
            background: "var(--color-brand-50)",
            color: "var(--color-brand-700)",
          }}
        >
          {toPersianDigits(r.quantity)}
        </span>
      ),
    },
    {
      key: "revenue",
      header: "درآمد",
      width: "180px",
      align: "end",
      cell: (r) => (
        <span className="text-sm font-semibold" dir="ltr">{formatPrice(r.revenue)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-1"
        items={[{ label: "داشبورد", href: "/" }, { label: "گزارش‌ها" }]}
      />

      <PageHeader
        title="گزارش‌ها"
        description={`نمای جامع از عملکرد فروشگاه — ${toPersianDigits(productsResult.total)} محصول فعال`}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="درآمد کل"
          value={<span dir="ltr">{formatPrice(totalRevenue)}</span>}
          description="از سفارش‌های پرداخت‌شده"
        />
        <StatCard
          icon={ShoppingCart}
          label="تعداد سفارش‌ها"
          value={<span dir="ltr">{formatNumber(ordersCount)}</span>}
          description={`${toPersianDigits(paidOrders.length)} سفارش پرداخت‌شده`}
        />
        <StatCard
          icon={Target}
          label="میانگین ارزش سفارش"
          value={<span dir="ltr">{formatPrice(avgOrderValue)}</span>}
          description="بر اساس سفارش‌های پرداخت‌شده"
        />
        <StatCard
          icon={TrendingUp}
          label="نرخ تبدیل"
          value={<span dir="ltr">{toPersianDigits(conversionRate)}٪</span>}
          description="بازدید به سفارش"
        />
      </div>

      {/* Sales by status + Top products */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <section
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <header className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <BarChart3 size={16} strokeWidth={1.75} className="text-foreground-secondary" />
            <h2 className="text-sm font-semibold">فروش به تفکیک وضعیت</h2>
          </header>
          {statusRows.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-foreground-secondary">
              سفارشی ثبت نشده است.
            </p>
          ) : (
            <DataTable
              columns={statusColumns}
              rows={statusRows}
              getRowKey={(r) => r.status}
              density="compact"
            />
          )}
        </section>

        <section
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <header className="flex items-center gap-2 px-5 py-4 border-b border-border">
            <TrendingUp size={16} strokeWidth={1.75} className="text-foreground-secondary" />
            <h2 className="text-sm font-semibold">پرفروش‌ترین محصولات</h2>
          </header>
          {topProducts.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-foreground-secondary">
              فروشی ثبت نشده است.
            </p>
          ) : (
            <DataTable
              columns={topProductColumns}
              rows={topProducts}
              getRowKey={(r) => r.id}
              density="compact"
            />
          )}
        </section>
      </div>

      {/* Payment summary */}
      <section
        className="rounded-lg border border-border bg-surface"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <header className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <CreditCard size={16} strokeWidth={1.75} className="text-foreground-secondary" />
          <h2 className="text-sm font-semibold">خلاصه پرداخت‌ها (به تفکیک درگاه)</h2>
        </header>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
          {Array.from(byGateway.entries()).map(([gateway, v]) => (
            <div
              key={gateway}
              className="rounded-lg border border-border p-4"
              style={{ borderRadius: "var(--radius-md)", background: "var(--surface-secondary)" }}
            >
              <p className="text-xs text-foreground-tertiary mb-1">{gateway}</p>
              <p className="text-lg font-bold" dir="ltr">{formatPrice(v.amount)}</p>
              <p className="text-xs text-foreground-secondary mt-1">
                {toPersianDigits(v.count)} تراکنش
              </p>
            </div>
          ))}
          {byGateway.size === 0 ? (
            <p className="text-sm text-foreground-secondary">پرداختی ثبت نشده است.</p>
          ) : null}
        </div>
      </section>

      {/* Inventory summary */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Boxes size={16} strokeWidth={1.75} className="text-foreground-secondary" />
          <h2 className="text-sm font-semibold">خلاصه موجودی</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Package}
            label="موجود"
            value={<span dir="ltr">{toPersianDigits(inStock)}</span>}
            description="از مجموع محصولات"
          />
          <StatCard
            icon={AlertTriangle}
            label="موجودی محدود"
            value={<span dir="ltr">{toPersianDigits(lowStock)}</span>}
            description="نزدیک به اتمام"
          />
          <StatCard
            icon={XCircle}
            label="ناموجود"
            value={<span dir="ltr">{toPersianDigits(outStock)}</span>}
            description="نیاز به تأمین"
          />
        </div>
      </section>
    </div>
  );
}
