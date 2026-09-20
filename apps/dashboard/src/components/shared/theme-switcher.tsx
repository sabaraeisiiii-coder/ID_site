"use client";

/**
 * ThemeSwitcher — dropdown to switch between registered themes.
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/design-system/themes/theme-provider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const dark = theme.mode === "dark";

  return (
    <button type="button" onClick={() => setTheme(dark ? "default" : "midnight")}
      aria-label={dark ? "فعال‌کردن حالت روشن" : "فعال‌کردن حالت تیره"}
      aria-pressed={dark} className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-foreground-secondary transition-all hover:border-border hover:bg-surface-secondary hover:text-foreground">
      <Sun aria-hidden className={`absolute size-[18px] transition-all duration-300 ${dark ? "rotate-90 scale-0" : "rotate-0 scale-100"}`} />
      <Moon aria-hidden className={`absolute size-[18px] transition-all duration-300 ${dark ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
    </button>
  );
}
