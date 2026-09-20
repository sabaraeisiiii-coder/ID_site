import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RoleForm } from "@/components/admin/role-form";

export const dynamic = "force-dynamic";

export default function NewRolePage() {
  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "نقش‌ها", href: "/roles" },
          { label: "نقش جدید" },
        ]}
      />
      <RoleForm />
    </div>
  );
}
