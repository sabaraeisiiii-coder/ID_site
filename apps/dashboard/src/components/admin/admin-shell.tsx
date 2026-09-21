"use client";

/**
 * AdminShell — sidebar + topbar layout for /*.
 * Responsive: sidebar collapses to drawer on mobile.
 */

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ChevronLeft } from "lucide-react";
import { adminNavGroups } from "@/config/admin-navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-5 px-3 py-4 overflow-y-auto">
      {adminNavGroups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1">
          <p className="px-3 mb-1 text-[11px] font-medium uppercase tracking-wider text-foreground-tertiary">
            {group.title}
          </p>
          {group.items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group inline-flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground",
                )}
                style={{ transitionDuration: "var(--duration-fast)" }}
              >
                <Icon size={18} strokeWidth={1.75} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background-subtle)" }}>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen border-e border-border"
        style={{ width: "var(--admin-sidebar-width)", background: "var(--surface)" }}
      >
        <div className="flex items-center gap-2 px-5 border-b border-border shrink-0"
          style={{ height: "var(--admin-topbar-height)" }}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 7 L12 4 L19 7 L19 17 L12 20 L5 17 Z"
                stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
              <path d="M9 10 L9 15 M12 8 L12 16 M15 10 L15 15"
                stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
          <div className="flex flex-col leading-tight">
            <span className="flex flex-col text-sm font-bold leading-[0.82]" aria-label="ID store"><span>ID</span><span className="text-[0.72em] font-medium text-foreground-tertiary">store</span></span>
            <span className="text-[11px] text-foreground-tertiary">پنل مدیریت</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto"><NavList /></div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header
          className="sticky top-0 z-sticky flex items-center gap-3 px-4 sm:px-6 border-b border-border bg-surface/95 backdrop-blur"
          style={{ height: "var(--admin-topbar-height)", zIndex: "var(--z-sticky)" }}
        >
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button type="button" aria-label="منوی مدیریت"
                className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground-secondary hover:bg-surface-secondary">
                <Menu size={20} strokeWidth={1.75} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <SheetHeader className="px-4 py-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 7 L12 4 L19 7 L19 17 L12 20 L5 17 Z"
                        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
                      <path d="M9 10 L9 15 M12 8 L12 16 M15 10 L15 15"
                        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="flex flex-col text-sm font-bold leading-[0.82]" aria-label="ID store"><span>ID</span><span className="text-[0.72em] font-medium text-foreground-tertiary">store</span></span>
                </SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-[calc(100vh-72px)]">
                <NavList onNavigate={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:block relative w-full max-w-md">
            <Search size={16} strokeWidth={1.75}
              className="absolute inset-inline-start-3 top-1/2 -translate-y-1/2 text-foreground-tertiary pointer-events-none" />
            <Input type="search" placeholder="جستجو در پنل..."
              className="h-9 ps-9 pe-3 text-sm bg-surface-secondary border-transparent" />
          </div>

          <div className="ms-auto flex items-center gap-2">
            <ThemeSwitcher />
            <Link href={process.env.NEXT_PUBLIC_STOREFRONT_URL ?? "http://localhost:3000"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground-secondary hover:bg-surface-secondary hover:text-foreground transition-colors"
              aria-label="بازگشت به فروشگاه">
              <ChevronLeft size={20} strokeWidth={1.75} />
            </Link>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
