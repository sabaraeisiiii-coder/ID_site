/** Product catalogue reconstructed from products.seed.json. */
import sourceProducts from "./data/products.seed.json";
import type { Category, Product } from "./types";

const categoryMeta = {
  "cat-iphone": { slug: "iphone", name: "iPhone", description: "مدل‌های آیفون", image: "/images/products/catalog/iphone-official.png" },
  "cat-mac": { slug: "mac", name: "Mac", description: "مک‌بوک و مک", image: "/images/products/catalog/mac-official.png" },
  "cat-ipad": { slug: "ipad", name: "iPad", description: "آیپد برای کار و خلاقیت", image: "/images/products/catalog/ipad-official.png" },
  "cat-apple-watch": { slug: "apple-watch", name: "Apple Watch", description: "ساعت‌های اپل", image: "/images/products/catalog/watch-official.png" },
  "cat-airpods": { slug: "airpods", name: "AirPods", description: "ایرپاد و صدای شخصی", image: "/images/products/catalog/airpods-official.png" },
  "cat-apple-tv": { slug: "apple-tv", name: "Apple TV", description: "تلویزیون و سرگرمی اپل", image: "/images/products/catalog/apple-accessories-official.jpg" },
  "cat-apple-accessories": { slug: "apple-accessories", name: "لوازم جانبی Apple", description: "لوازم سازگار با محصولات اپل", image: "/images/products/catalog/apple-accessories-official.jpg" },
} as const;

type CategoryId = keyof typeof categoryMeta;
const imageFor = (categoryId: string) => categoryMeta[categoryId as CategoryId]?.image ?? "/images/products/charging-accessories.png";

const importedProducts: Product[] = sourceProducts.filter((product) => product.categoryId !== "cat-ipad" && product.categoryId !== "cat-apple-watch" && product.categoryId !== "cat-apple-accessories" && product.categoryId !== "cat-airpods" && product.categoryId !== "cat-iphone").map((product) => ({
  ...product,
  // Seed records contain drafts and schematic paths. Normalize them for the demo UI.
  status: "active",
  stock: product.stock || 12,
  stockThreshold: product.stockThreshold || 3,
  images: product.images.map((image) => ({ ...image, url: imageFor(product.categoryId) })),
  rating: product.rating || 4.7,
  ratingCount: product.ratingCount || 20,
  isFeatured: false,
})) as Product[];

const selectedDefinitions = [
  ["selected-01", "imac-blue", "آل این وان اپل مدل iMac آبی", "Apple iMac – Blue", "Apple", "Mac", "cat-mac", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_27%20PM%20%281%29.png"],
  ["selected-02", "iphone-16-pro-desert-titanium", "گوشی اپل مدل iPhone 16 Pro رنگ تیتانیومی صحرایی", "Apple iPhone 16 Pro – Desert Titanium", "Apple", "iPhone", "cat-iphone", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_27%20PM%20%282%29.png"],
  ["selected-03", "macbook-pro-space-gray", "لپ تاپ اپل مدل MacBook Pro رنگ خاکستری فضایی", "Apple MacBook Pro – Space Gray", "Apple", "Mac", "cat-mac", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_28%20PM%20%283%29.png"],
  ["selected-04", "ipad-pro-space-gray", "تبلت اپل مدل iPad Pro رنگ خاکستری فضایی", "Apple iPad Pro – Space Gray", "Apple", "iPad", "cat-ipad", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_28%20PM%20%284%29.png"],
  ["selected-05", "apple-watch-ultra-2-trail-loop", "ساعت هوشمند اپل مدل Apple Watch Ultra 2 با بند تریل لوپ", "Apple Watch Ultra 2 – Titanium", "Apple", "Apple Watch", "cat-apple-watch", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_40%20PM%20%281%29.png"],
  ["selected-06", "airpods-max-silver", "هدفون بی‌سیم اپل مدل AirPods Max رنگ نقره‌ای", "Apple AirPods Max – Silver", "Apple", "AirPods", "cat-airpods", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_41%20PM%20%282%29.png"],
  ["selected-07", "airpods-pro-2", "هندزفری بلوتوثی اپل مدل AirPods Pro نسل دوم", "Apple AirPods Pro (2nd Generation)", "Apple", "AirPods", "cat-airpods", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_42%20PM%20%283%29.png"],
  ["selected-08", "mac-mini-silver", "کامپیوتر کوچک اپل مدل Mac mini رنگ نقره‌ای", "Apple Mac mini – Silver", "Apple", "Mac", "cat-mac", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_42%20PM%20%284%29.png"],
  ["selected-09", "ipad-pro-magic-keyboard", "تبلت اپل مدل iPad Pro به همراه کیبورد Magic Keyboard", "Apple iPad Pro with Magic Keyboard", "Apple", "iPad", "cat-ipad", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_43%20PM%20%285%29.png"],
  ["selected-10", "apple-tv-4k-siri-remote", "دستگاه پخش هوشمند اپل مدل Apple TV 4K به همراه ریموت Siri", "Apple TV 4K with Siri Remote", "Apple", "Apple TV", "cat-apple-tv", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_44%20PM%20%286%29.png"],
] as const;

const selectedProducts: Product[] = selectedDefinitions.map(([id, slug, title, titleLatin, brand, category, categoryId, image]) => ({
  id, slug, title, titleLatin, brand, category, categoryId, price: 0, currency: "تومان", sku: `SELECTED-${id}`,
  status: "active", stock: 12, stockThreshold: 3, description: `${title}؛ محصول منتخب فروشگاه.`,
  images: [{ id: `${id}-image`, url: `/product-images/${image}`, alt: title }], attributes: [], rating: 4.8, ratingCount: 20,
  badges: [{ type: "featured", label: "محصول منتخب" }], isFeatured: true, isNew: false, createdAt: "2026-09-21T00:00:00+03:30",
}));

const newIphoneDefinitions = [
  ["iphone-new-01", "iphone-16-pro-max-champagne-gold", "گوشی اپل مدل iPhone 16 Pro Max رنگ طلایی شامپاینی", "Apple iPhone 16 Pro Max – Champagne Gold", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_35_09%20PM.png"],
  ["iphone-new-02", "iphone-16-blue", "گوشی اپل مدل iPhone 16 رنگ آبی", "Apple iPhone 16 – Blue", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_35_18%20PM.png"],
  ["iphone-new-03", "iphone-16-pro-graphite", "گوشی اپل مدل iPhone 16 Pro رنگ خاکستری گرافیتی", "Apple iPhone 16 Pro – Graphite", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_35_25%20PM.png"],
] as const;

const newIphoneProducts: Product[] = newIphoneDefinitions.map(([id, slug, title, titleLatin, image]) => ({
  id, slug, title, titleLatin, brand: "Apple", category: "iPhone", categoryId: "cat-iphone", price: 0, currency: "تومان",
  sku: `NEW-${id}`, status: "active", stock: 12, stockThreshold: 3, description: `${title}؛ جدیدترین محصول فروشگاه.`,
  images: [{ id: `${id}-image`, url: `/product-images/${image}`, alt: title }], attributes: [], rating: 4.8, ratingCount: 20,
  badges: [{ type: "new", label: "جدید" }], isFeatured: false, isNew: true, createdAt: "2026-09-21T00:00:00+03:30",
}));

const selectedMacDefinitions = [
  ["mac-selected-01", "macbook-air-13-silver", "لپ‌تاپ اپل مدل MacBook Air 13 اینچ رنگ نقره‌ای", "Apple MacBook Air 13-inch – Silver", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_45_27%20PM%20%281%29.png"],
  ["mac-selected-02", "macbook-air-15-starlight", "لپ‌تاپ اپل مدل MacBook Air 15 اینچ رنگ استارلایت", "Apple MacBook Air 15-inch – Starlight", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_45_27%20PM%20%282%29.png"],
  ["mac-selected-03", "macbook-pro-14-space-gray", "لپ‌تاپ اپل مدل MacBook Pro 14 اینچ رنگ خاکستری فضایی", "Apple MacBook Pro 14-inch – Space Gray", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_45_28%20PM%20%283%29.png"],
  ["mac-selected-04", "imac-24-blue", "کامپیوتر آل این وان اپل مدل iMac 24 اینچ رنگ آبی", "Apple iMac 24-inch – Blue", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_45_28%20PM%20%284%29.png"],
] as const;

const selectedMacProducts: Product[] = selectedMacDefinitions.map(([id, slug, title, titleLatin, image]) => ({
  id, slug, title, titleLatin, brand: "Apple", category: "Mac", categoryId: "cat-mac", price: 0, currency: "تومان",
  sku: `MAC-${id}`, status: "active", stock: 12, stockThreshold: 3, description: `${title}؛ محصول منتخب Mac.`,
  images: [{ id: `${id}-image`, url: `/product-images/${image}`, alt: title }], attributes: [], rating: 4.8, ratingCount: 20,
  badges: [{ type: "featured", label: "منتخب مک" }], isFeatured: false, isNew: false, createdAt: "2026-09-21T00:00:00+03:30",
}));

const selectedIpadDefinitions = [
  ["ipad-selected-01", "ipad-pro-11-m4-space-black", "تبلت اپل مدل iPad Pro 11 اینچ با تراشه M4، رنگ مشکی فضایی", "Apple iPad Pro 11-inch M4 – Space Black", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_57_34%20PM%20%281%29.png"],
  ["ipad-selected-02", "ipad-air-11-m2-blue", "تبلت اپل مدل iPad Air 11 اینچ با تراشه M2، رنگ آبی", "Apple iPad Air 11-inch M2 – Blue", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_57_34%20PM%20%282%29.png"],
  ["ipad-selected-03", "ipad-mini-6-purple", "تبلت اپل مدل iPad mini نسل ششم 8.3 اینچ، رنگ بنفش", "Apple iPad mini 6 – Purple", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_57_35%20PM%20%283%29.png"],
  ["ipad-selected-04", "ipad-10th-generation-pink", "تبلت اپل مدل iPad نسل دهم 10.9 اینچ، رنگ صورتی", "Apple iPad 10th Generation – Pink", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_57_35%20PM%20%284%29.png"],
] as const;

const selectedIpadProducts: Product[] = selectedIpadDefinitions.map(([id, slug, title, titleLatin, image]) => ({
  id, slug, title, titleLatin, brand: "Apple", category: "iPad", categoryId: "cat-ipad", price: 0, currency: "تومان",
  sku: `IPAD-${id}`, status: "active", stock: 12, stockThreshold: 3, description: `${title}؛ محصول منتخب iPad.`,
  images: [{ id: `${id}-image`, url: `/product-images/${image}`, alt: title }], attributes: [], rating: 4.8, ratingCount: 20,
  badges: [{ type: "featured", label: "منتخب آیپد" }], isFeatured: false, isNew: false, createdAt: "2026-09-21T00:00:00+03:30",
}));

const selectedWatchDefinitions = [
  ["watch-selected-01", "apple-watch-ultra-2-trail-loop", "ساعت هوشمند اپل مدل Apple Watch Ultra 2 با بدنه تیتانیومی و بند تریل لوپ بژ", "Apple Watch Ultra 2 – Titanium / Trail Loop", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_03_42%20PM%20%281%29.png"],
  ["watch-selected-02", "apple-watch-se-2-44-midnight", "ساعت هوشمند اپل مدل Apple Watch SE نسل دوم 44 میلی‌متری، رنگ میدنایت", "Apple Watch SE (2nd Gen) 44mm – Midnight", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_03_42%20PM%20%282%29.png"],
  ["watch-selected-03", "apple-watch-series-9-45-silver", "ساعت هوشمند اپل مدل Apple Watch Series 9 سایز 45 میلی‌متری، رنگ نقره‌ای با بند پارچه‌ای سفید", "Apple Watch Series 9 45mm – Silver", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_03_42%20PM%20%283%29.png"],
  ["watch-selected-04", "apple-watch-series-9-41-pink", "ساعت هوشمند اپل مدل Apple Watch Series 9 سایز 41 میلی‌متری، رنگ صورتی با بند سیلیکونی", "Apple Watch Series 9 41mm – Pink", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_03_43%20PM%20%284%29.png"],
] as const;

const selectedWatchProducts: Product[] = selectedWatchDefinitions.map(([id, slug, title, titleLatin, image]) => ({
  id, slug, title, titleLatin, brand: "Apple", category: "Apple Watch", categoryId: "cat-apple-watch", price: 0, currency: "تومان",
  sku: `WATCH-${id}`, status: "active", stock: 12, stockThreshold: 3, description: `${title}؛ محصول منتخب Apple Watch.`,
  images: [{ id: `${id}-image`, url: `/product-images/${image}`, alt: title }], attributes: [], rating: 4.8, ratingCount: 20,
  badges: [{ type: "featured", label: "منتخب ساعت" }], isFeatured: false, isNew: false, createdAt: "2026-09-21T00:00:00+03:30",
}));

const selectedAccessoryDefinitions = [
  ["accessory-selected-01", "apple-usb-c-charge-cable-1m", "کابل شارژ اپل مدل USB-C به USB-C با روکش بافته‌شده، طول ۱ متر", "Apple USB-C Charge Cable (1m)", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_12_24%20PM%20%281%29.png"],
  ["accessory-selected-02", "apple-20w-usb-c-power-adapter", "آداپتور برق USB-C اپل ۲۰ وات", "Apple 20W USB-C Power Adapter", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_12_25%20PM%20%282%29.png"],
  ["accessory-selected-03", "apple-magsafe-charger", "شارژر بی‌سیم مغناطیسی اپل مدل MagSafe Charger", "Apple MagSafe Charger", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_16_51%20PM.png"],
  ["accessory-selected-04", "airpods-3-charging-case", "هندزفری بلوتوثی اپل مدل AirPods نسل سوم با کیس شارژ", "Apple AirPods (3rd Generation)", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_17_04%20PM.png"],
] as const;

const selectedAccessoryProducts: Product[] = selectedAccessoryDefinitions.map(([id, slug, title, titleLatin, image]) => ({
  id, slug, title, titleLatin, brand: "Apple", category: "لوازم جانبی Apple", categoryId: "cat-apple-accessories", price: 0, currency: "تومان",
  sku: `ACCESSORY-${id}`, status: "active", stock: 12, stockThreshold: 3, description: `${title}؛ محصول منتخب لوازم جانبی.`,
  images: [{ id: `${id}-image`, url: `/product-images/${image}`, alt: title }], attributes: [], rating: 4.8, ratingCount: 20,
  badges: [{ type: "featured", label: "منتخب لوازم جانبی" }], isFeatured: false, isNew: false, createdAt: "2026-09-21T00:00:00+03:30",
}));

const selectedAudioDefinitions = [
  ["audio-selected-01", "airpods-pro-2", "هندزفری بلوتوثی اپل مدل AirPods Pro نسل دوم", "Apple AirPods Pro (2nd Generation)", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_23_23%20PM%20%281%29.png"],
  ["audio-selected-02", "airpods-max-silver", "هدفون بی‌سیم اپل مدل AirPods Max رنگ نقره‌ای", "Apple AirPods Max – Silver", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_23_23%20PM%20%282%29.png"],
  ["audio-selected-03", "airpods-3", "هندزفری بلوتوثی اپل مدل AirPods نسل سوم", "Apple AirPods (3rd Generation)", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_23_24%20PM%20%283%29.png"],
  ["audio-selected-04", "earpods-usb-c", "هندزفری سیمی اپل مدل EarPods با کانکتور USB-C", "Apple EarPods (USB-C)", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2001_23_24%20PM%20%284%29.png"],
] as const;

const selectedAudioProducts: Product[] = selectedAudioDefinitions.map(([id, slug, title, titleLatin, image]) => ({
  id, slug, title, titleLatin, brand: "Apple", category: "AirPods", categoryId: "cat-airpods", price: 0, currency: "تومان",
  sku: `AUDIO-${id}`, status: "active", stock: 12, stockThreshold: 3, description: `${title}؛ محصول منتخب صدای شخصی اپل.`,
  images: [{ id: `${id}-image`, url: `/product-images/${image}`, alt: title }], attributes: [], rating: 4.8, ratingCount: 20,
  badges: [{ type: "featured", label: "منتخب صوتی" }], isFeatured: false, isNew: false, createdAt: "2026-09-21T00:00:00+03:30",
}));

export const products: Product[] = [...importedProducts, ...selectedProducts, ...newIphoneProducts, ...selectedMacProducts, ...selectedIpadProducts, ...selectedWatchProducts, ...selectedAccessoryProducts, ...selectedAudioProducts];

export const categories: Category[] = Object.entries(categoryMeta).map(([id, meta], index) => ({
  id,
  ...meta,
  parentId: null,
  status: "active",
  order: index + 1,
  productCount: products.filter((product) => product.categoryId === id).length,
}));

export const featuredProducts = products.filter((product) => product.isFeatured);
export const newArrivalProducts = products.filter((product) => product.isNew);
