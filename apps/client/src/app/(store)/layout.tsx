import type { ReactNode } from "react";
import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";

/** Wraps every storefront route with header + footer. */
export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </div>
  );
}
