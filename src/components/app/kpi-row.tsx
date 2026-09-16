"use client";

import { ArrowDownRight, ArrowUpRight, Check, Minus } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { InfoTip } from "@/components/ui/info-tip";
import { cn } from "@/lib/utils";

type Sentiment = "favourable" | "unfavourable" | "neutral";

interface KpiCard {
  label: string;
  /** What the metric measures — shown in the label's info tip. */
  description: string;
  value: string;
  subLabel: string;
  delta?: { value: string; direction: "up" | "down"; sentiment: Sentiment };
  status?: string;
}

/**
 * Delta colour encodes whether the movement is favourable, not merely its
 * sign: rising AI spend is amber even though the arrow points up.
 */
const CARDS: KpiCard[] = [
  {
    label: "Agentic",
    description:
      "Share of PR and review delivery completed by AI agents working on their own, rather than by people or people assisted by AI.",
    value: "82%",
    subLabel: "of PR & review delivery",
    delta: { value: "+8pp", direction: "up", sentiment: "favourable" },
  },
  {
    label: "AI cost",
    description:
      "Total spend on AI coding tools for the selected people in this period, across every model and seat.",
    value: "$270",
    subLabel: "in this period",
    delta: { value: "+15%", direction: "up", sentiment: "unfavourable" },
  },
  {
    label: "Efficiency",
    description:
      "AI cost divided by delivery points: what each point of delivered work cost in AI spend. Lower is better.",
    value: "$0.95",
    subLabel: "$/point",
    delta: { value: "+2%", direction: "up", sentiment: "unfavourable" },
  },
  {
    label: "People in budget",
    description:
      "Share of people whose AI spend stayed within their individual budget for this period.",
    value: "100%",
    subLabel: "12 of 12",
    status: "On track",
  },
  {
    label: "Excess spend",
    description:
      "AI spend above each person's budget limit, summed across the team. Zero means nobody went over.",
    value: "$0",
    subLabel: "above budget limits",
    status: "Within limits",
  },
  {
    label: "Top model",
    description:
      "The model that processed the largest share of AI tokens this period, with its share of the total.",
    value: "Claude Opus 5",
    subLabel: "50% of AI tokens",
    delta: { value: "+12pp", direction: "up", sentiment: "neutral" },
  },
];

const sentimentVariant = {
  favourable: "green",
  unfavourable: "amber",
  neutral: "gray-subtle",
} as const;

/**
 * Six across only from 2xl (1536px). Below that a card is too narrow to hold
 * the label, its info tip and the badge on one row — the longest pair needs
 * about 153px of inner width — and the badge belongs top right, so the grid
 * gives way instead: three across, then two, then one on a phone.
 */
export function KpiRow() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-6">
      {CARDS.map((card, index) => {
        const Arrow =
          card.delta?.direction === "up"
            ? ArrowUpRight
            : card.delta
              ? ArrowDownRight
              : Minus;

        return (
          <Card
            key={card.label}
            className="animate-enter gap-0 px-4 py-4"
            style={{ ["--i" as string]: index }}
          >
            <div className="mb-2.5 flex min-h-8 items-start justify-between gap-2">
              <span className="min-w-0 text-label-overline text-secondary">
                <InfoTip label={card.label}>{card.description}</InfoTip>
              </span>
              {card.delta ? (
                <Badge
                  variant={sentimentVariant[card.delta.sentiment]}
                  className="tabular-nums gap-0.5 pr-2 pl-1.5"
                >
                  <Arrow className="size-3" />
                  {card.delta.value}
                </Badge>
              ) : null}
              {card.status ? (
                <Badge variant="green" className="gap-1 pr-2 pl-1.5">
                  <Check className="size-3" />
                  {card.status}
                </Badge>
              ) : null}
            </div>

            <span
              className={cn(
                "tabular-nums mt-auto block truncate text-primary",
                card.value.length > 6 ? "text-h3" : "text-h1",
              )}
              title={card.value}
            >
              {card.value}
            </span>
            <span className="mt-1 block truncate text-copy-sm text-secondary">
              {card.subLabel}
            </span>
          </Card>
        );
      })}
    </div>
  );
}
