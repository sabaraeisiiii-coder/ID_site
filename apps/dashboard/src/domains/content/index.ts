/** Content (CMS) domain. */

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  body: string;
  status: "draft" | "active";
  updatedAt: string;
}

export const contentPages: ContentPage[] = [
  { id: "c1", slug: "about", title: "درباره ما",
    body: "بازار یک فروشگاه اینترنتی مدرن و مینیمال است که با هدف ارائه بهترین تجربه خرید طراحی شده.\n\nما با دقت محصولاتی را انتخاب می‌کنیم که کیفیت و طراحی برتر دارند. ماموریت ما این است که خرید آنلاین را ساده، شفاف و لذت‌بخش کنیم.",
    status: "active", updatedAt: "2024-09-01T10:00:00Z" },
  { id: "c2", slug: "terms", title: "قوانین و مقررات",
    body: "با استفاده از این سایت، شما قوانین زیر را می‌پذیرید:\n\n۱. تمامی قیمت‌ها به تومان است.\n۲. سفارش‌ها پس از تأیید پرداخت ارسال می‌شوند.\n۳. مهلت بازگشت کالا ۷ روز است.\n۴. هزینه ارسال بر اساس روش انتخابی محاسبه می‌شود.",
    status: "active", updatedAt: "2024-09-01T10:00:00Z" },
  { id: "c3", slug: "privacy", title: "حریم خصوصی",
    body: "ما به حریم خصوصی شما احترام می‌گذاریم. اطلاعات شخصی شما فقط برای پردازش سفارش‌ها و ارتباط با شما استفاده می‌شود و هرگز به اشخاص ثالث فروخته نمی‌شود.",
    status: "active", updatedAt: "2024-09-01T10:00:00Z" },
  { id: "c4", slug: "returns", title: "بازگشت کالا",
    body: "شما می‌توانید کالاهای خریداری‌شده را ظرف ۷ روز از تاریخ دریافت، در صورت عدم استفاده و داشتن بسته‌بندی اصلی، بازگردانید. هزینه ارسال بازگشت بر عهده فروشگاه است.",
    status: "active", updatedAt: "2024-09-01T10:00:00Z" },
  { id: "c5", slug: "faq", title: "سوالات متداول",
    body: "پرسش‌های پرتکرار:\n\n۱. چطور سفارش خود را پیگیری کنم؟ از بخش «سفارش‌های من» در حساب کاربری.\n۲. آیا ارسال رایگان دارید؟ برای سفارش‌های بالای ۱ میلیون تومان، ارسال رایگان است.\n۳. چطور پرداخت کنم؟ با کارت‌های بانکی عضو شتاب از طریق درگاه پرداخت.",
    status: "active", updatedAt: "2024-09-01T10:00:00Z" },
  { id: "c6", slug: "shipping-guide", title: "راهنمای ارسال",
    body: "روش‌های ارسال:\n\n• پست پیشتاز: ۲-۴ روز کاری\n• تیپاکس: ۱-۳ روز کاری\n• ارسال رایگان: ۳-۵ روز کاری (برای سفارش‌های بالای ۱ میلیون تومان)",
    status: "draft", updatedAt: "2024-09-05T10:00:00Z" },
];

export const contentService = {
  async list(): Promise<ContentPage[]> { return [...contentPages]; },
  async getBySlug(slug: string): Promise<ContentPage | null> {
    return contentPages.find((c) => c.slug === slug) ?? null;
  },
  async getById(id: string): Promise<ContentPage | null> {
    return contentPages.find((c) => c.id === id) ?? null;
  },
};
