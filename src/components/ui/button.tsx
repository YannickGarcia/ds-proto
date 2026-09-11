"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The size table, and the only place a button dimension is written down.
 * `className` is what the component renders; `height` and `label` are what the
 * design system prints. Keeping them in one row means the page cannot describe
 * a size the component no longer has — the failure mode this replaced.
 *
 * The class strings stay literal so Tailwind still finds them in this file.
 */
export const BUTTON_SIZES = {
  default: {
    className: "h-8 px-3 text-button-default",
    height: 32,
    label: 14,
    weight: 500,
    icon: 16,
  },
  small: {
    className: "h-7 px-2.5 text-label-default",
    height: 28,
    label: 14,
    weight: 400,
    icon: 14,
  },
} as const;

export type ButtonSize = keyof typeof BUTTON_SIZES;

const sizeClasses = Object.fromEntries(
  Object.entries(BUTTON_SIZES).map(([size, spec]) => [size, spec.className]),
) as Record<ButtonSize, string>;

const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 select-none items-center justify-center gap-1.5 whitespace-nowrap",
    "rounded-[var(--radius)] border border-transparent",
    "transition-[background-color,border-color,color,box-shadow,opacity] duration-150 ease-out",
    "outline-none focus-visible:shadow-[var(--ds-focus-ring)]",
    "disabled:cursor-not-allowed disabled:border-[var(--ds-gray-alpha-400)]",
    "disabled:bg-[var(--ds-gray-100)] disabled:text-disabled disabled:shadow-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-[var(--icon-size)]",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--ds-gray-1000)] text-[var(--ds-surface-secondary)] hover:bg-[var(--ds-gray-900)]",
        secondary: [
          "border-[var(--ds-gray-alpha-400)] bg-[var(--ds-surface-secondary)] text-primary",
          "hover:border-[var(--ds-gray-alpha-500)] hover:bg-[var(--ds-gray-alpha-100)]",
        ],
        tertiary:
          "bg-transparent text-secondary hover:bg-[var(--ds-gray-alpha-200)] hover:text-primary",
        // Same inversion trick as primary: the 800 fill is dark in the light
        // theme and light in the dark one, and --ds-surface-secondary flips with
        // it, so the label keeps its contrast either way.
        error:
          "bg-[var(--ds-red-800)] text-[var(--ds-surface-secondary)] hover:bg-[var(--ds-red-900)]",
        warning:
          "bg-[var(--ds-amber-800)] text-[var(--ds-surface-secondary)] hover:bg-[var(--ds-amber-900)]",
      },
      size: sizeClasses,
      shape: {
        default: "",
        square: "px-0 aspect-square",
        circle: "px-0 aspect-square rounded-full",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
      shape: "default",
    },
  },
);

export interface ButtonProps
  extends
    Omit<ComponentProps<"button">, "prefix">,
    VariantProps<typeof buttonVariants> {
  /** Render as the single child element instead of a `<button>`. */
  asChild?: boolean;
  /** Leading icon slot. */
  prefix?: ReactNode;
  /** Trailing icon slot. */
  suffix?: ReactNode;
}

/**
 * Button.
 *
 * `default` (32px, weight 500) is the product standard and the height every
 * other control comes in, so a button is level with whatever sits beside it
 * unless someone opts out. `small` (28px, weight 400) is for genuinely dense
 * chrome: it steps down in stature as well as size, which is what keeps it
 * from reading as a shrunken primary action.
 * Radius is `--radius` (6px); every colour resolves to a `--ds-*` token.
 */
export function Button({
  className,
  variant,
  size = "default",
  shape,
  asChild = false,
  prefix,
  suffix,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const iconSize = BUTTON_SIZES[size ?? "default"].icon;

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, shape }), className)}
      style={{ ["--icon-size" as string]: `${iconSize}px` }}
      {...props}
    >
      {/* These must be direct children of Comp, not wrapped in a fragment:
          Slot only finds `Slottable` among its own immediate children, and a
          fragment would hide it — leaving `asChild` unstyled. */}
      {prefix ? (
        <span className="inline-flex items-center">{prefix}</span>
      ) : null}
      {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : children}
      {suffix ? (
        <span className="inline-flex items-center">{suffix}</span>
      ) : null}
    </Comp>
  );
}

export { buttonVariants };
