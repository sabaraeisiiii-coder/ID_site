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
      { label: "داشبورد", href: "/admin", icon: LayoutDashboard },
      { label: "گزارش‌ها", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "فروشگاه",
    items: [
      { label: "محصولات", href: "/admin/products", icon: Package },
      { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: FolderTree },
      { label: "موجودی", href: "/admin/inventory", icon: Boxes },
      { label: "بنرها", href: "/admin/banners", icon: ImageIcon },
    ],
  },
  {
    title: "فروش",
    items: [
      { label: "سفارش‌ها", href: "/admin/orders", icon: ShoppingCart },
      { label: "پرداخت‌ها", href: "/admin/payments", icon: CreditCard },
      { label: "تخفیف‌ها", href: "/admin/discounts", icon: TicketPercent },
      { label: "روش‌های ارسال", href: "/admin/shipping", icon: Truck },
    ],
  },
  {
    title: "کاربران",
    items: [
      { label: "مشتریان", href: "/admin/customers", icon: Users },
      { label: "نقش‌ها", href: "/admin/roles", icon: ShieldCheck },
      { label: "لاگ رویدادها", href: "/admin/audit-log", icon: History },
    ],
  },
  {
    title: "محتوا و تنظیمات",
    items: [
      { label: "محتوا", href: "/admin/content", icon: FileText },
      { label: "اعلان‌ها", href: "/admin/notifications", icon: Bell },
      { label: "تنظیمات", href: "/admin/settings", icon: Settings },
    ],
  },
];
