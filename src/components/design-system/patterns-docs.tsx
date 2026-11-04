"use client";

import { useState } from "react";
import { ArrowUpRight, Check } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { InfoTip } from "@/components/ui/info-tip";
import { Card } from "@/components/ui/card";
import { SignalRow } from "@/components/signals/signal-row";
import { StatusGlyph } from "@/components/signals/status";
import { WhoSheet, type WhoTarget } from "@/components/signals/who-sheet";
import {
  CELEBRATES,
  LAST,
  METRIC_BY_ID,
  STATUS_LABEL,
  WHO_HEADING,
  type SignalStatus,
} from "@/lib/signals-data";
import {
  BestPractice,
  DocsBlock,
  DocsEntry,
  DocsSection,
  DocsTable,
  DoDont,
  Snippet,
  Token,
} from "./docs-kit";

export function PatternsDocs() {
  return (
    <DocsSection
      id="patterns"
      title="Patterns"
      intro="Compositions built from the primitives. These carry product decisions — what a colour means, how a card is ordered — so they belong in the system rather than in a single page."
    >
      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="pattern-signal"
        title="Signal"
        description="Where a metric sits against its target and which way it is heading, in one row. A signal is not the latest number: it reads a focus window — the last four weeks or the last quarter, chosen at the top of the page — against the target, and the slope of the whole six months. A metric below target that is closing in is a different message from one sliding away, and the row says which."
      >
        <DocsBlock
          label="Example"
          hint="The live row from the Signals page. Click it to expand why, who and what to do, then open the breakdown from the who list."
        >
          <SignalSpecimen />
        </DocsBlock>

        <DocsBlock
          label="Statuses"
          hint="Position decides the side, trend decides the word. A slope under a tenth of a percent of the target per week counts as flat."
        >
          <DocsTable
            head={[
              "Status",
              "Focus window",
              "26-week trend",
              "Who heading",
              "Celebrates",
            ]}
            rows={SIGNAL_RULES.map(([status, position, trend]) => [
              <span key={status} className="inline-flex items-center gap-2">
                <StatusGlyph status={status} />
                {STATUS_LABEL[status]}
              </span>,
              position,
              trend,
              WHO_HEADING[status],
              CELEBRATES[status] ? "Yes" : "No",
            ])}
          />
        </DocsBlock>

        <DocsBlock label="Anatomy">
          <DocsTable
            head={["Part", "Treatment"]}
            rows={[
              [
                "Row",
                "The whole header is the target, with the transparent family's hover, --ds-gray-alpha-100. The chevron is its one accessible trigger. Fixed side columns give every chart the same width, so the last week lines up down the page",
              ],
              [
                "Glyph",
                "Status hue, filled. Arrows point the way performance moves, not the number: cycle time falling is an arrow up",
              ],
              ["Name", "text-h4, with an InfoTip defining the metric"],
              [
                "Line",
                "One computed sentence — or, once a plan is set, the plan and how it is doing",
              ],
              [
                "Chart",
                "History in gray, the focus window in the status hue with its distance from the dashed target shaded, the dotted 26-week trend carried into a hatched projection, and a ring where it meets the target",
              ],
              [
                "Chip",
                "The status in words, neutral — the glyph already carries the colour",
              ],
              [
                "Value",
                "text-label-default with the target beneath. Deliberately small: the signal leads, not the number",
              ],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Hold everything back that is not the signal. Why, who and what
              open on request, and the people behind a number open one level
              further, in a <Token>Sheet</Token>.
            </>,
            <>
              Compute the line from the same series the chart draws. Written by
              hand, the words and the line will disagree within a week.
            </>,
            <>
              Once a plan is set, it replaces the line. What the team agreed to
              do matters more than the description of the chart beside it.
            </>,
            <>
              Drill down level by level — company, tribe, team, person. At 1,500
              engineers, names on the first screen are noise.
            </>,
            <>
              Celebrate by name when a signal is on track or getting there.
              Split every level into doing well and behind, and put the good
              news first when the signal is good.
            </>,
            <>
              The window changes what is averaged, never the trend. Four weeks
              answers how we are doing now; a quarter, how the quarter went. The
              26-week slope is the long view both are read against, so switching
              cannot turn a declining metric into an improving one.
            </>,
            <>
              Keep the four rows in the same order every week. Sorting by status
              would move them, and position is how a reader finds a metric.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="pattern-kpi"
        title="KPI card"
        description="A single headline metric with a delta or a status. Six sit in a row at the top of a page, above anything that needs interpreting."
      >
        <DocsBlock label="Example">
          <div className="grid max-w-[560px] grid-cols-2 gap-4">
            <Card className="gap-0 px-4 py-4">
              <div className="mb-2.5 min-h-8 flow-root">
                <Badge
                  variant="green"
                  className="tabular-nums float-right -my-0.5 ml-2 gap-0.5 pr-2 pl-1.5"
                >
                  <ArrowUpRight aria-hidden="true" className="size-3" />
                  +8pp
                </Badge>
                <span className="text-label-overline text-secondary">
                  <InfoTip label="Agentic">
                    Share of PR and review delivery completed by AI agents
                    working on their own.
                  </InfoTip>
                </span>
              </div>
              <span className="tabular-nums mt-auto block text-h1 text-primary">
                82%
              </span>
              <span className="mt-1 block text-copy-sm text-secondary">
                of PR &amp; review delivery
              </span>
            </Card>
            <Card className="gap-0 px-4 py-4">
              <div className="mb-2.5 min-h-8 flow-root">
                <Badge
                  variant="green"
                  className="float-right -my-0.5 ml-2 gap-1 pr-2 pl-1.5"
                >
                  <Check aria-hidden="true" className="size-3" />
                  Within limits
                </Badge>
                <span className="text-label-overline text-secondary">
                  <InfoTip label="Excess spend">
                    AI spend above each person&rsquo;s budget limit, summed
                    across the team.
                  </InfoTip>
                </span>
              </div>
              <span className="tabular-nums mt-auto block text-h1 text-primary">
                $0
              </span>
              <span className="mt-1 block text-copy-sm text-secondary">
                above budget limits
              </span>
            </Card>
          </div>
        </DocsBlock>

        <DocsBlock
          label="Delta semantics"
          hint="Colour encodes whether the movement is favourable, not its arithmetic sign. This is the rule most easily broken by a later contributor, so it is worth stating plainly."
        >
          <DocsTable
            head={["Situation", "Variant", "Example"]}
            rows={[
              [
                "Movement in the direction we want",
                <Badge key="a" variant="green">
                  +8pp
                </Badge>,
                "Agentic share rising",
              ],
              [
                "Movement against us",
                <Badge key="b" variant="amber">
                  +15%
                </Badge>,
                "AI cost rising",
              ],
              [
                "Movement with no valence",
                <Badge key="c">+12pp</Badge>,
                "Top model share shifting",
              ],
              [
                "Governance status, no delta",
                <Badge key="d" variant="green">
                  On track
                </Badge>,
                "People in budget",
              ],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Give the label row a <Token>min-h-8</Token> so cards whose label
              wraps to two lines keep their values on one baseline.
            </>,
            <>
              Uppercase 11px label, 32px value, 13px sub-label. The value is the
              only thing meant to be read at a glance.
            </>,
            <>
              Never colour a delta by its sign alone. Decide what “better” means
              for that metric first.
            </>,
            <>
              Tabular figures on every value and delta, or the row will not
              scan.
            </>,
            <>
              The badge floats top right and the label wraps around it — beside
              the badge while its words fit, underneath once they do not. A
              float cannot overlap text, so no combination of label, badge and
              card width can make them collide, and the row stays six across on
              desktop. Put the badge first in the markup: a float only affects
              what comes after it. Give it -my-0.5 so it occupies exactly one
              label line; from the second line on, the label gets the full card
              width.
            </>,
            <>
              Anchor the value to the bottom of the card with{" "}
              <Token>mt-auto</Token>. Cards in a row stretch to one height, so
              values share a baseline even when one label wraps and another does
              not.
            </>,
            <>
              Every KPI carries an <Token>InfoTip</Token> straight after its
              label. The label is two or three words by necessity; the tip is
              where the definition lives, so the card never has to grow a
              sentence.
            </>,
            <>
              Place the tip after the label, never beside the value or in the
              corner. It explains the metric, not the number, and the corner
              belongs to the delta.
            </>,
            <>
              Write the tip as a definition: what is counted, over what, and
              which direction is good when the badge alone does not say.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="pattern-chart-card"
        title="Chart card"
        description="The container for every visualisation: a question as the title, the answer as a headline, then the evidence. Composed from named parts so the nine cards on a page cannot drift apart."
      >
        <DocsBlock label="Order">
          <DocsTable
            head={["Part", "Type", "Content"]}
            rows={[
              [
                <Token key="a">ChartCardHeader</Token>,
                "heading-14",
                "The question, plus controls, share and info actions",
              ],
              [
                <Token key="b">ChartCardHeadline</Token>,
                "heading-16 + copy-13",
                "The answer, with its sub-line on the same baseline",
              ],
              [
                <Token key="c">ChartCardBody</Token>,
                "—",
                "The chart and its legend",
              ],
              [
                <Token key="d">ChartCardFooter</Token>,
                "copy-13",
                "How to read it, or a caveat",
              ],
            ]}
          />
        </DocsBlock>

        <DocsBlock label="Usage">
          <Snippet
            code={`<ChartCard order={1}>
  <ChartCardHeader title="How does delivery split across humans and agents?">
    <ShareAction label="Share this chart" />
    <InfoAction>{TOOLTIPS.deliverySplit}</InfoAction>
  </ChartCardHeader>
  <ChartCardHeadline value="841.9 pts · 8% human · 82% agentic">
    — Weekly average: 90.3
  </ChartCardHeadline>
  <ChartCardBody>…</ChartCardBody>
</ChartCard>`}
          />
        </DocsBlock>

        <DoDont
          do={[
            "Phrase the title as the question the reader arrived with.",
            "Put the headline answer on one line, with the sub-line inline beside it.",
            "Pass order so the card takes its place in the page's entrance sequence.",
          ]}
          dont={[
            "Let the headline out-size the section header above it — 16px under a 20px section.",
            "Repeat the headline in the footer. The footer explains how to read, not what it says.",
            "Add props to configure the card. Add a part.",
          ]}
        />

        <BestPractice
          items={[
            <>
              Question, answer, evidence, caveat. Every card follows the same
              four beats, which is what lets a reader skim nine of them.
            </>,
            <>
              Header actions go in one order: view controls, then share, then
              info.
            </>,
            <>
              The info tooltip carries the methodology. Keep it out of the
              visible card.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="pattern-scope"
        title="Scope & period controls"
        description="Global filters that apply to every chart on a page. They live in the header, above the tab bar, so it is clear they are not scoped to one view."
      >
        <DocsBlock label="Anatomy">
          <DocsTable
            head={["Control", "Component", "Behaviour"]}
            rows={[
              [
                "Scope",
                "Popover + search + cohort shortcuts",
                "Multi-select; the trigger shows the count, not the names",
              ],
              [
                "Period",
                "Menu of presets + custom range",
                "Flanked by previous / next stepper buttons",
              ],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Summarise the selection on the trigger — “12 people”, not a list
              of chips that reflows the header.
            </>,
            <>
              Offer cohort shortcuts (Everyone, per team) above the individual
              list; most selections are a group.
            </>,
            <>
              Pair a preset menu with steppers. Presets cover the common case,
              steppers cover “the week before that”.
            </>,
            <>
              Keep global filters visible across tab changes, so it is obvious
              they still apply.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="pattern-nav"
        title="Sidebar navigation"
        description="A permanent 248px rail: brand, grouped sections, and the account menu pinned to the bottom."
      >
        <DocsBlock label="Structure">
          <DocsTable
            head={["Element", "Treatment"]}
            rows={[
              [
                "Group heading",
                "11px uppercase, 0.04em tracking, --ds-gray-700",
              ],
              ["Item", "32px row, 6px radius, 16px icon at 1.75 stroke"],
              [
                "Active item",
                "--ds-gray-alpha-200 fill, medium weight, gray-1000 icon",
              ],
              [
                "Nested group",
                "Collapsible, guided by a --border-structural rule",
              ],
              [
                "Account row",
                "Avatar, name, email; opens the account menu upward",
              ],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Mark the active item with a fill and weight, not the accent.
              Reserve brand colour for the brand mark.
            </>,
            <>
              Group headings label, they do not act. Never make them clickable.
            </>,
            <>
              Nested items drop their icon and rely on the guide rule for
              indentation, so the hierarchy reads without extra colour.
            </>,
            <>
              Preferences — theme, account, sign out — belong in the account
              menu, not the header.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="pattern-shell"
        title="Page shell"
        description="Sidebar, sticky header, then content on a 1440px container. Shared by every page so the chrome never shifts between them."
      >
        <DocsBlock label="Usage">
          <Snippet
            code={`<AppShell>
  <div className="min-w-0 flex-1">
    <PageHeader>{/* title, global controls, tabs */}</PageHeader>
    <main id="main-content" className={\`\${SHELL} pt-6 pb-16\`}>…</main>
  </div>
</AppShell>`}
          />
        </DocsBlock>

        <DocsBlock label="Measures">
          <DocsTable
            head={["Element", "Value"]}
            rows={[
              ["Sidebar", "248px, sticky, full viewport height"],
              ["Container", "max 1440px, 24px gutter → 32px at lg"],
              ["Header", "sticky, 85% page tint with a backdrop blur"],
              ["Section rhythm", "48px between sections, 16px between cards"],
              [
                "Scroll offset",
                "scroll-mt-28 on anchors so the header never covers a target",
              ],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Blur the header rather than painting it opaque — content should
              read as passing underneath.
            </>,
            <>
              Include a skip link as the first focusable element on the page.
            </>,
            <>
              Every anchor target needs a scroll margin equal to the header
              height, or deep links land under it.
            </>,
            <>
              Use <Token>env(safe-area-inset-left)</Token> in the gutter so
              full-bleed layouts clear a notch.
            </>,
          ]}
        />
      </DocsEntry>
    </DocsSection>
  );
}

const SIGNAL_RULES: [SignalStatus, string, string][] = [
  ["on-track", "On the target's good side", "Improving or flat"],
  ["at-risk", "On the target's good side", "Worsening"],
  ["getting-there", "On the wrong side", "Improving"],
  ["regressing", "On the wrong side", "Flat or worsening"],
];

/** A real row, with its plan kept local so the specimen never edits the page's plan. */
function SignalSpecimen() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [who, setWho] = useState<WhoTarget | null>(null);
  return (
    <div className="border-y border-[var(--border-subtle)]">
      <SignalRow
        metric={METRIC_BY_ID.cost}
        open={open}
        onOpenChange={setOpen}
        plan={action ? { text: action, setWeek: LAST + 1 } : undefined}
        onSetAction={setAction}
        onRemoveAction={() => setAction(null)}
        onOpenWho={(nodeId) => setWho({ metricId: "cost", nodeId })}
      />
      <WhoSheet
        target={who}
        onNavigate={(nodeId) =>
          setWho((value) => (value ? { ...value, nodeId } : value))
        }
        onClose={() => setWho(null)}
      />
    </div>
  );
}
