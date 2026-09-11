"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  type SortDirection,
} from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import {
  ArrowsClockwise,
  CaretRight,
  Cloud,
  ClockCounterClockwise,
  DotsThree,
  HardDrives,
  Info,
  MagnifyingGlass,
  Plus,
  Sliders,
  Warning,
} from "@/components/icons";
import { ProviderIcon } from "@/components/provider-icon";
import {
  INSTANCES,
  REPOSITORIES,
  type Repository,
} from "@/lib/integrations-data";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";
import { IntegrationCharts } from "./integration-charts";
import { HealthPanel } from "./health-panel";
import {
  IntegrationsPage,
  Section,
  StaffOnly,
  StaffTag,
  useDismissible,
} from "./shared";

type SortKey = "name" | "prs" | "lastFetch" | "lastCommit";

export function GithubRepositories() {
  const [query, setQuery] = useState("");
  const [autoSync, setAutoSync] = useState("all");
  const [warnings, setWarnings] = useState("all");
  const [stale, setStale] = useState("all");
  const [instance, setInstance] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDirection }>({
    key: "name",
    dir: "asc",
  });
  const [expanded, setExpanded] = useState<string[]>([
    "cloud:acme",
    "ghes-eu:platform",
  ]);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const banners = useDismissible();

  const filtersActive =
    query !== "" ||
    autoSync !== "all" ||
    warnings !== "all" ||
    stale !== "all" ||
    instance !== "all";

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return REPOSITORIES.filter((repo) => {
      const on = overrides[repo.id] ?? repo.autoSync;
      if (
        needle &&
        !`${repo.owner}/${repo.name}`.toLowerCase().includes(needle)
      )
        return false;
      if (autoSync === "on" && !on) return false;
      if (autoSync === "off" && on) return false;
      if (warnings === "only" && !repo.warning) return false;
      if (warnings === "none" && repo.warning) return false;
      if (stale === "stale" && !repo.stale) return false;
      if (stale === "fresh" && repo.stale) return false;
      if (instance !== "all" && repo.instanceId !== instance) return false;
      return true;
    });
  }, [query, autoSync, warnings, stale, instance, overrides]);

  /** instance → owner → repositories, in the order the instances are listed. */
  const tree = useMemo(() => {
    return INSTANCES.map((inst) => {
      const owners = new Map<string, Repository[]>();
      for (const repo of rows.filter((r) => r.instanceId === inst.id)) {
        const list = owners.get(repo.owner) ?? [];
        list.push(repo);
        owners.set(repo.owner, list);
      }
      const dir = sort.dir === "desc" ? -1 : 1;
      for (const list of owners.values()) {
        list.sort((a, b) => {
          if (sort.key === "prs")
            return (a.prsDownloaded - b.prsDownloaded) * dir;
          return (
            `${a.owner}/${a.name}`.localeCompare(`${b.owner}/${b.name}`) * dir
          );
        });
      }
      return { instance: inst, owners: [...owners.entries()] };
    }).filter((group) => group.owners.length > 0);
  }, [rows, sort]);

  const toggleGroup = (key: string) =>
    setExpanded((v) =>
      v.includes(key) ? v.filter((k) => k !== key) : [...v, key],
    );

  const sortBy = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );

  const clearFilters = () => {
    setQuery("");
    setAutoSync("all");
    setWarnings("all");
    setStale("all");
    setInstance("all");
  };

  return (
    <IntegrationsPage
      crumbs={[
        { label: "Integrations", href: "/integrations" },
        { label: "GitHub repositories" },
      ]}
      titleIcon={<ProviderIcon provider="github" size="lg" />}
      title="GitHub"
      actions={
        <>
          <Button variant="primary" prefix={<Plus aria-hidden="true" />}>
            Add repository
          </Button>
          <Button variant="secondary">Add instance</Button>
          <Button
            asChild
            variant="secondary"
            prefix={<ClockCounterClockwise aria-hidden="true" />}
          >
            <Link href="/integrations/sync-log?integration=github">
              Sync log
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            prefix={<Sliders aria-hidden="true" />}
            suffix={<Badge>4</Badge>}
          >
            <Link href="/settings/repository-sync">
              Repository sync settings
            </Link>
          </Button>
          <Button
            variant="secondary"
            prefix={<ArrowsClockwise aria-hidden="true" />}
          >
            Fetch stale
          </Button>
          <Menu>
            <MenuTrigger asChild>
              <Button
                variant="secondary"
                shape="square"
                aria-label="More actions"
              >
                <DotsThree aria-hidden="true" weight="bold" />
              </Button>
            </MenuTrigger>
            <MenuContent align="end" className="w-[220px]">
              <MenuItem>
                <StaffTag />
                Resolve GitHub orgs
              </MenuItem>
              <MenuSeparator />
              <MenuItem className="text-[var(--ds-red-text)]">
                Disconnect
              </MenuItem>
            </MenuContent>
          </Menu>
        </>
      }
    >
      <div className="flex flex-col gap-8">
        {/* Contextual banners ------------------------------------------- */}
        {banners.any(["fetch-failed", "progress"]) ? (
          <div className="flex flex-col gap-3">
            {banners.visible("fetch-failed") && (
              <Banner
                severity="warning"
                title="Some repositories could not be fetched"
                onDismiss={() => banners.dismiss("fetch-failed")}
                action={
                  <Button variant="secondary" asChild>
                    <Link href="/integrations/sync-log?status=failed">
                      See failed sync log
                    </Link>
                  </Button>
                }
              >
                Two repositories were skipped in the last run because of
                credentials or permissions.
              </Banner>
            )}
            {banners.visible("progress") && (
              <ConnectionProgress
                onDismiss={() => banners.dismiss("progress")}
              />
            )}
          </div>
        ) : null}

        {/* Instances ---------------------------------------------------- */}
        <Section
          title="Instances"
          description="The cloud account and any GitHub Enterprise Server you have added."
        >
          <Card className="divide-y divide-[var(--border-subtle)] overflow-hidden">
            {INSTANCES.map((inst) => (
              <div
                key={inst.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-[7px] bg-[var(--ds-gray-alpha-100)] text-secondary">
                  {inst.kind === "cloud" ? (
                    <Cloud aria-hidden="true" className="size-4" />
                  ) : (
                    <HardDrives aria-hidden="true" className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-label-default font-medium text-primary">
                    {inst.label}
                  </p>
                  <p className="mt-0.5 truncate text-label-xs-mono text-secondary">
                    {inst.urls.internal
                      ? `${inst.urls.internal} · ${inst.urls.public}`
                      : inst.urls.public}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {inst.kind === "self-hosted" ? (
                    <Button variant="tertiary">
                      Edit instance
                    </Button>
                  ) : null}
                  <Button variant="secondary">
                    Add repository
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </Section>

        <HealthPanel scope="the GitHub connection and every connected repository" />

        <Section title="Activity">
          <IntegrationCharts mergedLabel="Merged PRs by repo" />
        </Section>

        {/* Repositories -------------------------------------------------- */}
        <Section
          title="Repositories"
          description={`${rows.length} of ${REPOSITORIES.length} repositories across ${INSTANCES.length} instances.`}
        >
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] p-3">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search repositories…"
                aria-label="Search repositories"
                type="search"
                autoComplete="off"
                spellCheck={false}
                prefix={<MagnifyingGlass aria-hidden="true" />}
                containerClassName="w-[240px]"
              />
              <FilterGroup label="Auto-sync">
                <SegmentedControl
                  aria-label="Auto-sync"
                  value={autoSync}
                  onValueChange={setAutoSync}
                  options={[
                    { value: "all", label: "All" },
                    { value: "on", label: "On" },
                    { value: "off", label: "Off" },
                  ]}
                />
              </FilterGroup>
              <FilterGroup label="Warnings">
                <SegmentedControl
                  aria-label="Warnings"
                  value={warnings}
                  onValueChange={setWarnings}
                  options={[
                    { value: "all", label: "All" },
                    { value: "none", label: "None" },
                    { value: "only", label: "Only" },
                  ]}
                />
              </FilterGroup>
              <Select value={instance} onValueChange={setInstance}>
                <SelectTrigger aria-label="Instance" className="w-[190px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All instances</SelectItem>
                  {INSTANCES.map((inst) => (
                    <SelectItem key={inst.id} value={inst.id}>
                      {inst.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <StaffOnly inline>
                <FilterGroup label="Stale">
                  <SegmentedControl
                    aria-label="Stale"
                    value={stale}
                    onValueChange={setStale}
                    options={[
                      { value: "all", label: "All" },
                      { value: "stale", label: "Stale" },
                      { value: "fresh", label: "Fresh" },
                    ]}
                  />
                </FilterGroup>
              </StaffOnly>
              {filtersActive ? (
                <Button variant="tertiary" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : null}
            </div>

            {rows.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={<MagnifyingGlass aria-hidden="true" />}
                  title="No repositories match these filters"
                  description="Try a different search term, or clear the filters to see everything."
                  action={
                    <Button
                      variant="secondary"
                      onClick={clearFilters}
                    >
                      Clear filters
                    </Button>
                  }
                />
              </div>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell
                      sortable
                      direction={sort.key === "name" ? sort.dir : null}
                      onSort={() => sortBy("name")}
                      className="min-w-[280px]"
                    >
                      Name
                    </TableHeaderCell>
                    <TableHeaderCell
                      sortable
                      direction={sort.key === "prs" ? sort.dir : null}
                      onSort={() => sortBy("prs")}
                    >
                      PRs
                    </TableHeaderCell>
                    <TableHeaderCell>Synced until</TableHeaderCell>
                    <TableHeaderCell>Last fetch</TableHeaderCell>
                    <TableHeaderCell>Last commit</TableHeaderCell>
                    <TableHeaderCell>Auto-sync</TableHeaderCell>
                    <TableHeaderCell>
                      <StaffOnly inline>Stale</StaffOnly>
                    </TableHeaderCell>
                    <TableHeaderCell>Warning</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tree.map(({ instance: inst, owners }) => (
                    <InstanceGroup
                      key={inst.id}
                      instanceId={inst.id}
                      label={inst.label}
                      kind={inst.kind}
                      credential={inst.credential}
                      owners={owners}
                      expanded={expanded}
                      onToggle={toggleGroup}
                      overrides={overrides}
                      onOverride={(id, value) =>
                        setOverrides((v) => ({ ...v, [id]: value }))
                      }
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </Section>
      </div>
    </IntegrationsPage>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-label-xs text-secondary">{label}</span>
      {children}
    </span>
  );
}

function ConnectionProgress({ onDismiss }: { onDismiss: () => void }) {
  const mounted = useMounted();
  return (
    <Banner
      severity={mounted ? "success" : "info"}
      title={mounted ? "12 repositories connected" : "Connecting repositories…"}
      // The banner is only dismissible once it has settled: nothing to clear
      // while the run is still in progress.
      onDismiss={mounted ? onDismiss : undefined}
    >
      {mounted
        ? "The initial import has finished. Pull requests continue to sync in the background."
        : "Importing repositories from github.com/acme."}
    </Banner>
  );
}

function InstanceGroup({
  instanceId,
  label,
  kind,
  credential,
  owners,
  expanded,
  onToggle,
  overrides,
  onOverride,
}: {
  instanceId: string;
  label: string;
  kind: "cloud" | "self-hosted";
  credential: { state: "ok" | "expired" | "loading"; label: string };
  owners: [string, Repository[]][];
  expanded: string[];
  onToggle: (key: string) => void;
  overrides: Record<string, boolean>;
  onOverride: (id: string, value: boolean) => void;
}) {
  const mounted = useMounted();

  return (
    <>
      <TableRow className="bg-[var(--ds-gray-alpha-100)]">
        <TableCell colSpan={8}>
          <div className="flex flex-wrap items-center gap-2">
            {kind === "cloud" ? (
              <Cloud
                aria-hidden="true"
                className="size-4 text-secondary"
              />
            ) : (
              <HardDrives
                aria-hidden="true"
                className="size-4 text-secondary"
              />
            )}
            <span className="text-label-sm font-medium text-primary">
              {label}
            </span>
            {mounted ? (
              <Badge variant={credential.state === "ok" ? "green" : "red"}>
                {credential.label}
              </Badge>
            ) : (
              <Skeleton className="h-5 w-[70px] rounded-full" />
            )}
          </div>
        </TableCell>
      </TableRow>

      {owners.map(([owner, repos]) => {
        const key = `${instanceId}:${owner}`;
        const isOpen = expanded.includes(key);
        const downloaded = repos.reduce((a, r) => a + r.prsDownloaded, 0);
        const total = repos.reduce((a, r) => a + r.prsTotal, 0);
        const active = repos.filter(
          (r) => overrides[r.id] ?? r.autoSync,
        ).length;
        const warns = repos.filter((r) => r.warning).length;

        return (
          // The group header and its repo rows are siblings in the table, so
          // the fragment is the mapped element and carries the key.
          <Fragment key={key}>
            <TableRow>
              <TableCell className="pl-6">
                <button
                  type="button"
                  onClick={() => onToggle(key)}
                  aria-expanded={isOpen}
                  className="inline-flex items-center gap-1.5 rounded-[4px] outline-none focus-visible:shadow-[var(--ds-focus-ring)]"
                >
                  <CaretRight
                    aria-hidden="true"
                    className={cn(
                      "size-3 text-tertiary transition-transform duration-150",
                      isOpen && "rotate-90",
                    )}
                  />
                  <span className="font-medium">{owner}</span>
                  <span className="text-label-xs text-secondary">
                    {repos.length} repos
                  </span>
                </button>
              </TableCell>
              <TableCell className="tabular-nums text-secondary">
                {downloaded} / {total}
              </TableCell>
              <TableCell colSpan={3} />
              <TableCell className="tabular-nums text-secondary">
                {active} / {repos.length}
              </TableCell>
              <TableCell />
              <TableCell>
                {warns > 0 ? <Badge variant="amber">{warns}</Badge> : null}
              </TableCell>
            </TableRow>

            {isOpen
              ? repos.map((repo) => (
                  <RepoRow
                    key={repo.id}
                    repo={repo}
                    autoSync={overrides[repo.id] ?? repo.autoSync}
                    onAutoSync={(value) => onOverride(repo.id, value)}
                  />
                ))
              : null}
          </Fragment>
        );
      })}
    </>
  );
}

function RepoRow({
  repo,
  autoSync,
  onAutoSync,
}: {
  repo: Repository;
  autoSync: boolean;
  onAutoSync: (value: boolean) => void;
}) {
  return (
    <TableRow interactive>
      <TableCell className="pl-12">
        <Link
          href={`/integrations/github/${repo.owner}/${repo.name}`}
          className="rounded-[4px] outline-none hover:underline focus-visible:shadow-[var(--ds-focus-ring)]"
        >
          <span className="text-secondary">{repo.owner}/</span>
          <span className="font-medium">{repo.name}</span>
        </Link>
      </TableCell>
      <TableCell className="tabular-nums">
        <Tooltip
          content={`${repo.prsDownloaded} downloaded of ${repo.prsTotal} known pull requests.`}
        >
          <span>
            {repo.prsDownloaded} / {repo.prsTotal}
          </span>
        </Tooltip>
      </TableCell>
      <TableCell className="tabular-nums whitespace-nowrap text-secondary">
        <Tooltip content="Pull requests are complete up to this point. Times are shown in your local zone.">
          <span>{repo.syncedUntil}</span>
        </Tooltip>
      </TableCell>
      <TableCell className="whitespace-nowrap text-secondary">
        {repo.lastFetch}
      </TableCell>
      <TableCell className="whitespace-nowrap text-secondary">
        {repo.lastCommit ?? "No commit yet"}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Switch
            checked={autoSync}
            onCheckedChange={onAutoSync}
            aria-label={`Auto-sync ${repo.owner}/${repo.name}`}
          />
          {repo.syncing ? <Badge variant="blue">Syncing…</Badge> : null}
          {!autoSync && repo.autoSyncNote ? (
            <Tooltip content={repo.autoSyncNote}>
              <Info
                aria-hidden="true"
                className="size-3.5 shrink-0 text-tertiary"
              />
            </Tooltip>
          ) : null}
        </div>
      </TableCell>
      <TableCell>
        {repo.stale ? (
          <StaffOnly inline>
            <span className="text-label-xs">Stale</span>
          </StaffOnly>
        ) : null}
      </TableCell>
      <TableCell className="max-w-[220px]">
        {repo.warning ? (
          <Tooltip content={repo.warning}>
            <span className="inline-flex min-w-0 items-center gap-1.5 text-[var(--ds-amber-text)]">
              <Warning
                aria-hidden="true"
                className="size-3.5 shrink-0"
                weight="fill"
              />
              <span className="truncate text-label-xs">{repo.warning}</span>
            </span>
          </Tooltip>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
