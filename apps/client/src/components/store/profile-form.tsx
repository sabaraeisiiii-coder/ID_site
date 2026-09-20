"use client";

/**
 * ProfileForm — client form for editing the user's profile.
 * Submit is visual only — shows a success toast.
 */

import * as React from "react";
import { Loader2, Save, ShieldCheck, CalendarDays } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserStatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@/lib/format";

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
}

export interface ProfileFormProps {
  initialValues: ProfileFormValues;
  status: "active" | "suspended" | "pending";
  createdAt: string;
}

const mobileRe = /^09\d{9}$/;
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ProfileForm({
  initialValues,
  status,
  createdAt,
}: ProfileFormProps) {
  const [values, setValues] = React.useState<ProfileFormValues>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof ProfileFormValues, string>>>({});
  const [submitting, setSubmitting] = React.useState(false);

  const initials = `${(values.firstName || "؟").charAt(0)}${(values.lastName || "").charAt(0)}`;

  function update<K extends keyof ProfileFormValues>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof ProfileFormValues, string>> = {};
    if (!values.firstName.trim()) next.firstName = "نام را وارد کنید.";
    if (!values.lastName.trim()) next.lastName = "نام خانوادگی را وارد کنید.";
    if (!mobileRe.test(values.mobile.trim())) next.mobile = "شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).";
    if (values.email.trim() && !emailRe.test(values.email.trim())) next.email = "ایمیل معتبر نیست.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Visual only — no real save call.
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("تغییرات پروفایل ذخیره شد.");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Avatar + meta */}
      <section
        className="flex flex-col sm:flex-row sm:items-center gap-5 p-6 bg-surface border border-border"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <span
          className="inline-flex items-center justify-center w-20 h-20 bg-primary text-primary-foreground text-2xl font-semibold shrink-0"
          style={{ borderRadius: "var(--radius-full)" }}
        >
          {initials}
        </span>
        <div className="flex flex-col gap-2 min-w-0">
          <h2 className="text-lg font-semibold">
            {values.firstName} {values.lastName}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-tertiary">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} strokeWidth={1.75} />
              <UserStatusBadge status={status} />
            </span>
            <span className="inline-flex items-center gap-1.5 nums-persian">
              <CalendarDays size={14} strokeWidth={1.75} />
              عضو از {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </section>

      {/* Form fields */}
      <section
        className="flex flex-col gap-5 p-6 bg-surface border border-border"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <h3 className="text-base font-semibold">اطلاعات شخصی</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="firstName">نام</Label>
            <Input
              id="firstName"
              value={values.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="نام"
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName ? (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="lastName">نام خانوادگی</Label>
            <Input
              id="lastName"
              value={values.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="نام خانوادگی"
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName ? (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mobile">شماره موبایل</Label>
            <Input
              id="mobile"
              inputMode="tel"
              dir="ltr"
              className="text-right nums-persian"
              value={values.mobile}
              onChange={(e) => update("mobile", e.target.value)}
              placeholder="09123456789"
              aria-invalid={!!errors.mobile}
            />
            {errors.mobile ? (
              <p className="text-xs text-destructive">{errors.mobile}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">ایمیل (اختیاری)</Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              className="text-right"
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="email@example.com"
              aria-invalid={!!errors.email}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-border">
          <p className="text-xs text-foreground-tertiary">
            شماره موبایل برای ورود و تأیید هویت استفاده می‌شود.
          </p>
          <Button type="submit" disabled={submitting} className="sm:w-auto">
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            ذخیره تغییرات
          </Button>
        </div>
      </section>
    </form>
  );
}
