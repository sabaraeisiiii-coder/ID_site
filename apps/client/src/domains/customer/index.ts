/** Customer domain — users + addresses. */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  mobile: string;
  email?: string;
  status: "active" | "suspended" | "pending";
  role: string;
  createdAt: string;
  lastLoginAt?: string;
  ordersCount?: number;
  totalSpent?: number;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  line1: string;
  line2?: string;
  postalCode: string;
  isDefault: boolean;
}

export const users: User[] = [
  { id: "u1", firstName: "سارا", lastName: "محمدی", fullName: "سارا محمدی",
    mobile: "09123456789", email: "sara@example.com", status: "active",
    role: "مشتری", createdAt: "2024-03-15T10:00:00Z", lastLoginAt: "2024-09-10T08:00:00Z",
    ordersCount: 6, totalSpent: 14500000 },
  { id: "u2", firstName: "علی", lastName: "رضایی", fullName: "علی رضایی",
    mobile: "09127654321", email: "ali@example.com", status: "active",
    role: "مشتری", createdAt: "2024-04-20T11:00:00Z", lastLoginAt: "2024-09-09T14:00:00Z",
    ordersCount: 3, totalSpent: 8200000 },
  { id: "u3", firstName: "مریم", lastName: "حسینی", fullName: "مریم حسینی",
    mobile: "09351112233", email: "maryam@example.com", status: "active",
    role: "مشتری", createdAt: "2024-05-12T09:30:00Z", lastLoginAt: "2024-09-10T09:00:00Z",
    ordersCount: 2, totalSpent: 5400000 },
  { id: "u4", firstName: "حسین", lastName: "کریمی", fullName: "حسین کریمی",
    mobile: "09124445566", status: "pending",
    role: "مشتری", createdAt: "2024-09-11T16:40:00Z" },
  { id: "u5", firstName: "نگار", lastName: "عباسی", fullName: "نگار عباسی",
    mobile: "09127778899", status: "suspended",
    role: "مشتری", createdAt: "2024-08-01T11:00:00Z", ordersCount: 1, totalSpent: 2190000 },
  { id: "u6", firstName: "مهدی", lastName: "صادقی", fullName: "مهدی صادقی",
    mobile: "09120009988", email: "mehdi@example.com", status: "active",
    role: "مشتری", createdAt: "2024-06-08T13:00:00Z", lastLoginAt: "2024-09-08T20:00:00Z",
    ordersCount: 8, totalSpent: 21300000 },
];

export const addresses: Address[] = [
  { id: "ad1", userId: "u1", label: "خانه", fullName: "سارا محمدی", phone: "09123456789",
    province: "تهران", city: "تهران", line1: "خیابان ولیعصر، پلاک ۱۲۳۴، واحد ۵",
    line2: "طبقه ۳", postalCode: "1963756481", isDefault: true },
  { id: "ad2", userId: "u1", label: "محل کار", fullName: "سارا محمدی", phone: "02122880000",
    province: "تهران", city: "تهران", line1: "خیابان میرداماد، برج آسمان، طبقه ۱۲",
    postalCode: "1918918765", isDefault: false },
];

export const customerService = {
  async list(): Promise<User[]> { return [...users]; },
  async getById(id: string): Promise<User | null> { return users.find((u) => u.id === id) ?? null; },
  async getCurrent(): Promise<User> { return users[0]; },
  async listAddresses(userId: string): Promise<Address[]> {
    return addresses.filter((a) => a.userId === userId);
  },
  async getAddress(id: string): Promise<Address | null> {
    return addresses.find((a) => a.id === id) ?? null;
  },
};
