import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Empty state — says what is missing and, where possible, offers the next step. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed",
        "border-[var(--border-subtle)] px-6 py-12 text-center",
        className,
      )}
    >
      {icon ? (
        <span className="mb-1 text-tertiary [&_svg]:size-6">
          {icon}
        </span>
      ) : null}
      <p className="text-h5 text-primary">{title}</p>
      {description ? (
        <p className="max-w-[44ch] text-copy-sm text-pretty text-secondary">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
