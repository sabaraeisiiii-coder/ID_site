/**
 * Dynamic CMS page — Server Component, fetches by slug, renders article.
 */

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { contentService } from "@/domains/content";
import { Section, Container, Stack } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { formatDate } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await contentService.getBySlug(slug);
  if (!page) return { title: "صفحه یافت نشد" };
  return { title: page.title };
}

export default async function CmsPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await contentService.getBySlug(slug);

  if (!page || page.status !== "active") {
    notFound();
  }

  const paragraphs = page.body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <main className="bg-background">
      <Section spacing="md" containerSize="md">
        <Stack gap={6}>
          <Breadcrumb
            items={[
              { label: "صفحات" },
              { label: page.title },
            ]}
          />

          <article
            className="bg-surface border border-border p-6 sm:p-10 shadow-sm"
            style={{ borderRadius: "var(--radius-xl)" }}
          >
            <header className="flex flex-col gap-2 pb-6 border-b border-border">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
                {page.title}
              </h1>
              <p className="text-xs text-foreground-tertiary nums-persian">
                آخرین به‌روزرسانی: {formatDate(page.updatedAt)}
              </p>
            </header>

            <div className="pt-6 flex flex-col gap-5">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="leading-relaxed text-foreground-secondary whitespace-pre-line text-[15px]"
                >
                  {para}
                </p>
              ))}
            </div>
          </article>
        </Stack>
      </Section>
    </main>
  );
}
