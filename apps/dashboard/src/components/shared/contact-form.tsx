"use client";

/**
 * ContactForm — Client form for the contact page.
 * On submit: success toast "پیام شما ارسال شد".
 */

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Stack } from "@/design-system/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});

  const errors: Record<string, string | undefined> = {
    name: !name.trim() ? "نام خود را وارد کنید." : undefined,
    email: !email.trim()
      ? "ایمیل خود را وارد کنید."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ? "ایمیل معتبر نیست."
        : undefined,
    subject: !subject.trim() ? "موضوع پیام را وارد کنید." : undefined,
    message: !message.trim() ? "متن پیام را وارد کنید." : undefined,
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true, message: true });
    if (errors.name || errors.email || errors.subject || errors.message) {
      toast.error("لطفاً فیلدهای مورد نیاز را تکمیل کنید.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("پیام شما ارسال شد. به‌زودی پاسخ خواهیم داد.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setTouched({});
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Stack gap={2}>
          <Label htmlFor="name">
            نام و نام خانوادگی <span className="text-error">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="نام شما"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            disabled={submitting}
            aria-invalid={Boolean(touched.name && errors.name)}
          />
          {touched.name && errors.name ? (
            <p className="text-xs text-error">{errors.name}</p>
          ) : null}
        </Stack>
        <Stack gap={2}>
          <Label htmlFor="email">
            ایمیل <span className="text-error">*</span>
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
            aria-invalid={Boolean(touched.email && errors.email)}
          />
          {touched.email && errors.email ? (
            <p className="text-xs text-error">{errors.email}</p>
          ) : null}
        </Stack>
      </div>

      <Stack gap={2}>
        <Label htmlFor="subject">
          موضوع <span className="text-error">*</span>
        </Label>
        <Input
          id="subject"
          type="text"
          placeholder="موضوع پیام شما"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, subject: true }))}
          disabled={submitting}
          aria-invalid={Boolean(touched.subject && errors.subject)}
        />
        {touched.subject && errors.subject ? (
          <p className="text-xs text-error">{errors.subject}</p>
        ) : null}
      </Stack>

      <Stack gap={2}>
        <Label htmlFor="message">
          متن پیام <span className="text-error">*</span>
        </Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="پیام خود را اینجا بنویسید…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          disabled={submitting}
          aria-invalid={Boolean(touched.message && errors.message)}
          className="resize-y min-h-32"
        />
        {touched.message && errors.message ? (
          <p className="text-xs text-error">{errors.message}</p>
        ) : null}
      </Stack>

      <Button type="submit" className="w-full sm:w-auto sm:self-end h-11" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            در حال ارسال…
          </>
        ) : (
          <>
            <Send size={16} />
            ارسال پیام
          </>
        )}
      </Button>
    </form>
  );
}
