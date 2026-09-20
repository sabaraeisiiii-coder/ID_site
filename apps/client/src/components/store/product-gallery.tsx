"use client";

/**
 * ProductGallery — image gallery for the PDP.
 * Desktop: vertical thumbnail rail (start) + main image (end).
 * Mobile: stacked thumbnails below main image.
 * Hover on main image gives subtle zoom (scale 1.05).
 */

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/format";
import type { ProductImage } from "@/domains/catalog/types";

export interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  className?: string;
}

export function ProductGallery({ images, title, className }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);

  // Reset to first image when images change
  React.useEffect(() => {
    setActiveIdx(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div
        className={cn("aspect-[4/5] w-full bg-surface-secondary flex items-center justify-center", className)}
        style={{ borderRadius: "var(--radius-lg)" }}
      >
        <span className="text-sm text-foreground-tertiary">تصویری موجود نیست</span>
      </div>
    );
  }

  const current = images[activeIdx] ?? images[0];

  return (
    <div className={cn("flex flex-col-reverse sm:flex-row gap-3", className)}>
      {/* Thumbnail rail */}
      {images.length > 1 ? (
        <div
          className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[560px] sm:pe-1"
          aria-label="تصاویر محصول"
        >
          {images.map((img, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`تصویر ${i + 1}`}
                aria-pressed={isActive}
                className={cn(
                  "relative shrink-0 w-20 h-20 sm:w-20 sm:h-24 overflow-hidden bg-surface-secondary",
                  "border-2 transition-all",
                  isActive
                    ? "border-primary"
                    : "border-transparent hover:border-border-strong",
                )}
                style={{ borderRadius: "var(--radius-md)" }}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      ) : null}

      {/* Main image */}
      <div
        className="relative flex-1 aspect-[4/5] overflow-hidden bg-surface-secondary group"
        style={{ borderRadius: "var(--radius-lg)" }}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
      >
        <Image
          key={current.id}
          src={current.url}
          alt={current.alt || title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-500 ease-out",
            zoom ? "scale-110" : "scale-100",
          )}
        />
        {/* Badges / placeholder for image counter */}
        {images.length > 1 ? (
          <span
            className="absolute bottom-3 inset-inline-end-3 inline-flex items-center justify-center min-w-[28px] h-6 px-2 rounded-full text-xs font-medium nums-persian"
            style={{
              background: "color-mix(in oklab, var(--background) 88%, transparent)",
              backdropFilter: "blur(6px)",
              color: "var(--foreground-secondary)",
            }}
          >
            {toPersianDigits(activeIdx + 1)} / {toPersianDigits(images.length)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
