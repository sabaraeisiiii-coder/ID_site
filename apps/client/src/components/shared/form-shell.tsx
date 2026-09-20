"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * FormShell — reusable form wrapper for admin create/edit forms.
 * Renders a 2-column grid (main + side panel) with a sticky action bar.
 * Submit handler prevents default + shows success toast + redirects.
 */

export interface FormShellProps {
  title: string;
  description?: string;
  /** Where to navigate after successful submit. */
  backHref: string;
  /** Label for the submit button. */
  submitLabel?: string;
  /** Side panel content (settings, status, organization). */
  sidePanel?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FormShell({
  title, description, backHref, submitLabel = "ذخیره", sidePanel, children, className,
}: FormShellProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("با موفقیت ذخیره شد");
    router.push(backHref);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {children}
        </div>
        {/* Side panel */}
        {sidePanel ? (
          <div className="lg:col-span-1 space-y-6">
            {sidePanel}
          </div>
        ) : null}
      </div>

      {/* Sticky action bar */}
      <div
        className="sticky bottom-0 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-t border-border bg-surface flex items-center justify-end gap-2"
        style={{ zIndex: "var(--z-sticky)" }}
      >
        <Button type="button" variant="ghost" onClick={() => router.push(backHref)}>
          انصراف
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
