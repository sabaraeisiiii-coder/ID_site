import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, Truck, RefreshCw, Headphones } from "lucide-react";

import { Container, Section, Stack, Inline, Grid } from "@/design-system/primitives";
import { Hero } from "@/components/store/hero";
import { AppleHighlights } from "@/components/store/apple-highlights";
import { HomepageCategoryStrip } from "@/components/store/homepage-category-strip";
import { ProductGrid } from "@/components/store/product-grid";
import { Button } from "@/components/ui/button";
import { catalogService } from "@/domains/catalog/service";
import { toPersianDigits } from "@/lib/format";

export const metadata = {
  title: "ID store — اپل و پلی‌استیشن",
  description:
    "فروشگاه تخصصی محصولات اپل و پلی‌استیشن؛ همهٔ اطلاعات این نسخه نمایشی هستند.",
};

export default async function HomePage() {
  const [catalog, selectedProducts, categories] = await Promise.all([
    catalogService.listProducts({ pageSize: 200 }),
    catalogService.listFeatured(10),
    catalogService.listCategories(),
  ]);
  const allProducts = catalog.items;
  const takeSection = (items: typeof allProducts) => items.slice(0, 20);
  const appleProducts = selectedProducts;
  const accessories = takeSection(allProducts.filter((product) => product.badges?.some((badge) => badge.label === "منتخب لوازم جانبی")));
  const stockProducts = takeSection(allProducts.filter((product) => product.badges?.some((badge) => badge.type === "limited")));
  const newProducts = takeSection(allProducts.filter((product) => product.isNew));
  const macProducts = takeSection(allProducts.filter((product) => product.badges?.some((badge) => badge.label === "منتخب مک")));
  const ipadProducts = takeSection(allProducts.filter((product) => product.badges?.some((badge) => badge.label === "منتخب آیپد")));
  const watchProducts = takeSection(allProducts.filter((product) => product.badges?.some((badge) => badge.label === "منتخب ساعت")));
  const airpodsProducts = takeSection(allProducts.filter((product) => product.badges?.some((badge) => badge.label === "منتخب صوتی")));
  const playstationProducts = takeSection(allProducts.filter((product) => product.categoryId === "cat-playstation"));

  return (
    <main className="bg-background">
      {/* Hero */}
      <Hero />
      <AppleHighlights />

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
            title="خرید بر اساس خانوادهٔ محصول"
            description="اپل، پلی‌استیشن و لوازم جانبی سازگار در یک کاتالوگ تخصصی."
            viewAllHref="/products"
          />
          <HomepageCategoryStrip categories={categories} />
        </Section>
      ) : null}

      <Section spacing="lg" className="pt-0">
        <div className="grid gap-4 lg:grid-cols-2">
          <FeatureBanner title="MacBook Air M3" description="سبک، قدرتمند و آمادهٔ کارهای بزرگ." href="/products?categoryId=cat-mac" image="/images/products/catalog/mac-official.png" tone="bg-[#eaf3ff] text-foreground" />
          <FeatureBanner title="iPad Air M3" description="یک بوم فراگیر برای ایده‌هایی که بزرگ‌تر می‌شوند." href="/products?categoryId=cat-ipad" image="/images/products/catalog/ipad-official.png" tone="bg-[#10131f] text-white" />
        </div>
      </Section>

      {/* Featured products */}
      {appleProducts.length > 0 ? (
        <Section spacing="lg" className="bg-surface-secondary/40">
          <SectionHeader
            eyebrow="منتخب فروشگاه"
            title="محصولات منتخب اپل"
            description="انتخاب‌های نمایشی از خانواده‌های اصلی اپل و PlayStation."
            viewAllHref="/products?sort=popular"
          />
          <ProductGrid products={appleProducts} />
        </Section>
      ) : null}

      {/* Promo banner */}
      {playstationProducts.length > 0 ? <Section spacing="lg"><PromoBanner /></Section> : null}

      {stockProducts.length > 0 ? (
        <Section spacing="lg" className="bg-surface-secondary/40">
          <SectionHeader
            eyebrow="استوک ویژه"
            title="محصولات استوک"
            description="انتخاب‌های نمونه با وضعیت شفاف؛ پیش از خرید نهایی، وضعیت فنی و قیمت استعلام می‌شود."
            viewAllHref="/products?sort=newest"
          />
          <ProductGrid products={stockProducts} />
        </Section>
      ) : null}

      {newProducts.length > 0 ? <CatalogSection eyebrow="تازه رسیده" title="جدیدترین محصولات فروشگاه" products={newProducts} href="/products?sort=newest" /> : null}
      {macProducts.length > 0 ? <CatalogSection eyebrow="خانواده Mac" title="محصولات منتخب Mac" products={macProducts} href="/products?categoryId=cat-mac" /> : null}
      {ipadProducts.length > 0 ? <CatalogSection eyebrow="خانواده iPad" title="آیپد برای کار و خلاقیت" products={ipadProducts} href="/products?categoryId=cat-ipad" muted /> : null}
      {watchProducts.length > 0 ? <CatalogSection eyebrow="Apple Watch" title="ساعت‌های اپل" products={watchProducts} href="/products?categoryId=cat-apple-watch" /> : null}
      {airpodsProducts.length > 0 ? <CatalogSection eyebrow="AirPods" title="صدای شخصی اپل" products={airpodsProducts} href="/products?categoryId=cat-airpods" muted /> : null}

      {/* Compatible accessories */}
      {accessories.length > 0 ? (
        <Section spacing="lg" className="bg-surface-secondary/40">
          <SectionHeader
            eyebrow="لوازم سازگار"
            title="لوازم جانبی محبوب"
            description="انتخاب‌های نمایشی سازگار با محصولات اپل."
            viewAllHref="/products?categoryId=cat-apple-accessories"
          />
          <ProductGrid products={accessories} />
        </Section>
      ) : null}

      {playstationProducts.length > 0 ? <CatalogSection eyebrow="PlayStation" title="کنسول‌های PS4 و PS5" products={playstationProducts} href="/products?categoryId=c6" muted /> : null}
    </main>
  );
}

function CatalogSection({ eyebrow, title, products, href, muted = false }: { eyebrow: string; title: string; products: Awaited<ReturnType<typeof catalogService.listFeatured>>; href: string; muted?: boolean }) {
  return <Section spacing="lg" className={muted ? "bg-surface-secondary/40" : undefined}><SectionHeader eyebrow={eyebrow} title={title} viewAllHref={href} /><ProductGrid products={products} /></Section>;
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
            دنیای بازی
          </span>
          <h3 className="max-w-sm text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
            پلی‌استیشن،
            <br />
            بدون محدودیت
          </h3>
          <p className="max-w-md text-sm leading-relaxed opacity-80 sm:text-base">
            کنسول‌های PS4 و PS5 و لوازم سازگار را در کاتالوگ تخصصی ID store ببینید. داده‌های این بخش نمایشی هستند.
          </p>
          <Inline gap={3} className="mt-2">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link href="/products?categoryId=c6">
                مشاهده محصولات
                <ArrowLeft size={18} strokeWidth={2} />
              </Link>
            </Button>
          </Inline>
        </Stack>

        {/* Image side */}
        <div className="relative min-h-[260px] self-stretch overflow-hidden md:min-h-0">
          <Image
            src="/images/products/gaming-console.png"
            alt="کنسول بازی در چیدمان استودیویی"
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

function FeatureBanner({ title, description, href, image, tone }: { title: string; description: string; href: string; image: string; tone: string }) {
  return <div className={`relative min-h-[245px] overflow-hidden rounded-[var(--radius-2xl)] ${tone}`}>
    <Image src={image} alt={title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-70" />
    <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-black/15 to-transparent" />
    <div className="relative z-10 flex min-h-[245px] max-w-sm flex-col justify-center p-7 sm:p-9"><p className="text-xl font-bold sm:text-2xl">{title}</p><p className="mt-2 text-sm opacity-80">{description}</p><Button asChild size="sm" className="mt-5 w-fit"><Link href={href}>مشاهده محصولات <ArrowLeft size={15} /></Link></Button></div>
  </div>;
}

void Container;
