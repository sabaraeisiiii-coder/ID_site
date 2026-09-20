/**
 * Support page — Server Component. Header + 3-card grid + FAQ accordion + CTA.
 */

import Link from "next/link";
import { Truck, RotateCcw, ShoppingBag, MessageCircleQuestion, ArrowLeft } from "lucide-react";

import { Section, Container, Stack, Grid, Box } from "@/design-system/primitives";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { SupportFaq } from "@/components/shared/support-faq";
import { Button } from "@/components/ui/button";

const SUPPORT_CARDS = [
  {
    icon: Truck,
    title: "پیگیری سفارش",
    description:
      "وضعیت لحظه‌ای سفارش خود را ببینید، زمان تحویل را پیگیری کنید و در صورت تأخیر به ما اطلاع دهید.",
    href: "/account/orders",
    cta: "مشاهده سفارش‌ها",
  },
  {
    icon: RotateCcw,
    title: "بازگشت کالا",
    description:
      "کالای نامناسب را ظرف ۷ روز بازگردانید. روند بازگشت ساده و بدون دردسر است.",
    href: "/pages/returns",
    cta: "راهنمای بازگشت",
  },
  {
    icon: ShoppingBag,
    title: "راهنمای خرید",
    description:
      "هر آنچه برای خرید آسان باید بدانید: از انتخاب محصول تا تسویه حساب و تحویل.",
    href: "/pages/faq",
    cta: "مشاهده راهنما",
  },
];

export default function SupportPage() {
  return (
    <main className="bg-background">
      <Section spacing="md">
        <Container>
          <Stack gap={8}>
            <Stack gap={6}>
              <Breadcrumb items={[{ label: "پشتیبانی" }]} />

              <PageHeader
                title="مرکز پشتیبانی"
                description="به مرکز پشتیبانی ما خوش آمدید. پاسخ سوالات متداول را پیدا کنید یا با تیم ما در ارتباط باشید."
                eyebrow="راهنما و پشتیبانی"
              />
            </Stack>

            {/* 3-card grid */}
            <Grid cols={1} colsSm={2} colsLg={3} gap={5}>
              {SUPPORT_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <Box
                    key={card.title}
                    className="group bg-surface border border-border p-6 shadow-sm transition-colors hover:border-border-hover flex flex-col gap-4"
                    style={{
                      borderRadius: "var(--radius-xl)",
                      transitionDuration: "var(--duration-fast)",
                    }}
                  >
                    <span
                      className="inline-flex h-12 w-12 items-center justify-center rounded-md"
                      style={{
                        background: "var(--surface-secondary)",
                        color: "var(--primary)",
                      }}
                    >
                      <Icon size={24} strokeWidth={1.75} />
                    </span>
                    <Stack gap={2}>
                      <h3 className="text-base font-semibold">{card.title}</h3>
                      <p className="text-sm text-foreground-secondary leading-relaxed">
                        {card.description}
                      </p>
                    </Stack>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="self-start mt-auto -mx-2 text-foreground-secondary hover:text-foreground"
                    >
                      <Link href={card.href}>
                        {card.cta}
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                      </Link>
                    </Button>
                  </Box>
                );
              })}
            </Grid>

            {/* FAQ section */}
            <div
              className="bg-surface border border-border p-6 sm:p-8 shadow-sm"
              style={{ borderRadius: "var(--radius-xl)" }}
            >
              <Stack gap={6}>
                <Stack gap={2}>
                  <div className="inline-flex items-center gap-2">
                    <MessageCircleQuestion size={20} strokeWidth={1.75} className="text-foreground-secondary" />
                    <h2 className="text-lg font-semibold">سوالات متداول</h2>
                  </div>
                  <p className="text-sm text-foreground-secondary">
                    رایج‌ترین سوالات کاربران درباره ارسال، بازگشت کالا، پرداخت و حساب کاربری.
                  </p>
                </Stack>
                <SupportFaq />
              </Stack>
            </div>

            {/* CTA */}
            <div
              className="overflow-hidden border border-border p-6 sm:p-10 text-center flex flex-col items-center gap-3"
              style={{
                borderRadius: "var(--radius-xl)",
                background: "var(--surface-secondary)",
              }}
            >
              <h2 className="text-xl font-bold">هنوز سوال دارید؟</h2>
              <p className="text-sm text-foreground-secondary max-w-md">
                تیم پشتیبانی ما آماده پاسخ به سوالات شماست. همین حالا با ما تماس بگیرید.
              </p>
              <Button asChild size="lg" className="mt-3 h-11">
                <Link href="/contact">
                  <MessageCircleQuestion size={18} />
                  تماس با ما
                </Link>
              </Button>
            </div>
          </Stack>
        </Container>
      </Section>
    </main>
  );
}
