import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/design-system/themes/theme-provider";
import { AdminShell } from "@/components/admin/admin-shell";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: "بازار — پنل مدیریت", template: "%s — بازار" },
  description: "پنل مدیریت فروشگاه بازار",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} antialiased`} style={{ fontFamily: "var(--font-sans)" }}>
        <ThemeProvider>
          <AdminShell>{children}</AdminShell>
          <Toaster />
          <SonnerToaster position="bottom-left" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
