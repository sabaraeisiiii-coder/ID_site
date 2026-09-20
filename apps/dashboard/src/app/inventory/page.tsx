import Link from "next/link";
import { Package, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { StatCard } from "@/components/admin/stat-card";
import { FilterTabs } from "@/components/admin/filter-tabs";
import { InventoryTable, type InventoryTableRow } from "@/components/admin/inventory-table";
import { inventoryService } from "@/domains/inventory";
import { catalogService } from "@/domains/catalog/service";
import { toPersianDigits } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type StockFilter = "all" | "in" | "low" | "out";

interface InventoryPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminInventoryPage({ searchParams }: InventoryPageProps) {
  const [inventoryRows, productsResult] = await Promise.all([
    inventoryService.list(),
    catalogService.listProducts({ pageSize: 100 }),
  ]);

  // Build image lookup by productId
  const imageByProductId = new Map<string, string>();
  for (const p of productsResult.items) {
    if (p.images[0]) imageByProductId.set(p.id, p.images[0].url);
  }

  // Join rows with image + product edit href
  const rows: InventoryTableRow[] = inventoryRows.map((r) => ({
    ...r,
    image: imageByProductId.get(r.productId),
    href: `/products/${r.productId}`,
  }));

  // KPI summary
  const totalCount = rows.length;
  const inStockCount = rows.filter((r) => r.status === "in").length;
  const lowStockCount = rows.filter((r) => r.status === "low").length;
  const outStockCount = rows.filter((r) => r.status === "out").length;

  // Active filter from URL
  const rawFilter = (await searchParams).status;
  const activeFilter: StockFilter = (() => {
    const v = Array.isArray(rawFilter) ? rawFilter[0] : rawFilter;
    if (v === "in" || v === "low" || v === "out" || v === "all") return v;
    return "all";
  })();

  const filteredRows = activeFilter === "all"
    ? rows
    : rows.filter((r) => r.status === activeFilter);

  const filterItems: { label: string; value: StockFilter; count: number }[] = [
    { label: "همه", value: "all", count: totalCount },
    { label: "موجود", value: "in", count: inStockCount },
    { label: "موجودی محدود", value: "low", count: lowStockCount },
    { label: "ناموجود", value: "out", count: outStockCount },
  ];

  const buildHref = (value: string) => {
    const params = new URLSearchParams();
    if (value && value !== "all") params.set("status", value);
    const qs = params.toString();
    return qs ? `/inventory?${qs}` : "/inventory";
  };

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-3"
        items={[{ label: "داشبورد", href: "/" }, { label: "موجودی" }]}
      />

      <PageHeader
        title="مدیریت موجودی"
        description="مدیریت موجودی محصولات، تنوع‌ها و آستانه هشدار."
        actions={
          <Button asChild variant="outline">
            <Link href="/products">مدیریت محصولات</Link>
          </Button>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Package}
          label="کل محصولات"
          value={<span dir="ltr">{toPersianDigits(totalCount)}</span>}
          description="مجموع ردیف‌های موجودی"
        />
        <StatCard
          icon={CheckCircle2}
          label="موجود"
          value={<span dir="ltr">{toPersianDigits(inStockCount)}</span>}
          description="موجودی سالم"
        />
        <StatCard
          icon={AlertTriangle}
          label="موجودی محدود"
          value={<span dir="ltr">{toPersianDigits(lowStockCount)}</span>}
          description="نزدیک به اتمام"
        />
        <StatCard
          icon={XCircle}
          label="ناموجود"
          value={<span dir="ltr">{toPersianDigits(outStockCount)}</span>}
          description="نیاز به تأمین فوری"
        />
      </div>

      {/* Filter tabs */}
      <FilterTabs
        items={filterItems}
        activeValue={activeFilter}
        buildHref={buildHref}
      />

      {/* Inventory table */}
      <InventoryTable rows={filteredRows} />
    </div>
  );
}
