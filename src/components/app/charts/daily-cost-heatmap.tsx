"use client";

/*
 * `PeriodColumnHighlight` portals into the chart container ref during render,
 * mirroring Bklit's own `HeatmapXAxis` / `HeatmapYAxis`. The `useMounted()`
 * gate makes the first client render match the server, so the ref is only ever
 * read once the container exists.
 */
/* eslint-disable react-hooks/refs */

import { useMemo } from "react";
import { createPortal } from "react-dom";
import {
  HeatmapCells,
  HeatmapChart,
  type HeatmapColumn,
  HeatmapInteractionRoot,
  HeatmapTooltip,
  HeatmapXAxis,
  HeatmapYAxis,
  useHeatmap,
} from "@/components/charts/heatmap";
import { HEAT_BUCKETS, heatmapForYear } from "@/lib/data";
import { useMounted } from "@/lib/use-mounted";

const dayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/**
 * Bklit keys cells by bucket level, so `count` carries the level (0–5) and the
 * dollar amount is looked up by date for the tooltip.
 */
const fillScale = (level: number | null | undefined) =>
  HEAT_BUCKETS[Math.max(0, Math.min(5, Math.round(level ?? 0)))].cssVar;

/**
 * Outlines the week column covered by the selected period. Positioned from
 * Bklit's own heatmap geometry, the same way `HeatmapXAxis` places its ticks.
 */
function PeriodColumnHighlight({ columnIndex }: { columnIndex: number }) {
  const { containerRef, margin, xScale, yScale, binWidth, binHeight, gap } =
    useHeatmap();
  const mounted = useMounted();
  const container = containerRef.current;
  if (!(mounted && container) || columnIndex < 0 || binWidth <= 0) return null;

  // `binWidth` / `binHeight` are the grid step, so the drawn cell is one gap
  // smaller than the step.
  const cellWidth = binWidth - gap;
  const cellHeight = binHeight - gap;
  const inset = 3;

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none absolute rounded-[5px] ring-1 ring-[var(--ds-gray-1000)]"
      style={{
        left: margin.left + xScale(columnIndex) - inset,
        top: margin.top + yScale(0) - inset,
        width: cellWidth + inset * 2,
        height: yScale(6) - yScale(0) + cellHeight + inset * 2,
      }}
    />,
    container,
  );
}

/**
 * GitHub-style year heatmap of daily AI spend: one column per week, one row
 * per weekday, coloured by spend bucket.
 */
export function DailyCostHeatmap({
  year,
  highlightWeekStart,
}: {
  year: number;
  /** ISO date (YYYY-MM-DD) of the Monday whose column should be outlined. */
  highlightWeekStart?: string;
}) {
  const { columns, highlightIndex, costByDate } = useMemo(() => {
    const days = heatmapForYear(year);
    const built: HeatmapColumn[] = [];
    const costs = new Map<number, number>();
    let column: HeatmapColumn | null = null;
    let index = -1;
    let matchIndex = -1;

    for (const day of days) {
      const weekday = day.date.getUTCDay();
      if (!column || weekday === 1) {
        index += 1;
        column = { bin: index, bins: [] };
        built.push(column);
        if (
          highlightWeekStart &&
          day.date.toISOString().slice(0, 10) === highlightWeekStart
        ) {
          matchIndex = index;
        }
      }
      column.bins.push({ count: day.level, bin: weekday, date: day.date });
      costs.set(day.date.getTime(), day.cost);
    }

    return { columns: built, highlightIndex: matchIndex, costByDate: costs };
  }, [year, highlightWeekStart]);

  const formatLabel = (level: number, date: Date) => {
    const bucket = HEAT_BUCKETS[Math.round(level)]?.label ?? "No usage";
    const cost = costByDate.get(date.getTime()) ?? 0;
    if (level <= 1) return `${bucket} · ${dayFormatter.format(date)}`;
    return `${currencyFormatter.format(cost)} · ${bucket}`;
  };

  return (
    <HeatmapInteractionRoot>
      <div className="no-scrollbar overflow-x-auto pt-1 pb-1">
        <div className="min-w-[780px]">
          <HeatmapChart
            data={columns}
            layout="fluid"
            gap={3}
            weekStartDay={1}
            fillScale={fillScale}
            colorScale={fillScale}
            margin={{ top: 24, right: 8, bottom: 0, left: 34 }}
          >
            <HeatmapCells />
            <HeatmapXAxis />
            <HeatmapYAxis labelFormat="full" />
            <HeatmapTooltip formatLabel={formatLabel} />
            <PeriodColumnHighlight columnIndex={highlightIndex} />
          </HeatmapChart>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-label-12 text-[var(--ds-gray-900)]">AI cost</span>
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {HEAT_BUCKETS.map((bucket) => (
            <li
              key={bucket.label}
              className="flex items-center gap-1.5 text-label-12 text-[var(--ds-gray-900)]"
            >
              <span
                className="size-2.5 shrink-0 rounded-[3px] ring-1 ring-[var(--ds-gray-alpha-400)] ring-inset"
                style={{ background: bucket.cssVar }}
                aria-hidden="true"
              />
              {bucket.label}
            </li>
          ))}
        </ul>
      </div>
    </HeatmapInteractionRoot>
  );
}
