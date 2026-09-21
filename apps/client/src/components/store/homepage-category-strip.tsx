import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/domains/catalog/types";

export function HomepageCategoryStrip({ categories }: { categories: Category[] }) {
  return <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
    {categories.map((category) => <Link key={category.id} href={`/products?categoryId=${category.id}`} className="group rounded-[var(--radius-lg)] border border-border bg-surface-secondary/55 p-3 text-center transition-colors hover:bg-surface-secondary">
      <div className="relative mx-auto aspect-[4/3] max-w-[118px] overflow-hidden"><Image src={category.image ?? "/images/showcase/id-site-devices.png"} alt={category.name} fill sizes="(max-width: 640px) 30vw, 14vw" className="object-contain transition-transform duration-300 group-hover:scale-105" /></div>
      <span className="mt-1 block text-sm font-semibold text-foreground">{category.name}</span>
    </Link>)}
  </div>;
}
