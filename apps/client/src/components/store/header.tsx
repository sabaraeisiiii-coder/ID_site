"use client";

/**
 * StoreHeader — sticky header with logo, mega menu, search trigger, account,
 * wishlist, cart + theme switcher + mobile drawer.
 */

import * as React from "react";
import Link from "next/link";
import { User, Heart, ShoppingBag, Menu, Search, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useCartStore, useWishlistStore } from "@/domains/cart/store";
import { ThemeSwitcher } from "./theme-switcher";
import { MegaMenu } from "./mega-menu";
import { useCart } from "./cart-drawer-provider";
import { useSearch } from "./search-command-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Container } from "@/design-system/primitives";
import { toPersianDigits } from "@/lib/format";

export function StoreHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const { openCart } = useCart();
  const { openSearch } = useSearch();

  const cartCount = useCartStore((s) => s.items.reduce((n, x) => n + x.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.ids.length);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 w-full transition-all"
      style={{
        zIndex: "var(--z-sticky)",
        background: scrolled ? "color-mix(in oklab, var(--background) 92%, transparent)" : "var(--background)",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transitionDuration: "var(--duration-normal)",
      }}
    >
      <div className="hidden border-b border-white/10 bg-foreground py-1.5 text-[11px] text-background lg:block">
        <Container className="flex items-center justify-between"><span>ارسال سریع به سراسر ایران</span><span>اطلاعات قیمت و موجودی در این نسخه نمایشی است</span></Container>
      </div>
      <Container className="flex max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8" style={{ height: "84px" }}>
        {/* Right (RTL): logo + nav */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" className="flex shrink-0" aria-label={siteConfig.name}>
            <BrandWordmark className="inline-flex" />
          </Link>
        </div>

        {/* Center: search trigger */}
        <button
          type="button"
          onClick={openSearch}
          className="hidden md:flex items-center gap-2 h-11 px-4 rounded-full bg-surface-secondary border border-border/70 hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 transition-colors max-w-2xl flex-1 mx-auto text-start"
          aria-label="جستجو"
        >
          <Search size={16} strokeWidth={1.75} className="text-foreground-tertiary" />
          <span className="flex-1 text-sm text-foreground-tertiary">جستجوی محصول، برند یا دسته‌بندی...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 h-6 px-1.5 rounded border border-border bg-surface text-[10px] font-mono text-foreground-tertiary">
            ⌘K
          </kbd>
        </button>

        {/* Left (RTL): actions */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={openSearch}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground-secondary hover:bg-surface-secondary transition-colors"
            aria-label="جستجو"
          >
            <Search size={20} strokeWidth={1.75} />
          </button>

          <ThemeSwitcher />

          <Link
            href="/account"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
            aria-label="حساب کاربری"
          >
            <User size={20} strokeWidth={1.75} />
          </Link>

          <Link
            href="/account/wishlist"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
            aria-label="علاقه‌مندی‌ها"
          >
            <Heart size={20} strokeWidth={1.75} />
            <CountBadge count={wishlistCount} />
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
            aria-label="سبد خرید"
          >
            <ShoppingBag size={20} strokeWidth={1.75} />
            <CountBadge count={cartCount} highlight />
          </button>

          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="منو"
                className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-surface-secondary transition-colors"
              >
                <Menu size={22} strokeWidth={1.75} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm p-0">
              <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <BrandWordmark />
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-[calc(100vh-72px)]">
                <nav className="flex flex-col">
                  {siteConfig.nav.main.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center justify-between px-5 py-3.5 text-sm font-medium border-b border-border hover:bg-surface-secondary transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronLeft size={16} className="text-foreground-tertiary" />
                    </Link>
                  ))}
                </nav>
                <div className="p-5 border-t border-border mt-2 flex flex-col gap-3">
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/account" onClick={() => setMobileNavOpen(false)}>
                      <User size={18} className="me-2" /> حساب کاربری
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/account/wishlist" onClick={() => setMobileNavOpen(false)}>
                      <Heart size={18} className="me-2" /> علاقه‌مندی‌ها
                      {wishlistCount > 0 ? (
                        <span className="ms-auto text-xs text-foreground-tertiary nums-persian">
                          {toPersianDigits(wishlistCount)}
                        </span>
                      ) : null}
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start" onClick={() => { setMobileNavOpen(false); openCart(); }}>
                    <span>
                      <ShoppingBag size={18} className="me-2" /> سبد خرید
                      {cartCount > 0 ? (
                        <span className="ms-auto text-xs nums-persian">{toPersianDigits(cartCount)} کالا</span>
                      ) : null}
                    </span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
      <div className="hidden border-t border-border/70 lg:block">
        <Container className="flex h-12 max-w-[1440px] items-center gap-2 px-5 sm:px-8">
          <MegaMenu />
          {siteConfig.nav.main.slice(1).map((item) => <Link key={item.href} href={item.href} className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground-secondary transition-colors hover:bg-surface-secondary hover:text-foreground">{item.label}</Link>)}
        </Container>
      </div>
    </header>
  );
}

function CountBadge({ count, highlight = false }: { count: number; highlight?: boolean }) {
  if (count <= 0) return null;
  return (
    <span
      className={cn(
        "absolute -top-0.5 -end-0.5 inline-flex min-w-[18px] h-[18px] items-center justify-center",
        "rounded-full px-1 text-[10px] font-bold leading-none nums-persian",
      )}
      style={{
        background: highlight ? "var(--primary)" : "var(--foreground)",
        color: highlight ? "var(--primary-foreground)" : "var(--background)",
      }}
    >
      {toPersianDigits(count > 99 ? "۹۹+" : count)}
    </span>
  );
}

function BrandWordmark({ className = "" }: { className?: string }) {
  return <span className={`flex flex-col leading-[0.72] font-bold tracking-[-0.06em] text-foreground ${className}`} aria-label="ID store"><span className="text-[36px]">ID</span><span className="mt-1 text-[15px] font-semibold tracking-[-0.04em]">store</span></span>;
}
