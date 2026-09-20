"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error, reset,
}: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[GlobalError]", error); }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-[60vh] flex items-center justify-center py-16 px-6">
          <div className="flex flex-col items-center gap-6 text-center max-w-md">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: "var(--color-error-50)", color: "var(--color-error-700)" }}>
              <AlertTriangle size={32} strokeWidth={1.5} />
            </span>
            <div className="flex flex-col gap-2 items-center">
              <h1 className="text-2xl sm:text-3xl font-bold">خطایی رخ داد</h1>
              <p className="text-sm sm:text-base text-foreground-secondary leading-relaxed">
                متأسفانه هنگام پردازش درخواست شما مشکلی پیش آمد. لطفاً دوباره تلاش کنید.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Button onClick={reset} size="lg"><RotateCcw size={16} className="me-2" />تلاش مجدد</Button>
              <Button asChild size="lg" variant="outline"><Link href="/"><Home size={16} className="me-2" />بازگشت به خانه</Link></Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
