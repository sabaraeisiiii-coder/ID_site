/** Dashboard mock catalog mirrors the storefront. All inventory and prices are demonstrative. */
import type { Category, Product } from "./types";
const devices = "/images/showcase/id-site-devices.png";
const consoleImage = "/images/products/gaming-console.png";
const earbudsImage = "/images/products/wireless-earbuds.png";
const chargingImage = "/images/products/charging-accessories.png";
const iphoneImage = "/images/showcase/iphone-highlight.png";
const macImage = "/images/showcase/mac-highlight.png";
const ipadImage = "/images/showcase/ipad-highlight.png";
const iphone16ProImage = "/images/products/iphone/iphone-16-pro.jpg";
const macbookAirM4Image = "/images/products/mac/macbook-air-m4.jpg";
const ipadAirM3Image = "/images/products/ipad/ipad-air-m3.jpg";
const appleWatchSeries10Image = "/images/products/apple-watch/apple-watch-series-10.jpg";
const airpodsPro2Image = "/images/products/airpods/airpods-pro-2-usb-c.jpg";
const date = "2026-09-01T10:00:00Z";
export const categories: Category[] = [
  ["c1", "iphone", "iPhone", "مدل‌های آیفون", iphone16ProImage, 12], ["c2", "mac", "Mac", "مک‌بوک و مک", macbookAirM4Image, 8], ["c3", "ipad", "iPad", "آیپد", ipadAirM3Image, 7], ["c4", "apple-watch", "Apple Watch", "ساعت‌های اپل", appleWatchSeries10Image, 5], ["c5", "airpods", "AirPods", "ایرپاد", airpodsPro2Image, 6], ["c6", "playstation", "PlayStation", "فقط PS4 و PS5", consoleImage, 6], ["c7", "apple-accessories", "لوازم جانبی اپل", "لوازم سازگار با اپل", devices, 10],
].map(([id, slug, name, description, image, productCount], index) => ({ id, slug, name, description, image, productCount, parentId: null, status: "active" as const, order: index + 1 })) as Category[];
const product = (id: string, slug: string, title: string, titleLatin: string, brand: string, category: string, categoryId: string, image: string, options: Partial<Product> = {}): Product => ({ id, slug, title, titleLatin, brand, category, categoryId, price: 0, currency: "تومان", sku: `DEMO-${id.toUpperCase()}`, status: "active", stock: 12, stockThreshold: 3, description: "داده‌های نمونه برای هم‌راستاسازی رابط مدیریت با فروشگاه ID site.", images: [{ id: `${id}-image`, url: image, alt: title }], attributes: [{ label: "وضعیت داده", value: "نمونه / غیرتأییدشده" }], rating: 4.8, ratingCount: 24, createdAt: date, ...options });
export const products: Product[] = [
  product("p1", "iphone-pro-demo", "iPhone 16 Pro", "iPhone 16 Pro", "Apple", "iPhone", "c1", iphone16ProImage, { isFeatured: true, isNew: true, badges: [{ type: "new" }] }), product("p2", "macbook-air-demo", "MacBook Air (M4)", "MacBook Air (M4)", "Apple", "Mac", "c2", macbookAirM4Image, { isFeatured: true }), product("p3", "ipad-air-demo", "iPad Air (M3)", "iPad Air (M3)", "Apple", "iPad", "c3", ipadAirM3Image, { isFeatured: true, isNew: true }), product("p4", "apple-watch-demo", "Apple Watch Series 10", "Apple Watch Series 10", "Apple", "Apple Watch", "c4", appleWatchSeries10Image, { isFeatured: true }), product("p5", "airpods-pro-demo", "AirPods Pro (2nd generation)", "AirPods Pro (2nd generation)", "Apple", "AirPods", "c5", airpodsPro2Image, { isFeatured: true, isNew: true }), product("p6", "playstation-5-demo", "PlayStation 5", "PlayStation 5", "PlayStation", "PlayStation", "c6", consoleImage, { isFeatured: true, isNew: true }), product("p7", "playstation-4-demo", "PlayStation 4", "PlayStation 4", "PlayStation", "PlayStation", "c6", consoleImage, { isFeatured: true }), product("p8", "apple-usb-c-accessory-demo", "لوازم جانبی USB-C", "USB-C Accessories", "ID site", "لوازم جانبی اپل", "c7", chargingImage, { isFeatured: true }), product("p9", "magsafe-charger-demo", "شارژر مغناطیسی", "Magnetic Charger", "ID site", "لوازم جانبی اپل", "c7", chargingImage, { isFeatured: true }), product("p10", "iphone-case-demo", "قاب شفاف گوشی", "Clear Phone Case", "ID site", "لوازم جانبی اپل", "c7", devices, { isFeatured: true }),
];
export const featuredProducts = products.filter((p) => p.isFeatured);
export const newArrivalProducts = products.filter((p) => p.isNew);
