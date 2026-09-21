"use client";

/**
 * StoreFooter — multi-column footer with brand, links, newsletter, social.
 */

import * as React from "react";
import Link from "next/link";
import { Instagram, Send, Twitter, Youtube, Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/design-system/primitives";
import { Stack, Inline } from "@/design-system/primitives";
import { toPersianDigits } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function StoreFooter() {
  const year = toPersianDigits(new Intl.DateTimeFormat("fa-IR", { calendar: "persian", year: "numeric" }).format(new Date()));

  return (
    <footer className="mt-auto border-t border-border bg-foreground text-background" style={{ "--footer-muted": "color-mix(in oklab, var(--background) 72%, transparent)" } as React.CSSProperties} role="contentinfo">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Stack gap={4}>
              <div className="flex items-center gap-2">
                <span className="flex flex-col text-lg font-bold leading-[0.75]" aria-label="ID site"><span className="text-2xl">ID</span><span className="mt-1 text-xs font-semibold">site</span></span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-[var(--footer-muted)]">
                فروشگاه تخصصی ID site برای محصولات اپل و پلی‌استیشن. مشخصات، قیمت و موجودی این نسخه صرفاً داده‌های نمایشی هستند.
              </p>
              <Stack gap={2} className="mt-2">
                <a href={`tel:${siteConfig.contact.phoneLatin}`} className="inline-flex items-center gap-2 text-sm text-[var(--footer-muted)] hover:text-background transition-colors">
                  <Phone size={16} strokeWidth={1.75} className="text-[var(--footer-muted)]" />
                  <span className="nums-persian">{siteConfig.contact.phone}</span>
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center gap-2 text-sm text-[var(--footer-muted)] hover:text-background transition-colors">
                  <Mail size={16} strokeWidth={1.75} className="text-[var(--footer-muted)]" />
                  {siteConfig.contact.email}
                </a>
                <div className="inline-flex items-start gap-2 text-sm text-[var(--footer-muted)]">
                  <MapPin size={16} strokeWidth={1.75} className="mt-0.5 text-[var(--footer-muted)]" />
                  <span>{siteConfig.contact.address}</span>
                </div>
              </Stack>
              <Inline gap={2} className="mt-3">
                <SocialIcon href={siteConfig.social.instagram} label="اینستاگرام"><Instagram size={18} strokeWidth={1.75} /></SocialIcon>
                <SocialIcon href={siteConfig.social.telegram} label="تلگرام"><Send size={18} strokeWidth={1.75} /></SocialIcon>
                <SocialIcon href={siteConfig.social.twitter} label="توییتر"><Twitter size={18} strokeWidth={1.75} /></SocialIcon>
                <SocialIcon href={siteConfig.social.youtube} label="یوتیوب"><Youtube size={18} strokeWidth={1.75} /></SocialIcon>
              </Inline>
            </Stack>
          </div>

          {/* Link columns */}
          {siteConfig.nav.footer.map((col) => (
            <div key={col.title} className="lg:col-span-2">
              <Stack gap={3}>
                <h3 className="text-sm font-semibold text-background">{col.title}</h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-[var(--footer-muted)] hover:text-background transition-colors"
                        style={{ transitionDuration: "var(--duration-fast)" }}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Stack>
            </div>
          ))}

          {/* Newsletter */}
          <div className="lg:col-span-2">
            <Stack gap={3}>
              <h3 className="text-sm font-semibold text-background">خبرنامه</h3>
              <p className="text-xs text-[var(--footer-muted)]">از تخفیف‌ها و محصولات جدید با خبر شو.</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
                <Input type="email" inputMode="email" placeholder="ایمیل شما" aria-label="ایمیل شما" className="h-10 text-sm" />
                <Button type="submit" size="sm" className="h-10">عضویت</Button>
              </form>
            </Stack>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--footer-muted)] nums-persian">© {year} — تمامی حقوق برای {siteConfig.name} محفوظ است.</p>
          <div className="flex items-center gap-2" aria-label="روش‌های پرداخت">
            {["نقدی", "کارت", "اقساط"].map((m) => (
              <span key={m} className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/10 px-2 py-1 text-[10px] font-medium text-[var(--footer-muted)]">{m}</span>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--footer-muted)] hover:bg-white/10 hover:text-background transition-colors"
      style={{ transitionDuration: "var(--duration-fast)" }}>
      {children}
    </a>
  );
}

