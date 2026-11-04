"use client";

import { useState } from "react";
import { Broadcast, Flag } from "@/components/icons";
import { AppShell, PageHeader, SHELL } from "@/components/app/app-shell";
import {
  METRICS,
  METRIC_BY_ID,
  PLAN_STATE_LABEL,
  getNode,
  planProgress,
  weekLabel,
  LAST,
  type MetricId,
} from "@/lib/signals-data";
import { textLinkClasses } from "@/components/ui/text-link";
import { useSignalPlan } from "@/lib/use-signal-plan";
import { PLAN_STATE_TEXT, SignalRow } from "./signal-row";
import { WhoSheet, type WhoTarget } from "./who-sheet";

/**
 * Signals — how the company is doing on its four metrics, and on the plan to
 * move them.
 *
 * The page shows the signal and holds everything else back: each row is a
 * status, one line and a chart; why, who and what open on request, and the
 * people behind a number open one level further, in a sheet.
 */
export function SignalsPage() {
  const { plan, setAction, removeAction } = useSignalPlan();
  const [open, setOpen] = useState<MetricId[]>([]);
  const [who, setWho] = useState<WhoTarget | null>(null);
  const company = getNode("company");

  const setRowOpen = (id: MetricId, next: boolean) =>
    setOpen((value) =>
      next ? [...value, id] : value.filter((item) => item !== id),
    );

  const jumpTo = (id: MetricId) => {
    setRowOpen(id, true);
    document
      .getElementById(`signal-${id}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AppShell>
      <div className="min-w-0 flex-1">
        <PageHeader>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 pb-4">
            <h1 className="flex items-center gap-2 text-h2 text-primary">
              <Broadcast aria-hidden="true" className="size-5 text-secondary" />
              Signals
            </h1>
            <p className="text-label-sm text-tertiary">
              Company · {company.headcount.toLocaleString("en-US")} engineers ·
              week of {weekLabel(LAST)}
            </p>
          </div>
        </PageHeader>

        <main id="main-content" className={`${SHELL} pt-2 pb-16`}>
          <PlanSummary plan={plan} onJump={jumpTo} />

          <div className="mt-4 border-t border-[var(--border-subtle)]">
            {METRICS.map((metric) => (
              <SignalRow
                key={metric.id}
                metric={metric}
                open={open.includes(metric.id)}
                onOpenChange={(next) => setRowOpen(metric.id, next)}
                plan={plan[metric.id]}
                onSetAction={(text) => setAction(metric.id, text)}
                onRemoveAction={() => removeAction(metric.id)}
                onOpenWho={(nodeId) => setWho({ metricId: metric.id, nodeId })}
              />
            ))}
          </div>

          <p className="mt-4 max-w-[72ch] text-copy-xs text-tertiary">
            Each signal reads the last four weeks against the target (dashed),
            and the trend across 26 weeks (dotted, carried forward into the
            hatched projection). Updated every Monday.
          </p>
        </main>
      </div>

      <WhoSheet
        target={who}
        onNavigate={(nodeId) =>
          setWho((value) => (value ? { ...value, nodeId } : value))
        }
        onClose={() => setWho(null)}
      />
    </AppShell>
  );
}

/** One line: what the plan is, and how each action is doing. */
function PlanSummary({
  plan,
  onJump,
}: {
  plan: ReturnType<typeof useSignalPlan>["plan"];
  onJump: (id: MetricId) => void;
}) {
  const items = METRICS.filter((metric) => plan[metric.id]).map((metric) => ({
    metric,
    progress: planProgress(
      metric,
      getNode("company").series[metric.id],
      plan[metric.id]!,
    ),
  }));

  return (
    <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1 text-copy-sm">
      <span className="inline-flex items-center gap-1.5 font-medium text-primary">
        <Flag aria-hidden="true" className="size-3.5 text-secondary" />
        Plan
      </span>
      {items.length === 0 ? (
        <span className="text-secondary">
          No actions yet. Open a signal and add its suggested action.
        </span>
      ) : (
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {items.map(({ metric, progress }, index) => (
            <li key={metric.id} className="flex items-center gap-3">
              {index > 0 ? (
                <span aria-hidden="true" className="text-disabled">
                  ·
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => onJump(metric.id)}
                className={textLinkClasses("subtle")}
              >
                {METRIC_BY_ID[metric.id].label}{" "}
                <span className={PLAN_STATE_TEXT[progress.state]}>
                  {PLAN_STATE_LABEL[progress.state].toLowerCase()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
