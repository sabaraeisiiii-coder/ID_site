import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProductForm } from "@/components/admin/product-form";
import { catalogService } from "@/domains/catalog/service";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await catalogService.listCategories();

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-3"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "محصولات", href: "/products" },
          { label: "محصول جدید" },
        ]}
      />

      <PageHeader
        title="محصول جدید"
        description="یک محصول جدید به کاتالوگ فروشگاه اضافه کنید."
      />

      <ProductForm categories={categories} />
    </div>
  );
}
