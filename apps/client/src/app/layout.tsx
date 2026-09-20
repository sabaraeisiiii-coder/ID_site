import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/design-system/themes/theme-provider";
import { CartDrawerProvider } from "@/components/store/cart-drawer-provider";
import { QuickViewProvider } from "@/components/store/quick-view-provider";
import { SearchCommandProvider } from "@/components/store/search-command-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "بازار — فروشگاه اینترنتی", template: "%s — بازار" },
  description:
    "یک فروشگاه اینترنتی مدرن، مینیمال و حرفه‌ای. تجربه خرید روان، سریع و قابل اعتماد.",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} antialiased`} style={{ fontFamily: "var(--font-sans)" }}>
        <ThemeProvider>
          <CartDrawerProvider>
            <QuickViewProvider>
              <SearchCommandProvider>
                {children}
                <Toaster />
                <SonnerToaster position="bottom-left" richColors />
              </SearchCommandProvider>
            </QuickViewProvider>
          </CartDrawerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
