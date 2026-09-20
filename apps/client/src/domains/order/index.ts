/** Order domain — types + mock data + service. */

export interface OrderItem {
  productId: string;
  title: string;
  image?: string;
  variant?: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderAddressSnapshot {
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface Order {
  id: string;
  number: string;
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: OrderAddressSnapshot;
  shippingMethod: string;
  createdAt: string;
  customer: { id: string; name: string; phone: string; email?: string };
}

const img = (id: string) => {
  const map: Record<string, string> = {
    p1: "/images/products/tshirt.webp",
    p2: "/images/products/coat.webp",
    p4: "/images/products/runner.webp",
    p5: "/images/products/tote.webp",
    p6: "/images/products/watch.webp",
    p7: "/images/products/headphones.webp",
    p8: "/images/products/perfume.webp",
    p9: "/images/products/sunglasses.webp",
  };
  return map[id];
};

export const orders: Order[] = [
  {
    id: "o1", number: "ORD-10234", status: "delivered", paymentStatus: "paid",
    items: [
      { productId: "p1", title: "تیشرت پنبه‌ای پریمیوم", quantity: 2, unitPrice: 890000, image: img("p1"), variant: "مشکی" },
      { productId: "p5", title: "کیف توت چرمی", quantity: 1, unitPrice: 2750000, image: img("p5") },
    ],
    subtotal: 4530000, discount: 453000, shipping: 80000, total: 4157000,
    address: { fullName: "سارا محمدی", phone: "09123456789",
      line1: "خیابان ولیعصر، پلاک ۱۲۳۴، واحد ۵", city: "تهران", province: "تهران", postalCode: "1963756481" },
    shippingMethod: "پست پیشتاز", createdAt: "2024-09-08T10:30:00Z",
    customer: { id: "u1", name: "سارا محمدی", phone: "09123456789", email: "sara@example.com" },
  },
  {
    id: "o2", number: "ORD-10235", status: "shipped", paymentStatus: "paid",
    items: [{ productId: "p6", title: "ساعت چرمی مینیمال", quantity: 1, unitPrice: 4280000, image: img("p6") }],
    subtotal: 4280000, discount: 0, shipping: 120000, total: 4400000,
    address: { fullName: "علی رضایی", phone: "09127654321", line1: "بلوار امیرآباد، کوچه ۸، پلاک ۲۲",
      city: "تهران", province: "تهران", postalCode: "1919654321" },
    shippingMethod: "تیپاکس", createdAt: "2024-09-09T14:15:00Z",
    customer: { id: "u2", name: "علی رضایی", phone: "09127654321" },
  },
  {
    id: "o3", number: "ORD-10236", status: "processing", paymentStatus: "paid",
    items: [{ productId: "p7", title: "هدفون بی‌سیم نویز کنسلینگ", quantity: 1, unitPrice: 5990000, image: img("p7") }],
    subtotal: 5990000, discount: 599000, shipping: 0, total: 5391000,
    address: { fullName: "مریم حسینی", phone: "09351112233", line1: "خیابان شریعتی، نبش کوچه ۱۵",
      city: "اصفهان", province: "اصفهان", postalCode: "8145678901" },
    shippingMethod: "ارسال رایگان", createdAt: "2024-09-10T09:00:00Z",
    customer: { id: "u3", name: "مریم حسینی", phone: "09351112233" },
  },
  {
    id: "o4", number: "ORD-10237", status: "pending", paymentStatus: "pending",
    items: [{ productId: "p2", title: "پالتو وول مینیمال", quantity: 1, unitPrice: 3450000, image: img("p2") }],
    subtotal: 3450000, discount: 0, shipping: 150000, total: 3600000,
    address: { fullName: "حسین کریمی", phone: "09124445566", line1: "خیابان امام، روبروی پارک",
      city: "شیراز", province: "فارس", postalCode: "7134859261" },
    shippingMethod: "پست پیشتاز", createdAt: "2024-09-11T16:45:00Z",
    customer: { id: "u4", name: "حسین کریمی", phone: "09124445566" },
  },
  {
    id: "o5", number: "ORD-10238", status: "cancelled", paymentStatus: "refunded",
    items: [{ productId: "p4", title: "کفش دونده اسپرت", quantity: 1, unitPrice: 2190000, image: img("p4") }],
    subtotal: 2190000, discount: 0, shipping: 0, total: 2190000,
    address: { fullName: "نگار عباسی", phone: "09127778899", line1: "آدرس نمونه",
      city: "تبریز", province: "آذربایجان شرقی", postalCode: "5164872319" },
    shippingMethod: "ارسال رایگان", createdAt: "2024-09-05T11:20:00Z",
    customer: { id: "u5", name: "نگار عباسی", phone: "09127778899" },
  },
  {
    id: "o6", number: "ORD-10239", status: "delivered", paymentStatus: "paid",
    items: [
      { productId: "p8", title: "ادو پارفان امضای ویژه", quantity: 1, unitPrice: 1850000, image: img("p8") },
      { productId: "p9", title: "عینک آفتابی پلاریزه", quantity: 1, unitPrice: 1290000, image: img("p9") },
    ],
    subtotal: 3140000, discount: 314000, shipping: 80000, total: 2906000,
    address: { fullName: "سارا محمدی", phone: "09123456789", line1: "خیابان ولیعصر، پلاک ۱۲۳۴، واحد ۵",
      city: "تهران", province: "تهران", postalCode: "1963756481" },
    shippingMethod: "پست پیشتاز", createdAt: "2024-09-01T08:00:00Z",
    customer: { id: "u1", name: "سارا محمدی", phone: "09123456789", email: "sara@example.com" },
  },
];

export const orderService = {
  async list(): Promise<Order[]> {
    return [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
  async listForUser(userId: string): Promise<Order[]> {
    return orders
      .filter((o) => o.customer.id === userId)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
  async getById(id: string): Promise<Order | null> {
    return orders.find((o) => o.id === id) ?? null;
  },
};
