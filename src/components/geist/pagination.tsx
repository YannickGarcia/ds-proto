"use client";

import { CaretLeft, CaretRight } from "@/components/icons";
import { Button } from "@/components/geist/button";

/**
 * Range-and-steppers pagination. States the span rather than listing page
 * numbers — for logs and long tables the count matters more than the index.
 */
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  label = "rows",
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
}) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="geist-tabular-nums text-label-13 text-[var(--ds-gray-900)]">
        {from}–{to} of {total} {label}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="secondary"
          shape="square"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <CaretLeft aria-hidden="true" />
        </Button>
        <span className="geist-tabular-nums px-2 text-label-13 text-[var(--ds-gray-900)]">
          {page} / {pageCount}
        </span>
        <Button
          variant="secondary"
          shape="square"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <CaretRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
