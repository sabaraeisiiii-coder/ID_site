import Link from "next/link";
import { Compass, Home, Search, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/design-system/primitives";
import { Stack, Inline } from "@/design-system/primitives";

export default function NotFound() {
  return (
    <Container className="min-h-[70vh] flex items-center justify-center py-16">
      <Stack gap={6} align="center" className="text-center max-w-lg">
        <div className="relative">
          <h1 className="text-7xl sm:text-9xl font-bold leading-none nums-persian"
            style={{ color: "var(--foreground-tertiary)" }}>۴۰۴</h1>
          <span className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl font-bold"
            style={{ color: "var(--primary)" }}>پیدا نشد</span>
        </div>
        <Stack gap={2} align="center">
          <h2 className="text-xl sm:text-2xl font-bold">صفحه‌ای که دنبالش بودی پیدا نشد</h2>
          <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed max-w-md">
            ممکنه آدرس اشتباه وارد شده باشه یا صفحه حذف شده باشه. می‌تونی به خانه برگردی یا بگردی.
          </p>
        </Stack>
        <Inline gap={3} className="flex-wrap justify-center">
          <Button asChild size="lg"><Link href="/"><Home size={16} className="me-2" />بازگشت به خانه</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/products"><Search size={16} className="me-2" />مشاهده محصولات</Link></Button>
        </Inline>
        <div className="w-full mt-4 pt-6 border-t border-border">
          <p className="text-xs text-foreground-tertiary mb-3 uppercase tracking-wider">صفحات پراستفاده</p>
          <Inline gap={2} className="flex-wrap justify-center">
            {[
              { label: "محصولات", href: "/products" },
              { label: "تماس با ما", href: "/contact" },
              { label: "پشتیبانی", href: "/support" },
              { label: "حساب کاربری", href: "/account" },
              { label: "درباره ما", href: "/pages/about" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border border-border text-foreground-secondary hover:text-foreground hover:border-border-strong transition-colors"
                style={{ transitionDuration: "var(--duration-fast)" }}>
                <Compass size={12} />{l.label}
              </Link>
            ))}
          </Inline>
        </div>
        <p className="text-xs text-foreground-tertiary mt-4">
          اگر فکر می‌کنی مشکل از ماست، با{" "}
          <Link href="/contact" className="font-medium hover:underline" style={{ color: "var(--primary)" }}>پشتیبانی</Link>{" "}
          تماس بگیر.
        </p>
      </Stack>
    </Container>
  );
}
