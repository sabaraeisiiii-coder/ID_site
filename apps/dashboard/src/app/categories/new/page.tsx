import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { CategoryForm } from "@/components/admin/category-form";
import { catalogService } from "@/domains/catalog/service";

export const dynamic = "force-dynamic";

export default async function NewCategoryPage() {
  const categories = await catalogService.listCategories();

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-3"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "دسته‌بندی‌ها", href: "/categories" },
          { label: "دسته جدید" },
        ]}
      />

      <PageHeader
        title="دسته‌بندی جدید"
        description="یک دسته‌بندی جدید برای سازماندهی محصولات ایجاد کنید."
      />

      <CategoryForm categories={categories} />
    </div>
  );
}
