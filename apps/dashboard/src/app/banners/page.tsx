import Image from "next/image";
import Link from "next/link";
import { ImagePlus, ExternalLink, ArrowUpWideNarrow, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { EmptyState } from "@/components/shared/empty-state";
import { EntityStatusBadge } from "@/components/shared/status-badge";
import { BannerActions } from "@/components/admin/banner-actions";
import { bannerService } from "@/domains/banner";
import { toPersianDigits } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const PLACEMENT_LABELS: Record<string, string> = {
  hero: "هیرو",
  promotional: "پراموشنال",
  sidebar: "ستون کناری",
};

export default async function AdminBannersPage() {
  const banners = await bannerService.list();

  return (
    <div className="space-y-5">
      <Breadcrumb
        className="mb-1"
        items={[{ label: "داشبورد", href: "/" }, { label: "بنرها" }]}
        actions={<Button asChild size="sm"><Link href="/banners/new"><Plus size={14} />افزودن بنر</Link></Button>}
      />

      <PageHeader
        title="بنرها"
        description={`${toPersianDigits(banners.length)} بنر فعال و پیش‌نویس`}
      />

      {banners.length === 0 ? (
        <div
          className="rounded-lg border border-border bg-surface"
          style={{ borderRadius: "var(--radius-lg)" }}
        >
          <EmptyState
            icon={ImagePlus}
            title="بنری یافت نشد"
            description="بنرهای هیرو و پراموشنال اینجا مدیریت می‌شوند."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="rounded-lg border border-border bg-surface overflow-hidden flex flex-col transition-shadow hover:shadow-md"
              style={{ borderRadius: "var(--radius-lg)" }}
            >
              {/* Thumbnail (16:9) */}
              <div className="relative aspect-[16/9] bg-surface-secondary overflow-hidden">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                />
                <div className="absolute top-2 inset-inline-start-2 flex items-center gap-1.5">
                  <EntityStatusBadge status={banner.status} />
                </div>
                <div
                  className="absolute top-2 inset-inline-end-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {PLACEMENT_LABELS[banner.placement] ?? banner.placement}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {banner.title}
                    </h3>
                    {banner.subtitle ? (
                      <p className="text-xs text-foreground-tertiary mt-0.5 truncate">
                        {banner.subtitle}
                      </p>
                    ) : null}
                  </div>
                  <BannerActions id={banner.id} />
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
                  <span className="inline-flex items-center gap-1 text-[11px] text-foreground-tertiary">
                    <ArrowUpWideNarrow size={11} strokeWidth={1.75} />
                    ترتیب: {toPersianDigits(banner.sortOrder)}
                  </span>
                  {banner.link ? (
                    <a
                      href={banner.link}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                      dir="ltr"
                    >
                      <ExternalLink size={11} strokeWidth={1.75} />
                      {banner.link.length > 24 ? `${banner.link.slice(0, 22)}…` : banner.link}
                    </a>
                  ) : (
                    <span className="text-[11px] text-foreground-tertiary">بدون لینک</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
