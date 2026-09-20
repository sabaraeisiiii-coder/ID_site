import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Globe,
  Tag,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { auditService } from "@/domains/audit";
import { formatDate, formatRelative, formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

const ACTION_LABELS: Record<string, string> = {
  create: "ایجاد",
  update: "به‌روزرسانی",
  update_status: "تغییر وضعیت",
  update_stock: "تغییر موجودی",
  update_settings: "تغییر تنظیمات",
  delete: "حذف",
};

const ENTITY_LABELS: Record<string, string> = {
  order: "سفارش",
  product: "محصول",
  discount: "تخفیف",
  site_settings: "تنظیمات سایت",
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "—";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] ?? "") + (parts[1][0] ?? "");
}

function DiffPanel({
  title,
  data,
  emptyHint,
}: {
  title: string;
  data?: Record<string, unknown>;
  emptyHint: string;
}) {
  return (
    <div
      className="rounded-lg border border-border bg-surface overflow-hidden"
      style={{ borderRadius: "var(--radius-md)" }}
    >
      <div className="px-4 py-2.5 border-b border-border bg-surface-secondary">
        <h3 className="text-xs font-semibold text-foreground-secondary">{title}</h3>
      </div>
      {data && Object.keys(data).length > 0 ? (
        <dl className="divide-y divide-border">
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[120px_1fr] gap-2 px-4 py-2">
              <dt className="text-xs font-mono text-foreground-tertiary" dir="ltr">
                {k}
              </dt>
              <dd className="text-xs font-medium text-foreground" dir="ltr">
                {typeof v === "object" ? JSON.stringify(v) : String(v)}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <div className="px-4 py-6 text-center">
          <p className="text-xs text-foreground-tertiary">{emptyHint}</p>
        </div>
      )}
    </div>
  );
}

export default async function AuditDetailPage({ params }: PageProps) {
  const { id } = await params;
  const log = await auditService.getById(id);
  if (!log) notFound();

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[
          { label: "داشبورد", href: "/" },
          { label: "لاگ رویدادها", href: "/audit-log" },
          { label: log.id },
        ]}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/audit-log"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary hover:text-foreground transition-colors"
            aria-label="بازگشت"
          >
            <ArrowRight size={18} strokeWidth={1.75} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold truncate">
              {ACTION_LABELS[log.action] ?? log.action} {ENTITY_LABELS[log.entity] ?? log.entity}
            </h1>
            <p className="text-xs text-foreground-tertiary font-mono mt-0.5" dir="ltr">
              {log.id} · {log.entity}/{log.entityId}
            </p>
          </div>
        </div>
      </div>

      {/* Actor + meta card */}
      <div
        className="rounded-lg border border-border bg-surface p-5"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <div className="flex items-start gap-4">
          <Avatar className="size-12 shrink-0">
            <AvatarFallback
              style={{
                background: "var(--color-brand-50)",
                color: "var(--color-brand-700)",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {initials(log.actor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <User size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
              <span className="text-sm font-semibold">{log.actor.name}</span>
              <span className="text-xs text-foreground-tertiary font-mono" dir="ltr">
                {log.actor.id}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Tag size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-foreground-tertiary">عملیات</span>
                  <span className="text-sm font-medium">
                    {ACTION_LABELS[log.action] ?? log.action}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-foreground-tertiary">زمان</span>
                  <span className="text-sm font-medium" title={formatDate(log.timestamp)}>
                    {formatRelative(log.timestamp)}
                  </span>
                  <span className="text-[10px] text-foreground-tertiary">
                    {formatDateShort(log.timestamp)}
                  </span>
                </div>
              </div>
              {log.ip ? (
                <div className="flex items-center gap-2">
                  <Globe size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
                  <div className="flex flex-col">
                    <span className="text-[10px] text-foreground-tertiary">آدرس IP</span>
                    <span className="text-sm font-mono" dir="ltr">{log.ip}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {log.reason ? (
          <>
            <Separator className="my-4" />
            <div className="flex items-start gap-2.5 ps-3 border-s-2" style={{ borderColor: "var(--color-brand-500)" }}>
              <FileText size={14} strokeWidth={1.75} className="text-foreground-tertiary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-foreground-tertiary mb-1">دلیل تغییر</p>
                <p className="text-sm text-foreground leading-relaxed">{log.reason}</p>
              </div>
            </div>
          </>
        ) : null}
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <AlertCircle size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
            <h2 className="text-sm font-semibold">قبل از تغییر</h2>
          </div>
          <DiffPanel title="قبل" data={log.before} emptyHint="مقدار قبلی ثبت نشده است (ایجاد اولیه)." />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <AlertCircle size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
            <h2 className="text-sm font-semibold">بعد از تغییر</h2>
          </div>
          <DiffPanel title="بعد" data={log.after} emptyHint="مقدار جدید ثبت نشده است (حذف)." />
        </div>
      </div>
    </div>
  );
}
