/** Role & permission domain. */

export interface Permission {
  domain: string;
  actions: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  userCount: number;
  status: "active" | "draft";
  createdAt: string;
}

export const permissionDomains = [
  { domain: "products", label: "محصولات", actions: ["view", "create", "edit", "delete"] },
  { domain: "categories", label: "دسته‌بندی‌ها", actions: ["view", "create", "edit", "delete"] },
  { domain: "inventory", label: "موجودی", actions: ["view", "edit"] },
  { domain: "orders", label: "سفارش‌ها", actions: ["view", "edit"] },
  { domain: "payments", label: "پرداخت‌ها", actions: ["view"] },
  { domain: "users", label: "کاربران", actions: ["view", "edit"] },
  { domain: "content", label: "محتوا", actions: ["view", "create", "edit", "delete"] },
  { domain: "settings", label: "تنظیمات", actions: ["view", "edit"] },
];

export const roles: Role[] = [
  { id: "r1", name: "مدیر کل", description: "دسترسی کامل به همه بخش‌ها",
    permissions: permissionDomains.map((p) => ({ domain: p.domain, actions: p.actions })),
    userCount: 2, status: "active", createdAt: "2024-01-01T00:00:00Z" },
  { id: "r2", name: "مدیر فروش", description: "مدیریت سفارش‌ها، پرداخت‌ها و موجودی",
    permissions: [
      { domain: "orders", actions: ["view", "edit"] },
      { domain: "payments", actions: ["view"] },
      { domain: "inventory", actions: ["view", "edit"] },
      { domain: "products", actions: ["view"] },
    ],
    userCount: 5, status: "active", createdAt: "2024-01-15T00:00:00Z" },
  { id: "r3", name: "اپراتور محتوا", description: "مدیریت محصولات و محتوای فروشگاه",
    permissions: [
      { domain: "products", actions: ["view", "create", "edit"] },
      { domain: "categories", actions: ["view", "create", "edit"] },
      { domain: "content", actions: ["view", "create", "edit"] },
    ],
    userCount: 3, status: "active", createdAt: "2024-02-01T00:00:00Z" },
  { id: "r4", name: "پشتیبان", description: "مشاهده سفارش‌ها و پاسخ به مشتریان",
    permissions: [
      { domain: "orders", actions: ["view"] },
      { domain: "users", actions: ["view", "edit"] },
    ],
    userCount: 8, status: "draft", createdAt: "2024-03-01T00:00:00Z" },
];

export const roleService = {
  async list(): Promise<Role[]> { return [...roles]; },
  async getById(id: string): Promise<Role | null> { return roles.find((r) => r.id === id) ?? null; },
};
