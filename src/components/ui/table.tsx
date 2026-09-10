"use client";

import type { ComponentProps } from "react";
import { CaretDown, CaretUp } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Data table. Scrolls horizontally inside its own container so the page never
 * does, and rows separate with `--border-subtle` to match the card they sit in.
 */
export function Table({ className, ...props }: ComponentProps<"table">) {
  return (
    <div className="no-scrollbar w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full border-collapse text-left", className)}
        {...props}
      />
    </div>
  );
}

export function TableHead({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={cn("bg-[var(--ds-surface-primary)]", className)}
      {...props}
    />
  );
}

export function TableBody(props: ComponentProps<"tbody">) {
  return <tbody {...props} />;
}

export function TableRow({
  className,
  interactive,
  ...props
}: ComponentProps<"tr"> & { interactive?: boolean }) {
  return (
    <tr
      className={cn(
        "border-b border-[var(--border-subtle)] last:border-b-0",
        interactive &&
          "cursor-pointer transition-colors duration-100 hover:bg-[var(--ds-gray-alpha-100)]",
        className,
      )}
      {...props}
    />
  );
}

export type SortDirection = "asc" | "desc" | null;

export function TableHeaderCell({
  className,
  sortable,
  direction = null,
  onSort,
  children,
  ...props
}: ComponentProps<"th"> & {
  sortable?: boolean;
  direction?: SortDirection;
  onSort?: () => void;
}) {
  return (
    <th
      scope="col"
      aria-sort={
        direction === "asc"
          ? "ascending"
          : direction === "desc"
            ? "descending"
            : undefined
      }
      className={cn(
        "border-b border-[var(--border-subtle)] px-3 py-2 text-label-12 font-medium whitespace-nowrap",
        "text-[var(--ds-gray-900)]",
        className,
      )}
      {...props}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            "-mx-1.5 inline-flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 outline-none",
            "transition-colors duration-100 hover:text-[var(--ds-gray-1000)]",
            "focus-visible:shadow-[var(--ds-focus-ring)]",
            direction && "text-[var(--ds-gray-1000)]",
          )}
        >
          {children}
          {direction === "asc" ? (
            <CaretUp aria-hidden="true" className="size-3" />
          ) : direction === "desc" ? (
            <CaretDown aria-hidden="true" className="size-3" />
          ) : (
            <CaretDown aria-hidden="true" className="size-3 opacity-0" />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export function TableCell({ className, ...props }: ComponentProps<"td">) {
  return (
    <td
      className={cn(
        "px-3 py-2.5 align-middle text-label-13 text-[var(--ds-gray-1000)]",
        className,
      )}
      {...props}
    />
  );
}
