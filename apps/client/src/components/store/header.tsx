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
      <Container className="flex items-center justify-between gap-4" style={{ height: "var(--header-height-desktop)" }}>
        {/* Right (RTL): logo + nav */}
        <div className="flex items-center gap-4 lg:gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={siteConfig.name}>
            <Logo />
            <BrandWordmark className="hidden sm:inline-flex" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="منوی اصلی">
            <MegaMenu />
            {siteConfig.nav.main.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-surface-secondary transition-colors"
                style={{ transitionDuration: "var(--duration-fast)" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: search trigger */}
        <button
          type="button"
          onClick={openSearch}
          className="hidden md:flex items-center gap-2 h-10 px-3 rounded-md bg-surface-secondary border border-transparent hover:border-border transition-colors max-w-md flex-1 mx-auto text-start"
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
                  <Logo />
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

function Logo() {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center rounded-lg"
      style={{ width: 32, height: 32, background: "var(--primary)", color: "var(--primary-foreground)" }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 7 L12 4 L19 7 L19 17 L12 20 L5 17 Z"
          stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
        <path d="M9 10 L9 15 M12 8 L12 16 M15 10 L15 15"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function BrandWordmark({ className = "" }: { className?: string }) {
  return <span className={`flex flex-col leading-[0.82] font-bold tracking-tight ${className}`} aria-label="ID site"><span>ID</span><span className="text-[0.72em] font-medium text-foreground-secondary">site</span></span>;
}
