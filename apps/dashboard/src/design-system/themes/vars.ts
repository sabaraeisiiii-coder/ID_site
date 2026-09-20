/**
 * Theme → CSS Variables converter.
 * Publishes color tokens only; spacing/radius/etc. come from sharedTokens.
 */

import type { Theme } from "./types";

type Vars = Record<string, string>;

function pushScale(out: Vars, prefix: string, scale: Record<string, string>): void {
  for (const k of Object.keys(scale)) out[prefix + k] = scale[k];
}

export function themeToCssVars(theme: Theme): Vars {
  const v: Vars = {};
  const c = theme.colors;

  pushScale(v, "--color-neutral-", c.neutral);
  pushScale(v, "--color-brand-", c.brand);
  pushScale(v, "--color-success-", c.success);
  pushScale(v, "--color-warning-", c.warning);
  pushScale(v, "--color-error-", c.error);
  pushScale(v, "--color-info-", c.info);

  v["--background"] = c.background;
  v["--background-subtle"] = c.backgroundSubtle;
  v["--surface"] = c.surface;
  v["--surface-secondary"] = c.surfaceSecondary;
  v["--surface-tertiary"] = c.surfaceTertiary;
  v["--foreground"] = c.foreground;
  v["--foreground-secondary"] = c.foregroundSecondary;
  v["--foreground-tertiary"] = c.foregroundTertiary;
  v["--foreground-disabled"] = c.foregroundDisabled;
  v["--border"] = c.border;
  v["--border-hover"] = c.borderHover;
  v["--border-strong"] = c.borderStrong;

  v["--primary"] = c.primary;
  v["--primary-hover"] = c.primaryHover;
  v["--primary-active"] = c.primaryActive;
  v["--primary-foreground"] = c.primaryForeground;

  v["--price-current"] = c.priceCurrent;
  v["--price-old"] = c.priceOld;
  v["--discount-bg"] = c.discountBg;
  v["--discount-text"] = c.discountText;
  v["--stock-in-bg"] = c.stockInBg;
  v["--stock-in-text"] = c.stockInText;
  v["--stock-low-bg"] = c.stockLowBg;
  v["--stock-low-text"] = c.stockLowText;
  v["--stock-out-bg"] = c.stockOutBg;
  v["--stock-out-text"] = c.stockOutText;

  return v;
}
