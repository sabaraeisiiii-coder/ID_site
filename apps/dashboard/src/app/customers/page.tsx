import { Search, Filter, Users, Eye, Mail, Phone } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { UserStatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customerService, type User } from "@/domains/customer";
import {
  formatPrice,
  formatNumber,
  formatDateShort,
  toPersianDigits,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const params = await searchParams;
  const status = params.status ?? "all";
  const allUsers = await customerService.list();

  const users =
    status === "all"
      ? allUsers
      : allUsers.filter((u) => u.status === status);

  const columns: Column<User>[] = [
    {
      key: "name",
      header: "نام",
      cell: (u) => (
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold shrink-0"
            style={{
              background: "var(--color-brand-50)",
              color: "var(--color-brand-700)",
            }}
          >
            {u.fullName.charAt(0)}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground truncate">
              {u.fullName}
            </span>
            <span className="text-[11px] text-foreground-tertiary">
              {u.role}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "mobile",
      header: "موبایل",
      width: "140px",
      cell: (u) => (
        <span
          className="text-sm text-foreground-secondary font-mono"
          dir="ltr"
        >
          {u.mobile}
        </span>
      ),
    },
    {
      key: "email",
      header: "ایمیل",
      cell: (u) =>
        u.email ? (
          <span className="text-sm text-foreground-secondary truncate" dir="ltr">
            {u.email}
          </span>
        ) : (
          <span className="text-xs text-foreground-tertiary">—</span>
        ),
    },
    {
      key: "ordersCount",
      header: "تعداد سفارش",
      width: "120px",
      align: "center",
      cell: (u) => (
        <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-md px-2 text-xs font-medium"
          style={{
            background: "var(--surface-secondary)",
            color: "var(--foreground-secondary)",
          }}
        >
          {toPersianDigits(u.ordersCount ?? 0)}
        </span>
      ),
    },
    {
      key: "totalSpent",
      header: "مجموع خرید",
      width: "160px",
      align: "end",
      cell: (u) => (
        <span className="text-sm font-semibold" dir="ltr">
          {u.totalSpent ? formatPrice(u.totalSpent) : "—"}
        </span>
      ),
    },
    {
      key: "status",
      header: "وضعیت",
      width: "120px",
      cell: (u) => <UserStatusBadge status={u.status} />,
    },
    {
      key: "createdAt",
      header: "تاریخ عضویت",
      width: "120px",
      align: "end",
      cell: (u) => (
        <span className="text-xs text-foreground-secondary" dir="ltr">
          {formatDateShort(u.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      width: "60px",
      align: "end",
      cell: (u) => (
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-foreground-tertiary hover:bg-surface-secondary hover:text-foreground transition-colors"
          aria-label={`مشاهده ${u.fullName}`}
        >
          <Eye size={16} strokeWidth={1.75} />
        </button>
      ),
    },
  ];

  // Status counts
  const counts: Record<string, number> = { all: allUsers.length };
  for (const u of allUsers) {
    counts[u.status] = (counts[u.status] ?? 0) + 1;
  }

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[{ label: "داشبورد", href: "/" }, { label: "مشتریان" }]}
      />

      <PageHeader
        title="مشتریان"
        description={`${formatNumber(allUsers.length)} مشتری ثبت‌نام شده`}
      />

      {/* Search + status filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={16}
            strokeWidth={1.75}
            className="absolute inset-inline-start-3 top-1/2 -translate-y-1/2 text-foreground-tertiary pointer-events-none"
          />
          <Input
            type="search"
            placeholder="جستجو بر اساس نام، موبایل یا ایمیل..."
            defaultValue={params.q ?? ""}
            className="h-9 ps-9 pe-3 text-sm bg-surface-secondary border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 sm:ms-auto">
          <Select defaultValue={status}>
            <SelectTrigger size="sm" className="w-40">
              <SelectValue placeholder="همه وضعیت‌ها" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه ({toPersianDigits(counts.all ?? 0)})</SelectItem>
              <SelectItem value="active">
                فعال ({toPersianDigits(counts.active ?? 0)})
              </SelectItem>
              <SelectItem value="pending">
                در انتظار ({toPersianDigits(counts.pending ?? 0)})
              </SelectItem>
              <SelectItem value="suspended">
                معلق ({toPersianDigits(counts.suspended ?? 0)})
              </SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter size={14} strokeWidth={1.75} />
            فیلتر
          </Button>
        </div>
      </div>

      {users.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={Users}
            title="مشتری‌ای یافت نشد"
            description="هیچ مشتری‌ای با این فیلتر وجود ندارد."
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={users}
          getRowKey={(u) => u.id}
          density="comfortable"
          stickyHeader
        />
      )}

      {/* Quick inline mini-cards: contact shortcuts (decorative footer) */}
      <section
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        aria-hidden="true"
      >
        <MiniContact
          icon={Users}
          label="کل مشتریان"
          value={toPersianDigits(allUsers.length)}
        />
        <MiniContact
          icon={Mail}
          label="با ایمیل"
          value={toPersianDigits(
            allUsers.filter((u) => Boolean(u.email)).length,
          )}
        />
        <MiniContact
          icon={Phone}
          label="با موبایل تأیید شده"
          value={toPersianDigits(allUsers.length)}
        />
        <MiniContact
          icon={Users}
          label="مشتریان فعال"
          value={toPersianDigits(counts.active ?? 0)}
          intent="success"
        />
      </section>
    </div>
  );
}

function MiniContact({
  icon: Icon,
  label,
  value,
  intent,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  intent?: "success";
}) {
  return (
    <div
      className="rounded-lg border border-border bg-surface p-4 flex items-center gap-3"
      style={{ borderRadius: "var(--radius-md)" }}
    >
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-md shrink-0"
        style={{
          background:
            intent === "success"
              ? "var(--color-success-50)"
              : "var(--surface-secondary)",
          color:
            intent === "success"
              ? "var(--color-success-700)"
              : "var(--foreground-secondary)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <Icon size={16} strokeWidth={1.75} />
      </span>
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] text-foreground-tertiary">{label}</span>
        <span className="text-sm font-semibold" dir="ltr">
          {value}
        </span>
      </div>
    </div>
  );
}
