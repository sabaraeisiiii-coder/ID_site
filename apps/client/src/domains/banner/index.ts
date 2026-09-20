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
  { id: "b1", title: "کلکسیون پاییز و زمستان", subtitle: "تا ۴۰٪ تخفیف",
    image: "/images/showcase/hero-studio.webp",
    link: "/products?onSale=true", cta: "مشاهده",
    status: "active", sortOrder: 1, placement: "hero" },
  { id: "b2", title: "۳۰٪ تخفیف روی ساعت‌ها", subtitle: "فرصت محدود",
    image: "/images/products/watch.webp",
    link: "/products?categoryId=c3", cta: "خرید",
    status: "active", sortOrder: 2, placement: "promotional" },
  { id: "b3", title: "محصولات جدید رسید", subtitle: "اولین نفر باش",
    image: "/images/products/sweater.webp",
    link: "/products?sort=newest", cta: "دیدن",
    status: "active", sortOrder: 3, placement: "promotional" },
];

export const bannerService = {
  async list(): Promise<Banner[]> {
    return [...banners].sort((a, b) => a.sortOrder - b.sortOrder);
  },
  async listActive(): Promise<Banner[]> {
    return banners.filter((b) => b.status === "active").sort((a, b) => a.sortOrder - b.sortOrder);
  },
};
