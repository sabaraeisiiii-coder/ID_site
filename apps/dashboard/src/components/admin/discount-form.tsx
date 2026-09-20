"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { FormShell } from "@/components/shared/form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type { Discount, DiscountType } from "@/domains/discount";
import { formatPrice, toPersianDigits } from "@/lib/format";

export interface DiscountFormInitialValues {
  id?: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  startsAt: string;
  endsAt: string;
  usageLimit?: number;
  status: Discount["status"];
}

interface DiscountFormProps {
  initialValues?: DiscountFormInitialValues;
}

const SAMPLE_ORDER = 1_000_000;

function emptyValues(): DiscountFormInitialValues {
  const now = new Date();
  const isoNow = now.toISOString().slice(0, 10);
  const isoEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return {
    code: "",
    description: "",
    type: "percentage",
    value: 10,
    minOrder: undefined,
    maxDiscount: undefined,
    startsAt: isoNow,
    endsAt: isoEnd,
    usageLimit: undefined,
    status: "active",
  };
}

function toInputDate(iso: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function DiscountForm({ initialValues }: DiscountFormProps) {
  const values = initialValues ?? emptyValues();

  const [code, setCode] = React.useState(values.code);
  const [description, setDescription] = React.useState(values.description);
  const [type, setType] = React.useState<DiscountType>(values.type);
  const [value, setValue] = React.useState<string>(String(values.value ?? ""));
  const [minOrder, setMinOrder] = React.useState<string>(
    values.minOrder ? String(values.minOrder) : "",
  );
  const [maxDiscount, setMaxDiscount] = React.useState<string>(
    values.maxDiscount ? String(values.maxDiscount) : "",
  );
  const [startsAt, setStartsAt] = React.useState<string>(toInputDate(values.startsAt));
  const [endsAt, setEndsAt] = React.useState<string>(toInputDate(values.endsAt));
  const [usageLimit, setUsageLimit] = React.useState<string>(
    values.usageLimit ? String(values.usageLimit) : "",
  );
  const [isActive, setIsActive] = React.useState<boolean>(values.status === "active");
  const [showPreview, setShowPreview] = React.useState(true);

  // Live preview calculation on a sample 1,000,000 Toman order
  const numericValue = Number(value) || 0;
  const numericMinOrder = Number(minOrder) || 0;
  const numericMaxDiscount = Number(maxDiscount) || 0;

  const preview = React.useMemo(() => {
    let discountAmount = 0;
    if (type === "percentage") {
      discountAmount = Math.floor((SAMPLE_ORDER * numericValue) / 100);
      if (numericMaxDiscount > 0) {
        discountAmount = Math.min(discountAmount, numericMaxDiscount);
      }
    } else {
      discountAmount = numericValue;
    }
    if (numericMinOrder > 0 && SAMPLE_ORDER < numericMinOrder) {
      return {
        applicable: false,
        message: `سفارش نمونه کمتر از حداقل (${formatPrice(numericMinOrder)}) است.`,
        discountAmount: 0,
        finalTotal: SAMPLE_ORDER,
      };
    }
    return {
      applicable: true,
      message: "",
      discountAmount,
      finalTotal: SAMPLE_ORDER - discountAmount,
    };
  }, [type, numericValue, numericMaxDiscount, numericMinOrder]);

  return (
    <FormShell
      title={initialValues?.id ? "ویرایش تخفیف" : "تخفیف جدید"}
      description={
        initialValues?.id
          ? `ویرایش کد تخفیف ${initialValues.code}`
          : "یک کد تخفیف جدید برای مشتریان ایجاد کنید"
      }
      backHref="/discounts"
      submitLabel={initialValues?.id ? "ذخیره تغییرات" : "ایجاد تخفیف"}
      sidePanel={
        <>
          {/* Status */}
          <PanelSection title="وضعیت" subtitle="فعال بودن کد تخفیف">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="text-sm">فعال</span>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </label>
            <p className="text-[11px] text-foreground-tertiary mt-2">
              {isActive
                ? "این کد برای مشتریان قابل استفاده است."
                : "این کد به‌صورت پیش‌نویس ذخیره می‌شود."}
            </p>
          </PanelSection>

          {/* Validity */}
          <PanelSection title="بازه اعتبار" subtitle="تاریخ شروع و پایان تخفیف">
            <div className="space-y-1.5">
              <Label htmlFor="discount-start">شروع</Label>
              <Input
                id="discount-start"
                type="date"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discount-end">پایان</Label>
              <Input
                id="discount-end"
                type="date"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                dir="ltr"
              />
            </div>
          </PanelSection>

          {/* Constraints */}
          <PanelSection
            title="محدودیت‌ها"
            subtitle="حداقل سفارش، سقف تخفیف و تعداد استفاده"
          >
            <div className="space-y-1.5">
              <Label htmlFor="discount-min">حداقل مبلغ سفارش (تومان)</Label>
              <Input
                id="discount-min"
                type="number"
                min={0}
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="500000"
                dir="ltr"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discount-max">سقف تخفیف (تومان)</Label>
              <Input
                id="discount-max"
                type="number"
                min={0}
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="200000"
                dir="ltr"
              />
              <p className="text-[11px] text-foreground-tertiary">
                فقط برای تخفیف‌های درصدی کاربرد دارد
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="discount-usage">محدودیت استفاده</Label>
              <Input
                id="discount-usage"
                type="number"
                min={0}
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="1000"
                dir="ltr"
              />
              <p className="text-[11px] text-foreground-tertiary">
                خالی = نامحدود
              </p>
            </div>
          </PanelSection>
        </>
      }
    >
      {/* General info */}
      <section
        className="rounded-lg border border-border bg-surface p-5 space-y-4"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <header>
          <h2 className="text-sm font-semibold">اطلاعات عمومی</h2>
          <p className="text-xs text-foreground-tertiary mt-0.5">
            کد و توضیحات تخفیف را وارد کنید
          </p>
        </header>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="discount-code">کد تخفیف</Label>
            <Input
              id="discount-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="SUMMER25"
              className="font-mono uppercase tracking-wider"
              dir="ltr"
            />
            <p className="text-[11px] text-foreground-tertiary">
              فقط حروف لاتین بزرگ و اعداد
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="discount-type">نوع تخفیف</Label>
            <Select value={type} onValueChange={(v) => setType(v as DiscountType)}>
              <SelectTrigger id="discount-type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">درصدی (٪)</SelectItem>
                <SelectItem value="fixed">مبلغی (تومان)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="discount-desc">توضیحات</Label>
          <Textarea
            id="discount-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثلاً: تخفیف پاییزه برای همه مشتریان"
            rows={3}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="discount-value">
            مقدار تخفیف {type === "percentage" ? "(درصد)" : "(تومان)"}
          </Label>
          <Input
            id="discount-value"
            type="number"
            min={0}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            dir="ltr"
            placeholder={type === "percentage" ? "10" : "50000"}
          />
        </div>
      </section>

      {/* Live preview */}
      <section
        className="rounded-lg border border-border bg-surface overflow-hidden"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <header className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold">پیش‌نمایش زنده</h2>
            <p className="text-xs text-foreground-tertiary mt-0.5">
              تأثیر تخفیف روی یک سفارش نمونه {toPersianDigits("1,000,000")} تومانی
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <>
                <EyeOff size={14} strokeWidth={1.75} />
                مخفی
              </>
            ) : (
              <>
                <Eye size={14} strokeWidth={1.75} />
                نمایش
              </>
            )}
          </Button>
        </header>
        {showPreview ? (
          <div className="p-5">
            {!preview.applicable ? (
              <div
                className="rounded-md p-3 text-sm"
                style={{
                  background: "var(--color-warning-50)",
                  color: "var(--color-warning-700)",
                }}
              >
                {preview.message}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <PreviewRow
                  label="مبلغ سفارش نمونه"
                  value={formatPrice(SAMPLE_ORDER)}
                />
                <PreviewRow
                  label="مقدار تخفیف"
                  value={`− ${formatPrice(preview.discountAmount)}`}
                  intent="error"
                />
                <Separator />
                <PreviewRow
                  label="مبلغ نهایی پس از تخفیف"
                  value={formatPrice(preview.finalTotal)}
                  bold
                />
              </div>
            )}
          </div>
        ) : null}
      </section>
    </FormShell>
  );
}

/* ---------- small helpers ---------- */

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

function PreviewRow({
  label,
  value,
  bold = false,
  intent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  intent?: "error" | "success";
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${bold ? "font-semibold" : "text-foreground-secondary"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${bold ? "text-base font-bold" : "font-medium"}`}
        dir="ltr"
        style={{
          color:
            intent === "error"
              ? "var(--color-error-700)"
              : intent === "success"
                ? "var(--color-success-700)"
                : "var(--foreground)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
