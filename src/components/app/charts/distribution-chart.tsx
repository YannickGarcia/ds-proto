"use client";

import { useState } from "react";
import type { DistributionBar } from "@/lib/data";
import { pct, points, usd } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Horizontal $/point bars, ranked most-inefficient first.
 *
 * Bklit's `BarChart orientation="horizontal"` draws the series but not the
 * per-bucket labels and inline values this card needs, so the ranking is laid
 * out in the DOM and animated with the Geist swift curve.
 */
export function DistributionChart({
  bars,
  emptyState,
}: {
  bars: DistributionBar[];
  emptyState: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (bars.length === 0) {
    return (
      <div className="flex h-[180px] items-center justify-center rounded-[var(--geist-radius)] border border-dashed border-[var(--border-subtle)] px-6 text-center text-copy-13 text-[var(--ds-gray-900)]">
        {emptyState}
      </div>
    );
  }

  const max = Math.max(...bars.map((bar) => bar.costPerPoint));

  return (
    <ul
      className="flex flex-col gap-2"
      onMouseLeave={() => setHovered(null)}
    >
      {bars.map((bar, index) => {
        const isHovered = hovered === bar.bucket;
        const isDimmed = hovered !== null && !isHovered;

        return (
          <li
            key={bar.bucket}
            onMouseEnter={() => setHovered(bar.bucket)}
            className={cn(
              "group relative grid grid-cols-[minmax(96px,140px)_1fr_auto] items-center gap-3",
              "transition-opacity duration-150",
              isDimmed && "opacity-40",
            )}
          >
            <span className="truncate text-label-13 text-[var(--ds-gray-900)]">
              {bar.bucket}
            </span>

            <span className="relative block h-7 overflow-hidden rounded-[4px] bg-[var(--ds-gray-alpha-100)]">
              <span
                className="absolute inset-y-0 left-0 rounded-[4px] transition-[width] duration-500 ease-[var(--ds-motion-timing-swift)]"
                style={{
                  width: `${(bar.costPerPoint / max) * 100}%`,
                  background:
                    index === 0
                      ? "var(--ds-blue-700)"
                      : "var(--ds-blue-600)",
                  opacity: 1 - index * 0.11,
                }}
              />
            </span>

            <span className="geist-tabular-nums w-[92px] text-right text-label-13 font-medium text-[var(--ds-gray-1000)]">
              ${bar.costPerPoint.toFixed(2)}/point
            </span>

            {isHovered ? (
              <span
                role="status"
                className={cn(
                  "pointer-events-none absolute top-full left-[152px] z-20 mt-1 flex flex-col gap-0.5",
                  "surface-tertiary elevated rounded-[var(--geist-radius)] border border-[var(--border-subtle)]",
                  "px-2.5 py-2",
                  "animate-geist-fade-in",
                )}
              >
                <span className="text-label-12 text-[var(--ds-gray-900)]">
                  Spend{" "}
                  <span className="geist-tabular-nums text-[var(--ds-gray-1000)]">
                    {usd(bar.spend, 2)}
                  </span>
                </span>
                <span className="text-label-12 text-[var(--ds-gray-900)]">
                  Delivery{" "}
                  <span className="geist-tabular-nums text-[var(--ds-gray-1000)]">
                    {points(bar.delivery)} pts
                  </span>
                </span>
                <span className="text-label-12 text-[var(--ds-gray-900)]">
                  Share of total points{" "}
                  <span className="geist-tabular-nums text-[var(--ds-gray-1000)]">
                    {pct(bar.shareOfPoints, 1)}
                  </span>
                </span>
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
