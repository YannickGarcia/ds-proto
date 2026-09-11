import Link from "next/link";
import type { ReactNode } from "react";
import { CaretRight } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: ReactNode;
  href?: string;
}

/** Breadcrumb — the trail only. The page title is a heading, not a crumb. */
export function Breadcrumb({
  items,
  className,
}: {
  items: Crumb[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-label-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}`} className="flex min-w-0 items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "truncate rounded-[4px] px-1 py-0.5 text-secondary outline-none",
                    "transition-colors duration-100 hover:text-primary",
                    "focus-visible:shadow-[var(--ds-focus-ring)]",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "truncate px-1 py-0.5",
                    isLast
                      ? "text-primary"
                      : "text-secondary",
                  )}
                >
                  {item.label}
                </span>
              )}
              {isLast ? null : (
                <CaretRight
                  aria-hidden="true"
                  className="size-3 shrink-0 text-tertiary"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
