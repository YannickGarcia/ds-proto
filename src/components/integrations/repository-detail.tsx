"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuTrigger,
} from "@/components/ui/menu";
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
import {
  ArrowSquareOut,
  CaretUpDown,
  ClockCounterClockwise,
  DotsThree,
  GitBranch,
  Info,
  MagnifyingGlass,
} from "@/components/icons";
import { ProviderIcon } from "@/components/provider-icon";
import {
  INSTANCES,
  PULL_REQUESTS,
  REPOSITORIES,
  WEEKLY_STATS,
  type PrState,
} from "@/lib/integrations-data";
import { IntegrationCharts } from "./integration-charts";
import { HealthPanel } from "./health-panel";
import { IntegrationsPage, Section, StaffOnly } from "./shared";

const STATE_BADGE = {
  open: { variant: "green", label: "Open" },
  merged: { variant: "purple", label: "Merged" },
  closed: { variant: "red", label: "Closed" },
  draft: { variant: "gray-subtle", label: "Draft" },
} as const;

const PAGE_SIZE = 20;

export function RepositoryDetail({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("all");
  const [branch, setBranch] = useState("all");
  const [state, setState] = useState("all");
  const [page, setPage] = useState(1);

  const authors = [...new Set(PULL_REQUESTS.map((pr) => pr.author))];
  const branches = [...new Set(PULL_REQUESTS.map((pr) => pr.target))];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return PULL_REQUESTS.filter((pr) => {
      if (needle && !pr.title.toLowerCase().includes(needle)) return false;
      if (author !== "all" && pr.author !== author) return false;
      if (branch !== "all" && pr.target !== branch) return false;
      if (state !== "all" && pr.state !== state) return false;
      return true;
    });
  }, [query, author, branch, state]);

  const filtersActive =
    query !== "" || author !== "all" || branch !== "all" || state !== "all";

  const clearFilters = () => {
    setQuery("");
    setAuthor("all");
    setBranch("all");
    setState("all");
    setPage(1);
  };

  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <IntegrationsPage
      crumbs={[
        { label: "Integrations", href: "/integrations" },
        { label: "GitHub integrations", href: "/integrations/github" },
        { label: `${owner}/${repo}` },
      ]}
      titleIcon={<ProviderIcon provider="github" size="lg" />}
      title={
        <a
          href={`https://github.com/${owner}/${repo}`}
          className="inline-flex items-center gap-1.5 rounded-[4px] outline-none hover:underline focus-visible:shadow-[var(--ds-focus-ring)]"
        >
          <span className="text-secondary">{owner}/</span>
          {repo}
          <ArrowSquareOut
            aria-hidden="true"
            className="size-4 text-tertiary"
          />
        </a>
      }
      actions={
        <>
          <Button
            asChild
            variant="secondary"
            prefix={<ClockCounterClockwise aria-hidden="true" />}
          >
            <Link href={`/integrations/sync-log?repository=${owner}/${repo}`}>
              Sync log
            </Link>
          </Button>
          <StaffOnly inline>
            <Menu>
              <MenuTrigger asChild>
                <Button
                  variant="tertiary"
                  shape="square"
                  aria-label="Staff actions"
                >
                  <DotsThree aria-hidden="true" weight="bold" />
                </Button>
              </MenuTrigger>
              <MenuContent align="end" className="w-[180px]">
                <MenuLabel>Staff</MenuLabel>
                <MenuItem>Fetch now</MenuItem>
              </MenuContent>
            </Menu>
          </StaffOnly>
        </>
      }
      meta={
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <RepoSwitcher current={`${owner}/${repo}`} />
          <span className="text-label-sm text-secondary">
            Last synced 2 hours ago
          </span>
          <span className="inline-flex items-center gap-1.5 text-label-sm text-secondary">
            <GitBranch aria-hidden="true" className="size-3.5" />
            main
          </span>
          <Tooltip content="Pull requests opened before the repository was connected are backfilled over the following days.">
            <span className="inline-flex items-center gap-1.5 text-label-sm text-secondary">
              <Info aria-hidden="true" className="size-3.5" />
              Backfill in progress
            </span>
          </Tooltip>
        </div>
      }
    >
      <div className="flex flex-col gap-8">
        <HealthPanel scope={`${owner}/${repo}`} status="ok" />

        <StaffOnly>
          <h2 className="text-h5 text-primary">
            Fetch diagnostics
          </h2>
          <dl className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Last fetch id", "fch_9f21c4a8"],
              ["Duration", "42.6s"],
              ["API calls", "318 of 5,000"],
              ["Cursor", "Y3Vyc29yOnYyOpK5MjAy"],
              ["Worker", "eu-west-1 · pool-3"],
              ["Rate limit reset", "in 38 minutes"],
              ["Retries", "0"],
              ["Payload", "4.1 MB"],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-label-xs text-secondary">{label}</dt>
                <dd className="text-copy-sm-mono text-primary">{value}</dd>
              </div>
            ))}
          </dl>
        </StaffOnly>

        <Section title="Weekly statistics">
          <div className="grid gap-4 sm:grid-cols-3">
            {WEEKLY_STATS.map((stat, index) => (
              <Card
                key={stat.label}
                className="animate-enter gap-0 px-4 py-4"
                style={{ ["--i" as string]: index }}
              >
                <span className="text-[11px] leading-4 font-medium tracking-[0.04em] text-secondary uppercase">
                  {stat.label}
                </span>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="tabular-nums text-h1 text-primary">
                    {stat.value}
                  </span>
                  <Badge variant={stat.favourable ? "green" : "amber"}>
                    {stat.delta}
                  </Badge>
                </div>
                <span className="mt-1 text-copy-sm text-secondary">
                  vs the previous week
                </span>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="Activity">
          <IntegrationCharts mergedLabel="Merged PRs" />
        </Section>

        {/* Pull requests -------------------------------------------------- */}
        <Section
          title="Pull requests"
          description={`${filtered.length} pull requests in this repository.`}
        >
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] p-3">
              <Input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search pull requests…"
                aria-label="Search pull requests"
                type="search"
                autoComplete="off"
                spellCheck={false}
                prefix={<MagnifyingGlass aria-hidden="true" />}
                containerClassName="w-[260px]"
              />
              <FilterSelect
                label="Author"
                allLabel="Any author"
                value={author}
                onChange={setAuthor}
                options={authors}
              />
              <FilterSelect
                label="Target branch"
                allLabel="Any branch"
                value={branch}
                onChange={setBranch}
                options={branches}
              />
              <FilterSelect
                label="State"
                allLabel="Any state"
                value={state}
                onChange={setState}
                options={["open", "merged", "closed", "draft"]}
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
                  icon={<MagnifyingGlass aria-hidden="true" />}
                  title="No pull requests match these filters"
                  description="Adjust the search or filters to see results."
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
                      <TableHeaderCell>State</TableHeaderCell>
                      <TableHeaderCell>Author</TableHeaderCell>
                      <TableHeaderCell className="min-w-[300px]">Name</TableHeaderCell>
                      <TableHeaderCell>Branches</TableHeaderCell>
                      <TableHeaderCell>Created</TableHeaderCell>
                      <TableHeaderCell>Updated</TableHeaderCell>
                      <TableHeaderCell>Merged / closed</TableHeaderCell>
                      <TableHeaderCell>
                        <StaffOnly inline>Downloaded</StaffOnly>
                      </TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visible.map((pr) => {
                      const badge = STATE_BADGE[pr.state as PrState];
                      return (
                        <TableRow key={pr.id} interactive>
                          <TableCell>
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              <Avatar name={pr.author} size="sm" />
                              <span className="truncate">{pr.author}</span>
                              {pr.authorUnlinked ? (
                                <Tooltip content="This git identity is not linked to a Pensero user, so its delivery is unattributed.">
                                  <Badge variant="amber">Unlinked</Badge>
                                </Tooltip>
                              ) : null}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-[380px]">
                            <Link
                              href={`/integrations/github/${owner}/${repo}`}
                              className="block truncate rounded-[4px] outline-none hover:underline focus-visible:shadow-[var(--ds-focus-ring)]"
                            >
                              {pr.title}{" "}
                              <span className="text-secondary">
                                #{pr.id}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-secondary">
                            <span className="text-label-xs-mono">{pr.source}</span>
                            <span className="px-1">→</span>
                            <span className="text-label-xs-mono">{pr.target}</span>
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-secondary">
                            {pr.createdAt}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-secondary">
                            {pr.updatedAt}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-secondary">
                            {pr.resolvedAt ?? "—"}
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-secondary">
                            {pr.downloadedAt}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="border-t border-[var(--border-subtle)] p-3">
                  <Pagination
                    page={page}
                    pageSize={PAGE_SIZE}
                    total={filtered.length}
                    onPageChange={setPage}
                    label="pull requests"
                  />
                </div>
              </>
            )}
          </Card>
        </Section>
      </div>
    </IntegrationsPage>
  );
}

function FilterSelect({
  label,
  allLabel,
  value,
  onChange,
  options,
}: {
  label: string;
  allLabel: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className="min-w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function RepoSwitcher({ current }: { current: string }) {
  const grouped = INSTANCES.map((inst) => ({
    instance: inst,
    repos: REPOSITORIES.filter((r) => r.instanceId === inst.id),
  })).filter((g) => g.repos.length > 0);

  return (
    <Menu>
      <MenuTrigger asChild>
        <Button
          variant="secondary"
          suffix={<CaretUpDown aria-hidden="true" />}
        >
          Switch repository
        </Button>
      </MenuTrigger>
      <MenuContent align="start" className="max-h-[320px] w-[300px] overflow-y-auto overscroll-contain">
        {grouped.map((group) => (
          <div key={group.instance.id}>
            <MenuLabel>{group.instance.label}</MenuLabel>
            {group.repos.map((r) => (
              <MenuItem key={r.id} asChild>
                <Link href={`/integrations/github/${r.owner}/${r.name}`}>
                  <span className="truncate">
                    {r.owner}/{r.name}
                  </span>
                  {`${r.owner}/${r.name}` === current ? (
                    <Badge className="ml-auto">Current</Badge>
                  ) : null}
                </Link>
              </MenuItem>
            ))}
          </div>
        ))}
      </MenuContent>
    </Menu>
  );
}
