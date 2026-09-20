import Link from "next/link";
import { Plus, Package } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { catalogService } from "@/domains/catalog/service";
import { ProductsAdminTable } from "@/components/admin/products-admin-table";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [productsResult, categories] = await Promise.all([
    catalogService.listProducts({ pageSize: 50 }),
    catalogService.listCategories(),
  ]);

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-3"
        items={[{ label: "داشبورد", href: "/" }, { label: "محصولات" }]}
      />

      <PageHeader
        title="مدیریت محصولات"
        description={`${categories.length} دسته · ${productsResult.total} محصول`}
        actions={
          <Button asChild>
            <Link href="/products/new">
              <Plus size={16} strokeWidth={2} />
              محصول جدید
            </Link>
          </Button>
        }
      />

      {productsResult.items.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={Package}
            title="هنوز محصولی ثبت نشده"
            description="اولین محصول فروشگاه خود را اضافه کنید تا اینجا نمایش داده شود."
            action={
              <Button asChild>
                <Link href="/products/new">
                  <Plus size={16} strokeWidth={2} />
                  افزودن محصول
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <ProductsAdminTable products={productsResult.items} categories={categories} />
      )}
    </div>
  );
}
