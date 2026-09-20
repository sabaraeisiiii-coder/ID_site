import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Minimal auth layout — brand + form card + back-to-home link. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, var(--background) 0%, var(--background-subtle) 100%)" }}>
      <header className="px-6 py-5">
        <Link href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors">
          <ArrowRight size={16} />
          بازگشت به فروشگاه
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 7 L12 4 L19 7 L19 17 L12 20 L5 17 Z"
                    stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
                  <path d="M9 10 L9 15 M12 8 L12 16 M15 10 L15 15"
                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
