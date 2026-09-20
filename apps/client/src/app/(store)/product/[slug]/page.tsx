/**
 * Product Detail Page (PDP) — Server Component.
 * Loads product by slug, renders gallery + buy box + tabs (description / attributes / reviews)
 * + related products section at the bottom.
 */

import * as React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MessageSquareText } from "lucide-react";

import { Section, Container, Stack, Inline } from "@/design-system/primitives";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductGrid } from "@/components/store/product-grid";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductBuyBox } from "@/components/store/product-buy-box";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { catalogService } from "@/domains/catalog/service";

export const dynamic = "force-dynamic";

interface PDPProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PDPProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await catalogService.getBySlug(slug);
  if (!product) return { title: "محصول یافت نشد" };
  return {
    title: product.title,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PDPProps) {
  const { slug } = await params;
  const product = await catalogService.getBySlug(slug);
  if (!product) notFound();

  const [category, related] = await Promise.all([
    catalogService.getCategoryById(product.categoryId),
    catalogService.listRelated(product.id, 4),
  ]);

  const descriptionParagraphs = product.description
    .split(/\n\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <main className="bg-background min-h-screen">
      <Section spacing="md" containerSize="default">
        <Stack gap={8}>
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              ...(category ? [{ label: category.name, href: `/products?categoryId=${category.id}` }] : []),
              { label: product.title },
            ]}
          />

          {/* Gallery + Buy Box */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <ProductGallery images={product.images} title={product.title} />
            <ProductBuyBox product={product} />
          </div>

          {/* Tabs: description / attributes / reviews */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="bg-surface-secondary p-1">
              <TabsTrigger value="description">توضیحات</TabsTrigger>
              <TabsTrigger value="attributes">مشخصات</TabsTrigger>
              <TabsTrigger value="reviews">نظرات</TabsTrigger>
            </TabsList>

            {/* Description */}
            <TabsContent value="description">
              <div
                className="bg-surface border border-border p-6 sm:p-8 mt-4"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <Stack gap={4}>
                  <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <h2 className="text-base font-semibold">توضیحات محصول</h2>
                  </div>
                  {descriptionParagraphs.length > 0 ? (
                    <div className="space-y-4">
                      {descriptionParagraphs.map((p, i) => (
                        <p key={i} className="text-sm leading-7 text-foreground-secondary">
                          {p}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground-tertiary">
                      توضیحاتی برای این محصول ثبت نشده است.
                    </p>
                  )}
                </Stack>
              </div>
            </TabsContent>

            {/* Attributes */}
            <TabsContent value="attributes">
              <div
                className="bg-surface border border-border p-6 sm:p-8 mt-4"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <Stack gap={4}>
                  <div className="flex items-center gap-2 pb-3 border-b border-border">
                    <h2 className="text-base font-semibold">مشخصات فنی</h2>
                  </div>
                  {product.attributes && product.attributes.length > 0 ? (
                    <div className="overflow-hidden border border-border" style={{ borderRadius: "var(--radius-md)" }}>
                      <table className="w-full">
                        <tbody className="divide-y divide-border">
                          {product.attributes.map((attr, i) => (
                            <tr key={i} className={i % 2 === 0 ? "bg-surface" : "bg-surface-secondary/50"}>
                              <th
                                scope="row"
                                className="text-sm font-medium text-foreground-secondary py-3 px-4 text-start w-1/3 align-top"
                              >
                                {attr.label}
                              </th>
                              <td className="text-sm text-foreground py-3 px-4 align-top">
                                {attr.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground-tertiary">
                      مشخصات فنی برای این محصول ثبت نشده است.
                    </p>
                  )}
                </Stack>
              </div>
            </TabsContent>

            {/* Reviews */}
            <TabsContent value="reviews">
              <div
                className="bg-surface border border-border mt-4"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <EmptyState
                  icon={MessageSquareText}
                  title="نظرات به‌زودی فعال می‌شوند"
                  description="در حال آماده‌سازی سیستم نظردهی هستیم. به‌زودی می‌توانید تجربه خود را با دیگران به اشتراک بگذارید."
                  size="sm"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Related products */}
          {related.length > 0 ? (
            <section className="pt-4">
              <Stack gap={5}>
                <Inline gap={2} justify="between" align="center">
                  <div>
                    <p className="text-xs font-medium text-foreground-tertiary uppercase tracking-wider">
                      ادامه خرید
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                      محصولات مرتبط
                    </h2>
                  </div>
                </Inline>
                <ProductGrid products={related} />
              </Stack>
            </section>
          ) : null}
        </Stack>
      </Section>

      {/* JSON-LD for product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.title,
            description: product.description,
            sku: product.sku,
            brand: { "@type": "Brand", name: product.brand },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.rating,
              reviewCount: product.ratingCount,
            },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "IRR",
              availability:
                product.stock > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
          }),
        }}
      />
    </main>
  );
}
