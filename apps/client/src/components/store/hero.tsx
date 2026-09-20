import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/design-system/primitives";
import { LiquidImageFrame } from "@/components/shared/liquid-image-frame";

export function Hero() {
  return <section className="relative overflow-hidden bg-background py-5 sm:py-8 lg:py-12">
    <div aria-hidden className="absolute inset-x-0 top-0 h-[80%] opacity-60" style={{ background: "radial-gradient(circle at 78% 18%, var(--surface-tertiary), transparent 35%), radial-gradient(circle at 12% 80%, var(--color-brand-50), transparent 32%)" }} />
    <Container className="relative"><div className="grid items-center gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
      <div className="order-2 lg:order-1 hero-enter max-w-xl">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-xs font-semibold text-foreground-secondary shadow-sm backdrop-blur"><Sparkles size={14} className="text-primary" /> انتخاب‌های تازه برای زندگی روزمره</span>
        <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">چیزهای خوب، برای <span className="text-primary">هر روزِ شما.</span></h1>
        <p className="mt-5 max-w-lg text-base leading-8 text-foreground-secondary sm:text-lg">مجموعه‌ای گزیده از پوشاک، اکسسوری و لوازم روزمره با طراحی فکرشده، کیفیت قابل‌اعتماد و تجربه‌ای آرام از خرید آنلاین.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Button asChild size="lg" className="group h-12 px-6 shadow-md transition-transform hover:-translate-y-0.5"><Link href="/products">مشاهده محصولات <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /></Link></Button><Button asChild size="lg" variant="outline" className="h-12 border-border bg-surface/70 px-6 backdrop-blur hover:bg-surface-secondary"><Link href="/products?onSale=true">پیشنهادهای ویژه</Link></Button></div>
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground-secondary">{["ارسال سریع و مطمئن", "تضمین اصالت کالا", "پشتیبانی پاسخ‌گو"].map((item) => <span key={item} className="inline-flex items-center gap-1.5"><Check size={15} className="text-primary" />{item}</span>)}</div>
      </div>
      <div className="relative order-1 hero-enter-delayed lg:order-2"><div aria-hidden className="absolute -inset-5 rounded-[2.5rem] opacity-70 blur-2xl" style={{ background: "var(--surface-tertiary)" }} />
        <LiquidImageFrame className="relative aspect-[1.08/1] rounded-[1.75rem] border border-border bg-surface shadow-xl sm:aspect-[1.3/1]"><Image src="/images/showcase/hero-studio.webp" alt="مجموعه‌ای از محصولات منتخب فروشگاه" fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover" /><div className="absolute inset-x-4 bottom-4 z-[3] flex items-center justify-between rounded-2xl border border-white/25 bg-black/25 px-4 py-3 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6"><div><p className="text-xs opacity-80">انتخاب این هفته</p><p className="mt-0.5 text-sm font-semibold">جزئیات ساده، کیفیت ماندگار</p></div><span className="rounded-full bg-white/15 px-3 py-1 text-xs">جدید</span></div></LiquidImageFrame>
        <div className="absolute -bottom-4 -start-2 z-[4] hidden rounded-2xl border border-border bg-surface p-3 shadow-lg sm:block"><p className="text-lg font-bold text-primary">+۵۰۰</p><p className="text-xs text-foreground-secondary">محصول منتخب</p></div>
      </div>
    </div></Container>
  </section>;
}
