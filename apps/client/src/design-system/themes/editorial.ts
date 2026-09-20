import type { Theme } from "./types";

/**
 * Editorial — warm, magazine-style, Scandinavian minimal.
 * Off-white background, charcoal primary, slightly tighter radii.
 * Proves the system is multi-theme capable: NO component code changes.
 */
export const editorialTheme: Theme = {
  id: "editorial",
  name: "ادیتوریال",
  description: "گرم، اسکاندیناوی، مینیمال",
  mode: "light",
  direction: "rtl",
  colors: {
    neutral: {
      0: "#FFFFFF",
      25: "#FCFAF7",
      50: "#F7F4EF",
      100: "#F0EBE3",
      200: "#E3DCD0",
      300: "#CFC6B6",
      400: "#A89F8E",
      500: "#7B7364",
      600: "#5A5347",
      700: "#3F3A32",
      800: "#262320",
      900: "#17150F",
      950: "#0C0B08",
    },
    brand: {
      50: "#FAF8F4",
      100: "#F1ECE3",
      200: "#E0D5C2",
      300: "#C9B894",
      400: "#A8946A",
      500: "#7B6A4D",
      600: "#5A4F3B",
      700: "#3F3729",
      800: "#26211A",
      900: "#17140F",
      950: "#0C0A07",
    },
    success: {
      50: "#ECFDF3", 100: "#D1FADF", 200: "#A6F4C5", 300: "#6CE9A6",
      400: "#32D583", 500: "#12B76A", 600: "#039855", 700: "#027A48",
      800: "#05603A", 900: "#054F31",
    },
    warning: {
      50: "#FFFAEB", 100: "#FEF0C7", 200: "#FEDF89", 300: "#FEC84B",
      400: "#FDB022", 500: "#F79009", 600: "#DC6803", 700: "#B54708",
      800: "#93370D", 900: "#7A2E0E",
    },
    error: {
      50: "#FEF3F2", 100: "#FEE4E2", 200: "#FECDCA", 300: "#FDA29B",
      400: "#F97066", 500: "#F04438", 600: "#D92D20", 700: "#B42318",
      800: "#912018", 900: "#7A271A",
    },
    info: {
      50: "#EFF8FF", 100: "#D1E9FF", 200: "#B2DDFF", 300: "#84CAFF",
      400: "#53B1FD", 500: "#2E90FA", 600: "#1570EF", 700: "#175CD3",
      800: "#1945A6", 900: "#12357E",
    },

    background: "#FCFAF7",
    backgroundSubtle: "#F7F4EF",
    surface: "#FFFFFF",
    surfaceSecondary: "#F7F4EF",
    surfaceTertiary: "#F0EBE3",
    foreground: "#17150F",
    foregroundSecondary: "#5A5347",
    foregroundTertiary: "#7B7364",
    foregroundDisabled: "#A89F8E",
    border: "#E3DCD0",
    borderHover: "#CFC6B6",
    borderStrong: "#A89F8E",

    primary: "#17150F",
    primaryHover: "#262320",
    primaryActive: "#3F3A32",
    primaryForeground: "#FCFAF7",

    priceCurrent: "#17150F",
    priceOld: "#7B7364",
    discountBg: "#FEE4E2",
    discountText: "#B42318",
    stockInBg: "#ECFDF3",
    stockInText: "#027A48",
    stockLowBg: "#FFFAEB",
    stockLowText: "#B54708",
    stockOutBg: "#F0EBE3",
    stockOutText: "#7B7364",
  },
};
