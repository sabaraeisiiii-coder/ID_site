"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { permissionDomains, type Permission } from "@/domains/role";
import { toPersianDigits } from "@/lib/format";

/**
 * PermissionMatrix — grid of domains × actions with checkboxes.
 * Used inside RoleForm. Select-all per domain + per-action toggle chips.
 */

export interface PermissionMatrixProps {
  value: Permission[];
  onChange: (next: Permission[]) => void;
  className?: string;
}

const ACTION_LABELS: Record<string, string> = {
  view: "مشاهده",
  create: "ایجاد",
  edit: "ویرایش",
  delete: "حذف",
};

export function PermissionMatrix({ value, onChange, className }: PermissionMatrixProps) {
  const valueMap = React.useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const p of value) {
      m.set(p.domain, new Set(p.actions));
    }
    return m;
  }, [value]);

  const toggleAction = (domain: string, action: string) => {
    const next = new Map(valueMap);
    const set = new Set(next.get(domain) ?? []);
    if (set.has(action)) set.delete(action);
    else set.add(action);
    next.set(domain, set);
    commit(next);
  };

  const toggleDomainAll = (domain: string, allActions: string[]) => {
    const next = new Map(valueMap);
    const existing = next.get(domain) ?? new Set<string>();
    const allSelected = allActions.every((a) => existing.has(a));
    if (allSelected) {
      next.delete(domain);
    } else {
      next.set(domain, new Set(allActions));
    }
    commit(next);
  };

  const commit = (next: Map<string, Set<string>>) => {
    const arr: Permission[] = [];
    for (const [domain, set] of next.entries()) {
      if (set.size > 0) arr.push({ domain, actions: Array.from(set) });
    }
    onChange(arr);
  };

  const totalSelected = Array.from(valueMap.values()).reduce((acc, s) => acc + s.size, 0);
  const totalAvailable = permissionDomains.reduce((acc, d) => acc + d.actions.length, 0);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-foreground-tertiary">
          ماتریس دسترسی‌ها
        </p>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{
            background: "var(--color-brand-50)",
            color: "var(--color-brand-700)",
          }}
        >
          {toPersianDigits(totalSelected)} / {toPersianDigits(totalAvailable)} دسترسی
        </span>
      </div>

      <div
        className="rounded-lg border border-border overflow-hidden"
        style={{ borderRadius: "var(--radius-md)" }}
      >
        {permissionDomains.map((d, idx) => {
          const selected = valueMap.get(d.domain) ?? new Set<string>();
          const allSelected = d.actions.every((a) => selected.has(a));
          const partial = !allSelected && selected.size > 0;
          return (
            <div
              key={d.domain}
              className={cn(
                "grid grid-cols-[180px_1fr] items-center gap-4 px-4 py-3",
                idx > 0 && "border-t border-border",
              )}
            >
              <label className="flex items-center gap-2.5 cursor-pointer min-w-0">
                <span
                  role="checkbox"
                  aria-checked={allSelected}
                  tabIndex={0}
                  onClick={() => toggleDomainAll(d.domain, d.actions)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      toggleDomainAll(d.domain, d.actions);
                    }
                  }}
                  className={cn(
                    "inline-flex h-4 w-4 items-center justify-center rounded border transition-colors shrink-0",
                    allSelected || partial
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface",
                  )}
                  style={{ borderRadius: "var(--radius-sm)" }}
                >
                  {allSelected ? (
                    <Check size={12} strokeWidth={3} />
                  ) : partial ? (
                    <span className="h-0.5 w-2 bg-primary-foreground rounded-full" />
                  ) : null}
                </span>
                <span className="text-sm font-medium text-foreground truncate">
                  {d.label}
                </span>
                <span className="text-[10px] text-foreground-tertiary font-mono" dir="ltr">
                  {d.domain}
                </span>
              </label>

              <div className="flex items-center gap-1.5 flex-wrap">
                {d.actions.map((action) => {
                  const active = selected.has(action);
                  return (
                    <button
                      key={action}
                      type="button"
                      onClick={() => toggleAction(d.domain, action)}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-secondary text-foreground-secondary hover:bg-surface-tertiary hover:text-foreground",
                      )}
                      style={{ transitionDuration: "var(--duration-fast)" }}
                    >
                      {active ? <Check size={11} strokeWidth={2.5} /> : null}
                      <span>{ACTION_LABELS[action] ?? action}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
