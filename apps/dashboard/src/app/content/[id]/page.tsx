import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ContentForm } from "@/components/admin/content-form";
import { contentService } from "@/domains/content";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditContentPage({ params }: PageProps) {
  const { id } = await params;
  const page = await contentService.getById(id);
  if (!page) notFound();

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "محتوا", href: "/content" },
          { label: page.title },
        ]}
      />
      <ContentForm
        isEdit
        initialValues={{
          title: page.title,
          slug: page.slug,
          body: page.body,
          status: page.status,
          updatedAt: page.updatedAt,
        }}
      />
    </div>
  );
}
