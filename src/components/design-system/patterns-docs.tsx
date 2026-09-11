"use client";

import {
  ArrowUpRight,
  Check,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
        id="pattern-kpi"
        title="KPI card"
        description="A single headline metric with a delta or a status. Six sit in a row at the top of a page, above anything that needs interpreting."
      >
        <DocsBlock label="Example">
          <div className="grid max-w-[560px] grid-cols-2 gap-4">
            <Card className="gap-0 px-4 py-4">
              <div className="mb-2.5 flex min-h-8 items-start justify-between gap-2">
                <span className="min-w-0 text-label-overline text-secondary">
                  Agentic
                </span>
                <Badge variant="green" className="tabular-nums gap-0.5 pr-2 pl-1.5">
                  <ArrowUpRight aria-hidden="true" className="size-3" />
                  +8pp
                </Badge>
              </div>
              <span className="tabular-nums block text-h1 text-primary">
                82%
              </span>
              <span className="mt-1 block text-copy-sm text-secondary">
                of PR &amp; review delivery
              </span>
            </Card>
            <Card className="gap-0 px-4 py-4">
              <div className="mb-2.5 flex min-h-8 items-start justify-between gap-2">
                <span className="min-w-0 text-label-overline text-secondary">
                  Excess spend
                </span>
                <Badge variant="green" className="gap-1 pr-2 pl-1.5">
                  <Check aria-hidden="true" className="size-3" />
                  Within limits
                </Badge>
              </div>
              <span className="tabular-nums block text-h1 text-primary">
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
              ["Movement in the direction we want", <Badge key="a" variant="green">+8pp</Badge>, "Agentic share rising"],
              ["Movement against us", <Badge key="b" variant="amber">+15%</Badge>, "AI cost rising"],
              ["Movement with no valence", <Badge key="c">+12pp</Badge>, "Top model share shifting"],
              ["Governance status, no delta", <Badge key="d" variant="green">On track</Badge>, "People in budget"],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>Give the label row a <Token>min-h-8</Token> so cards whose label wraps to two lines keep their values on one baseline.</>,
            <>Uppercase 11px label, 32px value, 13px sub-label. The value is the only thing meant to be read at a glance.</>,
            <>Never colour a delta by its sign alone. Decide what “better” means for that metric first.</>,
            <>Tabular figures on every value and delta, or the row will not scan.</>,
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
              [<Token key="a">ChartCardHeader</Token>, "heading-14", "The question, plus controls, share and info actions"],
              [<Token key="b">ChartCardHeadline</Token>, "heading-16 + copy-13", "The answer, with its sub-line on the same baseline"],
              [<Token key="c">ChartCardBody</Token>, "—", "The chart and its legend"],
              [<Token key="d">ChartCardFooter</Token>, "copy-13", "How to read it, or a caveat"],
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
            <>Question, answer, evidence, caveat. Every card follows the same four beats, which is what lets a reader skim nine of them.</>,
            <>Header actions go in one order: view controls, then share, then info.</>,
            <>The info tooltip carries the methodology. Keep it out of the visible card.</>,
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
              ["Scope", "Popover + search + cohort shortcuts", "Multi-select; the trigger shows the count, not the names"],
              ["Period", "Menu of presets + custom range", "Flanked by previous / next stepper buttons"],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>Summarise the selection on the trigger — “12 people”, not a list of chips that reflows the header.</>,
            <>Offer cohort shortcuts (Everyone, per team) above the individual list; most selections are a group.</>,
            <>Pair a preset menu with steppers. Presets cover the common case, steppers cover “the week before that”.</>,
            <>Keep global filters visible across tab changes, so it is obvious they still apply.</>,
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
              ["Group heading", "11px uppercase, 0.04em tracking, --ds-gray-700"],
              ["Item", "32px row, 6px radius, 16px icon at 1.75 stroke"],
              ["Active item", "--ds-gray-alpha-200 fill, medium weight, gray-1000 icon"],
              ["Nested group", "Collapsible, guided by a --border-structural rule"],
              ["Account row", "Avatar, name, email; opens the account menu upward"],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>Mark the active item with a fill and weight, not the accent. Reserve brand colour for the brand mark.</>,
            <>Group headings label, they do not act. Never make them clickable.</>,
            <>Nested items drop their icon and rely on the guide rule for indentation, so the hierarchy reads without extra colour.</>,
            <>Preferences — theme, account, sign out — belong in the account menu, not the header.</>,
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
              ["Scroll offset", "scroll-mt-28 on anchors so the header never covers a target"],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>Blur the header rather than painting it opaque — content should read as passing underneath.</>,
            <>Include a skip link as the first focusable element on the page.</>,
            <>Every anchor target needs a scroll margin equal to the header height, or deep links land under it.</>,
            <>Use <Token>env(safe-area-inset-left)</Token> in the gutter so full-bleed layouts clear a notch.</>,
          ]}
        />
      </DocsEntry>
    </DocsSection>
  );
}
