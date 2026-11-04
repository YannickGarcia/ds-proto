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
        <span className="inline-flex shrink-0 items-center text-tertiary [&_svg]:size-4">
          {prefix}
        </span>
      ) : null}
      <input
        data-slot="input"
        // The shell above owns the focus treatment; without this the global
        // fallback ring would paint a second, accent-coloured ring inside it.
        data-focus-managed=""
        className={cn(
          "w-full min-w-0 bg-transparent text-label-default text-primary",
          "outline-none placeholder:text-tertiary",
          "disabled:cursor-not-allowed disabled:text-disabled",
          className,
        )}
        {...props}
      />
      {suffix ? (
        <span className="inline-flex shrink-0 items-center text-tertiary [&_svg]:size-4">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

/**
 * Textarea — the Input's field treatment for text that runs to more than one
 * line. It is the one field exempt from the 32px form scale: it grows with
 * its content (`field-sizing: content`) from `rows` lines, so it is never
 * meant to sit level with a button in a row.
 */
export function Textarea({
  className,
  rows = 2,
  ...props
}: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      data-focus-managed=""
      rows={rows}
      className={cn(
        "block w-full resize-none rounded-[var(--radius)] [field-sizing:content]",
        "border border-[var(--ds-gray-alpha-400)] bg-[var(--ds-surface-secondary)] px-3 py-1.5",
        "text-copy-default text-primary outline-none placeholder:text-tertiary",
        "transition-[border-color,box-shadow] duration-150",
        "focus:border-[var(--ds-gray-alpha-600)] focus:shadow-[var(--ds-focus-border)]",
        "disabled:cursor-not-allowed disabled:text-disabled",
        className,
      )}
      {...props}
    />
  );
}
