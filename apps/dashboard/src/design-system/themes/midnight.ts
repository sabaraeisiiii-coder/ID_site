import type { Theme } from "./types";
import { defaultTheme } from "./default";

/**
 * Midnight — dark variant of default.
 * Surfaces inverted, brand brightened for contrast.
 */
export const midnightTheme: Theme = {
  ...defaultTheme,
  id: "midnight",
  name: "میان‌شب",
  description: "نسخه تیره‌ی تم پیش‌فرض",
  mode: "dark",
  colors: {
    ...defaultTheme.colors,

    background: "#0C111D",
    backgroundSubtle: "#10172A",
    surface: "#161D30",
    surfaceSecondary: "#1D2540",
    surfaceTertiary: "#283252",
    foreground: "#F2F4F7",
    foregroundSecondary: "#98A2B3",
    foregroundTertiary: "#667085",
    foregroundDisabled: "#475467",
    border: "#283252",
    borderHover: "#3B476B",
    borderStrong: "#475467",

    primary: "#7B86FF",
    primaryHover: "#A3ACFF",
    primaryActive: "#C6CEFF",
    primaryForeground: "#0C111D",

    priceCurrent: "#FFFFFF",
    priceOld: "#98A2B3",
    discountBg: "rgba(244,63,94,.12)",
    discountText: "#FF6B6B",
    stockInBg: "rgba(18,183,106,.12)",
    stockInText: "#3FD68B",
    stockLowBg: "rgba(247,144,9,.12)",
    stockLowText: "#FFB049",
    stockOutBg: "rgba(255,255,255,.06)",
    stockOutText: "#98A2B3",
  },
};
