"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  /** Accessible label when only an icon is rendered. */
  srLabel?: string;
}

interface SegmentedControlProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onValueChange: (value: T) => void;
  /** Render icons only, hiding text labels. */
  iconOnly?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * Geist segmented control — a bordered track with a spring-animated
 * `--ds-gray-alpha-200` indicator sliding behind the active segment.
 *
 * The track carries the 32px form-scale height and the segments fill it, so
 * the control is exactly as tall as the Input, Select and Button beside it.
 * Sizing the segments instead would leave the track taller than everything
 * else by its border and padding.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onValueChange,
  iconOnly = false,
  className,
  ...props
}: SegmentedControlProps<T>) {
  const layoutId = useId();

  return (
    <div
      role="radiogroup"
      aria-label={props["aria-label"]}
      className={cn(
        "relative inline-flex shrink-0 items-center gap-0.5 rounded-[var(--geist-radius)]",
        "border border-[var(--ds-gray-alpha-400)] bg-[var(--ds-surface-secondary)] p-0.5",
        "h-8",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.srLabel ?? option.label}
            onClick={() => onValueChange(option.value)}
            className={cn(
              "relative inline-flex items-center justify-center gap-1.5 rounded-[4px]",
              "outline-none transition-colors duration-150 focus-visible:shadow-[var(--ds-focus-ring)]",
              "h-full text-button-14",
              iconOnly ? "w-8" : "px-3",
              isActive
                ? "text-[var(--ds-gray-1000)]"
                : "text-[var(--ds-gray-900)] hover:text-[var(--ds-gray-1000)]",
              "[&_svg]:size-3.5 [&_svg]:shrink-0",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-[4px] bg-[var(--ds-gray-alpha-200)]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            ) : null}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {option.icon}
              {iconOnly ? null : option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
