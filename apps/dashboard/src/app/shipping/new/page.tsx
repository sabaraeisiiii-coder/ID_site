import { ShippingForm } from "@/components/admin/shipping-form";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export default function AdminShippingNewPage() {
  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "روش‌های ارسال", href: "/shipping" },
          { label: "روش جدید" },
        ]}
      />
      <ShippingForm />
    </div>
  );
}
