"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Lightweight pointer-driven liquid highlight for large editorial imagery. */
export function LiquidImageFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--liquid-x", `${((event.clientX - box.left) / box.width) * 100}%`);
    ref.current.style.setProperty("--liquid-y", `${((event.clientY - box.top) / box.height) * 100}%`);
  };
  return <div ref={ref} onPointerMove={move} className={cn("liquid-image-frame", className)}>{children}</div>;
}
