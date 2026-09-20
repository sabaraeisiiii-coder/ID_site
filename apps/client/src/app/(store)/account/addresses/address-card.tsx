"use client";

/**
 * AddressCard — single address display card with edit dialog + remove confirm.
 * All actions are visual only (toast feedback, no real persistence).
 */

import * as React from "react";
import {
  MapPin,
  Phone,
  User,
  Home,
  Briefcase,
  Star,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import type { Address } from "@/domains/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { StatusBadge } from "@/components/shared/status-badge";
import { toPersianDigits } from "@/lib/format";

const labelIconMap = {
  "خانه": Home,
  "محل کار": Briefcase,
} as const;

function LabelIcon({ label }: { label: string }) {
  const Icon = labelIconMap[label as keyof typeof labelIconMap] ?? MapPin;
  return <Icon size={14} strokeWidth={1.75} />;
}

export interface AddressFormValues {
  label: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  line1: string;
  line2: string;
  postalCode: string;
  isDefault: boolean;
}

const emptyValues: AddressFormValues = {
  label: "خانه",
  fullName: "",
  phone: "",
  province: "",
  city: "",
  line1: "",
  line2: "",
  postalCode: "",
  isDefault: false,
};

function AddressForm({
  open, onOpenChange, initialValues, onSubmit, submitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: AddressFormValues;
  onSubmit: (values: AddressFormValues) => void;
  submitting: boolean;
}) {
  const [values, setValues] = React.useState<AddressFormValues>(
    initialValues ?? emptyValues,
  );

  React.useEffect(() => {
    if (open) {
      setValues(initialValues ?? emptyValues);
    }
  }, [open, initialValues]);

  function update<K extends keyof AddressFormValues>(key: K, value: AddressFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? "ویرایش آدرس" : "افزودن آدرس جدید"}
          </DialogTitle>
          <DialogDescription>
            اطلاعات آدرس را با دقت وارد کنید.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-label">عنوان آدرس</Label>
              <Input
                id="addr-label"
                value={values.label}
                onChange={(e) => update("label", e.target.value)}
                placeholder="خانه / محل کار"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-fullName">نام و نام خانوادگی گیرنده</Label>
              <Input
                id="addr-fullName"
                value={values.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="نام کامل گیرنده"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-phone">شماره تماس گیرنده</Label>
              <Input
                id="addr-phone"
                inputMode="tel"
                dir="ltr"
                className="text-right nums-persian"
                value={values.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="09123456789"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-postalCode">کد پستی</Label>
              <Input
                id="addr-postalCode"
                dir="ltr"
                className="text-right nums-persian"
                value={values.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                placeholder="۱۲۳۴۵۶۷۸۹۰"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-province">استان</Label>
              <Input
                id="addr-province"
                value={values.province}
                onChange={(e) => update("province", e.target.value)}
                placeholder="تهران"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="addr-city">شهر</Label>
              <Input
                id="addr-city"
                value={values.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="تهران"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="addr-line1">نشانی</Label>
            <Input
              id="addr-line1"
              value={values.line1}
              onChange={(e) => update("line1", e.target.value)}
              placeholder="خیابان، کوچه، پلاک"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="addr-line2">توضیحات بیشتر (اختیاری)</Label>
            <Input
              id="addr-line2"
              value={values.line2}
              onChange={(e) => update("line2", e.target.value)}
              placeholder="طبقه، واحد، نام سازنده"
            />
          </div>

          <label
            htmlFor="addr-isDefault"
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <Checkbox
              id="addr-isDefault"
              checked={values.isDefault}
              onCheckedChange={(v) => update("isDefault", v === true)}
            />
            <span className="text-sm">تنظیم به‌عنوان آدرس پیش‌فرض</span>
          </label>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "در حال ذخیره…" : "ذخیره آدرس"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AddressCard({ address }: { address: Address }) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function handleEditSubmit(values: AddressFormValues) {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setEditOpen(false);
      toast.success("آدرس به‌روزرسانی شد.");
    }, 600);
  }

  function handleSetDefault() {
    toast.success("این آدرس به‌عنوان پیش‌فرض تنظیم شد.", {
      description: "برای آدرس‌های بعدی از این آدرس استفاده می‌شود.",
    });
  }

  function handleRemove() {
    toast.success("آدرس حذف شد.");
  }

  return (
    <article
      className="relative flex flex-col gap-4 p-5 bg-surface border border-border"
      style={{ borderRadius: "var(--radius-lg)" }}
    >
      {/* Header row */}
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-8 h-8"
            style={{
              borderRadius: "var(--radius-md)",
              background: "var(--surface-secondary)",
              color: "var(--foreground-secondary)",
            }}
          >
            <LabelIcon label={address.label} />
          </span>
          <span className="text-sm font-semibold">{address.label}</span>
        </div>
        {address.isDefault ? (
          <StatusBadge intent="primary" dot>پیش‌فرض</StatusBadge>
        ) : null}
      </header>

      {/* Recipient */}
      <div className="flex flex-col gap-2 text-sm">
        <p className="font-medium flex items-center gap-2">
          <User size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
          {address.fullName}
        </p>
        <p className="text-foreground-secondary flex items-center gap-2 nums-persian" dir="ltr">
          <Phone size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
          <span className="text-right inline-block">
            {toPersianDigits(address.phone)}
          </span>
        </p>
      </div>

      {/* Address */}
      <div className="text-sm text-foreground-secondary leading-6 flex items-start gap-2">
        <MapPin size={14} strokeWidth={1.75} className="text-foreground-tertiary mt-1 shrink-0" />
        <div className="flex flex-col gap-1 min-w-0">
          <p>{address.line1}{address.line2 ? `، ${address.line2}` : ""}</p>
          <p>
            {address.province}، {address.city}
          </p>
          <p className="text-xs text-foreground-tertiary nums-persian" dir="ltr">
            کد پستی: {toPersianDigits(address.postalCode)}
          </p>
        </div>
      </div>

      {/* Actions */}
      <footer className="flex flex-wrap items-center gap-2 pt-3 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
        >
          <Pencil size={14} strokeWidth={1.75} />
          ویرایش
        </Button>
        {!address.isDefault ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSetDefault}
          >
            <Star size={14} strokeWidth={1.75} />
            تنظیم به‌عنوان پیش‌فرض
          </Button>
        ) : (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-foreground-tertiary"
            style={{ borderRadius: "var(--radius-md)" }}
          >
            <CheckCircle2 size={14} strokeWidth={1.75} />
            آدرس پیش‌فرض
          </span>
        )}
        <ConfirmDialog
          trigger={
            <Button type="button" variant="ghost" size="sm" className="text-destructive ms-auto">
              <Trash2 size={14} strokeWidth={1.75} />
              حذف
            </Button>
          }
          title="حذف این آدرس؟"
          description="پس از حذف، این آدرس دیگر قابل بازیابی نیست."
          confirmLabel="حذف آدرس"
          intent="destructive"
          onConfirm={handleRemove}
        />
      </footer>

      <AddressForm
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={{
          label: address.label,
          fullName: address.fullName,
          phone: address.phone,
          province: address.province,
          city: address.city,
          line1: address.line1,
          line2: address.line2 ?? "",
          postalCode: address.postalCode,
          isDefault: address.isDefault,
        }}
        onSubmit={handleEditSubmit}
        submitting={submitting}
      />
    </article>
  );
}

export function AddAddressButton() {
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function handleSubmit(values: AddressFormValues) {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      toast.success("آدرس جدید اضافه شد.");
    }, 600);
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        افزودن آدرس جدید
      </Button>
      <AddressForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </>
  );
}
