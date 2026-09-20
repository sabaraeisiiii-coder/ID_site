"use client";

import * as React from "react";
import { ImageIcon, SlidersHorizontal } from "lucide-react";
import { FormShell } from "@/components/shared/form-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Banner } from "@/domains/banner";

const fallbackImage = "/images/showcase/hero-studio.webp";

export function BannerForm({ banner }: { banner?: Banner }) {
  const [title, setTitle] = React.useState(banner?.title ?? "");
  const [subtitle, setSubtitle] = React.useState(banner?.subtitle ?? "");
  const [image, setImage] = React.useState(banner?.image ?? fallbackImage);
  const [link, setLink] = React.useState(banner?.link ?? "/products");
  const [cta, setCta] = React.useState(banner?.cta ?? "مشاهده");
  const [placement, setPlacement] = React.useState<Banner["placement"]>(banner?.placement ?? "promotional");
  const [sortOrder, setSortOrder] = React.useState(banner?.sortOrder ?? 1);
  const [active, setActive] = React.useState(banner?.status === "active");

  return <FormShell title={banner ? "ویرایش بنر" : "افزودن بنر"} description="محتوا، جایگاه و نمایش بنر را تنظیم کنید." backHref="/banners" submitLabel={banner ? "ذخیره تغییرات" : "ایجاد بنر"} sidePanel={<div className="space-y-5">
    <Panel icon={SlidersHorizontal} title="تنظیمات نمایش"><label className="flex items-center justify-between"><span className="text-sm">نمایش در فروشگاه</span><Switch checked={active} onCheckedChange={setActive} /></label><Field label="جایگاه"><Select value={placement} onValueChange={(value) => setPlacement(value as Banner["placement"])}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="hero">هیرو</SelectItem><SelectItem value="promotional">پروموشنال</SelectItem><SelectItem value="sidebar">ستون کناری</SelectItem></SelectContent></Select></Field><Field label="ترتیب نمایش"><Input type="number" min="1" value={sortOrder} onChange={(e) => setSortOrder(Math.max(1, Number(e.target.value) || 1))} /></Field></Panel>
    <Panel icon={ImageIcon} title="پیش‌نمایش"><div className="aspect-[16/9] rounded-md bg-surface-secondary" style={{ backgroundImage: `url("${image || fallbackImage}")`, backgroundPosition: "center", backgroundSize: "cover" }} /><p className="mt-3 text-sm font-semibold">{title || "عنوان بنر"}</p><p className="mt-1 text-xs text-foreground-tertiary">{subtitle || "زیرعنوان بنر"}</p></Panel>
  </div>}>
    <Panel icon={ImageIcon} title="محتوای بنر"><div className="grid gap-4 sm:grid-cols-2"><Field label="عنوان"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="مثلاً کالکشن جدید" required /></Field><Field label="متن دکمه"><Input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="مشاهده" /></Field></div><Field label="زیرعنوان"><Textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={3} placeholder="توضیح کوتاه یا پیشنهاد تخفیف" /></Field></Panel>
    <Panel icon={SlidersHorizontal} title="تصویر و مقصد"><div className="grid gap-4 sm:grid-cols-2"><Field label="مسیر تصویر"><Input value={image} onChange={(e) => setImage(e.target.value)} dir="ltr" placeholder="/images/..." required /></Field><Field label="لینک مقصد"><Input value={link} onChange={(e) => setLink(e.target.value)} dir="ltr" placeholder="/products" /></Field></div><p className="text-[11px] text-foreground-tertiary">برای بهترین نتیجه، تصویر با نسبت ۱۶:۹ انتخاب کنید.</p></Panel>
  </FormShell>;
}
function Panel({ icon: Icon, title, children }: { icon: typeof ImageIcon; title: string; children: React.ReactNode }) { return <section className="space-y-4 rounded-lg border border-border bg-surface p-5" style={{ borderRadius: "var(--radius-lg)" }}><h2 className="flex items-center gap-2 text-sm font-semibold"><Icon size={16} className="text-foreground-secondary" />{title}</h2>{children}</section>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }
