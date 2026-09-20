"use client";

/**
 * Payment result page — Client Component.
 * Reads searchParams.status (success | failed | pending).
 * Renders a premium, centered result card with the appropriate icon and CTAs.
 */

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2, XCircle, Clock, ArrowLeft, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Section, Container, Stack, Inline } from "@/design-system/primitives";
import { Button } from "@/components/ui/button";
import { toPersianDigits } from "@/lib/format";

export default function PaymentResultPage() {
  const sp = useSearchParams();

  const statusRaw = sp.get("status") ?? "success";
  const order = sp.get("order") ?? `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const reference = sp.get("reference") ?? `TXN-${Math.floor(100000 + Math.random() * 900000)}`;

  const status: "success" | "failed" | "pending" =
    statusRaw === "failed" || statusRaw === "pending" ? statusRaw : "success";

  const handleRetry = () => {
    toast.info("در حال اتصال به درگاه...", { description: "لطفاً چند لحظه صبر کنید." });
  };

  if (status === "success") {
    return (
      <PaymentResultShell>
        <IconCircle
          icon={CheckCircle2}
          tone={{ bg: "var(--color-success-50)", fg: "var(--color-success-500)" }}
          pulse={false}
        />
        <Stack gap={2} align="center" className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            پرداخت با موفقیت انجام شد
          </h1>
          <p className="text-sm text-foreground-secondary leading-relaxed max-w-md">
            سفارش شما با موفقیت ثبت شد. کد رهگیری زیر را برای پیگیری نگه دارید.
          </p>
        </Stack>

        <div
          className="w-full max-w-md bg-surface border border-border p-5 flex flex-col gap-3"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <DetailRow label="شماره سفارش" value={order} mono />
          <DetailRow label="کد پیگیری" value={reference} mono />
        </div>

        <Inline gap={3} className="flex-wrap justify-center">
          <Button asChild size="lg">
            <Link href="/account/orders">
              مشاهده سفارش
              <ArrowLeft size={14} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              بازگشت به فروشگاه
            </Link>
          </Button>
        </Inline>
      </PaymentResultShell>
    );
  }

  if (status === "failed") {
    return (
      <PaymentResultShell>
        <IconCircle
          icon={XCircle}
          tone={{ bg: "var(--color-error-50)", fg: "var(--color-error-500)" }}
          pulse={false}
        />
        <Stack gap={2} align="center" className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            پرداخت ناموفق بود
          </h1>
          <p className="text-sm text-foreground-secondary leading-relaxed max-w-md">
            متأسفانه پرداخت شما با خطا مواجه شد. مبلغی از حساب شما کسر نشده است.
            می‌توانید دوباره تلاش کنید.
          </p>
        </Stack>

        <div
          className="w-full max-w-md bg-surface border border-border p-5 flex flex-col gap-3"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <DetailRow label="شماره سفارش" value={order} mono />
        </div>

        <Inline gap={3} className="flex-wrap justify-center">
          <Button size="lg" onClick={handleRetry}>
            <RefreshCw size={14} />
            تلاش مجدد
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/cart">
              بازگشت به سبد
              <ArrowLeft size={14} />
            </Link>
          </Button>
        </Inline>
      </PaymentResultShell>
    );
  }

  // pending
  return (
    <PaymentResultShell>
      <IconCircle
        icon={Clock}
        tone={{ bg: "var(--color-warning-50)", fg: "var(--color-warning-500)" }}
        pulse
      />
      <Stack gap={2} align="center" className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          پرداخت در حال بررسی است
        </h1>
        <p className="text-sm text-foreground-secondary leading-relaxed max-w-md">
          فرآیند پرداخت شما در حال تأیید است. در صورت قطعی شدن پرداخت، نتیجه از طریق پیامک
          و اعلان به اطلاع شما خواهد رسید.
        </p>
      </Stack>

      <div
        className="w-full max-w-md bg-surface border border-border p-5 flex flex-col gap-3"
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <DetailRow label="شماره سفارش" value={order} mono />
        <DetailRow label="کد پیگیری" value={reference} mono />
      </div>

      <Inline gap={3} className="flex-wrap justify-center">
        <Button asChild size="lg">
          <Link href="/">
            بازگشت به خانه
            <ArrowLeft size={14} />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/account/orders">
            مشاهده سفارش‌ها
          </Link>
        </Button>
      </Inline>
    </PaymentResultShell>
  );
}

/* ---------- Shell ---------- */
function PaymentResultShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-background min-h-screen flex items-center justify-center">
      <Section spacing="md" containerSize="sm" className="w-full">
        <Container>
          <Stack gap={6} align="center" className="w-full">
            {children}
          </Stack>
        </Container>
      </Section>
    </main>
  );
}

/* ---------- Icon circle ---------- */
function IconCircle({
  icon: Icon, tone, pulse,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  tone: { bg: string; fg: string };
  pulse: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center ${pulse ? "animate-pulse" : ""}`}
      style={{
        width: 96,
        height: 96,
        borderRadius: "var(--radius-full)",
        background: tone.bg,
        color: tone.fg,
      }}
    >
      <Icon size={44} strokeWidth={1.5} />
    </span>
  );
}

/* ---------- Detail row ---------- */
function DetailRow({
  label, value, mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-foreground-tertiary">{label}</span>
      <span
        className={`text-sm font-semibold nums-persian ${mono ? "font-mono" : ""}`}
        dir="ltr"
      >
        {toPersianDigits(value)}
      </span>
    </div>
  );
}
