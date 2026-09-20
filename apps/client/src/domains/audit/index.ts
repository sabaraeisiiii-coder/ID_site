/** Audit log domain. */

export interface AuditLog {
  id: string;
  actor: { id: string; name: string };
  action: string;
  entity: string;
  entityId: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  reason?: string;
  timestamp: string;
  ip?: string;
}

export const auditLogs: AuditLog[] = [
  { id: "a1", actor: { id: "admin1", name: "مدیر کل" },
    action: "update_status", entity: "order", entityId: "o3",
    before: { status: "pending" }, after: { status: "processing" },
    reason: "تأیید سفارش و ارسال به انبار",
    timestamp: "2024-09-10T11:00:00Z", ip: "5.124.85.21" },
  { id: "a2", actor: { id: "admin2", name: "مدیر فروش" },
    action: "update_stock", entity: "product", entityId: "p1",
    before: { stock: 35 }, after: { stock: 42 },
    reason: "رسید کالای جدید",
    timestamp: "2024-09-09T16:30:00Z", ip: "5.124.85.22" },
  { id: "a3", actor: { id: "admin1", name: "مدیر کل" },
    action: "create", entity: "discount", entityId: "d4",
    after: { code: "VIP25", value: 25 },
    timestamp: "2024-09-15T10:00:00Z", ip: "5.124.85.21" },
  { id: "a4", actor: { id: "admin3", name: "اپراتور محتوا" },
    action: "update", entity: "product", entityId: "p6",
    before: { price: 3990000 }, after: { price: 4280000 },
    reason: "اصلاح قیمت",
    timestamp: "2024-09-08T13:45:00Z", ip: "5.124.85.23" },
  { id: "a5", actor: { id: "admin1", name: "مدیر کل" },
    action: "update_settings", entity: "site_settings", entityId: "ss1",
    before: { freeShippingThreshold: 500000 },
    after: { freeShippingThreshold: 1000000 },
    reason: "افزایش سقف ارسال رایگان",
    timestamp: "2024-09-07T09:15:00Z", ip: "5.124.85.21" },
  { id: "a6", actor: { id: "admin2", name: "مدیر فروش" },
    action: "delete", entity: "product", entityId: "p_old_123",
    reason: "حذف محصول غیرفعال قدیمی",
    timestamp: "2024-09-06T14:00:00Z", ip: "5.124.85.22" },
];

export const auditService = {
  async list(): Promise<AuditLog[]> {
    return [...auditLogs].sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
  },
  async getById(id: string): Promise<AuditLog | null> {
    return auditLogs.find((a) => a.id === id) ?? null;
  },
};
