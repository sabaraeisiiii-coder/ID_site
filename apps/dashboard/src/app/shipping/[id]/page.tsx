import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ShippingForm } from "@/components/admin/shipping-form";
import { shippingService } from "@/domains/shipping";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminShippingEditPage({ params }: PageProps) {
  const { id } = await params;
  const method = await shippingService.getById(id);
  if (!method) notFound();

  const initialValues = {
    id: method.id,
    name: method.name,
    description: method.description,
    price: method.price,
    estimatedDays: method.estimatedDays,
    status: method.status,
    sortOrder: method.sortOrder,
  };

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "روش‌های ارسال", href: "/shipping" },
          { label: method.name },
        ]}
      />
      <ShippingForm initialValues={initialValues} />
    </div>
  );
}
