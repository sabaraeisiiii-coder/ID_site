"use client";

/**
 * CategoryForm — client form for create / edit category.
 * Uses FormShell for the 2-col + sticky action bar pattern.
 */

import * as React from "react";
import Image from "next/image";
import {
  Image as ImageIcon, Settings2, FileText, FolderTree,
} from "lucide-react";
import type { Category } from "@/domains/catalog/types";
import { FormShell } from "@/components/shared/form-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export interface CategoryFormProps {
  initialValues?: Category;
  /** All existing categories — used to populate the parent select. */
  categories: Category[];
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]/g, "");
}

export function CategoryForm({ initialValues, categories }: CategoryFormProps) {
  const isEdit = !!initialValues;

  const [name, setName] = React.useState(initialValues?.name ?? "");
  const [slug, setSlug] = React.useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(isEdit);
  const [description, setDescription] = React.useState(initialValues?.description ?? "");
  const [parentId, setParentId] = React.useState(initialValues?.parentId ?? "none");
  const [image, setImage] = React.useState(initialValues?.image ?? "");
  const [order, setOrder] = React.useState(
    initialValues?.order ? String(initialValues.order) : "0",
  );
  const [isActive, setIsActive] = React.useState(
    initialValues ? initialValues.status === "active" : true,
  );

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugTouched) setSlug(slugify(val));
  };
  const handleSlugChange = (val: string) => {
    setSlugTouched(true);
    setSlug(val);
  };

  // Don't allow a category to be its own parent (only relevant in edit mode).
  const parentOptions = categories.filter((c) => c.id !== initialValues?.id);

  return (
    <FormShell
      title={isEdit ? `ویرایش ${initialValues!.name}` : "افزودن دسته‌بندی جدید"}
      description={isEdit
        ? "اطلاعات دسته‌بندی را در بخش‌های زیر ویرایش کنید."
        : "یک دسته‌بندی جدید برای سازماندهی محصولات ایجاد کنید."}
      backHref="/categories"
      submitLabel={isEdit ? "به‌روزرسانی دسته" : "ثبت دسته"}
      sidePanel={
        <>
          <PanelCard icon={Settings2} title="نمایش و ترتیب">
            <Field label="دسته‌بندی والد">
              <Select value={parentId} onValueChange={setParentId}>
                <SelectTrigger className="w-full bg-surface-secondary border-transparent">
                  <SelectValue placeholder="بدون والد (دسته اصلی)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— بدون والد (دسته اصلی) —</SelectItem>
                  {parentOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="ترتیب نمایش">
              <Input
                type="number"
                min={0}
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="bg-surface-secondary border-transparent"
              />
              <p className="text-[11px] text-foreground-tertiary">
                عدد کوچک‌تر = نمایش زودتر.
              </p>
            </Field>
            <Field label="وضعیت انتشار">
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground-secondary">
                  {isActive ? "فعال" : "پیش‌نویس"}
                </span>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </Field>
          </PanelCard>

          <PanelCard icon={ImageIcon} title="تصویر دسته">
            <div className="flex gap-3">
              <div
                className="relative h-20 w-20 shrink-0 overflow-hidden bg-surface-secondary border border-border"
                style={{ borderRadius: "var(--radius-md)" }}
              >
                {image ? (
                  <Image
                    src={image}
                    alt={name || "دسته"}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-foreground-tertiary">
                    <ImageIcon size={22} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1.5">
                <Label className="text-xs text-foreground-secondary">آدرس تصویر</Label>
                <Input
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="bg-surface-secondary border-transparent font-mono text-xs"
                  dir="ltr"
                />
              </div>
            </div>
          </PanelCard>
        </>
      }
    >
      <PanelCard icon={FileText} title="اطلاعات پایه">
        <Field label="نام دسته">
          <Input
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="مثلاً پوشاک، کفش، اکسسوری"
            className="bg-surface-secondary border-transparent"
            autoFocus={!isEdit}
          />
        </Field>
        <Field label="نشانک (Slug)">
          <Input
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="apparel"
            className="bg-surface-secondary border-transparent font-mono"
            dir="ltr"
          />
          <p className="text-[11px] text-foreground-tertiary">
            آدرس URL دسته‌بندی. به‌صورت خودکار از نام ساخته می‌شود.
          </p>
        </Field>
        <Field label="توضیحات">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیح کوتاه درباره این دسته‌بندی..."
            rows={4}
            className="bg-surface-secondary border-transparent min-h-24"
          />
        </Field>
      </PanelCard>

      <PanelCard icon={FolderTree} title="زیرساخت">
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-md border border-border bg-surface-secondary px-3 py-2.5"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <p className="text-[11px] text-foreground-tertiary mb-0.5">دسته والد</p>
            <p className="text-sm font-medium">
              {parentId === "none"
                ? "دسته اصلی"
                : categories.find((c) => c.id === parentId)?.name ?? "—"}
            </p>
          </div>
          <div
            className="rounded-md border border-border bg-surface-secondary px-3 py-2.5"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <p className="text-[11px] text-foreground-tertiary mb-0.5">تعداد محصولات</p>
            <p className="text-sm font-medium">
              {initialValues?.productCount ?? 0} محصول
            </p>
          </div>
        </div>
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
