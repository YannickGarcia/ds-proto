"use client";

import {
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
} from "@/components/icons";
import { useMemo, useState } from "react";
import {
  ChartCard,
  ChartCardBody,
  ChartCardFooter,
  ChartCardHeader,
  ChartCardHeadline,
  ChartLegend,
  InfoAction,
  SectionHeader,
  ShareAction,
} from "@/components/app/chart-card";
import { DailyCostHeatmap } from "@/components/app/charts/daily-cost-heatmap";
import { DistributionChart } from "@/components/app/charts/distribution-chart";
import { QuadrantScatter } from "@/components/app/charts/quadrant-scatter";
import {
  BenchmarkRule,
  PercentStackedWeekChart,
  StackedWeekChart,
} from "@/components/app/charts/stacked-week-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuTrigger,
} from "@/components/ui/menu";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  adoptionSummary,
  costSummary,
  deliverySummary,
  DISTRIBUTION_DIMENSIONS,
  type DistributionDimension,
  distribution,
  HARNESSES,
  harnessLeader,
  harnessShare,
  LEVELS,
  MODELS,
  modelLeader,
  modelShare,
  people,
  POSITIONS,
  TEAMS,
  weeks,
} from "@/lib/data";
import { pct, usd } from "@/lib/format";

const seriesColor = (index: number) =>
  `var(--series-${String(index + 1).padStart(2, "0")})`;

const TOOLTIPS = {
  deliverySplit:
    "Weekly PR and review delivery points stacked by human, AI-assisted, and agentic attribution.",
  adoptionAssisted:
    "Percentage of active developers (those who merged code) with any AI tool usage tracked by Proto.",
  adoptionAgentic:
    "Active developers (merged code) with at least one pull request via agent identity in the period.",
  costPerPoint:
    "Measures AI cost efficiency by dividing total AI spend by delivery points completed. Includes on-demand spend and subscription-included usage reported by each provider, plus estimated agentic (Devin) spend and agent delivery. Only users with both AI spend and activity in the period count.",
  totalCost:
    "Total AI cost: AI-assisted tool usage (on-demand plus subscription-included usage) reported by each provider, plus estimated agentic spend from Devin sessions and reviews. Actual billing may differ depending on your plan or contract with each tool.",
  distribution:
    "Buckets ranked by cost per delivery point (most inefficient first). Hover a bar for spend, delivery, and share of total points.",
  harnesses:
    "Breakdown of AI-assisted code by tool source. Each bar represents the share of accepted lines per AI tool — Cursor, Claude Code, GitHub Copilot, and others.",
  models:
    "Distribution of AI models based on token usage, or merged AI lines when token breakdown is unavailable.",
} as const;

export function SummaryTab({
  scopeSize,
  range,
}: {
  scopeSize: number;
  range: string;
}) {
  return (
    <div className="mt-10 flex flex-col gap-12">
      <DeliveryAndAdoption />
      <EfficiencyAndCost range={range} />
      <WhoGetsValue range={range} scopeSize={scopeSize} />
      <UsageBreakdown />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4.2 Delivery & adoption                                                     */
/* -------------------------------------------------------------------------- */

const DELIVERY_SERIES = [
  {
    key: "human",
    label: "Human delivery",
    color: "var(--series-human)",
    format: (value: number) => `${value.toFixed(1)} pts`,
  },
  {
    key: "assisted",
    label: "AI-assisted delivery",
    color: "var(--series-assisted)",
    format: (value: number) => `${value.toFixed(1)} pts`,
  },
  {
    key: "agentic",
    label: "Agentic delivery",
    color: "var(--series-agentic)",
    format: (value: number) => `${value.toFixed(1)} pts`,
  },
];

function DeliveryAndAdoption() {
  const [mode, setMode] = useState<"assisted" | "agentic">("assisted");

  const adoptionSeries = useMemo(
    () =>
      mode === "assisted"
        ? [
            {
              key: "aiUsersPct",
              label: "AI users",
              color: "var(--series-assisted)",
              format: (value: number) => pct(value),
            },
            {
              key: "nonAiUsersPct",
              label: "Non-AI users",
              color: "var(--series-inactive)",
              format: (value: number) => pct(value),
            },
          ]
        : [
            {
              key: "agenticUsersPct",
              label: "Agentic users",
              color: "var(--series-agentic)",
              format: (value: number) => pct(value),
            },
            {
              key: "nonAgenticUsersPct",
              label: "Non-agentic users",
              color: "var(--series-inactive)",
              format: (value: number) => pct(value),
            },
          ],
    [mode],
  );

  return (
    <section id="delivery-adoption" className="scroll-mt-32">
      <SectionHeader
        title="Delivery &amp; adoption"
        subtitle="How work splits across humans, AI-assist and agents, and who’s adopting"
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard order={1}>
          <ChartCardHeader title="How does PR &amp; review delivery split across humans, AI-assist and agents?">
            <ShareAction label="Share this chart" />
            <InfoAction>{TOOLTIPS.deliverySplit}</InfoAction>
          </ChartCardHeader>
          <ChartCardHeadline
            value={`${deliverySummary.totalPoints} pts · ${deliverySummary.humanPct}% human · ${deliverySummary.assistedPct}% AI-assisted · ${deliverySummary.agenticPct}% agentic`}
          >
            — Weekly average: {deliverySummary.weeklyAverage}
          </ChartCardHeadline>
          <ChartCardBody>
            <StackedWeekChart
              data={weeks}
              series={DELIVERY_SERIES}
              totalRow={(point) => ({
                label: "Total delivery",
                value: `${Number(point.total ?? 0).toFixed(1)} pts`,
              })}
            />
            <ChartLegend
              className="mt-4"
              items={DELIVERY_SERIES.map((item) => ({
                label: item.label,
                color: item.color,
              }))}
            />
          </ChartCardBody>
        </ChartCard>

        <ChartCard order={2}>
          <ChartCardHeader title="How many active developers are using AI coding tools?">
            <SegmentedControl
              aria-label="Adoption mode"
              value={mode}
              onValueChange={setMode}
              options={[
                { value: "assisted", label: "AI-assisted" },
                { value: "agentic", label: "Agentic" },
              ]}
            />
            <ShareAction label="Share this chart" />
            <InfoAction>
              {mode === "assisted"
                ? TOOLTIPS.adoptionAssisted
                : TOOLTIPS.adoptionAgentic}
            </InfoAction>
          </ChartCardHeader>
          <ChartCardHeadline
            value={`${
              mode === "assisted"
                ? adoptionSummary.aiPct
                : adoptionSummary.agenticPct
            }% of active developers using ${mode === "assisted" ? "AI tools" : "agents"}`}
          >
            — Weekly average:{" "}
            {mode === "assisted"
              ? `${adoptionSummary.aiWeeklyAverage}%`
              : `${adoptionSummary.agenticWeeklyAverage}%`}
          </ChartCardHeadline>
          <ChartCardBody>
            <PercentStackedWeekChart
              data={weeks}
              series={adoptionSeries}
              totalRow={(point) => ({
                label: mode === "assisted" ? "AI users" : "Agentic users",
                value: `${
                  mode === "assisted" ? point.aiUsers : point.agenticUsers
                } of ${point.activeDevs} devs`,
              })}
            >
              <BenchmarkRule
                value={adoptionSummary.benchmarkMedian}
                label={`Proto median: ${adoptionSummary.benchmarkMedian}%`}
              />
            </PercentStackedWeekChart>
            <ChartLegend
              className="mt-4"
              items={[
                ...adoptionSeries.map((item) => ({
                  label: item.label,
                  color: item.color,
                })),
                {
                  label: `Proto median: ${adoptionSummary.benchmarkMedian}%`,
                  color: "var(--ds-gray-alpha-600)",
                  dashed: true,
                },
              ]}
            />
          </ChartCardBody>
        </ChartCard>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4.3 Efficiency & cost                                                       */
/* -------------------------------------------------------------------------- */

const CPP_SERIES = [
  {
    key: "cppAssisted",
    label: "AI-assisted $/pt",
    color: "var(--series-assisted)",
    format: (value: number) => `$${value.toFixed(2)}/pt`,
  },
  {
    key: "cppAgentic",
    label: "Agentic $/pt",
    color: "var(--series-agentic)",
    format: (value: number) => `$${value.toFixed(2)}/pt`,
  },
];

const COST_SERIES = [
  {
    key: "costAssisted",
    label: "AI-assisted cost",
    color: "var(--series-assisted)",
    format: (value: number) => usd(value, 2),
  },
  {
    key: "costAgentic",
    label: "Agentic cost",
    color: "var(--series-agentic)",
    format: (value: number) => usd(value, 2),
  },
];

function EfficiencyAndCost({ range }: { range: string }) {
  const [dimension, setDimension] = useState<DistributionDimension>("category");
  const [year, setYear] = useState(2025);

  const active = DISTRIBUTION_DIMENSIONS.find(
    (item) => item.value === dimension,
  );

  return (
    <section id="efficiency-cost" className="scroll-mt-32">
      <SectionHeader
        title="Efficiency &amp; cost"
        subtitle="How efficiently we’re using AI and what it costs"
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard order={3}>
          <ChartCardHeader title="How much does it cost to deliver a point?">
            <ShareAction label="Share this chart" />
            <InfoAction>{TOOLTIPS.costPerPoint}</InfoAction>
          </ChartCardHeader>
          <ChartCardHeadline
            value={`$${costSummary.costPerPoint.toFixed(2)} per delivery point`}
          >
            — Weekly average: {costSummary.costPerPointWeeklyAverage}
          </ChartCardHeadline>
          <ChartCardBody>
            <StackedWeekChart
              data={weeks}
              series={CPP_SERIES}
              totalRow={(point) => ({
                label: "Total $/pt",
                value: `$${Number(point.cppTotal ?? 0).toFixed(2)}/pt`,
              })}
            />
            <ChartLegend
              className="mt-4"
              items={CPP_SERIES.map((item) => ({
                label: item.label,
                color: item.color,
              }))}
            />
          </ChartCardBody>
        </ChartCard>

        <ChartCard order={4}>
          <ChartCardHeader title="What is our AI model usage costing?">
            <ShareAction label="Share this chart" />
            <InfoAction>{TOOLTIPS.totalCost}</InfoAction>
          </ChartCardHeader>
          <ChartCardHeadline
            value={`${usd(costSummary.totalCost)} in total AI cost this period`}
          >
            — Weekly average: {usd(costSummary.weeklyAverage, 2)}
          </ChartCardHeadline>
          <ChartCardBody>
            <StackedWeekChart
              data={weeks}
              series={COST_SERIES}
              totalRow={(point) => ({
                label: "Total AI cost",
                value: usd(Number(point.costTotal ?? 0), 2),
              })}
            />
            <ChartLegend
              className="mt-4"
              items={COST_SERIES.map((item) => ({
                label: item.label,
                color: item.color,
              }))}
            />
          </ChartCardBody>
        </ChartCard>

        <ChartCard order={5} className="xl:col-span-2">
          <ChartCardHeader title="Daily AI cost">
            <div className="flex items-center gap-1">
              <Button
                variant="tertiary"
                shape="square"
                aria-label={`Show ${year - 1}`}
                onClick={() => setYear((value) => value - 1)}
              >
                <CaretLeft aria-hidden="true" />
              </Button>
              <span className="tabular-nums w-10 text-center text-button-default text-primary">
                {year}
              </span>
              <Button
                variant="tertiary"
                shape="square"
                aria-label={`Show ${year + 1}`}
                disabled={year >= 2025}
                onClick={() => setYear((value) => value + 1)}
              >
                <CaretRight aria-hidden="true" />
              </Button>
            </div>
            <ShareAction label="Share this chart" />
            <InfoAction>{TOOLTIPS.totalCost}</InfoAction>
          </ChartCardHeader>
          <ChartCardBody>
            <DailyCostHeatmap year={year} highlightWeekStart="2025-09-01" />
          </ChartCardBody>
        </ChartCard>

        <ChartCard order={6} className="xl:col-span-2">
          <ChartCardHeader title="$/point distribution">
            <SegmentedControl
              aria-label="Distribution dimension"
              value={dimension}
              onValueChange={setDimension}
              options={DISTRIBUTION_DIMENSIONS.map((item) => ({
                value: item.value,
                label: item.label,
              }))}
            />
            <ShareAction label="Share this chart" />
            <InfoAction>{TOOLTIPS.distribution}</InfoAction>
          </ChartCardHeader>
          <ChartCardBody className="pt-1">
            <DistributionChart
              bars={distribution[dimension]}
              emptyState={active?.emptyState ?? ""}
            />
          </ChartCardBody>
          <ChartCardFooter>
            {dimension === "model"
              ? "Read as: which model costs most per point. Usage-based model cost only — included subscription spend is not in this breakdown. Hover a bar for spend, delivery, and share of total points."
              : "Read as: which work type / size / complexity / person / model costs most per point. Hover a bar for spend, delivery, and share of total points."}
          </ChartCardFooter>
        </ChartCard>
      </div>

      <span className="sr-only">Period {range}</span>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* 4.4 Who's getting value?                                                    */
/* -------------------------------------------------------------------------- */

function WhoGetsValue({
  range,
  scopeSize,
}: {
  range: string;
  scopeSize: number;
}) {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState<string | null>(null);
  const [team, setTeam] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return people.filter(
      (person) =>
        (!needle || person.name.toLowerCase().includes(needle)) &&
        (!position || person.position === position) &&
        (!team || person.team === team) &&
        (!level || person.level === level),
    );
  }, [query, position, team, level]);

  return (
    <section id="who-gets-value" className="scroll-mt-32">
      <SectionHeader
        title="Who’s getting value?"
        subtitle="Distribution of AI efficiency across developers"
      />

      <ChartCard order={7}>
        <ChartCardHeader
          title={`Cost per delivery point - Who uses AI most efficiently? · ${range}`}
        >
          <ShareAction label="Share this chart" />
        </ChartCardHeader>

        <div className="px-5 pb-4">
          <p className="max-w-[110ch] text-copy-sm text-pretty text-secondary">
            Compare the balance between AI cost efficiency ($ per delivery
            point) and delivery volume. X-axis = delivery points. Y-axis = cost
            per delivery point (lower cost = higher position = more efficient).
            Top-right: high delivery + lower cost per point. Top-left: low
            delivery + lower cost per point. Bottom-right: high delivery +
            higher cost per point. Bottom-left: low delivery + higher cost per
            point. Cost includes AI tool usage plus estimated agentic (Devin)
            spend charged to the person who ran the session; delivery credits
            directed agent work to that same person. Only includes users with AI
            spend and activity in the period.
          </p>
        </div>

        <ChartCardBody>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="scatter-search">
              Search people
            </label>
            <Input
              id="scatter-search"
              name="people-search"
              type="search"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search people (${scopeSize})…`}
              prefix={<MagnifyingGlass aria-hidden="true" />}
              containerClassName="w-[220px]"
            />
            <FilterMenu
              label="Positions"
              options={POSITIONS}
              value={position}
              onChange={setPosition}
            />
            <FilterMenu
              label="Teams"
              options={TEAMS}
              value={team}
              onChange={setTeam}
            />
            <FilterMenu
              label="Levels"
              options={LEVELS}
              value={level}
              onChange={setLevel}
            />
          </div>

          <QuadrantScatter people={filtered} />
        </ChartCardBody>
      </ChartCard>
    </section>
  );
}

function FilterMenu({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button variant="secondary">
          {value ?? label}
        </Button>
      </MenuTrigger>
      <MenuContent align="start" className="w-[176px]">
        <MenuLabel>{label}</MenuLabel>
        <MenuItem onSelect={() => onChange(null)}>All {label.toLowerCase()}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option} onSelect={() => onChange(option)}>
            {option}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}

/* -------------------------------------------------------------------------- */
/* 4.5 Usage breakdown                                                         */
/* -------------------------------------------------------------------------- */

const harnessSeries = HARNESSES.map((name, index) => ({
  key: name,
  label: name,
  color: seriesColor(index),
  format: (value: number) => pct(value, 1),
}));

const modelSeries = MODELS.map((name, index) => ({
  key: name,
  label: name,
  color: seriesColor(index),
  format: (value: number) => pct(value, 1),
}));

function UsageBreakdown() {
  return (
    <section id="usage-breakdown" className="scroll-mt-32">
      <SectionHeader
        title="Usage breakdown"
        subtitle="Which harnesses and models developers are using"
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard order={8}>
          <ChartCardHeader title="Which harnesses are developers using?">
            <ShareAction label="Share this chart" />
            <InfoAction>{TOOLTIPS.harnesses}</InfoAction>
          </ChartCardHeader>
          <ChartCardHeadline
            value={`Most used is ${harnessLeader.name}: ${pct(harnessLeader.share, 1)}`}
          />
          <ChartCardBody>
            <PercentStackedWeekChart data={harnessShare} series={harnessSeries} />
            <ChartLegend
              className="mt-4"
              items={harnessSeries.map((item) => ({
                label: item.label,
                color: item.color,
              }))}
            />
          </ChartCardBody>
        </ChartCard>

        <ChartCard order={9}>
          <ChartCardHeader title="Which AI models are being used?">
            <ShareAction label="Share this chart" />
            <InfoAction>{TOOLTIPS.models}</InfoAction>
          </ChartCardHeader>
          <ChartCardHeadline
            value={`Most used is ${modelLeader.name}: ${pct(modelLeader.share, 1)}`}
          />
          <ChartCardBody>
            <PercentStackedWeekChart data={modelShare} series={modelSeries} />
            <ChartLegend
              className="mt-4"
              items={modelSeries.map((item) => ({
                label: item.label,
                color: item.color,
              }))}
            />
          </ChartCardBody>
        </ChartCard>
      </div>
    </section>
  );
}
