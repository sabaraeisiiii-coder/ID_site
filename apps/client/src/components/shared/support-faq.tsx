"use client";

/**
 * SupportFaq — searchable FAQ accordion with 6 Persian FAQs.
 * Empty state when search has no match.
 */

import * as React from "react";
import { Search, SearchX } from "lucide-react";

import { Stack } from "@/design-system/primitives";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

interface Faq {
  id: string;
  q: string;
  a: string;
  category: "shipping" | "returns" | "payment" | "account" | "orders";
}

const FAQS: Faq[] = [
  {
    id: "f1",
    category: "shipping",
    q: "چه مدت طول می‌کشد تا سفارش من ارسال شود؟",
    a: "سفارش‌های ثبت‌شده تا ساعت ۱۲ ظهر، همان روز کاری پردازش و ارسال می‌شوند. بسته به روش ارسال انتخابی، بین ۱ تا ۵ روز کاری به دست شما می‌رسد. برای سفارش‌های بالای ۱ میلیون تومان، ارسال رایگان است.",
  },
  {
    id: "f2",
    category: "returns",
    q: "روند بازگشت کالا چگونه است؟",
    a: "شما ۷ روز فرصت دارید کالای خریداری‌شده را در صورت عدم استفاده و داشتن بسته‌بندی اصلی بازگردانید. درخواست بازگشت را از بخش «سفارش‌های من» ثبت کنید؛ پس از تأیید، کاتبیر رایگان برای دریافت کالا هماهنگ می‌شود و مبلغ به کیف پول یا کارت بانکی شما بازگردانده می‌شود.",
  },
  {
    id: "f3",
    category: "payment",
    q: "چه روش‌های پرداختی پشتیبانی می‌شوند؟",
    a: "پرداخت از طریق درگاه آنلاین بانکی با تمام کارت‌های عضو شتاب امکان‌پذیر است. همچنین برای سفارش‌های بالای ۵ میلیون تومان، گزینه پرداخت در محل با کارتخوان پست موجود است.",
  },
  {
    id: "f4",
    category: "account",
    q: "چطور رمز عبور حسابم را بازیابی کنم؟",
    a: "در صفحه ورود، روی «رمز عبور را فراموش کرده‌اید؟» کلیک کنید و شماره موبایل خود را وارد کنید. کد تأیید برایتان پیامک می‌شود و می‌توانید رمز جدید انتخاب کنید.",
  },
  {
    id: "f5",
    category: "orders",
    q: "چطور سفارش خود را پیگیری کنم؟",
    a: "از صفحه «حساب کاربری > سفارش‌های من» می‌توانید وضعیت لحظه‌ای سفارش خود را ببینید. همچنین برای هر مرحله (ثبت، پردازش، ارسال، تحویل) یک پیامک اطلاع‌رسانی دریافت می‌کنید.",
  },
  {
    id: "f6",
    category: "shipping",
    q: "آیا ارسال به همه شهرها انجام می‌شود؟",
    a: "بله، ارسال به تمام شهرهای ایران از طریق پست پیشتاز و تیپاکس انجام می‌شود. هزینه ارسال بر اساس وزن بسته و مقصد محاسبه می‌شود و در مرحله تسویه نمایش داده می‌شود.",
  },
];

const CATEGORY_LABELS: Record<Faq["category"], string> = {
  shipping: "ارسال",
  returns: "بازگشت کالا",
  payment: "پرداخت",
  account: "حساب کاربری",
  orders: "سفارش‌ها",
};

export function SupportFaq() {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQS;
    return FAQS.filter((f) => {
      const haystack = `${f.q} ${f.a} ${CATEGORY_LABELS[f.category]}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [query]);

  return (
    <Stack gap={4}>
      <div className="relative">
        <Search
          size={18}
          strokeWidth={1.75}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-foreground-tertiary pointer-events-none"
        />
        <Input
          type="search"
          placeholder="جستجو در سوالات متداول…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 pe-10"
          aria-label="جستجو در سوالات متداول"
        />
      </div>

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-border"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <span
            className="inline-flex items-center justify-center rounded-full mb-3"
            style={{
              width: 48,
              height: 48,
              background: "var(--surface-secondary)",
              color: "var(--foreground-tertiary)",
            }}
          >
            <SearchX size={24} strokeWidth={1.5} />
          </span>
          <h3 className="text-sm font-semibold mb-1">نتیجه‌ای یافت نشد</h3>
          <p className="text-xs text-foreground-secondary max-w-sm">
            برای «{query}» چیزی پیدا نکردیم. عبارت دیگری را امتحان کنید یا از طریق صفحه تماس با ما در ارتباط باشید.
          </p>
        </div>
      ) : (
        <div
          className="bg-surface border border-border px-5 shadow-sm"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <Accordion type="single" collapsible defaultValue={filtered[0]?.id}>
            {filtered.map((f) => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="text-start hover:no-underline">
                  <span className="flex flex-col items-start gap-1 text-start">
                    <span className="text-sm font-medium leading-relaxed">{f.q}</span>
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{
                        background: "var(--surface-secondary)",
                        color: "var(--foreground-tertiary)",
                      }}
                    >
                      {CATEGORY_LABELS[f.category]}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-foreground-secondary leading-relaxed whitespace-pre-line">
                    {f.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </Stack>
  );
}
