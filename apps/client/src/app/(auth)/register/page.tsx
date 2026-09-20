"use client";

/**
 * Register page — minimal auth shell, client form with validation + toast.
 */

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Container, Stack, Inline, Box } from "@/design-system/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const MOBILE_PATTERN = /^09\d{9}$/;

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function validate(): Record<string, string> {
    const next: Record<string, string> = {};
    if (!firstName.trim()) next.firstName = "نام را وارد کنید.";
    if (!lastName.trim()) next.lastName = "نام خانوادگی را وارد کنید.";
    if (!mobile.trim()) {
      next.mobile = "شماره موبایل را وارد کنید.";
    } else if (!MOBILE_PATTERN.test(mobile.trim())) {
      next.mobile = "شماره موبایل معتبر نیست (مثال: 09123456789).";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "ایمیل معتبر نیست.";
    }
    if (!password) {
      next.password = "رمز عبور را وارد کنید.";
    } else if (password.length < 6) {
      next.password = "رمز عبور باید حداقل ۶ کاراکتر باشد.";
    }
    if (confirmPassword !== password) {
      next.confirmPassword = "تکرار رمز عبور یکسان نیست.";
    }
    if (!acceptTerms) {
      next.acceptTerms = "پذیرش قوانین الزامی است.";
    }
    return next;
  }

  React.useEffect(() => {
    setErrors(validate());
  }, [firstName, lastName, mobile, email, password, confirmPassword, acceptTerms]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      mobile: true,
      email: true,
      password: true,
      confirmPassword: true,
      acceptTerms: true,
    });
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) {
      toast.error("لطفاً خطاهای فرم را برطرف کنید.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success("حساب شما با موفقیت ساخته شد. وارد شوید.");
    router.push("/login");
  }

  function showError(name: string): string | undefined {
    return touched[name] ? errors[name] : undefined;
  }

  const passwordStrength = getPasswordStrength(password);

  return (
    <Container size="sm" className="px-0">
      <Box
        className="p-6 sm:p-8 border border-border bg-surface shadow-sm"
        style={{ borderRadius: "var(--radius-xl)" }}
      >
        <Stack gap={2} className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">ساخت حساب کاربری</h1>
          <p className="text-sm text-foreground-secondary">
            در کمتر از یک دقیقه ثبت‌نام کنید و خرید را شروع کنید.
          </p>
        </Stack>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Stack gap={2}>
              <Label htmlFor="firstName">نام</Label>
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="مثلاً علی"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
                disabled={submitting}
                aria-invalid={Boolean(showError("firstName"))}
              />
              {showError("firstName") ? (
                <p className="text-xs text-error">{showError("firstName")}</p>
              ) : null}
            </Stack>
            <Stack gap={2}>
              <Label htmlFor="lastName">نام خانوادگی</Label>
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="مثلاً رضایی"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
                disabled={submitting}
                aria-invalid={Boolean(showError("lastName"))}
              />
              {showError("lastName") ? (
                <p className="text-xs text-error">{showError("lastName")}</p>
              ) : null}
            </Stack>
          </div>

          <Stack gap={2}>
            <Label htmlFor="mobile">شماره موبایل</Label>
            <Input
              id="mobile"
              type="tel"
              inputMode="tel"
              dir="ltr"
              autoComplete="tel"
              placeholder="09123456789"
              className="text-right"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, mobile: true }))}
              disabled={submitting}
              aria-invalid={Boolean(showError("mobile"))}
            />
            {showError("mobile") ? (
              <p className="text-xs text-error">{showError("mobile")}</p>
            ) : null}
          </Stack>

          <Stack gap={2}>
            <Label htmlFor="email">
              ایمیل <span className="text-foreground-tertiary font-normal">(اختیاری)</span>
            </Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder="you@example.com"
              className="text-right"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              disabled={submitting}
              aria-invalid={Boolean(showError("email"))}
            />
            {showError("email") ? (
              <p className="text-xs text-error">{showError("email")}</p>
            ) : null}
          </Stack>

          <Stack gap={2}>
            <Label htmlFor="password">رمز عبور</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="حداقل ۶ کاراکتر"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                disabled={submitting}
                aria-invalid={Boolean(showError("password"))}
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
            {password.length > 0 ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      background: passwordStrength.color,
                      transitionDuration: "var(--duration-fast)",
                    }}
                  />
                </div>
                <span className="text-xs text-foreground-tertiary nums-persian">
                  {passwordStrength.label}
                </span>
              </div>
            ) : null}
            {showError("password") ? (
              <p className="text-xs text-error">{showError("password")}</p>
            ) : null}
          </Stack>

          <Stack gap={2}>
            <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="رمز عبور را دوباره وارد کنید"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
              disabled={submitting}
              aria-invalid={Boolean(showError("confirmPassword"))}
            />
            {showError("confirmPassword") ? (
              <p className="text-xs text-error">{showError("confirmPassword")}</p>
            ) : confirmPassword && confirmPassword === password ? (
              <p className="text-xs text-success flex items-center gap-1">
                <CheckCircle2 size={14} /> رمز عبور یکسان است.
              </p>
            ) : null}
          </Stack>

          <Stack gap={2}>
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(v) => setAcceptTerms(Boolean(v))}
                disabled={submitting}
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm text-foreground-secondary cursor-pointer leading-relaxed">
                با{" "}
                <Link href="/pages/terms" className="text-foreground hover:underline underline-offset-4">
                  قوانین و مقررات
                </Link>{" "}
                و{" "}
                <Link href="/pages/privacy" className="text-foreground hover:underline underline-offset-4">
                  حریم خصوصی
                </Link>{" "}
                موافقم.
              </Label>
            </div>
            {showError("acceptTerms") ? (
              <p className="text-xs text-error">{showError("acceptTerms")}</p>
            ) : null}
          </Stack>

          <Button type="submit" className="w-full h-11" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                در حال ساخت حساب…
              </>
            ) : (
              "ثبت‌نام"
            )}
          </Button>
        </form>

        <Inline justify="center" gap={1} className="mt-6 text-sm">
          <span className="text-foreground-secondary">حساب دارید؟</span>
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline underline-offset-4"
            style={{ transitionDuration: "var(--duration-fast)" }}
          >
            وارد شوید
          </Link>
        </Inline>
      </Box>
    </Container>
  );
}

function getPasswordStrength(pwd: string): { score: number; label: string; color: string } {
  if (!pwd) return { score: 0, label: "—", color: "var(--border)" };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd) || /[آ-ی]/.test(pwd)) score++;
  if (/\d/.test(pwd) && /[!@#$%^&*(),.?":{}|<>_-]/.test(pwd)) score++;
  const labels = ["خیلی ضعیف", "ضعیف", "متوسط", "خوب", "قوی"];
  const colors = [
    "var(--color-error-500)",
    "var(--color-error-500)",
    "var(--color-warning-500)",
    "var(--color-info-500)",
    "var(--color-success-500)",
  ];
  return { score, label: labels[score], color: colors[score] };
}
