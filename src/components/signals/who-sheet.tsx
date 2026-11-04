"use client";

import { useState } from "react";
import { CaretRight } from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CELEBRATES,
  METRIC_BY_ID,
  getNode,
  pathTo,
  readChildren,
  readSeries,
  signalLine,
  type Metric,
  type MetricId,
  type OrgLevel,
  type Ranked,
} from "@/lib/signals-data";
import { cn } from "@/lib/utils";
import { KudosButton } from "./signal-row";
import { SignalChart, SignalSparkline } from "./signal-chart";
import { useSignalWindow } from "./signal-window";
import { StatusChip, StatusGlyph } from "./status";

export interface WhoTarget {
  metricId: MetricId;
  nodeId: string;
}

const CHILDREN_OF: Record<Exclude<OrgLevel, "person">, string> = {
  company: "tribes",
  tribe: "teams",
  team: "people",
};

/**
 * Lists show this many before asking; a tribe has twenty teams. A list only
 * folds when it would hide more than two — "Show all 7" to reveal one row
 * costs more than the row.
 */
const FIRST_PAGE = 6;
const foldable = (count: number) => count > FIRST_PAGE + 2;

/**
 * Who moves a signal, one level at a time: Company › Tribe › Team › Person.
 *
 * A CTO of 1,500 engineers does not start from names. Each level shows the
 * one above it as a chart and a line, then splits its children into those
 * doing well and those behind — celebrated first when the signal is good,
 * the gap first when it is not.
 */
export function WhoSheet({
  target,
  onNavigate,
  onClose,
}: {
  target: WhoTarget | null;
  onNavigate: (nodeId: string) => void;
  onClose: () => void;
}) {
  return (
    <Sheet
      open={target !== null}
      onOpenChange={(open) => (open ? null : onClose())}
    >
      <SheetContent aria-describedby={undefined}>
        {target ? (
          <WhoContent
            key={`${target.metricId}:${target.nodeId}`}
            metric={METRIC_BY_ID[target.metricId]}
            nodeId={target.nodeId}
            onNavigate={onNavigate}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function WhoContent({
  metric,
  nodeId,
  onNavigate,
}: {
  metric: Metric;
  nodeId: string;
  onNavigate: (nodeId: string) => void;
}) {
  const node = getNode(nodeId);
  const { weeks } = useSignalWindow();
  const read = readSeries(node.series[metric.id], metric, weeks);
  const path = pathTo(nodeId);
  const level = node.level === "person" ? "team" : node.level;
  const children = readChildren(nodeId, metric, weeks);
  const company = readSeries(
    getNode("company").series[metric.id],
    metric,
    weeks,
  );

  const doingWell = children
    .filter((child) => child.read.gap >= 0)
    .sort((a, b) => b.read.gap - a.read.gap);
  const behind = children
    .filter((child) => child.read.gap < 0)
    .sort(
      (a, b) => a.read.gap * a.node.headcount - b.read.gap * b.node.headcount,
    );

  const groups = [
    { key: "well", title: "Doing well", items: doingWell, kudos: true },
    { key: "behind", title: "Behind target", items: behind, kudos: false },
  ];
  if (!CELEBRATES[company.status]) groups.reverse();

  return (
    <>
      <SheetHeader>
        <SheetTitle>
          {metric.label}
          <span className="text-secondary">
            {" "}
            {node.level === "company" ? "by tribe" : `in ${node.name}`}
          </span>
        </SheetTitle>
        <Breadcrumb
          className="mt-2 -ml-1"
          items={path.map((step) => ({
            label: step.name,
            onSelect: () => onNavigate(step.id),
          }))}
        />
      </SheetHeader>

      <SheetBody>
        <div className="flex items-center gap-3">
          <StatusGlyph status={read.status} />
          <StatusChip status={read.status} />
          <span className="ml-auto text-label-default text-primary tabular-nums">
            {metric.format(read.recent)}
          </span>
          <span className="text-label-xs text-tertiary tabular-nums">
            target {metric.format(metric.target)}
          </span>
        </div>
        <p className="mt-2 text-copy-sm text-pretty text-secondary">
          {signalLine(metric, read)}
        </p>
        <div className="mt-5">
          <SignalChart
            metric={metric}
            series={node.series[metric.id]}
            read={read}
            height={72}
          />
        </div>

        <p className="mt-8 text-label-sm text-secondary">
          {level === "team" ? null : (
            <>
              {children.length} {CHILDREN_OF[level]} ·{" "}
            </>
          )}
          <span className="tabular-nums">
            {node.headcount.toLocaleString("en-US")}
          </span>{" "}
          people
        </p>

        {groups.map((group) =>
          group.items.length ? (
            <Group
              key={group.key}
              title={group.title}
              items={group.items}
              metric={metric}
              kudos={group.kudos}
              onNavigate={onNavigate}
            />
          ) : null,
        )}
      </SheetBody>
    </>
  );
}

function Group({
  title,
  items,
  metric,
  kudos,
  onNavigate,
}: {
  title: string;
  items: Ranked[];
  metric: Metric;
  kudos: boolean;
  onNavigate: (nodeId: string) => void;
}) {
  const [all, setAll] = useState(false);
  const shown =
    all || !foldable(items.length) ? items : items.slice(0, FIRST_PAGE);

  return (
    <section className="mt-5">
      <div className="mb-1 flex min-h-7 items-center justify-between gap-3">
        <h3 className="text-label-overline text-tertiary">
          {title} <span className="tabular-nums">· {items.length}</span>
        </h3>
        {kudos ? (
          <KudosButton
            names={items
              .slice(0, 3)
              .map((item) => item.node.name)
              .concat(items.length > 3 ? [`${items.length - 3} more`] : [])}
          />
        ) : null}
      </div>
      <ul className="-mx-2">
        {shown.map((item) => (
          <li key={item.node.id}>
            <WhoRow item={item} metric={metric} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
      {foldable(items.length) ? (
        <Button
          variant="tertiary"
          size="small"
          className="mt-1 -ml-2.5"
          onClick={() => setAll((value) => !value)}
        >
          {all ? "Show fewer" : `Show all ${items.length}`}
        </Button>
      ) : null}
    </section>
  );
}

function WhoRow({
  item,
  metric,
  onNavigate,
}: {
  item: Ranked;
  metric: Metric;
  onNavigate: (nodeId: string) => void;
}) {
  const { node, read } = item;
  const person = node.level === "person";
  const gap = `${metric.formatDelta(Math.abs(read.gap))} ${
    read.gap >= 0
      ? metric.better === "higher"
        ? "above"
        : "under"
      : metric.better === "higher"
        ? "below"
        : "over"
  }`;

  const content = (
    <>
      {person ? (
        <Avatar name={node.name} size="sm" />
      ) : (
        <StatusGlyph status={read.status} className="size-3.5" />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-label-default text-primary">
          {node.name}
        </span>
        <span className="block truncate text-label-xs text-tertiary">
          {person ? node.role : `${node.headcount} people`}
        </span>
      </span>
      <SignalSparkline
        metric={metric}
        series={node.series[metric.id]}
        read={read}
      />
      <span className="w-[84px] shrink-0 text-right">
        <span className="block text-label-sm text-primary tabular-nums">
          {metric.format(read.recent)}
        </span>
        <span className="block text-label-xs text-tertiary tabular-nums">
          {gap}
        </span>
      </span>
      {person ? (
        <span className="size-3 shrink-0" />
      ) : (
        <CaretRight
          aria-hidden="true"
          className="size-3 shrink-0 text-tertiary transition-colors group-hover:text-primary"
        />
      )}
    </>
  );

  const classes =
    "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left";

  return person ? (
    <div className={classes}>{content}</div>
  ) : (
    <button
      type="button"
      onClick={() => onNavigate(node.id)}
      className={cn(
        classes,
        "group outline-none transition-colors duration-150 hover:bg-[var(--ds-gray-alpha-100)]",
        "focus-visible:shadow-[var(--ds-focus-ring)]",
      )}
    >
      {content}
    </button>
  );
}
