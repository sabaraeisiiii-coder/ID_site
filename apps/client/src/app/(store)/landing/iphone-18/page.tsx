import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/design-system/primitives";

export const metadata = {
  title: "iPhone 18 — معرفی نمایشی | ID store",
  description: "لندینگ نمایشی iPhone 18 در فروشگاه ID store.",
};

const highlights = [
  ["طراحی یکپارچه", "فرم مینیمال برای حضور پررنگ‌تر در دست."],
  ["نمایشگر فراگیر", "فضای بیشتر برای دیدن، ساختن و ارتباط گرفتن."],
  ["قدرت برای هر روز", "یک تجربهٔ سریع و روان در جریان کارهای روزانه."],
];
const colors = ["#111318", "#e7ded3", "#8794a6", "#c7a291"];

export default function IPhone18LandingPage() {
  return <main className="overflow-hidden bg-background">
    <section className="relative isolate overflow-hidden bg-[#090a0d] py-14 text-white sm:py-20 lg:py-28">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,#6f4d3b_0%,transparent_28%),radial-gradient(circle_at_20%_80%,#172344_0%,transparent_32%)]" />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div className="order-2 max-w-xl lg:order-1"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/75"><Sparkles size={14} /> معرفی نمایشی ID store</span><p className="mt-7 text-lg font-medium text-white/75">iPhone 18</p><h1 className="mt-2 text-5xl font-bold leading-none tracking-tight sm:text-7xl">فقط یک<br />نگاه کافی‌ست.</h1><p className="mt-6 max-w-md text-base leading-8 text-white/70">یک صفحهٔ مفهومی برای تجربهٔ نسل تازهٔ آیفون. رنگ‌ها، ظرفیت‌ها و مشخصات نهایی هنگام عرضه و تأیید رسمی به‌روزرسانی می‌شوند.</p><div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/products?categoryId=c1">مشاهده آیفون‌ها <ArrowLeft size={17} /></Link></Button><Button asChild variant="outline" size="lg" className="border-white/20 bg-white/5 text-white hover:bg-white/15 hover:text-white"><Link href="/support">مشاورهٔ خرید</Link></Button></div></div>
        <div className="relative order-1 mx-auto aspect-square w-full max-w-2xl lg:order-2"><div aria-hidden className="absolute inset-10 rounded-full bg-[#806451]/30 blur-3xl" /><Image src="/images/products/iphone/iphone-18-pro.png" alt="iPhone 18 Pro" fill priority sizes="(max-width: 1024px) 90vw, 55vw" className="object-contain drop-shadow-[0_28px_34px_rgba(0,0,0,.55)]" /></div>
      </Container>
    </section>

    <Section spacing="xl"><Container><div className="mx-auto max-w-2xl text-center"><p className="text-sm font-semibold text-primary">یک تجربهٔ متمرکز</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">کمتر حواس‌پرتی، بیشتر آنچه مهم است.</h2></div><div className="mt-12 grid gap-4 md:grid-cols-3">{highlights.map(([title, description], index) => <article key={title} className="rounded-[var(--radius-xl)] border border-border bg-surface p-6"><span className="text-sm font-semibold text-primary">۰{index + 1}</span><h3 className="mt-6 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-foreground-secondary">{description}</p></article>)}</div></Container></Section>

    <Section spacing="xl" className="bg-surface-secondary/55"><Container className="grid items-center gap-10 lg:grid-cols-2"><div><p className="text-sm font-semibold text-primary">شخصی برای شما</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">رنگی که با شما هماهنگ است.</h2><p className="mt-5 max-w-lg leading-8 text-foreground-secondary">گزینه‌های رنگ و ظرفیت در این معرفی، صرفاً برای نمایش ساختار انتخاب محصول هستند و وضعیت نهایی آن‌ها به تأیید رسمی وابسته است.</p><div className="mt-7 flex gap-3">{colors.map((color) => <span key={color} className="size-10 rounded-full border-4 border-background shadow-sm" style={{ background: color }} />)}</div></div><div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-2xl)] bg-gradient-to-br from-[#f1ece7] to-[#bfa78d]"><Image src="/images/products/iphone/iphone-18-pro.png" alt="نمایش iPhone 18 Pro" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-contain p-10" /></div></Container></Section>

    <Section spacing="xl"><Container><div className="rounded-[var(--radius-2xl)] bg-foreground px-7 py-12 text-background sm:px-12 sm:py-16"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><h2 className="text-3xl font-bold">برای روز عرضه آماده باشید.</h2><p className="mt-3 max-w-xl text-sm leading-7 text-background/70">برای اطلاع از وضعیت عرضه و موجودی، محصولات خانوادهٔ iPhone را دنبال کنید.</p></div><Button asChild size="lg" variant="secondary"><Link href="/products?categoryId=c1">مشاهده محصولات <ArrowLeft size={17} /></Link></Button></div><div className="mt-10 grid gap-3 border-t border-white/15 pt-7 text-sm text-background/75 sm:grid-cols-3">{["اطلاعات عرضه پس از تأیید رسمی", "هماهنگ با RTL و حالت تاریک", "پشتیبانی پیش از خرید"].map((item) => <span key={item} className="inline-flex items-center gap-2"><Check size={16} className="text-primary" />{item}</span>)}</div></div></Container></Section>
  </main>;
}
