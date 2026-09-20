"use client";

import * as React from "react";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/** Mark-all-read button (visual only — shows a toast). */
export function MarkAllReadButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => toast.success("همه اعلان‌ها به‌عنوان خوانده‌شده علامت‌گذاری شدند")}
    >
      <CheckCheck size={14} strokeWidth={1.75} />
      علامت‌گذاری همه به‌عنوان خوانده‌شده
    </Button>
  );
}
