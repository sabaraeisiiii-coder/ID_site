import type { Theme } from "./types";
import {
  neutral, brand, success, warning, error, info,
  typography, spacing, radius, shadows, motion, container, layout, zIndex,
} from "../tokens/index";

/**
 * Default theme — clean, modern, light.
 * Refined neutral + a deep blue-violet brand (NOT Tailwind-default indigo).
 */

const typographyMotion = {
  fontFamily: typography.fontFamily,
  scale: typography.scale,
  weights: typography.weights,
  lineHeight: typography.lineHeight,
  letterSpacing: typography.letterSpacing,
};
void typographyMotion; // typography/motion/etc attached as CSS vars in globals.css

export const defaultTheme: Theme = {
  id: "default",
  name: "پیش‌فرض",
  description: "روشن، مدرن، مینیمال",
  mode: "light",
  direction: "rtl",
  colors: {
    neutral, brand, success, warning, error, info,

    background: "#FFFFFF",
    backgroundSubtle: "#F9FAFB",
    surface: "#FFFFFF",
    surfaceSecondary: "#F2F4F7",
    surfaceTertiary: "#E4E7EC",
    foreground: "#101828",
    foregroundSecondary: "#475467",
    foregroundTertiary: "#667085",
    foregroundDisabled: "#98A2B3",
    border: "#E4E7EC",
    borderHover: "#D0D5DD",
    borderStrong: "#98A2B3",

    primary: "#3A2BB8",
    primaryHover: "#2F2491",
    primaryActive: "#241D70",
    primaryForeground: "#FFFFFF",

    priceCurrent: "#0C111D",
    priceOld: "#667085",
    discountBg: "#FEF3F2",
    discountText: "#B42318",
    stockInBg: "#ECFDF3",
    stockInText: "#027A48",
    stockLowBg: "#FFFAEB",
    stockLowText: "#B54708",
    stockOutBg: "#F2F4F7",
    stockOutText: "#475467",
  },
};

/* Expose non-color tokens too so the registry can publish them as CSS vars. */
export const sharedTokens = {
  typography, spacing, radius, shadows, motion, container, layout, zIndex,
};
