import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";

import { Container, Section, Stack, Inline, Grid } from "@/design-system/primitives";
import { Hero } from "@/components/store/hero";
import { CategoryGrid } from "@/components/store/category-grid";
import { ProductGrid } from "@/components/store/product-grid";
import { Button } from "@/components/ui/button";
import { catalogService } from "@/domains/catalog/service";
import { toPersianDigits } from "@/lib/format";

export const metadata = {
  title: "بازار — فروشگاه اینترنتی",
  description:
    "یک فروشگاه اینترنتی مدرن، مینیمال و حرفه‌ای. تجربه خرید روان، سریع و قابل اعتماد.",
};

export default async function HomePage() {
  const [featured, newArrivals, categories] = await Promise.all([
    catalogService.listFeatured(8),
    catalogService.listNewArrivals(4),
    catalogService.listCategories(),
  ]);

  return (
    <main className="bg-background">
      {/* Hero */}
      <Hero />

      {/* Trust badges */}
      <Section spacing="sm" containerSize="default" className="border-y border-border bg-surface/50">
        <Grid cols={2} colsMd={4} gap={4}>
          <TrustBadge icon={Truck} title="ارسال سریع" desc="تحویل ۲ تا ۴ روزه در سراسر کشور" />
          <TrustBadge icon={ShieldCheck} title="ضمانت اصالت" desc="تضمین اصالت و کیفیت کالا" />
          <TrustBadge icon={RefreshCw} title="بازگشت ۷ روزه" desc="امکان بازگشت بدون شرط" />
          <TrustBadge icon={Headphones} title="پشتیبانی ۲۴/۷" desc="پاسخگویی در تمام ساعات" />
        </Grid>
      </Section>

      {/* Categories */}
      {categories.length > 0 ? (
        <Section spacing="lg">
          <SectionHeader
            eyebrow="دسته‌بندی‌ها"
            title="خرید بر اساس دسته"
            description="بهترین محصولات در هر دسته‌بندی، انتخاب‌شده برای شما."
            viewAllHref="/products"
          />
          <CategoryGrid categories={categories} />
        </Section>
      ) : null}

      {/* Featured products */}
      {featured.length > 0 ? (
        <Section spacing="lg" className="bg-surface-secondary/40">
          <SectionHeader
            eyebrow="منتخب فروشگاه"
            title="پرفروش‌ترین محصولات"
            description="پرطرفدارترین کالاها از نگاه مشتریان ما."
            viewAllHref="/products?sort=popular"
          />
          <ProductGrid products={featured} />
        </Section>
      ) : null}

      {/* Promo banner */}
      <Section spacing="lg">
        <PromoBanner />
      </Section>

      {/* New arrivals */}
      {newArrivals.length > 0 ? (
        <Section spacing="lg" className="bg-surface-secondary/40">
          <SectionHeader
            eyebrow="تازه‌ها"
            title="جدیدترین محصولات"
            description="آخرین کالاهای اضافه‌شده به فروشگاه."
            viewAllHref="/products?sort=newest"
          />
          <ProductGrid products={newArrivals} />
        </Section>
      ) : null}
    </main>
  );
}

/* ---------- SectionHeader ---------- */
function SectionHeader({
  eyebrow,
  title,
  description,
  viewAllHref,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  viewAllHref?: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8">
      <Stack gap={1} className="max-w-2xl">
        {eyebrow ? (
          <p className="text-xs font-medium text-foreground-tertiary uppercase tracking-wider">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-foreground-secondary">{description}</p>
        ) : null}
      </Stack>
      {viewAllHref ? (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="self-start sm:self-auto text-primary hover:text-primary-hover"
        >
          <Link href={viewAllHref}>
            مشاهده همه
            <ArrowLeft size={14} strokeWidth={2} />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

/* ---------- Trust badge ---------- */
function TrustBadge({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Inline gap={3} align="start" wrap={false}>
      <span
        className="inline-flex items-center justify-center size-10 shrink-0 rounded-full"
        style={{
          background: "var(--color-brand-50)",
          color: "var(--color-brand-700)",
        }}
      >
        <Icon size={18} strokeWidth={1.75} />
      </span>
      <Stack gap={0.5}>
        <p className="text-sm font-semibold leading-tight">{title}</p>
        <p className="text-xs text-foreground-tertiary leading-snug">{desc}</p>
      </Stack>
    </Inline>
  );
}

/* ---------- Promo banner ---------- */
function PromoBanner() {
  return (
    <div
      className="relative overflow-hidden border border-border/10 shadow-sm"
      style={{
        borderRadius: "var(--radius-2xl)",
        background: "var(--foreground)",
        color: "var(--background)",
      }}
    >
      <div className="grid min-h-[340px] grid-cols-1 items-center md:grid-cols-2">
        {/* Text side */}
        <Stack gap={4} className="relative z-10 p-8 sm:p-10 lg:p-14">
          <span
            className="self-start inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
            style={{
              borderRadius: "var(--radius-full)",
              background: "color-mix(in oklab, var(--background) 16%, transparent)",
              color: "var(--background)",
            }}
          >
            <span className="size-1.5 rounded-full" style={{ background: "var(--background)" }} />
            پیشنهاد ویژه
          </span>
          <h3 className="max-w-sm text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            تا {toPersianDigits(40)}٪ تخفیف
            <br />
            روی کلکسیون پاییز
          </h3>
          <p className="max-w-md text-sm leading-relaxed opacity-80 sm:text-base">
            فقط تا پایان هفته، روی صدها محصول منتخب تخفیف‌های ویژه اعمال شده است.
            فرصت را از دست ندهید.
          </p>
          <Inline gap={3} className="mt-2">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link href="/products?onSale=true">
                مشاهده تخفیف‌ها
                <ArrowLeft size={18} strokeWidth={2} />
              </Link>
            </Button>
          </Inline>
        </Stack>

        {/* Image side */}
        <div className="relative min-h-[260px] self-stretch overflow-hidden md:min-h-0">
          <Image
            src="/images/showcase/hero-studio.webp"
            alt="مجموعه لباس‌های پاییزه"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            priority
          />
        </div>
      </div>
    </div>
  );
}

void Container;
