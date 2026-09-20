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
    <footer className="mt-auto border-t border-border bg-surface" role="contentinfo">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand + contact */}
          <div className="lg:col-span-4">
            <Stack gap={4}>
              <div className="flex items-center gap-2">
                <Logo />
                <span className="text-lg font-bold">{siteConfig.name}</span>
              </div>
              <p className="text-sm text-foreground-secondary leading-relaxed max-w-sm">
                فروشگاه اینترنتی {siteConfig.name}، تجربه خرید مدرن و حرفه‌ای. محصولاتی که انتخاب می‌کنیم، جزو بهترین‌ها در دسته‌شان هستند.
              </p>
              <Stack gap={2} className="mt-2">
                <a href={`tel:${siteConfig.contact.phoneLatin}`} className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors">
                  <Phone size={16} strokeWidth={1.75} className="text-foreground-tertiary" />
                  <span className="nums-persian">{siteConfig.contact.phone}</span>
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors">
                  <Mail size={16} strokeWidth={1.75} className="text-foreground-tertiary" />
                  {siteConfig.contact.email}
                </a>
                <div className="inline-flex items-start gap-2 text-sm text-foreground-secondary">
                  <MapPin size={16} strokeWidth={1.75} className="text-foreground-tertiary mt-0.5" />
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
                <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-foreground-secondary hover:text-foreground transition-colors"
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
              <h3 className="text-sm font-semibold text-foreground">خبرنامه</h3>
              <p className="text-xs text-foreground-secondary">از تخفیف‌ها و محصولات جدید با خبر شو.</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
                <Input type="email" inputMode="email" placeholder="ایمیل شما" aria-label="ایمیل شما" className="h-10 text-sm" />
                <Button type="submit" size="sm" className="h-10">عضویت</Button>
              </form>
            </Stack>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground-tertiary nums-persian">© {year} — تمامی حقوق برای {siteConfig.name} محفوظ است.</p>
          <div className="flex items-center gap-2" aria-label="روش‌های پرداخت">
            {["نقدی", "کارت", "اقساط"].map((m) => (
              <span key={m} className="inline-flex items-center justify-center px-2 py-1 rounded-md text-[10px] font-medium bg-surface-secondary text-foreground-tertiary border border-border">{m}</span>
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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground-secondary hover:text-foreground hover:bg-surface-secondary transition-colors"
      style={{ transitionDuration: "var(--duration-fast)" }}>
      {children}
    </a>
  );
}

function Logo() {
  return (
    <span aria-hidden className="inline-flex items-center justify-center rounded-lg"
      style={{ width: 32, height: 32, background: "var(--primary)", color: "var(--primary-foreground)" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 7 L12 4 L19 7 L19 17 L12 20 L5 17 Z"
          stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
        <path d="M9 10 L9 15 M12 8 L12 16 M15 10 L15 15"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}
