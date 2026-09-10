import { cn } from "@/lib/utils";

/**
 * Placeholder for content that is still loading. Shaped like the thing it
 * replaces, so the layout does not shift when the real value arrives.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block animate-pulse rounded-[4px] bg-[var(--ds-gray-alpha-200)]",
        className,
      )}
    />
  );
}
