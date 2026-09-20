/** Catalog mock data for ID site. Prices, stock, and specifications are demonstrative only. */
import type { Category, Product } from "./types";

const devices = "/images/showcase/id-site-devices.png";
const consoleImage = "/images/products/gaming-console.png";
const date = "2026-09-01T10:00:00Z";

export const categories: Category[] = [
  ["c1", "iphone", "iPhone", "مدل‌های آیفون", devices, 12],
  ["c2", "mac", "Mac", "مک‌بوک و مک", devices, 8],
  ["c3", "ipad", "iPad", "آیپد برای کار و خلاقیت", devices, 7],
  ["c4", "apple-watch", "Apple Watch", "ساعت‌های اپل", devices, 5],
  ["c5", "airpods", "AirPods", "ایرپاد و صوت شخصی", devices, 6],
  ["c6", "playstation", "PlayStation", "فقط PS4 و PS5", consoleImage, 6],
  ["c7", "apple-accessories", "لوازم جانبی اپل", "لوازم سازگار با محصولات اپل", devices, 10],
].map(([id, slug, name, description, image, productCount], index) => ({ id, slug, name, description, image, productCount, parentId: null, status: "active" as const, order: index + 1 })) as Category[];

const product = (id: string, slug: string, title: string, titleLatin: string, brand: string, category: string, categoryId: string, price: number, image: string, options: Partial<Product> = {}): Product => ({
  id, slug, title, titleLatin, brand, category, categoryId, price, currency: "تومان", sku: `DEMO-${id.toUpperCase()}`, status: "active", stock: 12, stockThreshold: 3,
  description: "اطلاعات این محصول و مشخصات آن در این نسخه صرفاً برای نمایش فروشگاه هستند.", images: [{ id: `${id}-image`, url: image, alt: title }], attributes: [{ label: "وضعیت داده", value: "نمونه / غیرتأییدشده" }], rating: 4.8, ratingCount: 24, createdAt: date, ...options,
});

export const products: Product[] = [
  product("p1", "iphone-pro-demo", "iPhone Pro", "iPhone Pro", "Apple", "iPhone", "c1", 0, devices, { isFeatured: true, isNew: true, badges: [{ type: "new" }] }),
  product("p2", "macbook-air-demo", "MacBook Air", "MacBook Air", "Apple", "Mac", "c2", 0, devices, { isFeatured: true, badges: [{ type: "featured" }] }),
  product("p3", "ipad-air-demo", "iPad Air", "iPad Air", "Apple", "iPad", "c3", 0, devices, { isFeatured: true, isNew: true, badges: [{ type: "new" }] }),
  product("p4", "apple-watch-demo", "Apple Watch", "Apple Watch", "Apple", "Apple Watch", "c4", 0, devices, { isFeatured: true }),
  product("p5", "airpods-pro-demo", "AirPods Pro", "AirPods Pro", "Apple", "AirPods", "c5", 0, devices, { isNew: true }),
  product("p6", "playstation-5-demo", "PlayStation 5", "PlayStation 5", "PlayStation", "PlayStation", "c6", 0, consoleImage, { isFeatured: true, isNew: true, badges: [{ type: "featured" }] }),
  product("p7", "playstation-4-demo", "PlayStation 4", "PlayStation 4", "PlayStation", "PlayStation", "c6", 0, consoleImage, { isFeatured: true }),
  product("p8", "apple-usb-c-accessory-demo", "لوازم جانبی USB-C", "USB-C Accessories", "ID site", "لوازم جانبی اپل", "c7", 0, devices, { isFeatured: true, badges: [{ type: "limited" }] }),
];

export const featuredProducts = products.filter((p) => p.isFeatured);
export const newArrivalProducts = products.filter((p) => p.isNew);
