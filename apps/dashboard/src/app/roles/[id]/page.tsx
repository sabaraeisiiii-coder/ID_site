import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { RoleForm } from "@/components/admin/role-form";
import { roleService } from "@/domains/role";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRolePage({ params }: PageProps) {
  const { id } = await params;
  const role = await roleService.getById(id);
  if (!role) notFound();

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "نقش‌ها", href: "/roles" },
          { label: role.name },
        ]}
      />
      <RoleForm
        isEdit
        initialValues={{
          name: role.name,
          description: role.description,
          status: role.status,
          permissions: role.permissions,
          userCount: role.userCount,
          createdAt: role.createdAt,
        }}
      />
    </div>
  );
}
