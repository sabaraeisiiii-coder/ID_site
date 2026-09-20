import * as React from "react";
import { cn } from "@/lib/utils";
import type { StockStatus } from "../types";

/**
 * StockBadge — inventory status pill (re-export of shared StockStatusBadge).
 * Kept here for domain cohesion; uses shared component.
 */
import { StockStatusBadge } from "@/components/shared/status-badge";
export { StockStatusBadge };
