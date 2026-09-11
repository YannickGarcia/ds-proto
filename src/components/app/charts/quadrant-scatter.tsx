"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import type { Person } from "@/lib/data";
import { pct, points, usd } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Quadrant {
  key: string;
  label: string;
  className: string;
  favourable?: boolean;
  unfavourable?: boolean;
}

const QUADRANTS: Quadrant[] = [
  {
    key: "top-right",
    label: "High delivery, High efficiency",
    className: "right-3 top-3 text-right",
    favourable: true,
  },
  {
    key: "top-left",
    label: "Low delivery, High efficiency",
    className: "left-3 top-3 text-left",
  },
  {
    key: "bottom-right",
    label: "High delivery, Low efficiency",
    className: "right-3 bottom-3 text-right",
  },
  {
    key: "bottom-left",
    label: "Low delivery, Low efficiency",
    className: "left-3 bottom-3 text-left",
    unfavourable: true,
  },
];

/**
 * Quadrant scatter of delivery volume against cost efficiency, one avatar per
 * person. Bklit's `ScatterChart` is time-scaled on X and draws ring markers,
 * so this plot is laid out directly against the same tokens.
 */
export function QuadrantScatter({ people }: { people: Person[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="flex gap-3">
      <div className="flex w-6 shrink-0 items-center justify-center">
        <span className="text-label-xs whitespace-nowrap text-secondary [writing-mode:vertical-rl] rotate-180">
          Cost efficiency ($/pt)
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "relative aspect-[16/9] min-h-[320px] w-full overflow-hidden rounded-[var(--radius)]",
            "border border-[var(--border-subtle)] bg-[var(--ds-surface-primary)]",
          )}
          onMouseLeave={() => setActive(null)}
        >
          {/* Favourable / unfavourable quadrant washes */}
          <span className="absolute top-0 right-0 h-1/2 w-1/2 bg-[var(--ds-green-100)] opacity-45" />
          <span className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-[var(--ds-red-100)] opacity-40" />

          {/* Grid */}
          <span className="absolute inset-x-0 top-1/2 h-px bg-[var(--ds-gray-alpha-400)]" />
          <span className="absolute inset-y-0 left-1/2 w-px bg-[var(--ds-gray-alpha-400)]" />
          {[25, 75].map((position) => (
            <span
              key={`v-${position}`}
              className="absolute inset-y-0 w-px bg-[var(--ds-gray-alpha-200)]"
              style={{ left: `${position}%` }}
            />
          ))}
          {[25, 75].map((position) => (
            <span
              key={`h-${position}`}
              className="absolute inset-x-0 h-px bg-[var(--ds-gray-alpha-200)]"
              style={{ top: `${position}%` }}
            />
          ))}

          {QUADRANTS.map((quadrant) => (
            <span
              key={quadrant.key}
              className={cn(
                "pointer-events-none absolute max-w-[44%] rounded-[4px] px-1.5 py-0.5",
                "bg-[color-mix(in_srgb,var(--ds-surface-primary)_75%,transparent)]",
                "text-[11px] leading-4 text-balance",
                quadrant.className,
                quadrant.favourable
                  ? "text-[var(--ds-green-900)]"
                  : quadrant.unfavourable
                    ? "text-[var(--ds-red-900)]"
                    : "text-secondary",
              )}
            >
              {quadrant.label}
            </span>
          ))}

          {people.map((person) => {
            const isActive = active === person.id;
            const isDimmed = active !== null && !isActive;

            return (
              <button
                key={person.id}
                type="button"
                onMouseEnter={() => setActive(person.id)}
                onFocus={() => setActive(person.id)}
                onBlur={() => setActive(null)}
                aria-label={`${person.name}: ${points(person.deliveryPoints)} points at ${usd(person.costPerPoint, 2)} per point`}
                className={cn(
                  "absolute -translate-x-1/2 translate-y-1/2 rounded-full outline-none",
                  "transition-[opacity,transform] duration-200 ease-[var(--ds-motion-timing-swift)]",
                  "focus-visible:shadow-[var(--ds-focus-ring)]",
                  isDimmed ? "opacity-35" : "opacity-100",
                  isActive && "z-20 scale-115",
                )}
                style={{
                  left: `${8 + person.delivery * 0.84}%`,
                  bottom: `${9 + person.efficiency * 0.8}%`,
                }}
              >
                <Avatar
                  name={person.name}
                  size="md"
                  className={cn(
                    "ring-2 ring-[var(--ds-surface-secondary)]",
                    isActive && "ring-[var(--ds-gray-1000)]",
                  )}
                />
              </button>
            );
          })}

          {people.map((person) => {
            if (active !== person.id) return null;
            const flipX = person.delivery > 55;
            const flipY = person.efficiency > 55;

            return (
              <div
                key={`tip-${person.id}`}
                role="status"
                className={cn(
                  "pointer-events-none absolute z-30 w-[190px] rounded-[var(--radius)]",
                  "surface-tertiary elevated border border-[var(--border-subtle)]",
                  "px-2.5 py-2 animate-fade-in",
                )}
                style={{
                  left: `${8 + person.delivery * 0.84}%`,
                  bottom: `${9 + person.efficiency * 0.8}%`,
                  transform: `translate(${flipX ? "calc(-100% - 18px)" : "18px"}, ${
                    flipY ? "8px" : "calc(100% - 8px)"
                  })`,
                }}
              >
                <p className="mb-1 text-label-sm font-medium text-primary">
                  {person.name}
                </p>
                <p className="text-label-xs text-secondary">
                  {person.position} · {person.team} · {person.level}
                </p>
                <dl className="mt-1.5 flex flex-col gap-0.5 text-label-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-secondary">Delivery</dt>
                    <dd className="tabular-nums text-primary">
                      {points(person.deliveryPoints)} pts · {pct(person.delivery)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-secondary">Cost / point</dt>
                    <dd className="tabular-nums text-primary">
                      {usd(person.costPerPoint, 2)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-secondary">AI spend</dt>
                    <dd className="tabular-nums text-primary">
                      {usd(person.spend, 2)}
                    </dd>
                  </div>
                </dl>
              </div>
            );
          })}

          {people.length === 0 ? (
            <p className="absolute inset-0 flex items-center justify-center text-copy-sm text-secondary">
              Nobody matches these filters in this period
            </p>
          ) : null}
        </div>

        <div className="mt-2 flex items-center justify-between text-label-xs text-secondary">
          <span className="tabular-nums">0%</span>
          <span>Delivery</span>
          <span className="tabular-nums">100%</span>
        </div>
      </div>
    </div>
  );
}
