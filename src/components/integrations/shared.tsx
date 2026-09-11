"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  AppShell,
  MEASURE,
  type Measure,
  PageHeader,
} from "@/components/app/app-shell";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { InlineStatus } from "@/components/ui/banner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { useMounted } from "@/lib/use-mounted";
import type { HealthState, SyncStatus } from "@/lib/integrations-data";
import { cn } from "@/lib/utils";

export { InlineStatus as InlineRowStatus };

/**
 * Dismissal state for a stack of contextual banners.
 *
 * Every page-level banner is dismissible: they are conditional notices, so a
 * reader who has dealt with one must be able to clear it and keep the page.
 * `any` lets the caller drop the whole stack — and its gap — once it is empty.
 */
export function useDismissible() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  return useMemo(
    () => ({
      visible: (id: string) => !dismissed.includes(id),
      any: (ids: string[]) => ids.some((id) => !dismissed.includes(id)),
      dismiss: (id: string) =>
        setDismissed((current) =>
          current.includes(id) ? current : [...current, id],
        ),
    }),
    [dismissed],
  );
}

/** Page frame shared by every integrations page. */
export function IntegrationsPage({
  crumbs,
  title,
  titleIcon,
  actions,
  meta,
  measure = "full",
  children,
}: {
  crumbs: Crumb[];
  title: ReactNode;
  titleIcon?: ReactNode;
  actions?: ReactNode;
  meta?: ReactNode;
  /** Body width only — the header always spans the full measure. */
  measure?: Measure;
  children: ReactNode;
}) {
  return (
    <AppShell>
      <div className="min-w-0 flex-1">
        <PageHeader>
          <div className="pt-4 pb-4">
            <Breadcrumb items={crumbs} className="-ml-1" />
            <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                {titleIcon}
                <h1 className="min-w-0 text-h2 text-primary">
                  {title}
                </h1>
              </div>
              {actions ? (
                <div className="flex flex-wrap items-center gap-2">{actions}</div>
              ) : null}
            </div>
            {meta ? <div className="mt-2.5">{meta}</div> : null}
          </div>
          <div className="border-b border-[var(--border-structural)]" />
        </PageHeader>

        <main
          id="main-content"
          className={`${MEASURE[measure]} scroll-mt-32 pt-6 pb-20`}
        >
          {children}
        </main>
      </div>
    </AppShell>
  );
}

/** Section heading used between blocks on a page. */
export function Section({
  title,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("scroll-mt-32", className)}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-h4 text-primary">{title}</h2>
          {description ? (
            <p className="mt-1 max-w-[72ch] text-copy-sm text-pretty text-secondary">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

/**
 * Health badge. Loads after the page, so it renders a skeleton on the first
 * paint and settles once mounted — the same shape either way, so nothing moves.
 */
export function HealthBadge({
  state,
  reason,
}: {
  state: HealthState;
  reason?: string;
}) {
  const mounted = useMounted();
  if (!mounted) return <Skeleton className="h-5 w-[74px] rounded-full" />;

  const map = {
    working: { variant: "green", label: "Working" },
    attention: { variant: "amber", label: "Needs attention" },
    disabled: { variant: "gray-subtle", label: "Disabled" },
  } as const;
  const { variant, label } = map[state];
  const badge = <Badge variant={variant}>{label}</Badge>;

  return reason ? <Tooltip content={reason}>{badge}</Tooltip> : badge;
}

const SYNC_STATUS = {
  "in-progress": { variant: "blue", label: "In progress" },
  completed: { variant: "green", label: "Completed" },
  failed: { variant: "red", label: "Failed" },
  retrying: { variant: "amber", label: "Retrying" },
  unknown: { variant: "gray-subtle", label: "Unknown" },
} as const;

export function SyncStatusBadge({
  status,
  tooltip,
}: {
  status: SyncStatus;
  tooltip?: string;
}) {
  const { variant, label } = SYNC_STATUS[status];
  const badge = <Badge variant={variant}>{label}</Badge>;
  return tooltip ? <Tooltip content={tooltip}>{badge}</Tooltip> : badge;
}

/**
 * Marks an element that only product staff can see. The dotted edge and the
 * label make it obvious at a glance which parts an org admin never gets.
 */
export function StaffOnly({
  children,
  inline,
  className,
}: {
  children: ReactNode;
  inline?: boolean;
  className?: string;
}) {
  if (inline) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-[4px] border border-dashed",
          "border-[var(--ds-purple-400)] px-1.5 py-0.5",
          className,
        )}
      >
        <StaffTag />
        {children}
      </span>
    );
  }
  return (
    <div
      className={cn(
        "relative rounded-xl border border-dashed border-[var(--ds-purple-400)] p-4",
        className,
      )}
    >
      <span className="absolute -top-2 left-3 bg-[var(--ds-surface-primary)] px-1.5">
        <StaffTag />
      </span>
      {children}
    </div>
  );
}

export function StaffTag() {
  return (
    <span className="text-[10px] leading-4 font-medium tracking-[0.04em] text-[var(--ds-purple-900)] uppercase">
      Staff
    </span>
  );
}
