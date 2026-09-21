import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/design-system/primitives";

const promises = ["ارسال سریع و مطمئن", "تضمین اصالت کالا", "پشتیبانی پاسخ‌گو"];

export function Hero() {
  return <section className="relative overflow-hidden bg-background py-7 sm:py-10 lg:py-14">
    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_82%_25%,color-mix(in_oklab,var(--color-brand-50)_70%,transparent),transparent_27%),radial-gradient(circle_at_13%_80%,var(--surface-secondary),transparent_35%)]" />
    <Container className="relative">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.18fr] lg:gap-16">
        <div className="order-2 max-w-xl lg:order-1 lg:justify-self-end">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-2 text-xs font-semibold text-foreground-secondary shadow-sm backdrop-blur"><Sparkles size={14} className="text-primary" /> ID site / انتخاب‌های دقیق</span>
          <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3.65rem]">اپل و پلی‌استیشن،<br /><span className="text-primary">برای هر روز شما.</span></h1>
          <p className="mt-5 max-w-lg text-base leading-8 text-foreground-secondary sm:text-lg">محصولات منتخب اپل و کنسول‌های PlayStation با تجربهٔ خرید ساده، شفاف و دقیق.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg" className="group h-[52px] px-6 text-base shadow-lg shadow-primary/20"><Link href="/products">مشاهده محصولات <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /></Link></Button><Button asChild size="lg" variant="outline" className="h-[52px] bg-surface/70 px-6 text-base backdrop-blur hover:bg-surface-secondary"><Link href="/products?categoryId=c6">دنیای پلی‌استیشن</Link></Button></div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-foreground-secondary">{promises.map((item) => <span key={item} className="inline-flex items-center gap-1.5"><Check size={16} className="text-primary" />{item}</span>)}</div>
        </div>
        <div className="relative order-1 lg:order-2">
          <div aria-hidden className="absolute -inset-5 rounded-[2.75rem] bg-surface-secondary/70 blur-2xl" />
          <div className="relative aspect-[1.05/1] overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-surface shadow-[0_24px_65px_-32px_color-mix(in_oklab,var(--foreground)_45%,transparent)] sm:aspect-[1.35/1]">
            <Image src="/images/showcase/id-site-devices.png" alt="چیدمان مینیمال دستگاه‌های دیجیتال" fill priority sizes="(max-width: 1024px) 100vw, 56vw" className="object-cover" />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6"><div><p className="text-xs text-white/70">انتخاب این هفته</p><p className="mt-0.5 text-sm font-semibold">طراحی دقیق، تکنولوژی ماندگار</p></div><span className="rounded-full bg-white/15 px-3 py-1 text-xs">جدید</span></div>
          </div>
        </div>
      </div>
    </Container>
  </section>;
}
