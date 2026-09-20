import Link from "next/link";
import { History, Filter, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auditService } from "@/domains/audit";
import { formatRelative, formatDateShort, formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const ACTION_LABELS: Record<string, string> = {
  create: "ایجاد کرد",
  update: "به‌روزرسانی کرد",
  update_status: "وضعیت را تغییر داد",
  update_stock: "موجودی را تغییر داد",
  update_settings: "تنظیمات را تغییر داد",
  delete: "حذف کرد",
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

export default async function AdminAuditLogPage() {
  const logs = await auditService.list();

  const entityTypes = Array.from(new Set(logs.map((l) => l.entity)));
  const actions = Array.from(new Set(logs.map((l) => l.action)));

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[{ label: "داشبورد", href: "/" }, { label: "لاگ رویدادها" }]}
      />

      <PageHeader
        title="لاگ رویدادها"
        description={`${logs.length} رویداد ثبت شده است`}
      />

      {/* Filters */}
      <div
        className="rounded-lg border border-border bg-surface p-4 flex flex-col sm:flex-row sm:items-end gap-3"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <div className="flex items-center gap-2 text-foreground-secondary shrink-0">
          <Filter size={14} strokeWidth={1.75} />
          <span className="text-sm font-medium">فیلترها</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          <div className="space-y-1.5">
            <label className="text-xs text-foreground-tertiary">نوع موجودیت</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="همه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه</SelectItem>
                {entityTypes.map((e) => (
                  <SelectItem key={e} value={e}>
                    {ENTITY_LABELS[e] ?? e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-foreground-tertiary">نوع عملیات</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="همه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه</SelectItem>
                {actions.map((a) => (
                  <SelectItem key={a} value={a}>
                    {ACTION_LABELS[a] ?? a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-foreground-tertiary">بازه زمانی</label>
            <Button variant="outline" className="w-full justify-start gap-2 font-normal text-foreground-secondary">
              <Calendar size={14} strokeWidth={1.75} />
              انتخاب بازه
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline list */}
      {logs.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={History}
            title="رویدادی ثبت نشده"
            description="در اینجا فعالیت‌های مدیریتی نمایش داده می‌شوند."
          />
        </div>
      ) : (
        <div
          className="rounded-lg border border-border bg-surface overflow-hidden"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <ol className="relative">
            {logs.map((log, idx) => (
              <li
                key={log.id}
                className="relative flex gap-4 px-5 py-4 hover:bg-surface-secondary/50 transition-colors"
                style={{
                  borderBottom:
                    idx < logs.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                {/* Connector dot */}
                <span
                  className="absolute top-7 inset-inline-start-[26px] w-2 h-2 rounded-full"
                  style={{ background: "var(--color-brand-500)" }}
                  aria-hidden
                />

                <Avatar className="size-10 shrink-0">
                  <AvatarFallback
                    style={{
                      background: "var(--color-brand-50)",
                      color: "var(--color-brand-700)",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {initials(log.actor.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-1 text-sm leading-relaxed">
                      <span className="font-semibold text-foreground break-words">
                        {log.actor.name}
                      </span>
                      <span className="text-foreground-secondary break-words">
                        {ACTION_LABELS[log.action] ?? log.action}
                      </span>
                      <span className="font-medium text-foreground break-words">
                        {ENTITY_LABELS[log.entity] ?? log.entity}
                      </span>
                      <span
                        className="inline-flex max-w-full shrink-0 whitespace-normal break-all rounded bg-surface-secondary px-1.5 py-0.5 font-mono text-[11px] leading-none text-foreground-tertiary"
                        dir="ltr"
                        style={{ unicodeBidi: "isolate" }}
                      >
                        #{log.entityId}
                      </span>
                    </div>
                    <Link
                      href={`/audit-log/${log.id}`}
                      className="text-xs font-medium text-primary hover:underline shrink-0"
                    >
                      مشاهده جزئیات
                    </Link>
                  </div>

                  {log.reason ? (
                    <p className="mt-1.5 whitespace-normal break-words border-s-2 border-border ps-3 text-xs leading-5 text-foreground-secondary">
                      {log.reason}
                    </p>
                  ) : null}

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-foreground-tertiary flex-wrap">
                    <span title={formatDate(log.timestamp)}>
                      {formatRelative(log.timestamp)} · {formatDateShort(log.timestamp)}
                    </span>
                    {log.ip ? (
                      <span
                        className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono"
                        style={{
                          background: "var(--surface-secondary)",
                        }}
                        dir="ltr"
                      >
                        IP: {log.ip}
                      </span>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
