"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  LAST,
  PROJECTION_WEEKS,
  WEEK_COUNT,
  weekLabel,
  type Metric,
  type SignalRead,
} from "@/lib/signals-data";
import { STATUS_TONE } from "./status";

/**
 * The signal chart: six months of weeks, the target, and where the trend is
 * heading.
 *
 * Everything is quiet except the last four weeks, which take the status
 * colour — that is the reading the status is made from — with their distance
 * from the dashed target shaded. The dotted line is
 * the 26-week fitted trend, carried into a hatched projection, and a ring
 * marks where it meets the target when that falls inside the projection.
 */
const SLOTS = WEEK_COUNT + PROJECTION_WEEKS;
const PAD_TOP = 8;
const AXIS = 18;

export function SignalChart({
  metric,
  series,
  read,
  height = 80,
}: {
  metric: Metric;
  series: number[];
  read: SignalRead;
  height?: number;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const tone = STATUS_TONE[read.status];
  const plotBottom = height - AXIS;
  const trendAt = (i: number) => read.intercept + read.slope * i;

  const values = [...series, metric.target];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo) * 0.14 || metric.target * 0.05;
  const yMin = lo - pad;
  const yMax = hi + pad;

  const x = (i: number) => (i / (SLOTS - 1)) * width;
  const y = (v: number) =>
    PAD_TOP + (1 - (v - yMin) / (yMax - yMin)) * (plotBottom - PAD_TOP);
  const path = (from: number, to: number) =>
    series
      .slice(from, to + 1)
      .map(
        (v, k) =>
          `${k === 0 ? "M" : "L"}${x(from + k).toFixed(1)},${y(v).toFixed(1)}`,
      )
      .join("");

  const split = LAST - 3;
  const yTarget = y(metric.target);
  const crossAt =
    read.weeksToCross !== null && read.weeksToCross <= PROJECTION_WEEKS
      ? LAST + read.weeksToCross
      : null;

  const onPointer = (event: React.PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const index = Math.round(
      ((event.clientX - box.left) / width) * (SLOTS - 1),
    );
    setHover(Math.max(0, Math.min(LAST, index)));
  };

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          className="block overflow-visible"
          role="img"
          aria-label={`${metric.label} over ${WEEK_COUNT} weeks: ${metric.format(read.recent)} over the last four, against a target of ${metric.format(metric.target)}.`}
        >
          <defs>
            <pattern
              id={`hatch-${uid}`}
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="5"
                stroke="var(--ds-gray-alpha-200)"
                strokeWidth="1.5"
              />
            </pattern>
            <clipPath id={`plot-${uid}`}>
              <rect
                x="0"
                y={PAD_TOP - 2}
                width={width}
                height={plotBottom - PAD_TOP + 4}
              />
            </clipPath>
          </defs>

          {/* Projection */}
          <rect
            x={x(LAST)}
            y={PAD_TOP}
            width={x(SLOTS - 1) - x(LAST)}
            height={plotBottom - PAD_TOP}
            fill={`url(#hatch-${uid})`}
          />

          {/* Target */}
          <line
            x1="0"
            x2={width}
            y1={yTarget}
            y2={yTarget}
            stroke="var(--ds-gray-alpha-600)"
            strokeDasharray="3 3"
          />

          {/* Trend, fitted over 26 weeks and carried into the projection */}
          <line
            clipPath={`url(#plot-${uid})`}
            x1={x(0)}
            y1={y(trendAt(0))}
            x2={x(SLOTS - 1)}
            y2={y(trendAt(SLOTS - 1))}
            stroke={tone.line}
            strokeOpacity="0.55"
            strokeWidth="1.25"
            strokeDasharray="1.5 3"
            strokeLinecap="round"
          />
          {crossAt !== null ? (
            <circle
              cx={x(crossAt)}
              cy={yTarget}
              r="3"
              fill="var(--ds-surface-secondary)"
              stroke={tone.line}
              strokeWidth="1.5"
            />
          ) : null}

          {/* History, then the four weeks the status is read from */}
          <path
            d={path(0, split)}
            fill="none"
            stroke="var(--ds-gray-alpha-500)"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* The distance between the reading and the target, shaded */}
          <path
            d={`${path(split, LAST)}L${x(LAST)},${yTarget}L${x(split)},${yTarget}Z`}
            fill={tone.line}
            fillOpacity="0.14"
          />
          <path
            d={path(split, LAST)}
            fill="none"
            stroke={tone.line}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <circle
            cx={x(LAST)}
            cy={y(series[LAST])}
            r="3"
            fill={tone.line}
            stroke="var(--ds-surface-secondary)"
            strokeWidth="1.5"
          />

          {/* Axis: where the six months start, and the last reading */}
          <text x="0" y={height - 3} className="fill-tertiary text-label-xs">
            {weekLabel(0)}
          </text>
          <text
            x={x(LAST)}
            y={height - 3}
            textAnchor="middle"
            className="fill-tertiary text-label-xs"
          >
            {weekLabel(LAST)}
          </text>

          {hover !== null ? (
            <g pointerEvents="none">
              <line
                x1={x(hover)}
                x2={x(hover)}
                y1={PAD_TOP}
                y2={plotBottom}
                stroke="var(--ds-gray-alpha-500)"
              />
              <circle
                cx={x(hover)}
                cy={y(series[hover])}
                r="3"
                fill="var(--ds-surface-secondary)"
                stroke="var(--ds-gray-1000)"
                strokeWidth="1.5"
              />
            </g>
          ) : null}

          <rect
            x="0"
            y="0"
            width={x(LAST) + 6}
            height={plotBottom}
            fill="transparent"
            onPointerMove={onPointer}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
      ) : null}

      {hover !== null ? (
        <div
          className="pointer-events-none absolute -top-6 rounded-sm px-1.5 py-0.5 text-label-xs whitespace-nowrap text-primary surface-tertiary elevated-sm border border-[var(--border-subtle)] tabular-nums"
          style={{
            left: Math.min(Math.max(x(hover), 48), width - 48),
            transform: "translateX(-50%)",
          }}
        >
          <span className="text-secondary">{weekLabel(hover)}</span>{" "}
          {metric.format(series[hover])}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The same reading at row size, for the breakdown lists: history, the last
 * four weeks in the status colour, and the target. No axis, no projection.
 */
export function SignalSparkline({
  metric,
  series,
  read,
  width = 72,
  height = 24,
}: {
  metric: Metric;
  series: number[];
  read: SignalRead;
  width?: number;
  height?: number;
}) {
  const tone = STATUS_TONE[read.status];
  const values = [...series, metric.target];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;
  const x = (i: number) => (i / LAST) * width;
  const y = (v: number) => 2 + (1 - (v - lo) / span) * (height - 4);
  const path = (from: number, to: number) =>
    series
      .slice(from, to + 1)
      .map(
        (v, k) =>
          `${k === 0 ? "M" : "L"}${x(from + k).toFixed(1)},${y(v).toFixed(1)}`,
      )
      .join("");
  const split = LAST - 3;

  return (
    <svg
      width={width}
      height={height}
      aria-hidden="true"
      className="block shrink-0 overflow-visible"
    >
      <line
        x1="0"
        x2={width}
        y1={y(metric.target)}
        y2={y(metric.target)}
        stroke="var(--ds-gray-alpha-500)"
        strokeDasharray="2 2"
      />
      <path
        d={path(0, split)}
        fill="none"
        stroke="var(--ds-gray-alpha-500)"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d={path(split, LAST)}
        fill="none"
        stroke={tone.line}
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
