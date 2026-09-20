"use client";

/**
 * SearchCommandProvider — context + cmdk palette.
 * Opens via `openSearch()` or Cmd+K / Ctrl+K keyboard shortcut.
 */

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Command as CommandPrimitive } from "cmdk";
import { Search, Package, FolderTree, FileText, User, ShoppingCart, Heart, Phone } from "lucide-react";
import {
  Dialog, DialogContent, DialogTitle,
} from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { catalogService } from "@/domains/catalog/service";
import type { Product, Category } from "@/domains/catalog/types";
import { formatPrice } from "@/lib/format";

interface SearchContextValue {
  open: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = React.createContext<SearchContextValue | null>(null);

const PAGES = [
  { label: "حساب کاربری", href: "/account", icon: User },
  { label: "سفارش‌های من", href: "/account/orders", icon: ShoppingCart },
  { label: "علاقه‌مندی‌ها", href: "/account/wishlist", icon: Heart },
  { label: "تماس با ما", href: "/contact", icon: Phone },
  { label: "پشتیبانی", href: "/support", icon: FileText },
  { label: "درباره ما", href: "/pages/about", icon: FileText },
];

const POPULAR = ["تیشرت", "کفش", "ساعت", "عطر"];

export function SearchCommandProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // Global keyboard shortcut: Cmd+K / Ctrl+K
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const value = React.useMemo(
    () => ({
      open,
      openSearch: () => setOpen(true),
      closeSearch: () => setOpen(false),
    }),
    [open],
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SearchDialog open={open} onOpenChange={setOpen} onNavigate={(href) => { router.push(href); setOpen(false); }} />
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = React.useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside <SearchCommandProvider>");
  return ctx;
}

function SearchDialog({
  open, onOpenChange, onNavigate,
}: { open: boolean; onOpenChange: (v: boolean) => void; onNavigate: (href: string) => void }) {
  const [query, setQuery] = React.useState("");
  const [products, setProducts] = React.useState<Product[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  // Load categories once
  React.useEffect(() => {
    catalogService.listCategories().then(setCategories);
  }, []);

  // Debounce search query
  React.useEffect(() => {
    if (!query.trim()) { setProducts([]); return; }
    const id = setTimeout(async () => {
      const res = await catalogService.listProducts({ search: query, pageSize: 6 });
      setProducts(res.items);
    }, 200);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-2xl overflow-hidden" showCloseButton={false}>
        <DialogTitle className="sr-only">جستجو</DialogTitle>
        <Command shouldFilter={false} className="rounded-none">
          <div className="flex items-center border-b border-border px-4" cmdk-input-wrapper="">
            <Search size={18} strokeWidth={1.75} className="text-foreground-tertiary" />
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="جستجوی محصول، برند یا دسته‌بندی..."
              className="flex-1 h-14 border-0 bg-transparent text-base focus-visible:ring-0"
            />
          </div>
          <CommandList className="max-h-[60vh] overflow-y-auto">
            <CommandEmpty>نتیجه‌ای یافت نشد.</CommandEmpty>

            {/* Popular searches (when query empty) */}
            {!query.trim() ? (
              <>
                <CommandGroup heading="جستجوهای پرطرفدار">
                  {POPULAR.map((p) => (
                    <CommandItem key={p} onSelect={() => setQuery(p)} value={p}>
                      <Search size={14} className="text-foreground-tertiary" />
                      <span>{p}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandGroup heading="دسته‌بندی‌ها">
                  {categories.map((c) => (
                    <CommandItem key={c.id} onSelect={() => onNavigate(`/products?categoryId=${c.id}`)} value={c.name}>
                      <FolderTree size={14} className="text-foreground-tertiary" />
                      <span>{c.name}</span>
                      <span className="ms-auto text-xs text-foreground-tertiary">{c.productCount} کالا</span>
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandGroup heading="صفحات">
                  {PAGES.map((p) => (
                    <CommandItem key={p.href} onSelect={() => onNavigate(p.href)} value={p.label}>
                      <p.icon size={14} className="text-foreground-tertiary" />
                      <span>{p.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            ) : null}

            {/* Live product results */}
            {query.trim() ? (
              <CommandGroup heading="محصولات">
                {products.map((p) => (
                  <CommandItem key={p.id} onSelect={() => onNavigate(`/product/${p.slug}`)} value={p.title}>
                    <Package size={14} className="text-foreground-tertiary" />
                    <span className="flex-1 truncate">{p.title}</span>
                    <span className="text-xs text-foreground-tertiary nums-persian">{formatPrice(p.price)}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
