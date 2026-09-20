/**
 * Theme type — a fully self-contained visual identity.
 * Switching the active theme re-renders all CSS variables, so components
 * never hard-code visual values.
 */

export type Direction = "rtl" | "ltr";
export type ThemeMode = "light" | "dark";

export type ColorScale = Record<string, string>;

export interface ThemeColors {
  /* Primitives */
  neutral: ColorScale;
  brand: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  error: ColorScale;
  info: ColorScale;

  /* Semantic */
  background: string;
  backgroundSubtle: string;
  surface: string;
  surfaceSecondary: string;
  surfaceTertiary: string;
  foreground: string;
  foregroundSecondary: string;
  foregroundTertiary: string;
  foregroundDisabled: string;
  border: string;
  borderHover: string;
  borderStrong: string;

  /* Brand semantic */
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primaryForeground: string;

  /* Commerce */
  priceCurrent: string;
  priceOld: string;
  discountBg: string;
  discountText: string;
  stockInBg: string;
  stockInText: string;
  stockLowBg: string;
  stockLowText: string;
  stockOutBg: string;
  stockOutText: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  mode: ThemeMode;
  direction: Direction;
  colors: ThemeColors;
}

export interface ThemeMeta {
  id: string;
  name: string;
  description: string;
  mode: ThemeMode;
  swatch: { primary: string; surface: string; foreground: string };
}
