import Link from "next/link";
import { ShieldCheck, Plus, Users, ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { roleService } from "@/domains/role";
import { toPersianDigits, formatDateShort } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminRolesPage() {
  const roles = await roleService.list();

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[{ label: "داشبورد", href: "/" }, { label: "نقش‌ها" }]}
      />

      <PageHeader
        title="نقش‌ها"
        description={`${toPersianDigits(roles.length)} نقش تعریف شده`}
        actions={
          <Button asChild size="sm">
            <Link href="/roles/new">
              <Plus size={14} strokeWidth={2} />
              نقش جدید
            </Link>
          </Button>
        }
      />

      {roles.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={ShieldCheck}
            title="هیچ نقشی تعریف نشده"
            description="برای شروع، اولین نقش مدیریت را ایجاد کنید."
            action={
              <Button asChild size="sm">
                <Link href="/roles/new">
                  <Plus size={14} strokeWidth={2} />
                  ایجاد نقش
                </Link>
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {roles.map((role) => {
            const permCount = role.permissions.reduce(
              (acc, p) => acc + p.actions.length,
              0,
            );
            return (
              <Link
                key={role.id}
                href={`/roles/${role.id}`}
                className="group rounded-lg border border-border bg-surface p-5 flex flex-col gap-4 transition-all hover:shadow-md hover:border-foreground/10"
                style={{ borderRadius: "var(--radius-lg)" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md shrink-0"
                      style={{
                        background: "var(--color-brand-50)",
                        color: "var(--color-brand-700)",
                        borderRadius: "var(--radius-md)",
                      }}
                    >
                      <ShieldCheck size={18} strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {role.name}
                      </h3>
                      <p className="text-xs text-foreground-tertiary mt-0.5" dir="ltr">
                        {role.id}
                      </p>
                    </div>
                  </div>
                  <EntityStatusBadge status={role.status} />
                </div>

                <p className="text-sm text-foreground-secondary line-clamp-2 min-h-[2.5rem]">
                  {role.description}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Users size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-foreground-tertiary">کاربران</span>
                      <span className="text-sm font-semibold">
                        {toPersianDigits(role.userCount)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} strokeWidth={1.75} className="text-foreground-tertiary" />
                    <div className="flex flex-col">
                      <span className="text-[10px] text-foreground-tertiary">دسترسی‌ها</span>
                      <span className="text-sm font-semibold">
                        {toPersianDigits(permCount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-[11px] text-foreground-tertiary">
                    {formatDateShort(role.createdAt)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-1.5 transition-all">
                    مشاهده جزئیات
                    <ArrowLeft size={12} strokeWidth={2} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
