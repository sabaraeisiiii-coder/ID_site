/** Banner domain. */

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  cta?: string;
  status: "active" | "draft";
  sortOrder: number;
  placement: "hero" | "promotional" | "sidebar";
}

export const banners: Banner[] = [
  { id: "b1", title: "iPhone 16 Pro — فراتر از تصویر", subtitle: "Hero / محصولات جدید اپل",
    image: "/images/products/iphone/iphone-16-pro.jpg",
    link: "/products?categoryId=c1", cta: "مشاهده محصولات",
    status: "active", sortOrder: 1, placement: "hero" },
  { id: "b2", title: "MacBook Air M4 — سبک‌تر از همیشه", subtitle: "Hero / خانواده Mac",
    image: "/images/products/mac/macbook-air-m4.jpg",
    link: "/products?categoryId=c2", cta: "مشاهده محصولات",
    status: "active", sortOrder: 2, placement: "hero" },
  { id: "b3", title: "iPad Air M3 — فضا برای ایده‌های بزرگ", subtitle: "Hero / خانواده iPad",
    image: "/images/products/ipad/ipad-air-m3.jpg",
    link: "/products?categoryId=c3", cta: "مشاهده محصولات",
    status: "active", sortOrder: 3, placement: "hero" },
  { id: "b4", title: "Apple Watch Series 10", subtitle: "بنر تبلیغاتی / ساعت اپل",
    image: "/images/products/apple-watch/apple-watch-series-10.jpg",
    link: "/products?categoryId=c4", cta: "مشاهده محصولات",
    status: "active", sortOrder: 4, placement: "promotional" },
  { id: "b5", title: "PlayStation 5 — بازی بدون مرز", subtitle: "Hero / PlayStation",
    image: "/images/products/gaming-console.png",
    link: "/products?categoryId=c6", cta: "مشاهده محصولات",
    status: "active", sortOrder: 5, placement: "hero" },
];

export const bannerService = {
  async list(): Promise<Banner[]> {
    return [...banners].sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async listActive(): Promise<Banner[]> {
    return banners.filter((b) => b.status === "active").sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async getById(id: string): Promise<Banner | undefined> {
    return banners.find((banner) => banner.id === id);
  },
};
