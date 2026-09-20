import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BannerForm } from "@/components/admin/banner-form";
export default function NewBannerPage() { return <div className="space-y-5"><Breadcrumb items={[{ label: "داشبورد", href: "/" }, { label: "بنرها", href: "/banners" }, { label: "افزودن بنر" }]} /><BannerForm /></div>; }
