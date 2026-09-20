/** Payment domain. */

export interface Payment {
  id: string;
  reference: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  transactionStatus: "success" | "failed" | "pending" | "refunded";
  gateway: string;
  cardPan?: string;
  createdAt: string;
  paidAt?: string;
}

export const payments: Payment[] = [
  { id: "pay1", reference: "TXN-20240908-001", orderId: "o1", orderNumber: "ORD-10234",
    amount: 4157000, status: "paid", transactionStatus: "success",
    gateway: "زرین‌پال", cardPan: "6219-****-****-8562",
    createdAt: "2024-09-08T10:35:00Z", paidAt: "2024-09-08T10:36:00Z" },
  { id: "pay2", reference: "TXN-20240909-002", orderId: "o2", orderNumber: "ORD-10235",
    amount: 4400000, status: "paid", transactionStatus: "success",
    gateway: "آیدی‌پی", cardPan: "5892-****-****-1102",
    createdAt: "2024-09-09T14:20:00Z", paidAt: "2024-09-09T14:21:00Z" },
  { id: "pay3", reference: "TXN-20240910-003", orderId: "o3", orderNumber: "ORD-10236",
    amount: 5391000, status: "paid", transactionStatus: "success",
    gateway: "زرین‌پال", cardPan: "6037-****-****-9914",
    createdAt: "2024-09-10T09:05:00Z", paidAt: "2024-09-10T09:06:00Z" },
  { id: "pay4", reference: "TXN-20240911-004", orderId: "o4", orderNumber: "ORD-10237",
    amount: 3600000, status: "pending", transactionStatus: "pending",
    gateway: "زرین‌پال", createdAt: "2024-09-11T16:50:00Z" },
  { id: "pay5", reference: "TXN-20240905-005", orderId: "o5", orderNumber: "ORD-10238",
    amount: 2190000, status: "refunded", transactionStatus: "refunded",
    gateway: "آیدی‌پی", cardPan: "6219-****-****-4571",
    createdAt: "2024-09-05T11:25:00Z", paidAt: "2024-09-05T11:26:00Z" },
  { id: "pay6", reference: "TXN-20240901-006", orderId: "o6", orderNumber: "ORD-10239",
    amount: 2906000, status: "paid", transactionStatus: "success",
    gateway: "زرین‌پال", cardPan: "6037-****-****-7732",
    createdAt: "2024-09-01T08:05:00Z", paidAt: "2024-09-01T08:06:00Z" },
];

export const paymentService = {
  async list(): Promise<Payment[]> {
    return [...payments].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
  async getById(id: string): Promise<Payment | null> {
    return payments.find((p) => p.id === id) ?? null;
  },
  async getByOrder(orderId: string): Promise<Payment | null> {
    return payments.find((p) => p.orderId === orderId) ?? null;
  },
};
