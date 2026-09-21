/** Dashboard catalogue reconstructed from the same imported product seed. */
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

const importedProducts: Product[] = sourceProducts.map((product) => ({
  ...product,
  status: "active",
  stock: product.stock || 12,
  stockThreshold: product.stockThreshold || 3,
  images: product.images.map((image) => ({ ...image, url: imageFor(product.categoryId) })),
  rating: product.rating || 4.7,
  ratingCount: product.ratingCount || 20,
  isFeatured: false,
})) as Product[];

const selectedDefinitions = [
  ["selected-01", "imac-blue", "آل این وان اپل مدل iMac آبی", "Apple iMac – Blue", "Apple", "Mac", "cat-mac", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_27%20PM%20%281%29.png"], ["selected-02", "iphone-16-pro-desert-titanium", "گوشی اپل مدل iPhone 16 Pro رنگ تیتانیومی صحرایی", "Apple iPhone 16 Pro – Desert Titanium", "Apple", "iPhone", "cat-iphone", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_27%20PM%20%282%29.png"], ["selected-03", "macbook-pro-space-gray", "لپ تاپ اپل مدل MacBook Pro رنگ خاکستری فضایی", "Apple MacBook Pro – Space Gray", "Apple", "Mac", "cat-mac", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_28%20PM%20%283%29.png"], ["selected-04", "ipad-pro-space-gray", "تبلت اپل مدل iPad Pro رنگ خاکستری فضایی", "Apple iPad Pro – Space Gray", "Apple", "iPad", "cat-ipad", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_28%20PM%20%284%29.png"], ["selected-05", "apple-watch-ultra-2-trail-loop", "ساعت هوشمند اپل مدل Apple Watch Ultra 2 با بند تریل لوپ", "Apple Watch Ultra 2 – Titanium", "Apple", "Apple Watch", "cat-apple-watch", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_40%20PM%20%281%29.png"], ["selected-06", "airpods-max-silver", "هدفون بی‌سیم اپل مدل AirPods Max رنگ نقره‌ای", "Apple AirPods Max – Silver", "Apple", "AirPods", "cat-airpods", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_41%20PM%20%282%29.png"], ["selected-07", "airpods-pro-2", "هندزفری بلوتوثی اپل مدل AirPods Pro نسل دوم", "Apple AirPods Pro (2nd Generation)", "Apple", "AirPods", "cat-airpods", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_42%20PM%20%283%29.png"], ["selected-08", "mac-mini-silver", "کامپیوتر کوچک اپل مدل Mac mini رنگ نقره‌ای", "Apple Mac mini – Silver", "Apple", "Mac", "cat-mac", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_42%20PM%20%284%29.png"], ["selected-09", "ipad-pro-magic-keyboard", "تبلت اپل مدل iPad Pro به همراه کیبورد Magic Keyboard", "Apple iPad Pro with Magic Keyboard", "Apple", "iPad", "cat-ipad", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_43%20PM%20%285%29.png"], ["selected-10", "apple-tv-4k-siri-remote", "دستگاه پخش هوشمند اپل مدل Apple TV 4K به همراه ریموت Siri", "Apple TV 4K with Siri Remote", "Apple", "Apple TV", "cat-apple-tv", "ChatGPT%20Image%20Sep%2021%2C%202026%2C%2012_18_44%20PM%20%286%29.png"],
] as const;
const selectedProducts: Product[] = selectedDefinitions.map(([id, slug, title, titleLatin, brand, category, categoryId, image]) => ({ id, slug, title, titleLatin, brand, category, categoryId, price: 0, currency: "تومان", sku: `SELECTED-${id}`, status: "active", stock: 12, stockThreshold: 3, description: `${title}؛ محصول منتخب فروشگاه.`, images: [{ id: `${id}-image`, url: `/product-images/${image}`, alt: title }], attributes: [], rating: 4.8, ratingCount: 20, badges: [{ type: "featured", label: "محصول منتخب" }], isFeatured: true, isNew: false, createdAt: "2026-09-21T00:00:00+03:30" }));
export const products: Product[] = [...importedProducts, ...selectedProducts];

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
