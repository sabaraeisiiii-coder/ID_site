/**
 * Blog placeholder page — uses EmptyState with CTA to products.
 */

import Link from "next/link";
import { Newspaper } from "lucide-react";

import { Section, Container, Stack } from "@/design-system/primitives";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function BlogPage() {
  return (
    <main className="bg-background">
      <Section spacing="md">
        <Container>
          <Stack gap={6}>
            <Breadcrumb items={[{ label: "مجله" }]} />

            <PageHeader
              title="مجله"
              description="مقالات، راهنماهای خرید و داستان‌های پشت محصولات به‌زودی منتشر می‌شوند."
              eyebrow="محتوای ویراستاری"
            />

            <div
              className="bg-surface border border-border shadow-sm"
              style={{ borderRadius: "var(--radius-xl)" }}
            >
              <EmptyState
                icon={Newspaper}
                title="مجله به‌زودی راه‌اندازی می‌شود"
                description="ما در حال آماده‌سازی مقالات و راهنماهای تخصصی هستیم. منتظر مطالب جذاب و کاربردی باشید."
                action={
                  <Button asChild size="lg" className="h-11">
                    <Link href="/products">مشاهده محصولات</Link>
                  </Button>
                }
              />
            </div>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
