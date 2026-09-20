"use client";

/**
 * Login page — minimal auth shell, client form with toast + redirect.
 */

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Container, Stack, Inline, Box } from "@/design-system/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error("لطفاً شماره موبایل و رمز عبور را وارد کنید.");
      return;
    }
    setSubmitting(true);
    // Simulated auth latency
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("خوش آمدید! با موفقیت وارد شدید.");
    router.push("/");
  }

  return (
    <Container size="sm" className="px-0">
      <Box
        className="p-6 sm:p-8 border border-border bg-surface shadow-sm"
        style={{ borderRadius: "var(--radius-xl)" }}
      >
        <Stack gap={2} className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">ورود به حساب</h1>
          <p className="text-sm text-foreground-secondary">
            برای ادامه خرید وارد حساب کاربری خود شوید.
          </p>
        </Stack>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Stack gap={2}>
            <Label htmlFor="identifier">شماره موبایل یا ایمیل</Label>
            <Input
              id="identifier"
              type="text"
              autoComplete="username"
              inputMode="email"
              placeholder="0912XXXXXXX یا ایمیل شما"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={submitting}
              required
            />
          </Stack>

          <Stack gap={2}>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">رمز عبور</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-foreground-tertiary hover:text-foreground transition-colors"
                style={{ transitionDuration: "var(--duration-fast)" }}
              >
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                required
                className="pe-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute end-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-tertiary hover:text-foreground hover:bg-surface-secondary transition-colors"
                style={{ transitionDuration: "var(--duration-fast)" }}
                aria-label={showPassword ? "پنهان کردن رمز" : "نمایش رمز"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Stack>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(v) => setRemember(Boolean(v))}
              disabled={submitting}
            />
            <Label htmlFor="remember" className="text-sm text-foreground-secondary cursor-pointer">
              مرا به خاطر بسپار
            </Label>
          </div>

          <Button type="submit" className="w-full h-11" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                در حال ورود…
              </>
            ) : (
              "ورود"
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-foreground-tertiary">یا</span>
          <Separator className="flex-1" />
        </div>

        <Inline justify="center" gap={1} className="text-sm">
          <span className="text-foreground-secondary">حساب کاربری ندارید؟</span>
          <Link
            href="/register"
            className="font-medium text-foreground hover:underline underline-offset-4"
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            ثبت‌نام کنید
          </Link>
        </Inline>
      </Box>
    </Container>
  );
}
