"use client";

/**
 * ProductForm — client form for create / edit product.
 *
 * Shared by /products/new and /products/[id].
 * Uses FormShell for the 2-col + sticky action bar pattern.
 *
 * All persistence is mocked (submit shows toast + redirects to list).
 */

import * as React from "react";
import Image from "next/image";
import {
  Plus, Trash2, Image as ImageIcon, Package, Tag, Layers,
  Settings2, FileText, DollarSign,
} from "lucide-react";
import type { Product, Category, ProductStatus } from "@/domains/catalog/types";
import { FormShell } from "@/components/shared/form-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toPersianDigits } from "@/lib/format";

export interface ProductFormProps {
  initialValues?: Product;
  categories: Category[];
}

interface VariantRow {
  id: string;
  value: string;
  stock: string;
}

interface AttributeRow {
  id: string;
  label: string;
  value: string;
}

const statusOptions: { value: ProductStatus; label: string }[] = [
  { value: "active", label: "فعال" },
  { value: "draft", label: "پیش‌نویس" },
  { value: "archived", label: "بایگانی" },
];

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "");
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ProductForm({ initialValues, categories }: ProductFormProps) {
  const isEdit = !!initialValues;

  const [title, setTitle] = React.useState(initialValues?.title ?? "");
  const [slug, setSlug] = React.useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [description, setDescription] = React.useState(initialValues?.description ?? "");
  const [categoryId, setCategoryId] = React.useState(
    initialValues?.categoryId ?? categories[0]?.id ?? "",
  );
  const [brand, setBrand] = React.useState(initialValues?.brand ?? "");
  const [price, setPrice] = React.useState(
    initialValues ? String(initialValues.price) : "",
  );
  const [comparePrice, setComparePrice] = React.useState(
    initialValues?.comparePrice ? String(initialValues.comparePrice) : "",
  );
  const [sku, setSku] = React.useState(initialValues?.sku ?? "");
  const [stock, setStock] = React.useState(
    initialValues ? String(initialValues.stock) : "",
  );
  const [stockThreshold, setStockThreshold] = React.useState(
    initialValues?.stockThreshold ? String(initialValues.stockThreshold) : "",
  );
  const [status, setStatus] = React.useState<ProductStatus>(
    initialValues?.status ?? "draft",
  );
  const [isFeatured, setIsFeatured] = React.useState(
    initialValues?.isFeatured ?? false,
  );

  const [image1, setImage1] = React.useState(initialValues?.images[0]?.url ?? "");
  const [image2, setImage2] = React.useState(initialValues?.images[1]?.url ?? "");

  const [variants, setVariants] = React.useState<VariantRow[]>(
    initialValues?.variants?.map((v) => ({
      id: v.id, value: v.value, stock: String(v.stock),
    })) ?? [],
  );
  const [attributes, setAttributes] = React.useState<AttributeRow[]>(
    initialValues?.attributes?.map((a) => ({
      id: uid("attr"), label: a.label, value: a.value,
    })) ?? [],
  );

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugTouched) setSlug(slugify(val));
  };

  const handleSlugChange = (val: string) => {
    setSlugTouched(true);
    setSlug(val);
  };

  const addVariant = () => {
    setVariants((rows) => [...rows, { id: uid("var"), value: "", stock: "" }]);
  };
  const updateVariant = (id: string, patch: Partial<VariantRow>) => {
    setVariants((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };
  const removeVariant = (id: string) => {
    setVariants((rows) => rows.filter((r) => r.id !== id));
  };

  const addAttribute = () => {
    setAttributes((rows) => [...rows, { id: uid("attr"), label: "", value: "" }]);
  };
  const updateAttribute = (id: string, patch: Partial<AttributeRow>) => {
    setAttributes((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };
  const removeAttribute = (id: string) => {
    setAttributes((rows) => rows.filter((r) => r.id !== id));
  };

  return (
    <FormShell
      title={isEdit ? `ویرایش ${initialValues!.title}` : "افزودن محصول جدید"}
      description={isEdit && initialValues?.createdAt
        ? `آخرین به‌روزرسانی: ${new Intl.DateTimeFormat("fa-IR", {
            calendar: "persian", year: "numeric", month: "long", day: "numeric",
          }).format(new Date(initialValues.createdAt))}`
        : "اطلاعات محصول را در بخش‌های زیر وارد کنید."}
      backHref="/products"
      submitLabel={isEdit ? "به‌روزرسانی محصول" : "ثبت محصول"}
      sidePanel={
        <>
          {/* Status panel */}
          <PanelCard icon={Settings2} title="وضعیت و انتشار">
            <Field label="وضعیت محصول">
              <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
                <SelectTrigger className="w-full bg-surface-secondary border-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="محصول ویژه">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground-secondary">
                  نمایش در بخش محصولات ویژه
                </span>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
            </Field>
          </PanelCard>

          {/* Stock panel */}
          <PanelCard icon={Package} title="موجودی">
            <div className="grid grid-cols-2 gap-3">
              <Field label="موجودی">
                <Input
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="۰"
                  className="bg-surface-secondary border-transparent"
                />
              </Field>
              <Field label="آستانه هشدار">
                <Input
                  type="number"
                  min={0}
                  value={stockThreshold}
                  onChange={(e) => setStockThreshold(e.target.value)}
                  placeholder="۰"
                  className="bg-surface-secondary border-transparent"
                />
              </Field>
            </div>
            <p className="text-[11px] text-foreground-tertiary">
              موجودی کمتر یا مساوی آستانه، با هشدار نمایش داده می‌شود.
            </p>
          </PanelCard>

          {/* Organization panel */}
          <PanelCard icon={Tag} title="سازماندهی">
            <Field label="دسته‌بندی">
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full bg-surface-secondary border-transparent">
                  <SelectValue placeholder="انتخاب دسته" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="برند">
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="نام برند"
                className="bg-surface-secondary border-transparent"
              />
            </Field>
            <Field label="کد محصول (SKU)">
              <Input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="مثلاً TS-001-BLK"
                className="bg-surface-secondary border-transparent font-mono"
                dir="ltr"
              />
            </Field>
          </PanelCard>
        </>
      }
    >
      {/* General info */}
      <PanelCard icon={FileText} title="اطلاعات عمومی">
        <Field label="عنوان محصول">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="مثلاً تیشرت پنبه‌ای پریمیوم"
            className="bg-surface-secondary border-transparent"
          />
        </Field>
        <Field label="نشانک (Slug)">
          <Input
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="premium-cotton-tshirt"
            className="bg-surface-secondary border-transparent font-mono"
            dir="ltr"
          />
          <p className="text-[11px] text-foreground-tertiary">
            آدرس URL محصول. به‌صورت خودکار از عنوان ساخته می‌شود.
          </p>
        </Field>
        <Field label="توضیحات">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحات کامل محصول..."
            rows={5}
            className="bg-surface-secondary border-transparent min-h-32"
          />
        </Field>
      </PanelCard>

      {/* Pricing */}
      <PanelCard icon={DollarSign} title="قیمت‌گذاری">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="قیمت فروش (تومان)">
            <Input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="۰"
              className="bg-surface-secondary border-transparent"
            />
          </Field>
          <Field label="قیمت مقایسه‌ای (تومان)">
            <Input
              type="number"
              min={0}
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              placeholder="اختیاری"
              className="bg-surface-secondary border-transparent"
            />
          </Field>
        </div>
        {price && comparePrice && Number(comparePrice) > Number(price) ? (
          <p
            className="text-[11px] font-medium"
            style={{ color: "var(--color-success-700)" }}
          >
            {toPersianDigits(
              Math.round(
                ((Number(comparePrice) - Number(price)) / Number(comparePrice)) * 100,
              ),
            )}٪ تخفیف اعمال می‌شود.
          </p>
        ) : null}
      </PanelCard>

      {/* Images */}
      <PanelCard icon={ImageIcon} title="تصاویر محصول">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "تصویر اصلی", value: image1, set: setImage1 },
            { label: "تصویر دوم", value: image2, set: setImage2 },
          ].map((img, i) => (
            <div key={i} className="space-y-2">
              <Label className="text-xs text-foreground-secondary">{img.label}</Label>
              <div className="flex gap-3">
                <div
                  className="relative h-16 w-16 shrink-0 overflow-hidden bg-surface-secondary border border-border"
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  {img.value ? (
                    <Image
                      src={img.value}
                      alt={img.label}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-foreground-tertiary">
                      <ImageIcon size={18} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <Input
                  value={img.value}
                  onChange={(e) => img.set(e.target.value)}
                  placeholder="https://..."
                  className="bg-surface-secondary border-transparent font-mono text-xs"
                  dir="ltr"
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-foreground-tertiary">
          آدرس تصویر را وارد کنید. پیش‌نمایش به‌صورت خودکار نمایش داده می‌شود.
        </p>
      </PanelCard>

      {/* Variants */}
      <PanelCard icon={Layers} title="تنوع‌ها (رنگ / سایز)">
        {variants.length === 0 ? (
          <p className="text-sm text-foreground-tertiary py-2">
            تنوعی تعریف نشده. در صورت نیاز، یک تنوع اضافه کنید.
          </p>
        ) : (
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div
                key={v.id}
                className="flex items-center gap-2"
              >
                <span className="text-xs text-foreground-tertiary w-6 shrink-0">
                  {toPersianDigits(i + 1)}.
                </span>
                <Input
                  value={v.value}
                  onChange={(e) => updateVariant(v.id, { value: e.target.value })}
                  placeholder="مثلاً مشکی / سایز ۴۰"
                  className="bg-surface-secondary border-transparent"
                />
                <Input
                  type="number"
                  min={0}
                  value={v.stock}
                  onChange={(e) => updateVariant(v.id, { stock: e.target.value })}
                  placeholder="موجودی"
                  className="bg-surface-secondary border-transparent w-24"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-foreground-tertiary hover:text-error"
                  onClick={() => removeVariant(v.id)}
                  aria-label="حذف تنوع"
                >
                  <Trash2 size={15} strokeWidth={1.75} />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addVariant}
          className="w-full border-dashed"
        >
          <Plus size={15} strokeWidth={2} />
          افزودن تنوع
        </Button>
      </PanelCard>

      {/* Attributes */}
      <PanelCard icon={FileText} title="ویژگی‌های محصول">
        {attributes.length === 0 ? (
          <p className="text-sm text-foreground-tertiary py-2">
            ویژگی خاصی تعریف نشده. مثلاً جنس، ابعاد، ساخته‌شده در و...
          </p>
        ) : (
          <div className="space-y-2">
            {attributes.map((a, i) => (
              <div key={a.id} className="flex items-center gap-2">
                <span className="text-xs text-foreground-tertiary w-6 shrink-0">
                  {toPersianDigits(i + 1)}.
                </span>
                <Input
                  value={a.label}
                  onChange={(e) => updateAttribute(a.id, { label: e.target.value })}
                  placeholder="برچسب (مثلاً جنس)"
                  className="bg-surface-secondary border-transparent"
                />
                <Input
                  value={a.value}
                  onChange={(e) => updateAttribute(a.id, { value: e.target.value })}
                  placeholder="مقدار (مثلاً ۱۰۰٪ پنبه)"
                  className="bg-surface-secondary border-transparent"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0 text-foreground-tertiary hover:text-error"
                  onClick={() => removeAttribute(a.id)}
                  aria-label="حذف ویژگی"
                >
                  <Trash2 size={15} strokeWidth={1.75} />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAttribute}
          className="w-full border-dashed"
        >
          <Plus size={15} strokeWidth={2} />
          افزودن ویژگی
        </Button>
      </PanelCard>
    </FormShell>
  );
}

/* ---------- Local helpers ---------- */

function PanelCard({
  icon: Icon, title, children,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-lg border border-border bg-surface"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      <header className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
        <Icon size={15} strokeWidth={1.75} className="text-foreground-secondary" />
        <h2 className="text-sm font-semibold">{title}</h2>
      </header>
      <div className="p-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-foreground-secondary">{label}</Label>
      {children}
    </div>
  );
}
