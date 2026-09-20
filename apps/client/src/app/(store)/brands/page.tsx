/**
 * Brands placeholder page — uses EmptyState with CTA to products.
 */

import Link from "next/link";
import { Tag } from "lucide-react";

import { Section, Container, Stack } from "@/design-system/primitives";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function BrandsPage() {
  return (
    <main className="bg-background">
      <Section spacing="md">
        <Container>
          <Stack gap={6}>
            <Breadcrumb items={[{ label: "برندها" }]} />

            <PageHeader
              title="برندها"
              description="فهرست کامل برندهای موجود در فروشگاه ما به‌زودی در دسترس خواهد بود."
              eyebrow="کاتالوگ"
            />

            <div
              className="bg-surface border border-border shadow-sm"
              style={{ borderRadius: "var(--radius-xl)" }}
            >
              <EmptyState
                icon={Tag}
                title="بخش برندها به‌زودی فعال می‌شود"
                description="در حال گردآوری فهرست کاملی از برندهای منتخب هستیم. تا آن زمان، می‌توانید محصولات را مرور کنید."
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
