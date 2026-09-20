"use client";

import * as React from "react";
import { ShieldCheck, Users } from "lucide-react";
import { FormShell } from "@/components/shared/form-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { PermissionMatrix } from "@/components/admin/permission-matrix";
import type { Role, Permission } from "@/domains/role";
import { toPersianDigits, formatDate } from "@/lib/format";

export interface RoleFormValues {
  name: string;
  description: string;
  status: "active" | "draft";
  permissions: Permission[];
}

export interface RoleFormProps {
  initialValues?: Partial<RoleFormValues> & {
    userCount?: number;
    createdAt?: string;
  };
  /** When provided, the form acts as edit (header reads "ویرایش نقش"). */
  isEdit?: boolean;
}

export function RoleForm({ initialValues, isEdit = false }: RoleFormProps) {
  const [name, setName] = React.useState(initialValues?.name ?? "");
  const [description, setDescription] = React.useState(initialValues?.description ?? "");
  const [status, setStatus] = React.useState<"active" | "draft">(
    initialValues?.status ?? "active",
  );
  const [permissions, setPermissions] = React.useState<Permission[]>(
    initialValues?.permissions ?? [],
  );

  return (
    <FormShell
      title={isEdit ? "ویرایش نقش" : "نقش جدید"}
      description={isEdit ? "ویرایش دسترسی‌ها و مشخصات نقش" : "ساخت نقش جدید با دسترسی‌های دلخواه"}
      backHref="/roles"
      submitLabel={isEdit ? "به‌روزرسانی نقش" : "ایجاد نقش"}
      sidePanel={
        <div className="space-y-5">
          <div
            className="rounded-lg border border-border bg-surface p-5"
            style={{ borderRadius: "var(--radius-lg)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={16} strokeWidth={1.75} className="text-foreground-secondary" />
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
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} strokeWidth={1.75} className="text-foreground-secondary" />
              <h3 className="text-sm font-semibold">آمار نقش</h3>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-foreground-secondary">تعداد کاربران</dt>
                <dd className="font-medium">{toPersianDigits(initialValues?.userCount ?? 0)}</dd>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <dt className="text-foreground-secondary">دسترسی‌های فعال</dt>
                <dd className="font-medium">
                  {toPersianDigits(permissions.reduce((acc, p) => acc + p.actions.length, 0))}
                </dd>
              </div>
              {initialValues?.createdAt ? (
                <>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <dt className="text-foreground-secondary">تاریخ ایجاد</dt>
                    <dd className="text-xs">{formatDate(initialValues.createdAt)}</dd>
                  </div>
                </>
              ) : null}
            </dl>
          </div>
        </div>
      }
    >
      <div
        className="rounded-lg border border-border bg-surface p-5 space-y-4"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <h2 className="text-sm font-semibold">مشخصات نقش</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="role-name">نام نقش</Label>
            <Input
              id="role-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: مدیر فروش"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role-status">شناسه داخلی</Label>
            <Input
              id="role-status"
              value={isEdit ? (initialValues?.name ?? "") : name}
              disabled
              className="bg-surface-secondary font-mono text-xs"
              placeholder="auto"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role-desc">توضیحات</Label>
          <Textarea
            id="role-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="شرح مختصر مسئولیت‌های این نقش..."
            rows={3}
          />
        </div>
      </div>

      <div
        className="rounded-lg border border-border bg-surface p-5"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold">دسترسی‌ها</h2>
          <span className="text-xs text-foreground-tertiary">بر اساس دامنه و عملیات</span>
        </div>
        <PermissionMatrix value={permissions} onChange={setPermissions} />
      </div>
    </FormShell>
  );
}

export type { Role };
