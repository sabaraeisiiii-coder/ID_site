"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/design-system/primitives";
import { Stack } from "@/design-system/primitives";

export default function Error({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[ErrorBoundary]", error); }, [error]);

  return (
    <Container className="min-h-[60vh] flex items-center justify-center py-16">
      <Stack gap={6} align="center" className="text-center max-w-md">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: "var(--color-error-50)", color: "var(--color-error-700)" }}>
          <AlertTriangle size={32} strokeWidth={1.5} />
        </span>
        <Stack gap={2} align="center">
          <h1 className="text-2xl sm:text-3xl font-bold">صفحه بارگذاری نشد</h1>
          <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
            مشکلی در بارگذاری این صفحه رخ داد. می‌تونی دوباره تلاش کنی.
          </p>
        </Stack>
        {error.digest ? (
          <p className="text-xs text-foreground-tertiary nums-persian">کد خطا: {error.digest}</p>
        ) : null}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Button onClick={reset} size="lg"><RotateCcw size={16} className="me-2" />تلاش مجدد</Button>
          <Button asChild size="lg" variant="outline"><Link href="/"><Home size={16} className="me-2" />بازگشت به خانه</Link></Button>
        </div>
      </Stack>
    </Container>
  );
}
