/** Admin navigation config — grouped for sidebar. */

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, BarChart3, Package, FolderTree, Boxes, Image as ImageIcon,
  ShoppingCart, CreditCard, TicketPercent, Truck, Users, ShieldCheck,
  History, FileText, Bell, Settings,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    title: "نمای کلی",
    items: [
      { label: "داشبورد", href: "/", icon: LayoutDashboard },
      { label: "گزارش‌ها", href: "/reports", icon: BarChart3 },
    ],
  },
  {
    title: "فروشگاه",
    items: [
      { label: "محصولات", href: "/products", icon: Package },
      { label: "دسته‌بندی‌ها", href: "/categories", icon: FolderTree },
      { label: "موجودی", href: "/inventory", icon: Boxes },
      { label: "بنرها", href: "/banners", icon: ImageIcon },
    ],
  },
  {
    title: "فروش",
    items: [
      { label: "سفارش‌ها", href: "/orders", icon: ShoppingCart },
      { label: "پرداخت‌ها", href: "/payments", icon: CreditCard },
      { label: "تخفیف‌ها", href: "/discounts", icon: TicketPercent },
      { label: "روش‌های ارسال", href: "/shipping", icon: Truck },
    ],
  },
  {
    title: "کاربران",
    items: [
      { label: "مشتریان", href: "/customers", icon: Users },
      { label: "نقش‌ها", href: "/roles", icon: ShieldCheck },
      { label: "لاگ رویدادها", href: "/audit-log", icon: History },
    ],
  },
  {
    title: "محتوا و تنظیمات",
    items: [
      { label: "محتوا", href: "/content", icon: FileText },
      { label: "اعلان‌ها", href: "/notifications", icon: Bell },
      { label: "تنظیمات", href: "/settings", icon: Settings },
    ],
  },
];
