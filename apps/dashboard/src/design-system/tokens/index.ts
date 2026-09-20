/**
 * Design tokens — primitive scales.
 * Exported individually and consumed by themes + the global CSS var publisher.
 */

// Colors (re-exported from colors.ts)
export { neutral, brand, success, warning, error, info, type ColorScale } from "./colors";

/** Typography scale. */
export const typography = {
  fontFamily: {
    sans: 'var(--font-vazirmatn), "IRANSansX", "Peyda", "Inter", system-ui, sans-serif',
    latin: '"Inter", var(--font-vazirmatn), system-ui, sans-serif',
    mono: 'ui-monospace, "SF Mono", Menlo, monospace',
  },
  scale: {
    xs: "12px", sm: "14px", md: "16px", lg: "18px", xl: "20px",
    "2xl": "24px", "3xl": "30px", "4xl": "36px", "5xl": "48px", "6xl": "60px",
  },
  weights: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  lineHeight: { tight: 1.2, snug: 1.4, normal: 1.6, relaxed: 1.8 },
  letterSpacing: { tight: "-0.02em", normal: "0", wide: "0.02em" },
} as const;

/** Spacing scale (4px base). */
export const spacing = {
  0: "0", 1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "20px", 6: "24px",
  8: "32px", 10: "40px", 12: "48px", 14: "56px", 16: "64px", 20: "80px",
  24: "96px", 32: "128px",
} as const;

/** Radius scale. */
export const radius = {
  xs: "4px", sm: "6px", md: "8px", lg: "12px", xl: "16px",
  "2xl": "20px", "3xl": "24px", full: "9999px",
} as const;

/** Shadow scale. */
export const shadows = {
  xs: "0 1px 2px rgba(16,24,40,.05)",
  sm: "0 1px 3px rgba(16,24,40,.10), 0 1px 2px rgba(16,24,40,.06)",
  md: "0 4px 8px -2px rgba(16,24,40,.10), 0 2px 4px -2px rgba(16,24,40,.06)",
  lg: "0 12px 16px -4px rgba(16,24,40,.08), 0 4px 6px -2px rgba(16,24,40,.03)",
  xl: "0 20px 24px -4px rgba(16,24,40,.08), 0 8px 8px -4px rgba(16,24,40,.03)",
} as const;

/** Motion tokens. */
export const motion = {
  duration: { fast: "120ms", normal: "200ms", slow: "300ms", enter: "240ms", exit: "180ms" },
  easing: {
    standard: "cubic-bezier(.2,0,0,1)",
    enter: "cubic-bezier(0,0,.2,1)",
    exit: "cubic-bezier(.4,0,1,1)",
  },
} as const;

/** Container sizes. */
export const container = {
  sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1440px",
  default: "1280px", paddingInline: "24px",
} as const;

/** Layout dimensions. */
export const layout = {
  headerHeightDesktop: "72px",
  headerHeightMobile: "60px",
  adminSidebarWidth: "256px",
  adminSidebarCollapsed: "72px",
  adminTopbarHeight: "60px",
} as const;

/** z-index scale. */
export const zIndex = {
  base: 0, dropdown: 100, sticky: 200, overlay: 300,
  drawer: 400, modal: 500, toast: 600, tooltip: 700,
} as const;

/** Breakpoints. */
export const breakpoints = {
  sm: "640px", md: "768px", lg: "1024px", xl: "1280px", "2xl": "1536px",
} as const;
