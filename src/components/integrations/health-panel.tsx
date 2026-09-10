"use client";

import { useState } from "react";
import { Badge } from "@/components/geist/badge";
import { Button } from "@/components/geist/button";
import { Card } from "@/components/geist/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/geist/collapsible";
import { Tooltip } from "@/components/geist/tooltip";
import { ArrowsClockwise, CaretDown } from "@/components/icons";
import { HEALTH_CHECKS, HEALTH_HISTORY } from "@/lib/integrations-data";
import { cn } from "@/lib/utils";

const RESULT_TONE = {
  ok: "bg-[var(--ds-green-700)]",
  warn: "bg-[var(--ds-amber-700)]",
  error: "bg-[var(--ds-red-700)]",
} as const;

const BADGE = {
  ok: "green",
  warn: "amber",
  error: "red",
  muted: "gray-subtle",
} as const;

/**
 * Integration health. Collapsed it answers one question — is this working;
 * expanded it shows why. Used on both the provider page and a single
 * repository, scoped by `scope`.
 */
export function HealthPanel({
  scope,
  status = "issues",
  checkedAgo = "2 hours ago",
}: {
  scope: string;
  status?: "ok" | "issues" | "broken";
  checkedAgo?: string;
}) {
  const [open, setOpen] = useState(false);

  const summary = {
    ok: { label: "Working and up to date", tone: "green" },
    issues: { label: "Connected, with issues", tone: "amber" },
    broken: { label: "Connection issue", tone: "red" },
  }[status] as { label: string; tone: "green" | "amber" | "red" };

  const dot = {
    green: "bg-[var(--ds-green-700)]",
    amber: "bg-[var(--ds-amber-700)]",
    red: "bg-[var(--ds-red-700)]",
  }[summary.tone];

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <CollapsibleTrigger
              className={cn(
                "group flex min-w-0 items-center gap-2 rounded-[var(--geist-radius)] outline-none",
                "focus-visible:shadow-[var(--ds-focus-ring)]",
              )}
            >
              <CaretDown
                aria-hidden="true"
                className={cn(
                  "size-3.5 shrink-0 text-[var(--ds-gray-700)] transition-transform duration-200",
                  "ease-[var(--ds-motion-timing-swift)]",
                  open && "rotate-180",
                )}
              />
              <span className="text-heading-14 text-[var(--ds-gray-1000)]">
                Integration health
              </span>
            </CollapsibleTrigger>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className={cn("size-1.5 rounded-full", dot)} />
              <span className="text-label-13 text-[var(--ds-gray-900)]">
                {summary.label}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-label-12 text-[var(--ds-gray-900)]">
              Checked {checkedAgo}
            </span>
            <Button
              variant="secondary"
              prefix={<ArrowsClockwise aria-hidden="true" />}
            >
              Run healthcheck
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          <div className="border-t border-[var(--border-subtle)] px-5 py-4">
            <p className="mb-3 text-copy-13 text-[var(--ds-gray-900)]">
              Checks run against {scope}.
            </p>

            <ul className="flex flex-col gap-2.5">
              {HEALTH_CHECKS.map((check) => (
                <li
                  key={check.id}
                  className="rounded-[var(--geist-radius)] border border-[var(--border-subtle)] p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-label-13 font-medium text-[var(--ds-gray-1000)]">
                        {check.title}
                      </p>
                      <p className="mt-0.5 text-copy-13 text-[var(--ds-gray-900)]">
                        {check.description}
                      </p>
                    </div>
                    <Badge variant={BADGE[check.tone]}>{check.result}</Badge>
                  </div>

                  {check.details?.length ? (
                    <ul className="mt-2.5 flex flex-col gap-1 border-t border-[var(--border-subtle)] pt-2.5">
                      {check.details.map((detail) => (
                        <li
                          key={detail.repo}
                          className="flex flex-wrap items-center gap-x-2 text-label-12"
                        >
                          <code className="text-mono-12 text-[var(--ds-gray-1000)]">
                            {detail.repo}
                          </code>
                          <span className="text-[var(--ds-gray-900)]">
                            {detail.reason}
                          </span>
                          <span className="text-[var(--ds-gray-700)]">
                            since {detail.since} ago
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>

            {/* History ------------------------------------------------- */}
            <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-label-13 font-medium text-[var(--ds-gray-1000)]">
                  Healthcheck history
                </p>
                <Badge>2× daily</Badge>
              </div>
              <div className="mt-2.5 flex gap-1">
                {HEALTH_HISTORY.map((run) => (
                  <Tooltip key={run.at} content={`${run.at} — ${run.result}`}>
                    <span
                      className={cn(
                        "h-6 flex-1 rounded-[3px] opacity-80 transition-opacity hover:opacity-100",
                        RESULT_TONE[run.result],
                      )}
                    />
                  </Tooltip>
                ))}
              </div>
              <ul className="mt-3 flex flex-col gap-1.5">
                {HEALTH_HISTORY.slice(0, 2).map((run) => (
                  <li
                    key={`row-${run.at}`}
                    className="flex flex-wrap items-center gap-x-2 text-label-12"
                  >
                    <span className="geist-tabular-nums text-[var(--ds-gray-1000)]">
                      {run.at}
                    </span>
                    <span className="text-[var(--ds-gray-900)]">
                      {run.result === "ok"
                        ? "All checks passed"
                        : run.result === "warn"
                          ? "2 repositories incomplete"
                          : "Could not reach the provider"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
