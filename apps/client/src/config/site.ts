/** Site-wide identity & navigation. Change once → propagates. */

export const siteConfig = {
  name: "ID store",
  nameLatin: "ID store",
  tagline: "اپل و پلی‌استیشن، با انتخاب دقیق",
  description: "فروشگاه تخصصی محصولات اپل و پلی‌استیشن",
  url: "https://id-site.example.com",
  locale: "fa-IR",
  direction: "rtl" as const,

  contact: {
    phone: "۰۲۱-۹۱۰۰۰۰۰۰",
    phoneLatin: "+98 21 910 00 000",
    email: "support@bazaar.example.com",
    address: "تهران، خیابان ولیعصر، پلاک ۱۲۳۴",
    hours: "شنبه تا پنجشنبه، ۹ تا ۱۸",
  },

  social: {
    instagram: "https://instagram.com",
    telegram: "https://telegram.org",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
  },

  nav: {
    main: [
      { label: "صفحه اصلی", href: "/" },
      { label: "محصولات", href: "/products" },
      { label: "محصولات اپل", href: "/products?categoryId=c1" },
      { label: "پلی‌استیشن", href: "/products?categoryId=c6" },
      { label: "درباره ما", href: "/pages/about" },
    ],
    footer: [
      {
        title: "خدمات مشتریان",
        links: [
          { label: "تماس با ما", href: "/contact" },
          { label: "پشتیبانی", href: "/support" },
          { label: "پیگیری سفارش", href: "/account/orders" },
          { label: "بازگشت کالا", href: "/pages/returns" },
        ],
      },
      {
        title: "با ID store",
        links: [
          { label: "درباره ما", href: "/pages/about" },
          { label: "قوانین و مقررات", href: "/pages/terms" },
          { label: "حریم خصوصی", href: "/pages/privacy" },
          { label: "سوالات متداول", href: "/pages/faq" },
        ],
      },
      {
        title: "خرید",
        links: [
          { label: "محصولات", href: "/products" },
          { label: "تخفیف‌ها", href: "/products?onSale=true" },
          { label: "برندها", href: "/brands" },
          { label: "مجله", href: "/blog" },
        ],
      },
    ],
  },
};

export type SiteConfig = typeof siteConfig;
