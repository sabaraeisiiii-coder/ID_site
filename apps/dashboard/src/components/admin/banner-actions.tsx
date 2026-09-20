"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Banner card action buttons — visual only, show toasts on click. */
export function BannerActions({ id }: { id: string }) {
  return (
    <div className="flex items-center gap-1">
      <Button asChild
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => toast.info("فرم ویرایش بنر به‌زودی فعال خواهد شد")}
        aria-label="ویرایش بنر"
      >
        <Link href={`/banners/${id}`}><Pencil size={14} strokeWidth={1.75} /></Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-foreground-tertiary hover:text-error"
        onClick={() => toast.error("برای حذف بنر ابتدا نیاز به تأیید دارید")}
        aria-label="حذف بنر"
      >
        <Trash2 size={14} strokeWidth={1.75} />
      </Button>
    </div>
  );
}
