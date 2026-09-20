import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { CategoryForm } from "@/components/admin/category-form";
import { catalogService } from "@/domains/catalog/service";
import { toPersianDigits } from "@/lib/format";

export const dynamic = "force-dynamic";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  const [category, categories] = await Promise.all([
    catalogService.getCategoryById(id),
    catalogService.listCategories(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-3"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "دسته‌بندی‌ها", href: "/categories" },
          { label: category.name },
        ]}
      />

      <PageHeader
        title={category.name}
        description={`${toPersianDigits(category.productCount ?? 0)} محصول در این دسته`}
        eyebrow={`slug · ${category.slug}`}
      />

      <CategoryForm initialValues={category} categories={categories} />
    </div>
  );
}
