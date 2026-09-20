"use client";

/**
 * ThemeProvider
 * --------------------------------------------------------------------
 * - Holds the active theme id in a hydration-safe external client store
 * - Uses the same deterministic initial theme on the server and client
 * - Restores a persisted theme from localStorage only after hydration
 * - Renders an inline <style> block publishing ALL theme tokens as CSS
 *   variables on :root so SSR HTML already has correct tokens.
 * - Syncs <html dir>, data-theme, data-mode, lang attributes.
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore,
} from "react";
import type { Theme, ThemeMeta } from "./types";
import { DEFAULT_THEME_ID, getTheme, themeMetas } from "./registry";
import { themeToCssVars } from "./vars";
import { sharedTokens } from "./default";

const STORAGE_KEY = "ecom.theme.id";

interface ThemeContextValue {
  theme: Theme;
  themeId: string;
  themes: ThemeMeta[];
  setTheme: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function buildRootCss(theme: Theme): string {
  const vars = { ...themeToCssVars(theme), ...sharedTokensToVars() };
  const decls = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");
  return `:root {\n${decls}\n}\n`;
}

function sharedTokensToVars(): Record<string, string> {
  const v: Record<string, string> = {};
  const t = sharedTokens.typography;
  v["--font-sans"] = t.fontFamily.sans;
  v["--font-latin"] = t.fontFamily.latin;
  v["--font-mono"] = t.fontFamily.mono;
  for (const k of Object.keys(t.scale)) v[`--text-${k}`] = t.scale[k as keyof typeof t.scale];
  v["--font-regular"] = String(t.weights.regular);
  v["--font-medium"] = String(t.weights.medium);
  v["--font-semibold"] = String(t.weights.semibold);
  v["--font-bold"] = String(t.weights.bold);
  v["--leading-tight"] = String(t.lineHeight.tight);
  v["--leading-snug"] = String(t.lineHeight.snug);
  v["--leading-normal"] = String(t.lineHeight.normal);
  v["--leading-relaxed"] = String(t.lineHeight.relaxed);

  for (const [k, value] of Object.entries(sharedTokens.spacing)) v[`--space-${k}`] = value;
  for (const [k, value] of Object.entries(sharedTokens.radius)) v[`--radius-${k}`] = value;
  for (const [k, value] of Object.entries(sharedTokens.shadows)) v[`--shadow-${k}`] = value;
  for (const [k, value] of Object.entries(sharedTokens.motion.duration)) v[`--duration-${k}`] = value;
  for (const [k, value] of Object.entries(sharedTokens.motion.easing)) v[`--ease-${k}`] = value;
  for (const [k, value] of Object.entries(sharedTokens.container)) v[`--container-${k}`] = value;
  v["--header-height-desktop"] = sharedTokens.layout.headerHeightDesktop;
  v["--header-height-mobile"] = sharedTokens.layout.headerHeightMobile;
  v["--admin-sidebar-width"] = sharedTokens.layout.adminSidebarWidth;
  v["--admin-topbar-height"] = sharedTokens.layout.adminTopbarHeight;
  for (const k of Object.keys(sharedTokens.zIndex))
    v[`--z-${k}`] = String(sharedTokens.zIndex[k as keyof typeof sharedTokens.zIndex]);
  return v;
}

function readStoredTheme(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

// Start from the SSR default so the inline token stylesheet is identical while
// React hydrates. The visitor's stored choice is restored immediately after.
let clientThemeId = DEFAULT_THEME_ID;
const themeListeners = new Set<() => void>();

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => themeListeners.delete(listener);
}

function getClientThemeId() {
  return clientThemeId;
}

function setClientThemeId(id: string) {
  const nextThemeId = getTheme(id).id;
  if (nextThemeId === clientThemeId) return;
  clientThemeId = nextThemeId;
  themeListeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useSyncExternalStore(
    subscribeTheme,
    getClientThemeId,
    () => DEFAULT_THEME_ID,
  );
  const theme = useMemo(() => getTheme(themeId), [themeId]);

  useEffect(() => {
    setClientThemeId(readStoredTheme());
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("dir", theme.direction);
    html.setAttribute("lang", theme.direction === "rtl" ? "fa" : "en");
    html.setAttribute("data-theme", theme.id);
    html.setAttribute("data-mode", theme.mode);
  }, [theme]);

  const setTheme = useCallback((id: string) => {
    const nextThemeId = getTheme(id).id;
    setClientThemeId(nextThemeId);
    try { window.localStorage.setItem(STORAGE_KEY, nextThemeId); } catch { /* ignore */ }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, themeId, themes: themeMetas, setTheme }),
    [theme, themeId, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <style
        id="theme-vars"
        dangerouslySetInnerHTML={{ __html: buildRootCss(theme) }}
      />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
