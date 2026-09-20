import type { Theme, ThemeMeta } from "./types";
import { defaultTheme } from "./default";
import { midnightTheme } from "./midnight";

/**
 * Theme registry — single source of truth.
 * To ship a new storefront: drop a Theme object here. No component changes.
 */
// The visual identity is fixed; users can only choose its accessible light/dark modes.
export const themes: Theme[] = [defaultTheme, midnightTheme];

export const themeRegistry: Record<string, Theme> = Object.fromEntries(
  themes.map((t) => [t.id, t]),
);

export const themeMetas: ThemeMeta[] = themes.map((t) => ({
  id: t.id,
  name: t.name,
  description: t.description,
  mode: t.mode,
  swatch: {
    primary: t.colors.primary,
    surface: t.colors.surface,
    foreground: t.colors.foreground,
  },
}));

export const DEFAULT_THEME_ID = defaultTheme.id;

export function getTheme(id: string | undefined | null): Theme {
  if (id && themeRegistry[id]) return themeRegistry[id];
  return defaultTheme;
}
