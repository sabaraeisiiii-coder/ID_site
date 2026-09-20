import { DiscountForm } from "@/components/admin/discount-form";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export default function AdminDiscountNewPage() {
  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "تخفیف‌ها", href: "/discounts" },
          { label: "تخفیف جدید" },
        ]}
      />
      <DiscountForm />
    </div>
  );
}
