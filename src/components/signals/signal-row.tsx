"use client";

import { useState } from "react";
import {
  ArrowRight,
  CaretDown,
  CaretRight,
  Check,
  Flag,
  HandsClapping,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { InfoTip } from "@/components/ui/info-tip";
import { Textarea } from "@/components/ui/input";
import {
  CELEBRATES,
  PLAN_STATE_LABEL,
  WHO_HEADING,
  getNode,
  planProgress,
  rankFor,
  readChildren,
  readSeries,
  signalLine,
  whoFact,
  type Metric,
  type PlanItem,
  type PlanState,
} from "@/lib/signals-data";
import { cn } from "@/lib/utils";
import { SignalChart } from "./signal-chart";
import { useSignalWindow } from "./signal-window";
import { StatusChip, StatusGlyph } from "./status";

/**
 * The row's columns, shared by the header and the open details so they line
 * up: the title, the chart, then status and value. The outer two are fixed
 * shares, so every row's chart gets the same width and the four share one
 * time axis — today lines up down the page.
 */
const ROW_COLUMNS = "lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_232px]";

export const PLAN_STATE_TEXT: Record<PlanState, string> = {
  working: "text-[var(--ds-green-text)]",
  stalled: "text-[var(--ds-amber-text)]",
  new: "text-tertiary",
};

/**
 * One signal. Collapsed, it answers "where are we, and which way are we
 * going" in a line and a chart. Expanded, it adds why, who and what to do —
 * and from who, the full breakdown opens in a sheet.
 *
 * The chevron is the one accessible trigger; the rest of the header is a
 * mouse convenience that ignores clicks landing on its own controls.
 */
export function SignalRow({
  metric,
  open,
  onOpenChange,
  plan,
  onSetAction,
  onRemoveAction,
  onOpenWho,
}: {
  metric: Metric;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: PlanItem | undefined;
  onSetAction: (text: string) => void;
  onRemoveAction: () => void;
  onOpenWho: (nodeId: string) => void;
}) {
  const focus = useSignalWindow();
  const series = getNode("company").series[metric.id];
  const read = readSeries(series, metric, focus.weeks);
  const progress = plan ? planProgress(metric, series, plan) : null;
  const titleId = `signal-${metric.id}`;

  return (
    <Collapsible open={open} onOpenChange={onOpenChange} asChild>
      <section
        id={titleId}
        aria-labelledby={`${titleId}-title`}
        className="scroll-mt-28 border-b border-[var(--border-subtle)]"
      >
        {/* The hover covers the whole row, open or closed — it is one
            object. Only the header toggles it. */}
        <div
          className={cn(
            "-mx-3 rounded-md px-3",
            "transition-colors duration-150 hover:bg-[var(--ds-gray-alpha-100)]",
          )}
        >
          <div
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("button, a, textarea"))
                return;
              onOpenChange(!open);
            }}
            className={cn(
              "grid cursor-pointer grid-cols-1 gap-x-10 gap-y-4 py-6",
              ROW_COLUMNS,
              "lg:items-center",
            )}
          >
            <div className="min-w-0">
              <h2
                id={`${titleId}-title`}
                className="flex items-center gap-2 text-h4 text-primary"
              >
                <StatusGlyph status={read.status} />
                <span>
                  <InfoTip label={metric.label}>{metric.definition}</InfoTip>
                </span>
              </h2>
              {plan && progress ? (
                <div className="mt-2 pl-6">
                  <p className="flex min-w-0 items-center gap-1.5 text-copy-sm text-primary">
                    <Flag
                      aria-hidden="true"
                      className="size-3.5 shrink-0 text-secondary"
                    />
                    <span className="sr-only">Plan: </span>
                    <span className="truncate" title={plan.text}>
                      {plan.text}
                    </span>
                  </p>
                  <p className="mt-0.5 text-copy-sm text-secondary">
                    <span className={PLAN_STATE_TEXT[progress.state]}>
                      {PLAN_STATE_LABEL[progress.state]}
                    </span>
                    {" · "}
                    {progress.line}
                  </p>
                </div>
              ) : (
                <p className="mt-2 pl-6 text-copy-sm text-pretty text-secondary">
                  {signalLine(metric, read)}
                </p>
              )}
            </div>

            <SignalChart metric={metric} series={series} read={read} />

            <div className="flex items-center gap-4 pl-6 lg:justify-end lg:pl-0">
              <StatusChip status={read.status} />
              <div className="min-w-[84px] text-right">
                <p className="text-label-default text-primary tabular-nums">
                  {metric.format(read.recent)}
                </p>
                <p className="mt-0.5 text-label-xs text-tertiary tabular-nums">
                  target {metric.format(metric.target)}
                </p>
              </div>
              <CollapsibleTrigger asChild>
                <Button
                  variant="tertiary"
                  shape="square"
                  aria-label={`${open ? "Hide" : "Investigate"} ${metric.label}`}
                  className="ml-auto lg:ml-0"
                >
                  <CaretDown
                    aria-hidden="true"
                    className={cn(
                      "transition-transform duration-200",
                      open && "rotate-180",
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent>
            <SignalDetails
              metric={metric}
              plan={plan}
              onSetAction={onSetAction}
              onRemoveAction={onRemoveAction}
              onOpenWho={onOpenWho}
            />
          </CollapsibleContent>
        </div>
      </section>
    </Collapsible>
  );
}

function SignalDetails({
  metric,
  plan,
  onSetAction,
  onRemoveAction,
  onOpenWho,
}: {
  metric: Metric;
  plan: PlanItem | undefined;
  onSetAction: (text: string) => void;
  onRemoveAction: () => void;
  onOpenWho: (nodeId: string) => void;
}) {
  const focus = useSignalWindow();
  const series = getNode("company").series[metric.id];
  const read = readSeries(series, metric, focus.weeks);
  const top = rankFor(
    read.status,
    readChildren("company", metric, focus.weeks),
  ).slice(0, 3);
  const celebrates = CELEBRATES[read.status];

  return (
    <div className={cn("grid grid-cols-1 gap-x-10 gap-y-8 pb-8", ROW_COLUMNS)}>
      <div className="pl-6">
        <Heading>Why</Heading>
        <p className="text-copy-default text-pretty text-secondary">
          {metric.why}
        </p>
      </div>

      {/* Who starts where the chart does; who and what share the chart's
          and the value's columns between them. */}
      <div className="grid grid-cols-1 gap-x-10 gap-y-8 pl-6 lg:col-span-2 lg:grid-cols-2 lg:pl-0">
        <div>
          <Heading>{WHO_HEADING[read.status]}</Heading>
          <ul className="-mx-2">
            {top.map(({ node, read: tribe }) => (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => onOpenWho(node.id)}
                  className={cn(
                    "group flex h-8 w-full items-center gap-2 rounded-md px-2 text-left",
                    "outline-none transition-colors duration-150 hover:bg-[var(--ds-gray-alpha-100)]",
                    "focus-visible:shadow-[var(--ds-focus-ring)]",
                  )}
                >
                  <StatusGlyph status={tribe.status} className="size-3.5" />
                  <span className="text-label-default text-primary">
                    {node.name}
                  </span>
                  <span className="text-label-xs text-tertiary tabular-nums">
                    {node.headcount}
                  </span>
                  <span className="ml-auto truncate text-label-sm text-secondary tabular-nums">
                    {whoFact(read.status, metric, tribe)}
                  </span>
                  <CaretRight
                    aria-hidden="true"
                    className="size-3 shrink-0 text-tertiary transition-colors group-hover:text-primary"
                  />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button
              variant="tertiary"
              size="small"
              suffix={<ArrowRight aria-hidden="true" />}
              onClick={() => onOpenWho("company")}
              className="-ml-2.5"
            >
              All tribes, teams and people
            </Button>
            {celebrates ? (
              <KudosButton names={top.map((item) => item.node.name)} />
            ) : null}
          </div>
        </div>

        <ActionColumn
          metric={metric}
          plan={plan}
          onSetAction={onSetAction}
          onRemoveAction={onRemoveAction}
        />
      </div>
    </div>
  );
}

function Heading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="mb-2 text-label-overline text-tertiary">
      {children}
    </h3>
  );
}

/** Celebrating is one click, and says who it went to. */
export function KudosButton({ names }: { names: string[] }) {
  const [sent, setSent] = useState(false);
  const who =
    names.length > 2
      ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`
      : names.join(" and ");
  return sent ? (
    <span
      role="status"
      className="inline-flex h-7 items-center gap-1.5 text-label-sm text-[var(--ds-green-text)]"
    >
      <Check aria-hidden="true" className="size-3.5" />
      Kudos sent to {who}
    </span>
  ) : (
    <Button
      variant="tertiary"
      size="small"
      prefix={<HandsClapping aria-hidden="true" />}
      onClick={() => setSent(true)}
    >
      Send kudos
    </Button>
  );
}

function ActionColumn({
  metric,
  plan,
  onSetAction,
  onRemoveAction,
}: {
  metric: Metric;
  plan: PlanItem | undefined;
  onSetAction: (text: string) => void;
  onRemoveAction: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const text = plan?.text ?? metric.suggestion;
  const progress = plan
    ? planProgress(metric, getNode("company").series[metric.id], plan)
    : null;
  const fieldId = `action-${metric.id}`;

  const startEditing = () => {
    setDraft(text);
    setEditing(true);
  };
  const commit = () => {
    const value = draft.trim();
    if (!value) return;
    onSetAction(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div>
        <Heading id={fieldId}>
          {plan ? "Your plan" : "Suggested action"}
        </Heading>
        <Textarea
          aria-labelledby={fieldId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey))
              commit();
            if (event.key === "Escape") setEditing(false);
          }}
          autoFocus
          // Editing usually means adding to the end, so the caret starts there.
          onFocus={(event) => {
            const end = event.currentTarget.value.length;
            event.currentTarget.setSelectionRange(end, end);
          }}
          maxLength={180}
        />
        <div className="mt-2 flex items-center gap-2">
          <Button
            variant="secondary"
            size="small"
            onClick={commit}
            disabled={!draft.trim()}
          >
            {plan ? "Save" : "Add to plan"}
          </Button>
          <Button
            variant="tertiary"
            size="small"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Heading>{plan ? "Your plan" : "Suggested action"}</Heading>
      <p className="text-copy-default text-pretty text-primary">{text}</p>
      {progress ? (
        <p className="mt-1.5 text-copy-sm text-secondary">
          <span className={PLAN_STATE_TEXT[progress.state]}>
            {PLAN_STATE_LABEL[progress.state]}
          </span>{" "}
          · {progress.line}
        </p>
      ) : null}
      <div className="mt-3 flex items-center gap-2">
        {plan ? (
          <>
            <Button
              variant="tertiary"
              size="small"
              onClick={startEditing}
              className="-ml-2.5"
            >
              Edit
            </Button>
            <Button variant="tertiary" size="small" onClick={onRemoveAction}>
              Remove from plan
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="secondary"
              size="small"
              prefix={<Flag aria-hidden="true" />}
              onClick={() => onSetAction(metric.suggestion)}
            >
              Add to plan
            </Button>
            <Button variant="tertiary" size="small" onClick={startEditing}>
              Edit first
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
