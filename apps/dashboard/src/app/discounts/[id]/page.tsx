import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DiscountForm } from "@/components/admin/discount-form";
import { discountService } from "@/domains/discount";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminDiscountEditPage({ params }: PageProps) {
  const { id } = await params;
  const discount = await discountService.getById(id);
  if (!discount) notFound();

  const initialValues = {
    id: discount.id,
    code: discount.code,
    description: discount.description,
    type: discount.type,
    value: discount.value,
    minOrder: discount.minOrder,
    maxDiscount: discount.maxDiscount,
    startsAt: discount.startsAt,
    endsAt: discount.endsAt,
    usageLimit: discount.usageLimit,
    status: discount.status,
  };

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "تخفیف‌ها", href: "/discounts" },
          { label: discount.code },
        ]}
      />
      <DiscountForm initialValues={initialValues} />
    </div>
  );
}
