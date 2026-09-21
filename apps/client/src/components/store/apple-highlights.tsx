import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/design-system/primitives";

const cards = [
  { title: "جدیدترین آیفون‌ها", kicker: "New iPhone", description: "برای ثبت لحظه‌های هر روز.", href: "/products?categoryId=c1", image: "/images/showcase/iphone-highlight.png", tone: "bg-[#0c0c0e] text-white" },
  { title: "دنیای مک‌بوک", kicker: "New Mac", description: "سبک، آرام و آمادهٔ کار.", href: "/products?categoryId=c2", image: "/images/showcase/mac-highlight.png", tone: "bg-surface-secondary text-foreground" },
  { title: "قدرت برای حرفه‌ای‌ها", kicker: "New Mac Pro", description: "فضا برای پروژه‌های بزرگ.", href: "/products?categoryId=c2", image: "/images/showcase/mac-pro-highlight.png", tone: "bg-[#14131a] text-white" },
  { title: "خلاقیت با آیپد", kicker: "New iPad Air", description: "یک بوم سبک برای ایده‌های شما.", href: "/products?categoryId=c3", image: "/images/showcase/ipad-highlight.png", tone: "bg-[#dceeff] text-foreground" },
];

export function AppleHighlights() {
  return <section className="py-8 sm:py-12"><Container>
    <div className="mb-5 flex items-baseline justify-between gap-4"><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">آخرین‌ها، <span className="text-foreground-secondary">جدیدترین محصولات اپل</span></h2><Link href="/products?sort=newest" className="shrink-0 text-sm font-medium text-primary hover:underline">مشاهده همه</Link></div>
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible" dir="rtl">
      {cards.map((card) => <Link key={card.kicker} href={card.href} className={`group relative h-[420px] min-w-[78vw] snap-start overflow-hidden rounded-[var(--radius-2xl)] border border-border/50 p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 md:min-w-0 ${card.tone}`}>
        <div className="relative z-10"><p className="text-sm font-semibold opacity-80" dir="ltr">{card.kicker}</p><h3 className="mt-3 text-xl font-bold leading-tight">{card.title}</h3><p className="mt-2 text-sm opacity-80">{card.description}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">مشاهده <ArrowLeft size={15} /></span></div>
        <Image src={card.image} alt={card.title} fill sizes="(max-width: 768px) 78vw, 25vw" className="object-cover object-bottom transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/25 to-transparent" aria-hidden />
      </Link>)}
    </div>
  </Container></section>;
}
