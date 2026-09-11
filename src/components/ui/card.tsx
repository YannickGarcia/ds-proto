import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Card — a raised surface: sheen over the fill, a lit top edge and a short
 * grounding shadow, so elevation reads from light rather than from a shadow.
 */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "surface-secondary flex flex-col rounded-xl",
        "border border-[var(--border-subtle)] text-primary",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex items-start justify-between gap-4 px-5 pt-4 pb-2",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="card-title"
      className={cn("text-h5 text-primary", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-copy-sm text-secondary", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-5 pb-5", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "mt-auto flex items-center gap-3 rounded-b-xl border-t border-[var(--border-subtle)]",
        "bg-[var(--ds-surface-primary)] px-5 py-2.5 text-copy-sm text-secondary",
        className,
      )}
      {...props}
    />
  );
}
