import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ProductForm } from "@/components/admin/product-form";
import { catalogService } from "@/domains/catalog/service";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    catalogService.getById(id),
    catalogService.listCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        className="mb-3"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "محصولات", href: "/products" },
          { label: product.title },
        ]}
      />

      <PageHeader
        title={product.title}
        description={`آخرین به‌روزرسانی: ${formatDate(product.createdAt)}`}
        eyebrow={`SKU · ${product.sku}`}
      />

      <ProductForm initialValues={product} categories={categories} />
    </div>
  );
}
