/**
 * Formatting utilities — locale-aware (Persian default).
 */

const FA_IR = "fa-IR";

export function formatPrice(value: number, currency = "تومان"): string {
  if (!Number.isFinite(value)) return "—";
  const grouped = new Intl.NumberFormat(FA_IR, { maximumFractionDigits: 0 })
    .format(Math.round(value));
  return `${grouped} ${currency}`;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(FA_IR, { maximumFractionDigits: 0 }).format(Math.round(value));
}

export function toPersianDigits(input: string | number): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  return String(input).replace(/[0-9]/g, (d) => persian[Number(d)]);
}

export function toLatinDigits(input: string): string {
  return String(input)
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
}

export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat(FA_IR, {
      calendar: "persian", year: "numeric", month: "long", day: "numeric",
    }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

export function formatDateShort(date: Date | string | number): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return new Intl.DateTimeFormat(FA_IR, {
      calendar: "persian", year: "numeric", month: "2-digit", day: "2-digit",
    }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

export function formatRelative(date: Date | string | number): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  const diff = Date.now() - d.getTime();
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hour = Math.round(min / 60);
  const day = Math.round(hour / 24);

  if (sec < 60) return "همین حالا";
  if (min < 60) return `${toPersianDigits(min)} دقیقه پیش`;
  if (hour < 24) return `${toPersianDigits(hour)} ساعت پیش`;
  if (day < 30) return `${toPersianDigits(day)} روز پیش`;
  return formatDate(date);
}

export function truncate(text: string, n: number): string {
  if (text.length <= n) return text;
  return text.slice(0, n - 1) + "…";
}

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
