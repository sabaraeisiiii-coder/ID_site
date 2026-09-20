import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BannerForm } from "@/components/admin/banner-form";
import { bannerService } from "@/domains/banner";
export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const banner = await bannerService.getById(id); if (!banner) notFound(); return <div className="space-y-5"><Breadcrumb items={[{ label: "داشبورد", href: "/" }, { label: "بنرها", href: "/banners" }, { label: banner.title }]} /><BannerForm banner={banner} /></div>; }
