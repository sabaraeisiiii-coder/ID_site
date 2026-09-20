"use client";

/**
 * AccountNav — sidebar nav for the account section.
 * Client component because it uses `usePathname()` for active state.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  ShoppingBag,
  MapPin,
  Heart,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountNavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  /** exact match — when false, route is considered active for any sub-route */
  exact?: boolean;
}

const items: AccountNavItem[] = [
  { label: "نمای کلی", href: "/account", icon: LayoutDashboard, exact: true },
  { label: "پروفایل", href: "/account/profile", icon: UserCircle },
  { label: "سفارش‌ها", href: "/account/orders", icon: ShoppingBag },
  { label: "آدرس‌ها", href: "/account/addresses", icon: MapPin },
  { label: "علاقه‌مندی‌ها", href: "/account/wishlist", icon: Heart },
  { label: "اعلان‌ها", href: "/account/notifications", icon: Bell },
];

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AccountNav() {
  const pathname = usePathname() ?? "/account";

  return (
    <nav aria-label="ناوبری حساب کاربری" className="flex flex-col gap-1">
      <h2 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-foreground-tertiary">
        حساب کاربری
      </h2>
      <ul className="flex flex-col gap-1">
        {items.map((item) => {
          const active = isActive(pathname, item.href, item.exact);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground-secondary hover:bg-surface-secondary hover:text-foreground",
                )}
                style={{
                  borderRadius: "var(--radius-md)",
                  transitionDuration: "var(--duration-fast)",
                }}
              >
                <Icon
                  size={18}
                  strokeWidth={1.75}
                  className={cn(
                    "shrink-0 transition-colors",
                    active
                      ? "text-primary-foreground"
                      : "text-foreground-tertiary group-hover:text-foreground",
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
