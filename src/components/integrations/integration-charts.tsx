"use client";

import {
  ChartCard,
  ChartCardBody,
  ChartCardHeader,
  ChartCardHeadline,
  ChartLegend,
  InfoAction,
  ShareAction,
} from "@/components/app/chart-card";
import {
  PercentStackedWeekChart,
  StackedWeekChart,
} from "@/components/app/charts/stacked-week-chart";
import { weeks } from "@/lib/data";
import { pct } from "@/lib/format";

/** Weekly rows derived from the shared series so the charts stay deterministic. */
const PROCESSING = weeks.map((week) => {
  const downloaded = Math.round(Number(week.total) * 1.6);
  const failed = Math.max(0, Math.round(Number(week.human) * 0.06));
  return {
    ...week,
    prProcessed: downloaded - failed,
    prFailed: failed,
  };
});

const USERS = ["Aisha K.", "Tomas L.", "Elena V.", "Priya N.", "Others"];
const REPOS = ["acme/web-app", "acme/api", "acme/design-system", "Others"];

function shareRows(names: string[], seed: number) {
  let state = seed;
  const rand = () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
  return weeks.map((week) => {
    const raw = names.map((_, index) => 1 / (index + 1) + rand() * 0.35);
    const sum = raw.reduce((a, b) => a + b, 0);
    const row: Record<string, number | string> = {
      week: week.week,
      label: week.label,
    };
    let running = 0;
    names.forEach((name, index) => {
      const value =
        index === names.length - 1
          ? Math.round((100 - running) * 10) / 10
          : Math.round((raw[index] / sum) * 1000) / 10;
      running = Math.round((running + value) * 10) / 10;
      row[name] = value;
    });
    return row;
  });
}

const BY_USER = shareRows(USERS, 4242);
const BY_REPO = shareRows(REPOS, 7788);

const seriesColor = (index: number) =>
  `var(--series-${String(index + 1).padStart(2, "0")})`;

const PROCESSING_SERIES = [
  {
    key: "prProcessed",
    label: "Processed",
    color: "var(--series-assisted)",
    format: (value: number) => `${value} PRs`,
  },
  {
    key: "prFailed",
    label: "Failed",
    color: "var(--ds-red-700)",
    format: (value: number) => `${value} PRs`,
  },
];

const userSeries = USERS.map((name, index) => ({
  key: name,
  label: name,
  color: seriesColor(index),
  format: (value: number) => pct(value, 1),
}));

const repoSeries = REPOS.map((name, index) => ({
  key: name,
  label: name,
  color: seriesColor(index),
  format: (value: number) => pct(value, 1),
}));

/**
 * The three charts that appear on both the provider page and a repository.
 * `mergedLabel` differs between the two scopes.
 */
export function IntegrationCharts({
  mergedLabel = "Merged PRs by repo",
}: {
  mergedLabel?: string;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <ChartCard order={1}>
        <ChartCardHeader title="PR processing health">
          <ShareAction label="Share this chart" />
          <InfoAction>
            Pull requests downloaded each week, split by whether processing
            succeeded. A run of failures usually means a permissions change.
          </InfoAction>
        </ChartCardHeader>
        <ChartCardHeadline value="99.4% processed">
          — last 12 months
        </ChartCardHeadline>
        <ChartCardBody>
          <StackedWeekChart
            data={PROCESSING}
            series={PROCESSING_SERIES}
            aspectRatio="2.2 / 1"
          />
          <ChartLegend
            className="mt-4"
            items={PROCESSING_SERIES.map((item) => ({
              label: item.label,
              color: item.color,
            }))}
          />
        </ChartCardBody>
      </ChartCard>

      <ChartCard order={2}>
        <ChartCardHeader title="PRs by git user">
          <ShareAction label="Share this chart" />
          <InfoAction>
            Share of merged pull requests per git identity. Unlinked identities
            are grouped under “Others”.
          </InfoAction>
        </ChartCardHeader>
        <ChartCardHeadline value="12 active authors">
          — last 12 months
        </ChartCardHeadline>
        <ChartCardBody>
          <PercentStackedWeekChart
            data={BY_USER}
            series={userSeries}
            aspectRatio="2.2 / 1"
          />
          <ChartLegend
            className="mt-4"
            items={userSeries.map((item) => ({
              label: item.label,
              color: item.color,
            }))}
          />
        </ChartCardBody>
      </ChartCard>

      <ChartCard order={3}>
        <ChartCardHeader title={mergedLabel}>
          <ShareAction label="Share this chart" />
          <InfoAction>
            Weekly share of merged pull requests, so a repository that stops
            contributing is visible immediately.
          </InfoAction>
        </ChartCardHeader>
        <ChartCardHeadline value="4,167 merged">
          — last 12 months
        </ChartCardHeadline>
        <ChartCardBody>
          <PercentStackedWeekChart
            data={BY_REPO}
            series={repoSeries}
            aspectRatio="2.2 / 1"
          />
          <ChartLegend
            className="mt-4"
            items={repoSeries.map((item) => ({
              label: item.label,
              color: item.color,
            }))}
          />
        </ChartCardBody>
      </ChartCard>
    </div>
  );
}
