"use client";

import {
  Sparkle,
} from "@/components/icons";
import { useState } from "react";
import { AppShell, PageHeader, SHELL } from "@/components/app/app-shell";
import { KpiRow } from "@/components/app/kpi-row";
import {
  PERIOD_PRESETS,
  PeriodSelector,
  type PeriodValue,
} from "@/components/app/period-selector";
import { ScopeSelector } from "@/components/app/scope-selector";
import { SummaryTab } from "@/components/app/summary-tab";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/geist/tabs";
import { people } from "@/lib/data";
import { useSearchParam } from "@/lib/use-search-param";

const TABS = [
  { value: "summary", label: "Summary" },
  { value: "ai-economics", label: "AI economics" },
  { value: "ai-budget", label: "AI budget" },
  { value: "model-fit", label: "Model fit" },
  { value: "contributors", label: "Contributors" },
  { value: "raw-data", label: "Raw data" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

function isTabValue(value: string | null): value is TabValue {
  return TABS.some((tab) => tab.value === value);
}

export function AiIntelligencePage() {
  const [scope, setScope] = useState<string[]>(() =>
    people.map((person) => person.id),
  );
  const [period, setPeriod] = useState<PeriodValue>("previous-week");
  const [periodOffset, setPeriodOffset] = useState(0);
  // The active tab is deep-linked through `?tab=`, so a shared URL reopens on
  // the same view.
  const urlTab = useSearchParam("tab");
  const [override, setOverride] = useState<TabValue | null>(null);
  const tab = override ?? (isTabValue(urlTab) ? urlTab : "summary");

  const selectTab = (next: string) => {
    if (!isTabValue(next)) return;
    setOverride(next);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", next);
    window.history.replaceState(null, "", url);
  };

  const preset =
    PERIOD_PRESETS.find((item) => item.value === period) ?? PERIOD_PRESETS[1];
  const range = shiftRange(preset.range, periodOffset);

  return (
    <AppShell>
      <Tabs value={tab} onValueChange={selectTab} className="min-w-0 flex-1">
        <PageHeader>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 pb-4">
            <h1 className="flex items-center gap-2 text-heading-24 text-[var(--ds-gray-1000)]">
              <Sparkle
                aria-hidden="true"
                className="size-5 text-[var(--ds-gray-900)]"
              />
              AI intelligence
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <ScopeSelector selected={scope} onChange={setScope} />
              <PeriodSelector
                value={period}
                onValueChange={(next) => {
                  setPeriod(next);
                  setPeriodOffset(0);
                }}
                range={range}
                onStep={(direction) =>
                  setPeriodOffset((value) => value + direction)
                }
              />
            </div>
          </div>

          <TabsList>
            {TABS.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </PageHeader>

        <TabsContent value="summary">
          <main id="main-content" className={`${SHELL} scroll-mt-32 pt-6 pb-16`}>
            <KpiRow />
            <SummaryTab scopeSize={scope.length} range={range} />
          </main>
        </TabsContent>

        {TABS.filter((item) => item.value !== "summary").map((item) => (
          <TabsContent key={item.value} value={item.value}>
            <main className={`${SHELL} pt-6 pb-16`}>
              <EmptyTab label={item.label} />
            </main>
          </TabsContent>
        ))}
      </Tabs>
    </AppShell>
  );
}

function EmptyTab({ label }: { label: string }) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center gap-2 rounded-xl surface-secondary border border-dashed border-[var(--border-subtle)] p-10 text-center">
      <h2 className="text-heading-16 text-[var(--ds-gray-1000)]">{label}</h2>
      <p className="max-w-[44ch] text-copy-14 text-[var(--ds-gray-900)]">
        Not part of this prototype. The scope and period controls stay visible
        and apply to every tab.
      </p>
    </div>
  );
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Shifts the displayed range label by whole periods for the arrow controls. */
function shiftRange(range: string, offset: number) {
  if (offset === 0 || !range.includes("–")) return range;

  const parse = (token: string) => {
    const [month, day] = token.trim().split(" ");
    return { month: MONTHS.indexOf(month), day: Number(day) };
  };

  const [fromToken, toToken] = range.split("–");
  const from = parse(fromToken);
  const to = parse(toToken);
  if (from.month < 0 || to.month < 0 || Number.isNaN(from.day)) return range;

  const spanDays =
    (Date.UTC(2025, to.month, to.day) - Date.UTC(2025, from.month, from.day)) /
      86_400_000 +
    1;

  const format = (base: { month: number; day: number }) => {
    const shifted = new Date(
      Date.UTC(2025, base.month, base.day + offset * spanDays),
    );
    return `${MONTHS[shifted.getUTCMonth()]} ${String(
      shifted.getUTCDate(),
    ).padStart(2, "0")}`;
  };

  return `${format(from)} – ${format(to)}`;
}
