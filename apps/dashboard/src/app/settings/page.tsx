"use client";

import * as React from "react";
import {
  Settings as SettingsIcon,
  Store,
  ToggleLeft,
  Bell,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteConfig } from "@/config/site";

interface GeneralSettings {
  siteName: string;
  description: string;
  locale: string;
  timezone: string;
  currency: string;
}

interface StoreSettings {
  freeShippingThreshold: string;
  lowStockThreshold: string;
  defaultSort: string;
}

interface FeaturesSettings {
  wishlist: boolean;
  reviews: boolean;
  coupons: boolean;
}

interface NotificationsSettings {
  email: boolean;
  sms: boolean;
}

export default function AdminSettingsPage() {
  const [general, setGeneral] = React.useState<GeneralSettings>({
    siteName: siteConfig.name,
    description: siteConfig.description,
    locale: siteConfig.locale,
    timezone: "Asia/Tehran",
    currency: "تومان",
  });
  const [store, setStore] = React.useState<StoreSettings>({
    freeShippingThreshold: "1000000",
    lowStockThreshold: "8",
    defaultSort: "newest",
  });
  const [features, setFeatures] = React.useState<FeaturesSettings>({
    wishlist: true,
    reviews: true,
    coupons: true,
  });
  const [notifications, setNotifications] = React.useState<NotificationsSettings>({
    email: true,
    sms: false,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("تنظیمات ذخیره شد");
  };

  return (
    <div dir="rtl" className="settings-page space-y-5 text-right">
      <Breadcrumb
        className="mb-1"
        items={[{ label: "داشبورد", href: "/" }, { label: "تنظیمات" }]}
      />

      <PageHeader
        title="تنظیمات"
        description="پیکربندی کلی فروشگاه، امکانات و اعلان‌ها"
      />

      <form onSubmit={handleSave} className="settings-form space-y-5 text-right">
        <Tabs defaultValue="general">
          <TabsList dir="rtl" className="w-full justify-start overflow-x-auto sm:w-auto">
            <TabsTrigger value="general" className="gap-1.5">
              <SettingsIcon size={14} strokeWidth={1.75} />
              عمومی
            </TabsTrigger>
            <TabsTrigger value="store" className="gap-1.5">
              <Store size={14} strokeWidth={1.75} />
              فروشگاه
            </TabsTrigger>
            <TabsTrigger value="features" className="gap-1.5">
              <ToggleLeft size={14} strokeWidth={1.75} />
              امکانات
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5">
              <Bell size={14} strokeWidth={1.75} />
              اعلان‌ها
            </TabsTrigger>
          </TabsList>

          {/* General */}
          <TabsContent value="general">
            <div
              className="space-y-5 rounded-lg border border-border bg-surface p-4 text-right sm:p-6"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <div className="space-y-1">
                <h2 className="text-sm font-semibold">تنظیمات عمومی</h2>
                <p className="text-xs text-foreground-tertiary">
                  اطلاعات پایه هویت فروشگاه
                </p>
              </div>
              <Separator />
              <div className="settings-field-grid grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="site-name">نام فروشگاه</Label>
                  <Input
                    id="site-name"
                    value={general.siteName}
                    onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="site-locale">زبان و منطقه</Label>
                  <Select
                    value={general.locale}
                    onValueChange={(v) => setGeneral({ ...general, locale: v })}
                  >
                    <SelectTrigger id="site-locale" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fa-IR">فارسی (ایران)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="ar-SA">العربية (السعودية)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="site-desc">توضیحات</Label>
                  <Input
                    id="site-desc"
                    value={general.description}
                    onChange={(e) => setGeneral({ ...general, description: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="site-tz">منطقه زمانی</Label>
                  <Input
                    id="site-tz"
                    value={general.timezone}
                    onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                    dir="ltr"
                    className="font-mono text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="site-currency">واحد پول</Label>
                  <Input
                    id="site-currency"
                    value={general.currency}
                    onChange={(e) => setGeneral({ ...general, currency: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Store */}
          <TabsContent value="store">
            <div
              className="space-y-5 rounded-lg border border-border bg-surface p-4 text-right sm:p-6"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <div className="space-y-1">
                <h2 className="text-sm font-semibold">تنظیمات فروشگاه</h2>
                <p className="text-xs text-foreground-tertiary">
                  آستانه‌ها و رفتار پیش‌فرض فروشگاه
                </p>
              </div>
              <Separator />
              <div className="settings-field-grid grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="free-ship">آستانه ارسال رایگان (تومان)</Label>
                  <Input
                    id="free-ship"
                    type="number"
                    value={store.freeShippingThreshold}
                    onChange={(e) => setStore({ ...store, freeShippingThreshold: e.target.value })}
                    dir="ltr"
                    className="font-mono"
                  />
                  <p className="text-[11px] text-foreground-tertiary">
                    سفارش‌های بالای این مبلغ، ارسال رایگان دارند.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="low-stock">آستانه موجودی کم</Label>
                  <Input
                    id="low-stock"
                    type="number"
                    value={store.lowStockThreshold}
                    onChange={(e) => setStore({ ...store, lowStockThreshold: e.target.value })}
                    dir="ltr"
                    className="font-mono"
                  />
                  <p className="text-[11px] text-foreground-tertiary">
                    موجودی برابر یا کمتر از این عدد، «محدود» علامت می‌خورد.
                  </p>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="default-sort">مرتب‌سازی پیش‌فرض محصولات</Label>
                  <Select
                    value={store.defaultSort}
                    onValueChange={(v) => setStore({ ...store, defaultSort: v })}
                  >
                    <SelectTrigger id="default-sort" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">جدیدترین‌ها</SelectItem>
                      <SelectItem value="popular">محبوب‌ترین‌ها</SelectItem>
                      <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
                      <SelectItem value="price-desc">گران‌ترین</SelectItem>
                      <SelectItem value="discount">بیشترین تخفیف</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <div
              className="space-y-5 rounded-lg border border-border bg-surface p-4 text-right sm:p-6"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <div className="space-y-1">
                <h2 className="text-sm font-semibold">امکانات</h2>
                <p className="text-xs text-foreground-tertiary">
                  فعال یا غیرفعال کردن قابلیت‌های فروشگاه
                </p>
              </div>
              <Separator />
              <ul className="space-y-4">
                {([
                  { key: "wishlist" as const, label: "لیست علاقه‌مندی‌ها", desc: "اجازه به کاربران برای ذخیره محصولات موردعلاقه" },
                  { key: "reviews" as const, label: "نظرات", desc: "اجازه ثبت نظر برای محصولات توسط مشتریان" },
                  { key: "coupons" as const, label: "کد تخفیف", desc: "پشتیبانی از کدهای تخفیف در سبد خرید" },
                ]).map((row) => (
                  <li
                    key={row.key}
                    className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{row.label}</p>
                      <p className="text-xs text-foreground-tertiary mt-0.5">{row.desc}</p>
                    </div>
                    <Switch
                      checked={features[row.key]}
                      onCheckedChange={(v) => setFeatures({ ...features, [row.key]: v })}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <div
              className="space-y-5 rounded-lg border border-border bg-surface p-4 text-right sm:p-6"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              <div className="space-y-1">
                <h2 className="text-sm font-semibold">اعلان‌ها</h2>
                <p className="text-xs text-foreground-tertiary">
                  کانال‌های ارسال اعلان به مشتریان و مدیران
                </p>
              </div>
              <Separator />
              <ul className="space-y-4">
                {([
                  { key: "email" as const, label: "اعلان ایمیلی", desc: "ارسال ایمیل برای رویدادهای مهم (سفارش، پرداخت، ارسال)" },
                  { key: "sms" as const, label: "اعلان پیامکی", desc: "ارسال SMS برای تأیید سفارش و تغییر وضعیت" },
                ]).map((row) => (
                  <li
                    key={row.key}
                    className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{row.label}</p>
                      <p className="text-xs text-foreground-tertiary mt-0.5">{row.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[row.key]}
                      onCheckedChange={(v) => setNotifications({ ...notifications, [row.key]: v })}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        {/* Sticky action bar */}
        <div
          className="sticky bottom-0 -mx-4 flex items-center justify-start gap-2 border-t border-border bg-surface px-4 py-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          style={{ zIndex: "var(--z-sticky)" }}
        >
          <Button type="submit">
            <Save size={14} strokeWidth={1.75} />
            ذخیره تنظیمات
          </Button>
        </div>
      </form>
    </div>
  );
}
