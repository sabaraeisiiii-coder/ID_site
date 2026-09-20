/** Shipping domain. */

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  status: "active" | "draft";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export const shippingMethods: ShippingMethod[] = [
  { id: "s1", name: "پست پیشتاز", description: "تحویل ۲ تا ۴ روز کاری",
    price: 80000, estimatedDays: "۲-۴ روز", status: "active", sortOrder: 1,
    createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-09-01T00:00:00Z" },
  { id: "s2", name: "تیپاکس", description: "تحویل ۱ تا ۳ روز کاری",
    price: 120000, estimatedDays: "۱-۳ روز", status: "active", sortOrder: 2,
    createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-09-01T00:00:00Z" },
  { id: "s3", name: "ارسال رایگان", description: "برای سفارش‌های بالای ۱ میلیون تومان",
    price: 0, estimatedDays: "۳-۵ روز", status: "active", sortOrder: 3,
    createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-09-01T00:00:00Z" },
  { id: "s4", name: "ارسال فوری (تهران)", description: "تحویل در همان روز",
    price: 250000, estimatedDays: "همان روز", status: "draft", sortOrder: 4,
    createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-09-01T00:00:00Z" },
];

export const shippingService = {
  async list(): Promise<ShippingMethod[]> {
    return [...shippingMethods].sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async listActive(): Promise<ShippingMethod[]> {
    return shippingMethods.filter((s) => s.status === "active").sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async getById(id: string): Promise<ShippingMethod | null> {
    return shippingMethods.find((s) => s.id === id) ?? null;
  },
};
