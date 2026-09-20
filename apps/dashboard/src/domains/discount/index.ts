/** Discount / coupon domain. */

export type DiscountType = "percentage" | "fixed";

export interface Discount {
  id: string;
  code: string;
  description: string;
  type: DiscountType;
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  startsAt: string;
  endsAt: string;
  usageLimit?: number;
  usedCount: number;
  status: "active" | "draft" | "expired";
}

export const discounts: Discount[] = [
  { id: "d1", code: "WELCOME10", description: "تخفیف خوش‌آمدگویی ۱۰٪",
    type: "percentage", value: 10, minOrder: 500000, maxDiscount: 200000,
    startsAt: "2024-09-01T00:00:00Z", endsAt: "2024-10-31T23:59:59Z",
    usageLimit: 1000, usedCount: 234, status: "active" },
  { id: "d2", code: "AUTUMN15", description: "تخفیف پاییزه ۱۵٪",
    type: "percentage", value: 15, minOrder: 1000000, maxDiscount: 500000,
    startsAt: "2024-09-10T00:00:00Z", endsAt: "2024-10-10T23:59:59Z",
    usageLimit: 500, usedCount: 89, status: "active" },
  { id: "d3", code: "FREESHIP", description: "ارسال رایگان",
    type: "fixed", value: 80000, minOrder: 800000,
    startsAt: "2024-08-01T00:00:00Z", endsAt: "2024-12-31T23:59:59Z",
    usageLimit: 5000, usedCount: 1234, status: "active" },
  { id: "d4", code: "VIP25", description: "تخفیف VIP ۲۵٪",
    type: "percentage", value: 25, minOrder: 3000000, maxDiscount: 1000000,
    startsAt: "2024-09-15T00:00:00Z", endsAt: "2024-10-15T23:59:59Z",
    usageLimit: 100, usedCount: 12, status: "active" },
  { id: "d5", code: "SUMMER20", description: "تخفیف تابستانه (منقضی)",
    type: "percentage", value: 20, minOrder: 800000,
    startsAt: "2024-06-01T00:00:00Z", endsAt: "2024-08-31T23:59:59Z",
    usageLimit: 2000, usedCount: 1876, status: "expired" },
];

export interface ApplyCouponResult {
  success: boolean;
  message: string;
  discountAmount?: number;
  totalAfter?: number;
}

export const discountService = {
  async list(): Promise<Discount[]> { return [...discounts]; },
  async getById(id: string): Promise<Discount | null> {
    return discounts.find((d) => d.id === id) ?? null;
  },
  async getByCode(code: string): Promise<Discount | null> {
    return discounts.find((d) => d.code.toLowerCase() === code.toLowerCase()) ?? null;
  },
  async validate(code: string, subtotal: number): Promise<ApplyCouponResult> {
    const d = await this.getByCode(code);
    if (!d) return { success: false, message: "کد تخفیف یافت نشد." };
    if (d.status === "expired") return { success: false, message: "این کد منقضی شده است." };
    if (d.minOrder && subtotal < d.minOrder) {
      return { success: false, message: `حداقل خرید برای این کد ${d.minOrder} تومان است.` };
    }
    let amount: number;
    if (d.type === "percentage") {
      amount = Math.floor((subtotal * d.value) / 100);
      if (d.maxDiscount) amount = Math.min(amount, d.maxDiscount);
    } else {
      amount = d.value;
    }
    return { success: true, message: "کد با موفقیت اعمال شد.", discountAmount: amount, totalAfter: subtotal - amount };
  },
};
