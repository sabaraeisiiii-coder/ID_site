import * as React from "react";
import { cn } from "@/lib/utils";

/* ---------- Container ---------- */

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "default";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  bleed?: boolean;
  as?: React.ElementType;
}

const containerClass: Record<ContainerSize, string> = {
  sm: "mx-auto px-6",
  md: "mx-auto px-6",
  lg: "mx-auto px-6",
  xl: "mx-auto px-6",
  default: "mx-auto px-6",
};

const containerStyle: Record<ContainerSize, React.CSSProperties> = {
  sm: { maxWidth: "var(--container-sm)" },
  md: { maxWidth: "var(--container-md)" },
  lg: { maxWidth: "var(--container-lg)" },
  xl: { maxWidth: "var(--container-2xl)" },
  default: { maxWidth: "var(--container-default)" },
};

export function Container({
  size = "default", bleed = false, as: Tag = "div", className, style, ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(!bleed && containerClass[size], className)}
      style={{ ...(!bleed && containerStyle[size]), ...style }}
      {...props}
    />
  );
}

/* ---------- Section ---------- */

export type SectionSpacing = "sm" | "md" | "lg" | "xl";

const sectionSpacing: Record<SectionSpacing, string> = {
  sm: "py-8 sm:py-10",
  md: "py-12 sm:py-14",
  lg: "py-16 sm:py-20",
  xl: "py-20 sm:py-24 md:py-28",
};

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: SectionSpacing;
  containerSize?: ContainerSize;
  bleed?: boolean;
  as?: React.ElementType;
}

export function Section({
  spacing = "lg", containerSize = "default", bleed = false, as: Tag = "section",
  className, children, ...props
}: SectionProps) {
  return (
    <Tag className={cn(sectionSpacing[spacing], className)} {...props}>
      {bleed ? children : <Container size={containerSize}>{children}</Container>}
    </Tag>
  );
}

/* ---------- Stack (vertical flex) ---------- */

export type Gap = 0 | 0.5 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 14 | 16 | 20 | 24;

const gapClass: Record<Gap, string> = {
  0: "gap-0", 0.5: "gap-0.5", 1: "gap-1", 2: "gap-2", 3: "gap-3", 4: "gap-4", 5: "gap-5", 6: "gap-6",
  8: "gap-8", 10: "gap-10", 12: "gap-12", 14: "gap-14", 16: "gap-16",
  20: "gap-20", 24: "gap-24",
};

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  as?: React.ElementType;
}

export function Stack({
  gap = 4, align = "stretch", justify = "start", as: Tag = "div",
  className, children, ...props
}: StackProps) {
  return (
    <Tag
      className={cn(
        "flex flex-col",
        gapClass[gap],
        align === "start" && "items-start",
        align === "center" && "items-center",
        align === "end" && "items-end",
        align === "stretch" && "items-stretch",
        justify === "start" && "justify-start",
        justify === "center" && "justify-center",
        justify === "end" && "justify-end",
        justify === "between" && "justify-between",
        justify === "around" && "justify-around",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ---------- Inline (horizontal flex) ---------- */

export interface InlineProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: Gap;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  as?: React.ElementType;
}

export function Inline({
  gap = 3, align = "center", justify = "start", wrap = true, as: Tag = "div",
  className, children, ...props
}: InlineProps) {
  return (
    <Tag
      className={cn(
        "flex flex-row",
        gapClass[gap],
        align === "start" && "items-start",
        align === "center" && "items-center",
        align === "end" && "items-end",
        align === "stretch" && "items-stretch",
        justify === "start" && "justify-start",
        justify === "center" && "justify-center",
        justify === "end" && "justify-end",
        justify === "between" && "justify-between",
        justify === "around" && "justify-around",
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ---------- Grid ---------- */

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12;
const colsClass: Record<GridCols, string> = {
  1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4",
  5: "grid-cols-5", 6: "grid-cols-6", 12: "grid-cols-12",
};

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
  colsSm?: GridCols;
  colsMd?: GridCols;
  colsLg?: GridCols;
  colsXl?: GridCols;
  gap?: Gap;
  as?: React.ElementType;
}

export function Grid({
  cols = 2, colsSm, colsMd, colsLg, colsXl, gap = 4, as: Tag = "div",
  className, children, ...props
}: GridProps) {
  return (
    <Tag
      className={cn(
        "grid",
        colsClass[cols],
        colsSm && `sm:${colsClass[colsSm]}`,
        colsMd && `md:${colsClass[colsMd]}`,
        colsLg && `lg:${colsClass[colsLg]}`,
        colsXl && `xl:${colsClass[colsXl]}`,
        gapClass[gap],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ---------- Box ---------- */

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

export function Box({ as: Tag = "div", className, children, ...props }: BoxProps) {
  return <Tag className={className} {...props}>{children}</Tag>;
}
