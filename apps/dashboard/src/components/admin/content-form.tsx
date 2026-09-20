"use client";

import * as React from "react";
import { Eye, FileText } from "lucide-react";
import { FormShell } from "@/components/shared/form-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { ContentPage } from "@/domains/content";

export interface ContentFormValues {
  title: string;
  slug: string;
  body: string;
  status: "draft" | "active";
}

export interface ContentFormProps {
  initialValues?: Partial<ContentFormValues> & {
    updatedAt?: string;
  };
  isEdit?: boolean;
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ContentForm({ initialValues, isEdit = false }: ContentFormProps) {
  const [title, setTitle] = React.useState(initialValues?.title ?? "");
  const [slug, setSlug] = React.useState(initialValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(Boolean(initialValues?.slug));
  const [body, setBody] = React.useState(initialValues?.body ?? "");
  const [status, setStatus] = React.useState<"draft" | "active">(
    initialValues?.status ?? "draft",
  );

  const displayedSlug = slugTouched ? slug : slugify(title);

  const paragraphs = React.useMemo(() => body.split(/\n\n+/), [body]);

  return (
    <FormShell
      title={isEdit ? "ویرایش صفحه" : "صفحه جدید"}
      description={isEdit ? "ویرایش محتوای صفحه" : "ساخت صفحه محتوای جدید"}
      backHref="/content"
      submitLabel={isEdit ? "به‌روزرسانی" : "انتشار صفحه"}
      sidePanel={
        <div className="space-y-5">
          <div
            className="rounded-lg border border-border bg-surface p-5"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} strokeWidth={1.75} className="text-foreground-secondary" />
              <h3 className="text-sm font-semibold">وضعیت انتشار</h3>
            </div>
            <Label className="text-xs text-foreground-secondary mb-2 block">وضعیت</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={status === "active"}
                  onCheckedChange={(v) => v && setStatus("active")}
                />
                <span className="text-sm">فعال</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={status === "draft"}
                  onCheckedChange={(v) => v && setStatus("draft")}
                />
                <span className="text-sm">پیش‌نویس</span>
              </label>
            </div>
          </div>

          <div
            className="rounded-lg border border-border bg-surface p-5"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <h3 className="text-sm font-semibold mb-3">اطلاعات صفحه</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-foreground-tertiary mb-0.5">slug</dt>
                <dd
                  className="text-xs font-mono text-foreground break-all"
                  dir="ltr"
                >
                  /pages/{displayedSlug || "—"}
                </dd>
              </div>
              <div className="pt-2 border-t border-border">
                <dt className="text-xs text-foreground-tertiary mb-0.5">تعداد پاراگراف</dt>
                <dd className="text-sm font-medium">{paragraphs.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      }
    >
      <div
        className="rounded-lg border border-border bg-surface p-5 space-y-4"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <h2 className="text-sm font-semibold">مشخصات صفحه</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="content-title">عنوان</Label>
            <Input
              id="content-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: درباره ما"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="content-slug">شناسه URL (slug)</Label>
            <Input
              id="content-slug"
              value={displayedSlug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              placeholder="about"
              className="font-mono text-sm"
              dir="ltr"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="content-body">متن صفحه</Label>
          <Textarea
            id="content-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="محتوای صفحه را وارد کنید. برای جدا کردن پاراگراف‌ها از یک خط خالی استفاده کنید."
            rows={12}
            className="font-mono text-sm leading-relaxed"
          />
          <p className="text-[11px] text-foreground-tertiary">
            با فشردن Enter دو بار، پاراگراف جدید ایجاد کنید.
          </p>
        </div>
      </div>

      {/* Live preview */}
      <div
        className="rounded-lg border border-border bg-surface overflow-hidden"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-surface-secondary">
          <Eye size={14} strokeWidth={1.75} className="text-foreground-secondary" />
          <h2 className="text-sm font-semibold">پیش‌نمایش زنده</h2>
        </div>
        <div className="px-6 py-5 max-h-96 overflow-y-auto">
          {title || body ? (
            <article className="space-y-4">
              <h1 className="text-xl font-bold text-foreground">{title || "عنوان نمونه"}</h1>
              {paragraphs.length > 0 && paragraphs[0] !== "" ? (
                paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-foreground-secondary leading-relaxed">
                    {p}
                  </p>
                ))
              ) : (
                <p className="text-sm text-foreground-tertiary italic">
                  محتوای صفحه اینجا نمایش داده می‌شود...
                </p>
              )}
            </article>
          ) : (
            <p className="text-sm text-foreground-tertiary italic text-center py-8">
              شروع به تایپ کنید تا پیش‌نمایش را ببینید.
            </p>
          )}
        </div>
      </div>
    </FormShell>
  );
}

export type { ContentPage };
