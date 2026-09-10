import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Geist Badge — subtle tinted pills built from the `--ds-*` colour scales. */
const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-full border font-medium whitespace-nowrap [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        gray: "border-transparent bg-[var(--ds-gray-1000)] text-[var(--ds-surface-secondary)]",
        "gray-subtle":
          "border-[var(--ds-gray-alpha-400)] bg-[var(--ds-gray-alpha-100)] text-[var(--ds-gray-900)]",
        blue: "border-[var(--ds-blue-400)] bg-[var(--ds-blue-200)] text-[var(--ds-blue-900)]",
        purple:
          "border-[var(--ds-purple-400)] bg-[var(--ds-purple-200)] text-[var(--ds-purple-900)]",
        amber:
          "border-[var(--ds-amber-400)] bg-[var(--ds-amber-200)] text-[var(--ds-amber-900)]",
        red: "border-[var(--ds-red-400)] bg-[var(--ds-red-200)] text-[var(--ds-red-900)]",
        green:
          "border-[var(--ds-green-400)] bg-[var(--ds-green-200)] text-[var(--ds-green-900)]",
        teal: "border-[var(--ds-teal-400)] bg-[var(--ds-teal-200)] text-[var(--ds-teal-900)]",
      },
      size: {
        sm: "h-5 px-2 text-[11px] leading-none [&_svg]:size-3",
        md: "h-6 px-2.5 text-button-12 [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "gray-subtle", size: "sm" },
  },
);

export interface BadgeProps
  extends ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { badgeVariants };
