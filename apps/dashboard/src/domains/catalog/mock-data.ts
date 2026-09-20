/**
 * Catalog domain — mock product + category data.
 * Frontend-only until backend is wired up.
 */

import type { Category, Product } from "./types";

const img = {
  apparel1a: "/images/products/tshirt.webp",
  apparel1b: "/images/products/tshirt.webp",
  apparel2a: "/images/products/sweater.webp",
  apparel2b: "/images/products/sweater.webp",
  jacket1a: "/images/products/coat.webp",
  jacket1b: "/images/products/coat.webp",
  shoes1a: "/images/products/sneakers.webp",
  shoes1b: "/images/products/sneakers.webp",
  shoes2a: "/images/products/runner.webp",
  shoes2b: "/images/products/runner.webp",
  bag1a: "/images/products/tote.webp",
  bag1b: "/images/products/tote.webp",
  watch1a: "/images/products/watch.webp",
  watch1b: "/images/products/watch.webp",
  headphone1a: "/images/products/headphones.webp",
  headphone1b: "/images/products/headphones.webp",
  perfume1a: "/images/products/perfume.webp",
  perfume1b: "/images/products/perfume.webp",
  sunglass1a: "/images/products/sunglasses.webp",
  sunglass1b: "/images/products/sunglasses.webp",
};

export const categories: Category[] = [
  { id: "c1", slug: "apparel", name: "پوشاک", description: "لباس‌های روزمره و رسمی",
    parentId: null, image: img.apparel1a, productCount: 248, status: "active", order: 1 },
  { id: "c2", slug: "shoes", name: "کفش", description: "کفش‌های ورزشی و کژوال",
    parentId: null, image: img.shoes1a, productCount: 156, status: "active", order: 2 },
  { id: "c3", slug: "accessories", name: "اکسسوری", description: "ساعت، عینک، کیف و...",
    parentId: null, image: img.watch1a, productCount: 92, status: "active", order: 3 },
  { id: "c4", slug: "bags", name: "کیف", description: "کیف‌های چرمی و اسپرت",
    parentId: null, image: img.bag1a, productCount: 64, status: "active", order: 4 },
  { id: "c5", slug: "beauty", name: "زیبایی", description: "عطر، آرایش و بهداشت",
    parentId: null, image: img.perfume1a, productCount: 128, status: "active", order: 5 },
  { id: "c6", slug: "electronics", name: "الکترونیک", description: "هدفون، اسپیکر و گجت",
    parentId: null, image: img.headphone1a, productCount: 87, status: "active", order: 6 },
];

const date = "2024-09-10T10:00:00Z";

export const products: Product[] = [
  {
    id: "p1", slug: "premium-cotton-tshirt",
    title: "تیشرت پنبه‌ای پریمیوم", titleLatin: "Premium Cotton T-Shirt",
    description: "تیشرت برش تمیز از پنبه ۱۰۰٪ مرسریزه‌شده. مناسب استایل مینیمال روزمره.",
    brand: "مارکا", category: "پوشاک", categoryId: "c1",
    price: 890000, comparePrice: 1290000, currency: "تومان",
    sku: "TS-001-BLK", status: "active", stock: 42, stockThreshold: 10,
    images: [
      { id: "p1-i1", url: img.apparel1a, alt: "تیشرت پنبه‌ای - نمای جلو" },
      { id: "p1-i2", url: img.apparel1b, alt: "تیشرت پنبه‌ای - نمای پشت", isSecondary: true },
    ],
    variants: [
      { id: "v1", name: "رنگ", value: "مشکی", swatch: "#0A0A0A", stock: 20 },
      { id: "v2", name: "رنگ", value: "سفید", swatch: "#FFFFFF", stock: 22 },
    ],
    attributes: [{ label: "جنس", value: "۱۰۰٪ پنبه" }, { label: "ساخت", value: "ایران" }],
    rating: 4.7, ratingCount: 124,
    badges: [{ type: "sale" }, { type: "bestseller" }],
    isFeatured: true, createdAt: date,
  },
  {
    id: "p2", slug: "minimal-wool-coat",
    title: "پالتو وول مینیمال", titleLatin: "Minimal Wool Coat",
    description: "پالتو کلاسیک با چسبندگی عالی و آستر حرارت‌دار. مناسب فصل سرد.",
    brand: "مارکا", category: "پوشاک", categoryId: "c1",
    price: 3450000, comparePrice: 4200000, currency: "تومان",
    sku: "CT-014-CML", status: "active", stock: 8, stockThreshold: 10,
    images: [
      { id: "p2-i1", url: img.jacket1a, alt: "پالتو وول - نمای جلو" },
      { id: "p2-i2", url: img.jacket1b, alt: "پالتو وول - جزئیات", isSecondary: true },
    ],
    attributes: [
      { label: "جنس", value: "۸۰٪ وول / ۲۰٪ پلی‌استر" },
      { label: "آستر", value: "حرارت‌دار" },
    ],
    rating: 4.9, ratingCount: 56,
    badges: [{ type: "limited" }], isFeatured: true, createdAt: date,
  },
  {
    id: "p3", slug: "classic-sneakers-white",
    title: "اسنیکرز کلاسیک سفید", titleLatin: "Classic White Sneakers",
    description: "کفش کژوال سفید با کفی آناتومیک و رویه چرم طبیعی.",
    brand: "مارکا", category: "کفش", categoryId: "c2",
    price: 1890000, comparePrice: 2400000, currency: "تومان",
    sku: "SN-007-WHT", status: "active", stock: 0, stockThreshold: 8,
    images: [
      { id: "p3-i1", url: img.shoes1a, alt: "اسنیکرز سفید - جلو" },
      { id: "p3-i2", url: img.shoes1b, alt: "اسنیکرز سفید - پهلو", isSecondary: true },
    ],
    variants: [
      { id: "v3", name: "سایز", value: "۴۰", stock: 0 },
      { id: "v4", name: "سایز", value: "۴۲", stock: 0 },
    ],
    rating: 4.6, ratingCount: 89,
    badges: [{ type: "out" }], isFeatured: false, createdAt: date,
  },
  {
    id: "p4", slug: "sport-runner-shoes",
    title: "کفش دونده اسپرت", titleLatin: "Sport Runner Shoes",
    description: "کفش دونده با فنر کفی و وزن سبک. مناسب دویدن طولانی.",
    brand: "مارکا", category: "کفش", categoryId: "c2",
    price: 2190000, currency: "تومان",
    sku: "SN-012-BLK", status: "active", stock: 34, stockThreshold: 12,
    images: [
      { id: "p4-i1", url: img.shoes2a, alt: "کفش دونده - جلو" },
      { id: "p4-i2", url: img.shoes2b, alt: "کفش دونده - کفی", isSecondary: true },
    ],
    rating: 4.5, ratingCount: 67,
    badges: [{ type: "new" }], isNew: true, isFeatured: true, createdAt: date,
  },
  {
    id: "p5", slug: "leather-tote-bag",
    title: "کیف توت چرمی", titleLatin: "Leather Tote Bag",
    description: "کیف توت چرم طبیعی با دوخت reinforced و جیب داخلی متعدد.",
    brand: "مارکا", category: "کیف", categoryId: "c4",
    price: 2750000, comparePrice: 3500000, currency: "تومان",
    sku: "BG-021-TAN", status: "active", stock: 14, stockThreshold: 5,
    images: [
      { id: "p5-i1", url: img.bag1a, alt: "کیف توت - جلو" },
      { id: "p5-i2", url: img.bag1b, alt: "کیف توت - داخل", isSecondary: true },
    ],
    attributes: [
      { label: "جنس", value: "چرم طبیعی" },
      { label: "ابعاد", value: "۳۵×۲۸×۱۲ سانتی‌متر" },
    ],
    rating: 4.8, ratingCount: 42,
    badges: [{ type: "sale" }], isFeatured: true, createdAt: date,
  },
  {
    id: "p6", slug: "minimalist-leather-watch",
    title: "ساعت چرمی مینیمال", titleLatin: "Minimalist Leather Watch",
    description: "ساعت آنالوگ با صفحه مینیمال و بند چرم ایتالیایی. مقاوم در برابر آب.",
    brand: "مارکا", category: "اکسسوری", categoryId: "c3",
    price: 4280000, comparePrice: 5990000, currency: "تومان",
    sku: "WT-009-SLV", status: "active", stock: 6, stockThreshold: 8,
    images: [
      { id: "p6-i1", url: img.watch1a, alt: "ساعت مینیمال - مچ" },
      { id: "p6-i2", url: img.watch1b, alt: "ساعت مینیمال - صفحه", isSecondary: true },
    ],
    attributes: [
      { label: "قطر صفحه", value: "۴۰ میلی‌متر" },
      { label: "بند", value: "چرم ایتالیایی" },
    ],
    rating: 4.9, ratingCount: 31,
    badges: [{ type: "limited" }, { type: "sale" }], isFeatured: true, createdAt: date,
  },
  {
    id: "p7", slug: "wireless-noise-cancel-headphones",
    title: "هدفون بی‌سیم نویز کنسلینگ", titleLatin: "Wireless ANC Headphones",
    description: "هدفون با تکنولوژی حذف نویز فعال و باتری ۳۰ ساعته. بلوتوث ۵.۳.",
    brand: "مارکا", category: "الکترونیک", categoryId: "c6",
    price: 5990000, comparePrice: 7800000, currency: "تومان",
    sku: "HP-003-BLK", status: "active", stock: 22, stockThreshold: 8,
    images: [
      { id: "p7-i1", url: img.headphone1a, alt: "هدفون - جلو" },
      { id: "p7-i2", url: img.headphone1b, alt: "هدفون - تاشو", isSecondary: true },
    ],
    attributes: [{ label: "باتری", value: "۳۰ ساعت" }, { label: "بلوتوث", value: "۵.۳" }],
    rating: 4.8, ratingCount: 156,
    badges: [{ type: "bestseller" }, { type: "sale" }], isFeatured: true, createdAt: date,
  },
  {
    id: "p8", slug: "signature-eau-de-parfum",
    title: "ادو پارفان امضای ویژه", titleLatin: "Signature Eau de Parfum",
    description: "عطر شرقی-چوبی با ماندگاری ۸ ساعته. حجم ۱۰۰ میلی‌لیتر.",
    brand: "مارکا", category: "زیبایی", categoryId: "c5",
    price: 1850000, comparePrice: 2300000, currency: "تومان",
    sku: "PF-005-100", status: "active", stock: 38, stockThreshold: 15,
    images: [
      { id: "p8-i1", url: img.perfume1a, alt: "عطر امضا - شیشه" },
      { id: "p8-i2", url: img.perfume1b, alt: "عطر امضا - جعبه", isSecondary: true },
    ],
    attributes: [{ label: "حجم", value: "۱۰۰ میلی‌لیتر" }, { label: "گروه", value: "شرقی-چوبی" }],
    rating: 4.7, ratingCount: 98,
    badges: [{ type: "sale" }, { type: "featured" }], isFeatured: true, createdAt: date,
  },
  {
    id: "p9", slug: "polarized-sunglasses",
    title: "عینک آفتابی پلاریزه", titleLatin: "Polarized Sunglasses",
    description: "عینک با عدسی پلاریزه و فریم استیل. محافظت UV400.",
    brand: "مارکا", category: "اکسسوری", categoryId: "c3",
    price: 1290000, comparePrice: 1690000, currency: "تومان",
    sku: "SG-011-BRN", status: "active", stock: 19, stockThreshold: 8,
    images: [
      { id: "p9-i1", url: img.sunglass1a, alt: "عینک - روی صورت" },
      { id: "p9-i2", url: img.sunglass1b, alt: "عینک - عدسی", isSecondary: true },
    ],
    attributes: [{ label: "عدسی", value: "پلاریزه UV400" }, { label: "فریم", value: "استیل" }],
    rating: 4.6, ratingCount: 47,
    badges: [{ type: "new" }], isNew: true, isFeatured: false, createdAt: date,
  },
  {
    id: "p10", slug: "oversized-knit-sweater",
    title: "بافت اورسایز", titleLatin: "Oversized Knit Sweater",
    description: "بافت گرم و نرم با یهن اورسایز. مناسب استایل کژوال پاییزه.",
    brand: "مارکا", category: "پوشاک", categoryId: "c1",
    price: 1490000, comparePrice: 1990000, currency: "تومان",
    sku: "SW-028-CRM", status: "active", stock: 25, stockThreshold: 8,
    images: [
      { id: "p10-i1", url: img.apparel2a, alt: "بافت اورسایز - جلو" },
      { id: "p10-i2", url: img.apparel2b, alt: "بافت اورسایز - بافت", isSecondary: true },
    ],
    attributes: [{ label: "جنس", value: "آکریلیک / وول" }, { label: "ضخامت", value: "متوسط" }],
    rating: 4.5, ratingCount: 73,
    badges: [{ type: "sale" }], isFeatured: false, createdAt: date,
  },
];

export const featuredProducts = products.filter((p) => p.isFeatured);
export const newArrivalProducts = products.filter((p) => p.isNew);
