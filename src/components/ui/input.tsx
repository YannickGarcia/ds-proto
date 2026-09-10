"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends Omit<
  ComponentProps<"input">,
  "prefix" | "size"
> {
  /** Leading adornment, typically an icon. */
  prefix?: ReactNode;
  /** Trailing adornment. */
  suffix?: ReactNode;
  containerClassName?: string;
}

/**
 * Input — hairline border that darkens to `--ds-gray-alpha-600` on focus
 * with the `--ds-focus-border` halo, rather than a blue ring.
 *
 * One height: 32px, the form scale, matching Select, Menu, SegmentedControl
 * and a default Button. A field has no reason to come in two sizes — the
 * second only ever creates the chance of a crooked row.
 */
export function Input({
  className,
  containerClassName,
  prefix,
  suffix,
  ...props
}: InputProps) {
  return (
    <div
      className={cn(
        "group inline-flex h-8 w-full items-center gap-2 rounded-[var(--radius)]",
        "border border-[var(--ds-gray-alpha-400)] bg-[var(--ds-surface-secondary)] px-3",
        "transition-[border-color,box-shadow] duration-150",
        "focus-within:border-[var(--ds-gray-alpha-600)] focus-within:shadow-[var(--ds-focus-border)]",
        containerClassName,
      )}
    >
      {prefix ? (
        <span className="inline-flex shrink-0 items-center text-[var(--ds-gray-700)] [&_svg]:size-4">
          {prefix}
        </span>
      ) : null}
      <input
        data-slot="input"
        // The shell above owns the focus treatment; without this the global
        // fallback ring would paint a second, accent-coloured ring inside it.
        data-focus-managed=""
        className={cn(
          "w-full min-w-0 bg-transparent text-label-14 text-[var(--ds-gray-1000)]",
          "outline-none placeholder:text-[var(--ds-gray-700)]",
          "disabled:cursor-not-allowed disabled:text-[var(--ds-gray-700)]",
          className,
        )}
        {...props}
      />
      {suffix ? (
        <span className="inline-flex shrink-0 items-center text-[var(--ds-gray-700)] [&_svg]:size-4">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
