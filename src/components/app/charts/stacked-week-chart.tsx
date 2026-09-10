"use client";

import type { ReactNode } from "react";
import { MonthAxis } from "@/components/app/chart-card";
import { Bar } from "@/components/charts/bar";
import { BarChart } from "@/components/charts/bar-chart";
import { Grid } from "@/components/charts/grid";
import { ChartTooltip } from "@/components/charts/tooltip";

export interface StackedSeries {
  key: string;
  label: string;
  color: string;
  /** Formats the value shown in the tooltip row. */
  format: (value: number) => string;
}

type Point = Record<string, unknown>;

interface BaseProps {
  data: Point[];
  series: StackedSeries[];
  aspectRatio?: string;
  /** Optional summary row rendered above the per-series rows. */
  totalRow?: (point: Point) => { label: string; value: string };
}

function tooltipRows(series: StackedSeries[], totalRow?: BaseProps["totalRow"]) {
  return (point: Point) => {
    const rows = series
      .filter((item) => Number(point[item.key] ?? 0) > 0)
      .reverse()
      .map((item) => ({
        color: item.color,
        label: item.label,
        value: item.format(Number(point[item.key] ?? 0)),
      }));

    if (!totalRow) return rows;
    const total = totalRow(point);
    return [
      { color: "var(--ds-gray-1000)", label: total.label, value: total.value },
      ...rows,
    ];
  };
}

/**
 * Bklit discovers series by walking `BarChart`'s direct children, so the bars
 * must be an inline array rather than a wrapper component.
 */
function stackedBars(series: StackedSeries[]) {
  return series.map((item) => (
    <Bar
      key={item.key}
      dataKey={item.key}
      fill={item.color}
      lineCap={2}
      fadedOpacity={0.25}
    />
  ));
}

/**
 * Weekly stacked bars over ~12 months, in the chart's own unit (points, $,
 * $/pt). Series stack bottom-up in the order they are given.
 */
export function StackedWeekChart({
  data,
  series,
  aspectRatio = "3.4 / 1",
  totalRow,
}: BaseProps) {
  return (
    <div>
      <BarChart
        data={data}
        xDataKey="label"
        stacked
        stackGap={1}
        barGap={0.28}
        aspectRatio={aspectRatio}
        margin={{ top: 8, right: 0, bottom: 4, left: 0 }}
      >
        <Grid horizontal numTicksRows={4} hideHorizontalEdgeLines />
        {stackedBars(series)}
        <ChartTooltip
          showDatePill
          dotSize={4}
          rows={tooltipRows(series, totalRow)}
        />
      </BarChart>
      <MonthAxis />
    </div>
  );
}

/**
 * Weekly 100%-stacked bars. Values are already normalised to percentages, so
 * the stack fills the plot and no gridlines are drawn.
 */
export function PercentStackedWeekChart({
  data,
  series,
  aspectRatio = "3.4 / 1",
  totalRow,
  children,
}: BaseProps & {
  /** Overlays drawn on top of the plot, e.g. a benchmark rule. */
  children?: ReactNode;
}) {
  return (
    <div>
      <div className="relative">
        <BarChart
          data={data}
          xDataKey="label"
          stacked
          valueDomainMax={PERCENT_DOMAIN_MAX}
          barGap={0.28}
          aspectRatio={aspectRatio}
          margin={{ top: 8, right: 0, bottom: 4, left: 0 }}
        >
          {stackedBars(series)}
          <ChartTooltip
            showDatePill
            dotSize={4}
            rows={tooltipRows(series, totalRow)}
          />
        </BarChart>
        {children}
      </div>
      <MonthAxis />
    </div>
  );
}

/** 100%-stacked charts fill the plot exactly — no headroom above the stack. */
const PERCENT_DOMAIN_MAX = 100;

/**
 * Dashed benchmark rule. Sits inside `PercentStackedWeekChart` and matches its
 * 8px top / 4px bottom margin, mapped onto the chart's own y-domain.
 */
export function BenchmarkRule({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0"
      style={{ top: 8, bottom: 4 }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-x-0 flex items-center"
        style={{ bottom: `${(value / PERCENT_DOMAIN_MAX) * 100}%` }}
      >
        <span className="h-0 flex-1 border-t border-dashed border-[var(--ds-gray-alpha-600)]" />
        <span className="ml-2 rounded-[4px] bg-[var(--ds-surface-secondary)] px-1.5 py-0.5 text-[11px] leading-4 text-[var(--ds-gray-900)]">
          {label}
        </span>
      </div>
    </div>
  );
}
