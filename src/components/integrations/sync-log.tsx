"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { CaretDown, ClockCounterClockwise } from "@/components/icons";
import { ProviderIcon } from "@/components/provider-icon";
import { INSTANCES, SYNC_RUNS, type SyncRun } from "@/lib/integrations-data";
import { cn } from "@/lib/utils";
import { IntegrationsPage, StaffOnly, SyncStatusBadge } from "./shared";

const PAGE_SIZE = 20;

export function SyncLog() {
  const [integration, setIntegration] = useState("all");
  const [instance, setInstance] = useState("all");
  const [organization, setOrganization] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<string[]>([]);

  const integrations = [...new Set(SYNC_RUNS.map((r) => r.provider))];
  const organizations = [...new Set(SYNC_RUNS.map((r) => r.organization))];

  const filtered = useMemo(
    () =>
      SYNC_RUNS.filter((run) => {
        if (integration !== "all" && run.provider !== integration) return false;
        if (organization !== "all" && run.organization !== organization)
          return false;
        if (status !== "all" && run.status !== status) return false;
        return true;
      }),
    [integration, organization, status],
  );

  const filtersActive =
    integration !== "all" ||
    instance !== "all" ||
    organization !== "all" ||
    status !== "all";

  const clearFilters = () => {
    setIntegration("all");
    setInstance("all");
    setOrganization("all");
    setStatus("all");
    setPage(1);
  };

  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <IntegrationsPage
      crumbs={[
        { label: "Integrations", href: "/integrations" },
        { label: "GitHub repositories", href: "/integrations/github" },
        { label: "Sync log" },
      ]}
      titleIcon={
        <span className="flex size-10 items-center justify-center rounded-[9px] bg-[var(--ds-gray-alpha-100)] text-[var(--ds-gray-900)]">
          <ClockCounterClockwise aria-hidden="true" className="size-5" />
        </span>
      }
      title="Sync log"
    >
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] p-3">
          <FilterSelect
            label="Integration"
            allLabel="All integrations"
            value={integration}
            onChange={(v) => {
              setIntegration(v);
              setPage(1);
            }}
            options={integrations}
          />
          <FilterSelect
            label="Instance"
            allLabel="All instances"
            value={instance}
            onChange={setInstance}
            options={INSTANCES.map((i) => i.label)}
          />
          <FilterSelect
            label="Organization"
            allLabel="All organizations"
            value={organization}
            onChange={(v) => {
              setOrganization(v);
              setPage(1);
            }}
            options={organizations}
          />
          <FilterSelect
            label="Status"
            allLabel="Any status"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={["in-progress", "completed", "failed", "retrying", "unknown"]}
            format={(v) => v.replace("-", " ").replace(/^./, (c) => c.toUpperCase())}
          />
          {filtersActive ? (
            <Button variant="tertiary" onClick={clearFilters}>
              Clear filters
            </Button>
          ) : null}
        </div>

        {visible.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={<ClockCounterClockwise aria-hidden="true" />}
              title="No data syncs to show"
              description="Nothing matches these filters. Runs appear here as soon as a sync starts."
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell className="sticky left-0 z-10 bg-[var(--ds-surface-primary)] min-w-[240px]">
                    Integration
                  </TableHeaderCell>
                  <TableHeaderCell>Organization</TableHeaderCell>
                  <TableHeaderCell>Sync range</TableHeaderCell>
                  <TableHeaderCell>Start date</TableHeaderCell>
                  <TableHeaderCell>Updated at</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>
                    <StaffOnly inline>Errors</StaffOnly>
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visible.map((run) => (
                  <SyncRow
                    key={run.id}
                    run={run}
                    expanded={expanded.includes(run.id)}
                    onToggle={() =>
                      setExpanded((v) =>
                        v.includes(run.id)
                          ? v.filter((id) => id !== run.id)
                          : [...v, run.id],
                      )
                    }
                  />
                ))}
              </TableBody>
            </Table>
            <div className="border-t border-[var(--border-subtle)] p-3">
              <Pagination
                page={page}
                pageSize={PAGE_SIZE}
                total={filtered.length}
                onPageChange={setPage}
                label="runs"
              />
            </div>
          </>
        )}
      </Card>
    </IntegrationsPage>
  );
}

function SyncRow({
  run,
  expanded,
  onToggle,
}: {
  run: SyncRun;
  expanded: boolean;
  onToggle: () => void;
}) {
  const hasDetail = Boolean(run.errors?.length || run.skips?.length);

  return (
    <>
      <TableRow>
        <TableCell className="sticky left-0 z-10 bg-[var(--ds-surface-secondary)]">
          <span className="flex items-center gap-2.5">
            <ProviderIcon provider={run.provider} size="sm" />
            <span className="truncate text-mono-13">{run.resource}</span>
          </span>
        </TableCell>
        <TableCell className="text-[var(--ds-gray-900)]">
          {run.organization}
        </TableCell>
        <TableCell className="whitespace-nowrap text-[var(--ds-gray-900)]">
          <Tooltip content="The window of data covered by this run. Dates are shown in your local time zone.">
            <span>
              {run.rangeFrom} → {run.rangeTo}
            </span>
          </Tooltip>
        </TableCell>
        <TableCell className="whitespace-nowrap text-[var(--ds-gray-900)]">
          {run.startedAt}
        </TableCell>
        <TableCell className="whitespace-nowrap text-[var(--ds-gray-900)]">
          {run.updatedAt}
        </TableCell>
        <TableCell>
          <div className="flex min-w-0 flex-col items-start gap-1">
            <SyncStatusBadge
              status={run.status}
              tooltip={
                run.status === "retrying"
                  ? "Paused by provider rate limits. The run resumes automatically when the quota resets."
                  : undefined
              }
            />
            {run.message ? (
              <span className="max-w-[280px] text-label-12 text-pretty text-[var(--ds-gray-900)]">
                {run.message}
              </span>
            ) : null}
          </div>
        </TableCell>
        <TableCell>
          {hasDetail ? (
            <StaffOnly inline>
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={expanded}
                className="inline-flex items-center gap-1 rounded-[4px] text-label-12 outline-none focus-visible:shadow-[var(--ds-focus-ring)]"
              >
                {expanded ? "Less" : "More"}
                <CaretDown
                  aria-hidden="true"
                  className={cn("size-3 transition-transform", expanded && "rotate-180")}
                />
              </button>
            </StaffOnly>
          ) : (
            <span className="text-[var(--ds-gray-700)]">—</span>
          )}
        </TableCell>
      </TableRow>

      {expanded && hasDetail ? (
        <TableRow>
          <TableCell colSpan={7} className="bg-[var(--ds-gray-alpha-100)]">
            <div className="flex flex-col gap-2 py-1">
              {run.errors?.length ? (
                <div>
                  <p className="text-label-12 font-medium text-[var(--ds-red-900)]">
                    Errors
                  </p>
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {run.errors.map((error) => (
                      <li key={error} className="text-mono-12 text-[var(--ds-gray-900)]">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {run.skips?.length ? (
                <div>
                  <p className="text-label-12 font-medium text-[var(--ds-amber-900)]">
                    Skipped
                  </p>
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {run.skips.map((skip) => (
                      <li key={skip} className="text-mono-12 text-[var(--ds-gray-900)]">
                        {skip}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}

function FilterSelect({
  label,
  allLabel,
  value,
  onChange,
  options,
  format,
}: {
  label: string;
  allLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  format?: (value: string) => string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="min-w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {format ? format(option) : option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
