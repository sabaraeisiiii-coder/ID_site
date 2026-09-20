"use client";

import * as React from "react";
import { Truck } from "lucide-react";
import { FormShell } from "@/components/shared/form-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type { ShippingMethod } from "@/domains/shipping";
import { formatPrice, toPersianDigits } from "@/lib/format";

export interface ShippingFormInitialValues {
  id?: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  status: ShippingMethod["status"];
  sortOrder: number;
}

interface ShippingFormProps {
  initialValues?: ShippingFormInitialValues;
}

function emptyValues(): ShippingFormInitialValues {
  return {
    name: "",
    description: "",
    price: 0,
    estimatedDays: "۲-۴ روز",
    status: "active",
    sortOrder: 1,
  };
}

export function ShippingForm({ initialValues }: ShippingFormProps) {
  const values = initialValues ?? emptyValues();

  const [name, setName] = React.useState(values.name);
  const [description, setDescription] = React.useState(values.description);
  const [price, setPrice] = React.useState<string>(String(values.price ?? 0));
  const [estimatedDays, setEstimatedDays] = React.useState(values.estimatedDays);
  const [isActive, setIsActive] = React.useState<boolean>(values.status === "active");
  const [sortOrder, setSortOrder] = React.useState<string>(String(values.sortOrder ?? 1));

  const numericPrice = Number(price) || 0;
  const numericSort = Number(sortOrder) || 1;

  return (
    <FormShell
      title={initialValues?.id ? "ویرایش روش ارسال" : "روش ارسال جدید"}
      description={
        initialValues?.id
          ? `ویرایش ${initialValues.name}`
          : "یک روش ارسال جدید پیکربندی کنید"
      }
      backHref="/shipping"
      submitLabel={initialValues?.id ? "ذخیره تغییرات" : "ایجاد روش ارسال"}
      sidePanel={
        <>
          {/* Status */}
          <PanelSection title="وضعیت" subtitle="فعال بودن روش ارسال">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-sm">فعال</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </label>
            <p className="text-[11px] text-foreground-tertiary mt-2">
              {isActive
                ? "این روش در زمان تسویه به مشتریان نمایش داده می‌شود."
                : "این روش به‌صورت پیش‌نویس ذخیره می‌شود."}
            </p>
          </PanelSection>

          {/* Display order */}
          <PanelSection
            title="ترتیب نمایش"
            subtitle="روش‌ها به ترتیب صعودی این عدد در صفحه تسویه نمایش داده می‌شوند"
          >
            <div className="space-y-1.5">
              <Label htmlFor="shipping-sort">ترتیب</Label>
              <Input
                id="shipping-sort"
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                dir="ltr"
              />
            </div>
          </PanelSection>

          {/* Live preview card */}
          <PanelSection title="پیش‌نمایش کارت">
            <div
              className="rounded-lg border border-border p-4 flex items-center gap-3"
              style={{ borderRadius: "var(--radius-md)", background: "var(--surface-secondary)" }}
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0"
                style={{
                  background: "var(--color-brand-50)",
                  color: "var(--color-brand-700)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <Truck size={16} strokeWidth={1.75} />
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground truncate">
                  {name || "نام روش"}
                </span>
                <span className="text-xs text-foreground-tertiary truncate">
                  {description || "توضیحات روش ارسال"}
                </span>
              </div>
              <div className="text-end shrink-0 ms-auto">
                <p className="text-sm font-semibold" dir="ltr">
                  {numericPrice === 0 ? "رایگان" : formatPrice(numericPrice)}
                </p>
                <p className="text-[11px] text-foreground-tertiary">
                  {estimatedDays || "—"}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-foreground-tertiary">
              ترتیب نمایش: {toPersianDigits(numericSort)}
            </p>
          </PanelSection>
        </>
      }
    >
      <section
        className="rounded-lg border border-border bg-surface p-5 space-y-4"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <header>
          <h2 className="text-sm font-semibold">اطلاعات عمومی</h2>
          <p className="text-xs text-foreground-tertiary mt-0.5">
            نام و توضیحات روش ارسال
          </p>
        </header>
        <Separator />
        <div className="space-y-1.5">
          <Label htmlFor="shipping-name">نام روش</Label>
          <Input
            id="shipping-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="پست پیشتاز، تیپاکس، ارسال رایگان..."
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="shipping-desc">توضیحات</Label>
          <Textarea
            id="shipping-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثلاً: تحویل ۲ تا ۴ روز کاری در سراسر کشور"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="shipping-price">قیمت (تومان)</Label>
            <Input
              id="shipping-price"
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              dir="ltr"
              placeholder="80000"
            />
            <p className="text-[11px] text-foreground-tertiary">
              برای ارسال رایگان، ۰ وارد کنید
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="shipping-days">زمان تحویل</Label>
            <Input
              id="shipping-days"
              value={estimatedDays}
              onChange={(e) => setEstimatedDays(e.target.value)}
              placeholder="۲-۴ روز"
            />
            <p className="text-[11px] text-foreground-tertiary">
              متن آزاد برای نمایش به مشتری
            </p>
          </div>
        </div>
      </section>
    </FormShell>
  );
}

function PanelSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-lg border border-border bg-surface p-5 space-y-4"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <header>
        <h2 className="text-sm font-semibold">{title}</h2>
        {subtitle ? (
          <p className="text-xs text-foreground-tertiary mt-0.5">{subtitle}</p>
        ) : null}
      </header>
      <Separator />
      {children}
    </section>
  );
}
