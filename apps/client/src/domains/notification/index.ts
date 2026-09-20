/** Notification domain — used by both account & admin. */

export type NotificationType =
  | "order" | "payment" | "shipment" | "system" | "promo" | "review";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export const accountNotifications: Notification[] = [
  { id: "n1", type: "order", title: "سفارش شما ارسال شد",
    body: "سفارش شماره ORD-10235 با تیپاکس ارسال شد. کد رهگیری: ۱۲۳۴۵.",
    isRead: false, createdAt: "2024-09-09T16:00:00Z", link: "/account/orders" },
  { id: "n2", type: "promo", title: "تخفیف ویژه پاییزه",
    body: "با کد AUTUMN15 از ۱۵٪ تخفیف استفاده کن. فقط تا ۱۰ مهر.",
    isRead: false, createdAt: "2024-09-10T08:00:00Z" },
  { id: "n3", type: "payment", title: "پرداخت تأیید شد",
    body: "پرداخت سفارش ORD-10234 با موفقیت ثبت شد.",
    isRead: true, createdAt: "2024-09-08T10:36:00Z", link: "/account/orders" },
  { id: "n4", type: "system", title: "خوش آمدی به بازار",
    body: "حساب کاربری شما با موفقیت ایجاد شد. از خرید لذت ببر!",
    isRead: true, createdAt: "2024-03-15T10:00:00Z" },
];

export const adminNotifications: Notification[] = [
  { id: "an1", type: "order", title: "سفارش جدید",
    body: "سفارش شماره ORD-10237 در انتظار بررسی.",
    isRead: false, createdAt: "2024-09-11T16:50:00Z", link: "/admin/orders" },
  { id: "an2", type: "payment", title: "پرداخت ناموفق",
    body: "یک پرداخت ناموفق در درگاه رخ داد. مرور کنید.",
    isRead: false, createdAt: "2024-09-10T11:30:00Z", link: "/admin/payments" },
  { id: "an3", type: "shipment", title: "موجودی کم",
    body: "محصول «پالتو وول مینیمال» به موجودی پایین رسیده است.",
    isRead: true, createdAt: "2024-09-09T14:00:00Z", link: "/admin/inventory" },
  { id: "an4", type: "system", title: "به‌روزرسانی سیستم",
    body: "سیستم با موفقیت به‌روزرسانی شد.",
    isRead: true, createdAt: "2024-09-08T02:00:00Z" },
];

export const notificationService = {
  async listAccount(): Promise<Notification[]> {
    return [...accountNotifications].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
  async listAdmin(): Promise<Notification[]> {
    return [...adminNotifications].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
};
