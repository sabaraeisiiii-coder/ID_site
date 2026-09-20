/**
 * Primitive color palettes.
 * --------------------------------------------------------------------
 * These are RAW values — never consumed directly by components.
 * Components read semantic tokens (--background, --primary, ...) which
 * a Theme maps to entries in these scales.
 *
 * Each palette is a 50→950 (or 50→900) scale.
 */

export const neutral = {
  0: "#FFFFFF",
  25: "#FCFCFD",
  50: "#F9FAFB",
  100: "#F2F4F7",
  200: "#E4E7EC",
  300: "#D0D5DD",
  400: "#98A2B3",
  500: "#667085",
  600: "#475467",
  700: "#344054",
  800: "#1D2939",
  900: "#101828",
  950: "#0C111D",
} as const;

/** Cool indigo-free brand: a deep blue-violet that reads premium, not Tailwind-default. */
export const brand = {
  50: "#EEF0FF",
  100: "#E0E5FF",
  200: "#C6CEFF",
  300: "#A3ACFF",
  400: "#7B86FF",
  500: "#5C68F5",
  600: "#4534E0",
  700: "#3A2BB8",
  800: "#2F2491",
  900: "#241D70",
  950: "#191250",
} as const;

export const success = {
  50: "#ECFDF3",
  100: "#D1FADF",
  200: "#A6F4C5",
  300: "#6CE9A6",
  400: "#32D583",
  500: "#12B76A",
  600: "#039855",
  700: "#027A48",
  800: "#05603A",
  900: "#054F31",
} as const;

export const warning = {
  50: "#FFFAEB",
  100: "#FEF0C7",
  200: "#FEDF89",
  300: "#FEC84B",
  400: "#FDB022",
  500: "#F79009",
  600: "#DC6803",
  700: "#B54708",
  800: "#93370D",
  900: "#7A2E0E",
} as const;

export const error = {
  50: "#FEF3F2",
  100: "#FEE4E2",
  200: "#FECDCA",
  300: "#FDA29B",
  400: "#F97066",
  500: "#F04438",
  600: "#D92D20",
  700: "#B42318",
  800: "#912018",
  900: "#7A271A",
} as const;

export const info = {
  50: "#EFF8FF",
  100: "#D1E9FF",
  200: "#B2DDFF",
  300: "#84CAFF",
  400: "#53B1FD",
  500: "#2E90FA",
  600: "#1570EF",
  700: "#175CD3",
  800: "#1945A6",
  900: "#12357E",
} as const;

export type ColorScale = typeof neutral;
