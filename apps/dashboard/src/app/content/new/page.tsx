import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ContentForm } from "@/components/admin/content-form";

export const dynamic = "force-dynamic";

export default function NewContentPage() {
  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "محتوا", href: "/content" },
          { label: "صفحه جدید" },
        ]}
      />
      <ContentForm />
    </div>
  );
}
