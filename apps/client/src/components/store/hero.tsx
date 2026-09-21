"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause } from "lucide-react";
import { Container } from "@/design-system/primitives";

const slides = [
  { id: "iphone", kicker: "iPhone 16 Pro", title: "فراتر از تصویر", description: "قدرت حرفه‌ای اپل برای ثبت لحظه‌هایی دقیق‌تر، سریع‌تر و چشم‌گیرتر.", href: "/products?categoryId=c1", image: "/images/products/iphone/iphone-16-pro.jpg", alt: "iPhone 16 Pro", tone: "from-[#090a0d] via-[#19120f] to-[#39281f]", light: false },
  { id: "mac", kicker: "MacBook Air M4", title: "سبک‌تر از همیشه، آمادهٔ هر کار", description: "مک‌بوک ایر با طراحی باریک و عملکرد سریع برای کار و خلاقیت روزانه.", href: "/products?categoryId=c2", image: "/images/products/mac/macbook-air-m4.jpg", alt: "MacBook Air M4", tone: "from-[#edf6ff] via-[#dcecff] to-[#b8d4f8]", light: true },
  { id: "ipad", kicker: "iPad Air M3", title: "فضا برای ایده‌های بزرگ", description: "نمایشگر فراگیر، توان M3 و آزادی بیشتر برای خلق کردن.", href: "/products?categoryId=c3", image: "/images/products/ipad/ipad-air-m3.jpg", alt: "iPad Air M3", tone: "from-[#10111b] via-[#17172a] to-[#302443]", light: false },
  { id: "playstation", kicker: "PlayStation 5", title: "بازی، بدون مرز", description: "جهانی تازه از بازی با پلی‌استیشن ۵ و تجربه‌ای فراتر از انتظار.", href: "/products?categoryId=c6", image: "/images/products/gaming-console.png", alt: "PlayStation 5", tone: "from-[#020b25] via-[#06338d] to-[#031441]", light: false },
] as const;

export function Hero() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduceMotion = React.useRef(false);
  React.useEffect(() => { reduceMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches; }, []);
  React.useEffect(() => {
    if (paused || reduceMotion.current) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, active]);
  const previous = () => setActive((value) => (value - 1 + slides.length) % slides.length);
  const next = () => setActive((value) => (value + 1) % slides.length);
  const slide = slides[active];

  return <section className="bg-background py-3 sm:py-5" aria-roledescription="carousel" aria-label="پیشنهادهای ویژه فروشگاه">
    <Container className="max-w-[1440px] px-3 sm:px-5">
      <div className={`relative isolate min-h-[410px] overflow-hidden rounded-[28px] bg-gradient-to-l ${slide.tone} text-white shadow-[0_25px_60px_-36px_rgba(0,0,0,.8)] sm:min-h-[460px] lg:min-h-[510px]`} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <Image key={slide.image} src={slide.image} alt={slide.alt} fill priority sizes="(max-width: 768px) 100vw, 1440px" className={`object-cover object-center opacity-75 transition-opacity duration-500 ${slide.light ? "mix-blend-multiply" : ""}`} />
        <div className={`absolute inset-0 bg-gradient-to-l ${slide.light ? "from-white via-white/75 to-white/5" : "from-black/90 via-black/55 to-transparent"}`} />
        <div className="relative z-10 flex min-h-[410px] max-w-xl flex-col justify-center px-7 py-16 sm:min-h-[460px] sm:px-12 lg:min-h-[510px] lg:px-16">
          <p className={`mb-3 text-sm font-semibold ${slide.light ? "text-foreground-secondary" : "text-white/75"}`}>{slide.kicker}</p>
          <h1 className={`text-balance text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl ${slide.light ? "text-foreground" : "text-white"}`}>{slide.title}</h1>
          <p className={`mt-5 max-w-md text-sm leading-7 sm:text-base ${slide.light ? "text-foreground-secondary" : "text-white/80"}`}>{slide.description}</p>
        </div>
        <div className="absolute inset-x-5 bottom-5 z-20 flex items-center justify-between sm:inset-x-8"><div className="flex items-center gap-2" role="tablist" aria-label="انتخاب اسلاید">{slides.map((item, index) => <button key={item.id} type="button" role="tab" aria-selected={active === index} aria-label={`اسلاید ${index + 1}`} onClick={() => setActive(index)} className={`h-2 rounded-full transition-all ${active === index ? "w-8 bg-white" : "w-2 bg-white/45 hover:bg-white/70"}`} />)}</div><div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/20 p-1.5 backdrop-blur"><button type="button" onClick={() => setPaused((value) => !value)} className="grid size-8 place-items-center rounded-full text-white/80 hover:bg-white/15 hover:text-white" aria-label={paused ? "ادامهٔ پخش خودکار" : "توقف پخش خودکار"}><Pause size={15} /></button><span className="h-4 w-px bg-white/20" /><button type="button" onClick={previous} className="grid size-8 place-items-center rounded-full text-white hover:bg-white/15" aria-label="اسلاید قبل"><ChevronRight size={18} /></button><button type="button" onClick={next} className="grid size-8 place-items-center rounded-full text-white hover:bg-white/15" aria-label="اسلاید بعد"><ChevronLeft size={18} /></button></div></div>
      </div>
    </Container>
  </section>;
}
