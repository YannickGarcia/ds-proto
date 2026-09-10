"use client";

import {
  Info,
  ShareNetwork,
} from "@/components/icons";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { monthTicks } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-1">
      <h2 className="text-heading-20 text-pretty text-[var(--ds-gray-1000)]">
        {title}
      </h2>
      <p className="text-copy-14 text-pretty text-[var(--ds-gray-900)]">
        {subtitle}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Chart card — composed from named parts rather than configured with props    */
/* -------------------------------------------------------------------------- */

/**
 * `order` places the card in the page's entrance sequence; the KPI row takes
 * indices 0–5, so chart cards continue from there.
 */
export function ChartCard({
  className,
  order = 0,
  style,
  ...props
}: ComponentProps<"div"> & { order?: number }) {
  return (
    <Card
      className={cn("animate-enter overflow-hidden", className)}
      style={{ ...style, ["--i" as string]: 6 + order }}
      {...props}
    />
  );
}

export function ChartCardHeader({
  title,
  children,
}: {
  title: string;
  /** Header-right controls, rendered before the share and info actions. */
  children?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-2">
      <h3 className="max-w-[52ch] min-w-0 text-heading-14 text-balance text-[var(--ds-gray-1000)]">
        {title}
      </h3>
      <div className="flex shrink-0 items-center gap-1.5">{children}</div>
    </div>
  );
}

export function ShareAction({ label }: { label: string }) {
  return (
    <Tooltip content={label}>
      <Button
        variant="tertiary"
        shape="square"
        aria-label={label}
        className="touch-manipulation"
      >
        <ShareNetwork aria-hidden="true" />
      </Button>
    </Tooltip>
  );
}

export function InfoAction({ children }: { children: ReactNode }) {
  return (
    <Tooltip content={children} side="top" align="end">
      <button
        type="button"
        aria-label="About this metric"
        className={cn(
          "inline-flex size-8 touch-manipulation items-center justify-center rounded-[var(--radius)]",
          "text-[var(--ds-gray-700)] outline-none transition-colors duration-150",
          "hover:bg-[var(--ds-gray-alpha-200)] hover:text-[var(--ds-gray-1000)]",
          "focus-visible:shadow-[var(--ds-focus-ring)]",
        )}
      >
        <Info className="size-3.5" aria-hidden="true" />
      </button>
    </Tooltip>
  );
}

export function ChartCardHeadline({
  value,
  children,
}: {
  value: ReactNode;
  /** Sub-line rendered on the same baseline, e.g. a weekly average. */
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 px-5 pb-4">
      <span className="tabular-nums text-heading-16 text-pretty text-[var(--ds-gray-1000)]">
        {value}
      </span>
      {children ? (
        <span className="text-copy-13 text-[var(--ds-gray-900)]">
          {children}
        </span>
      ) : null}
    </div>
  );
}

export function ChartCardBody({ className, ...props }: ComponentProps<"div">) {
  return <CardContent className={cn("px-5 pb-5", className)} {...props} />;
}

export function ChartCardFooter({ className, ...props }: ComponentProps<"div">) {
  return <CardFooter className={cn("text-pretty", className)} {...props} />;
}

/* -------------------------------------------------------------------------- */
/* Shared chart chrome                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Month tick row for the weekly charts. Bklit's `BarXAxis` labels every nth
 * bar; these charts want calendar months instead.
 */
export function MonthAxis({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mt-2 h-4 select-none text-[var(--ds-gray-900)]",
        className,
      )}
      aria-hidden="true"
    >
      {monthTicks.map((tick, index) => (
        <span
          key={`${tick.label}-${index}`}
          className="absolute -translate-x-1/2 text-[11px] leading-4"
          style={{ left: `${tick.offset * 100}%` }}
        >
          {tick.label}
        </span>
      ))}
    </div>
  );
}

export interface LegendItem {
  label: string;
  color: string;
  value?: string;
  /** Rendered as a dashed rule instead of a swatch, e.g. a benchmark. */
  dashed?: boolean;
}

export function ChartLegend({
  items,
  className,
}: {
  items: LegendItem[];
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-1.5 text-label-12 text-[var(--ds-gray-900)]"
        >
          {item.dashed ? (
            <span
              className="h-0 w-3 shrink-0 border-t border-dashed"
              style={{ borderColor: item.color }}
              aria-hidden="true"
            />
          ) : (
            <span
              className="size-2 shrink-0 rounded-[2px]"
              style={{ background: item.color }}
              aria-hidden="true"
            />
          )}
          <span className="min-w-0 truncate">{item.label}</span>
          {item.value ? (
            <span className="tabular-nums text-[var(--ds-gray-1000)]">
              {item.value}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
