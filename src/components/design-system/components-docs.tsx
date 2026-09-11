"use client";

import {
  ArrowUpRight,
  CaretDown,
  Check,
  MagnifyingGlass,
  Plus,
  Trash,
} from "@/components/icons";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { BUTTON_SIZES, Button, type ButtonSize } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Tooltip } from "@/components/ui/tooltip";
import {
  BestPractice,
  DocsBlock,
  DocsEntry,
  DocsSection,
  DocsTable,
  Example,
  Snippet,
  Specimens,
  Token,
} from "./docs-kit";

/** Typed `Object.entries` over the button size table, for the docs below. */
const BUTTON_SIZE_ENTRIES = Object.entries(BUTTON_SIZES) as [
  ButtonSize,
  (typeof BUTTON_SIZES)[ButtonSize],
][];

export function ComponentsDocs() {
  const [segment, setSegment] = useState("assisted");
  const [tab, setTab] = useState("summary");

  return (
    <DocsSection
      id="components"
      title="Components"
      intro="The primitives every screen is assembled from. Each one resolves entirely to Pensero tokens, so a change to a foundation propagates without touching a component."
    >
      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-avatar"
        title="Avatar"
        description="Initials on a hue derived deterministically from the name, so a person keeps the same colour everywhere without storing one."
      >
        <DocsBlock label="Sizes">
          <Specimens
            items={[
              {
                label: "xs · 20px",
                node: <Avatar name="Aisha K." size="xs" />,
              },
              {
                label: "sm · 24px",
                node: <Avatar name="Daniel W." size="sm" />,
              },
              {
                label: "md · 28px",
                node: <Avatar name="Elena V." size="md" />,
              },
              {
                label: "lg · 32px",
                node: <Avatar name="Mara D." size="lg" />,
              },
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Derive the colour from the name, never from list position — the
              same person must not change colour when a filter reorders the
              list.
            </>,
            <>Two initials maximum.</>,
            <>
              Add a ring in the surface colour when avatars overlap or sit on a
              busy plot.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-badge"
        title="Badge"
        description="A status or metric chip. Every tinted variant carries a fill, a border and a text colour drawn from the same hue — the border is what keeps it legible on a tinted surface."
      >
        <DocsBlock label="Variants">
          <Specimens
            items={[
              { label: "gray-subtle", node: <Badge>Neutral</Badge> },
              { label: "gray", node: <Badge variant="gray">Solid</Badge> },
              { label: "green", node: <Badge variant="green">On track</Badge> },
              { label: "amber", node: <Badge variant="amber">+15%</Badge> },
              { label: "red", node: <Badge variant="red">Over budget</Badge> },
              { label: "blue", node: <Badge variant="blue">Beta</Badge> },
              {
                label: "purple",
                node: <Badge variant="purple">Agentic</Badge>,
              },
              { label: "teal", node: <Badge variant="teal">Synced</Badge> },
            ]}
          />
        </DocsBlock>

        <DocsBlock label="Sizes">
          <Specimens
            items={[
              { label: "sm · 20px", node: <Badge size="sm">Small</Badge> },
              { label: "md · 24px", node: <Badge size="md">Medium</Badge> },
              {
                label: "with icon",
                node: (
                  <Badge variant="green" size="md">
                    <Check aria-hidden="true" />
                    Within limits
                  </Badge>
                ),
              },
            ]}
          />
        </DocsBlock>

        <DocsBlock
          label="Anatomy"
          hint="Fill at step 200, border at 400, text at 900. Those steps flip direction between themes on their own, so one class works in both."
        >
          <Snippet
            code={`fill   → --ds-{hue}-200
border → --ds-{hue}-400
text   → --ds-{hue}-900`}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Keep the border. A step-200 fill sits at roughly 1.05:1 against
              the surface — without an edge the chip has no boundary, only
              floating text.
            </>,
            <>
              Colour by meaning, not by direction. Rising AI cost is amber even
              though its arrow points up.
            </>,
            <>Badges state; they do not act. Anything clickable is a button.</>,
            <>
              Cap the text at two or three words. A badge that wraps is a
              sentence in the wrong component.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-banner"
        title="Banner"
        description="A page-level notice. One pattern across four severities, so a page that shows several conditional banners still reads as a set rather than a pile."
      >
        <DocsBlock label="Severities">
          <div className="flex flex-col gap-3">
            <Banner severity="info" title="Only 2 team members have been added">
              Metrics stay incomplete until the people who write the code are on
              the account.
            </Banner>
            <Banner
              severity="warning"
              title="Some repositories could not be fetched"
            >
              Two repositories were skipped in the last run.
            </Banner>
            <Banner severity="error" title="The GitLab login expired">
              Re-connect the integration to resume syncing.
            </Banner>
            <Banner severity="success" title="Your integrations are set up" />
          </div>
        </DocsBlock>

        <DocsBlock label="Usage">
          <Snippet
            code={`<Banner
  severity="warning"
  title="Some repositories could not be fetched"
  action={<Button variant="secondary">See failed sync log</Button>}
  onDismiss={() => hide("fetch")}
>
  Two repositories were skipped in the last run.
</Banner>`}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Title states the situation, body explains the consequence, action
              offers the fix. A banner with no next step is usually a status,
              not a banner.
            </>,
            <>
              Only <Token>error</Token> takes{" "}
              <Token>role=&quot;alert&quot;</Token>; the rest are{" "}
              <Token>status</Token>, so a screen reader is not interrupted for
              information.
            </>,
            <>
              Make a banner dismissible when it is informational, and permanent
              when it describes something broken.
            </>,
            <>
              Three is the practical maximum. Beyond that, group them or move
              the detail into the section it concerns.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-breadcrumb"
        title="Breadcrumb"
        description="The trail above a page title, for anything more than one level deep. It shows position, not navigation history."
      >
        <DocsBlock label="Example">
          <Example>
            <Breadcrumb
              items={[
                { label: "Integrations", href: "#component-breadcrumb" },
                { label: "GitHub repositories", href: "#component-breadcrumb" },
                { label: "acme/web-app" },
              ]}
            />
          </Example>
        </DocsBlock>

        <BestPractice
          items={[
            <>
              The last crumb is the current page: not a link, and marked{" "}
              <Token>aria-current=&quot;page&quot;</Token>.
            </>,
            <>
              Never repeat the page title as the final crumb when the two would
              read identically — one of them is redundant.
            </>,
            <>
              Crumbs mirror the information hierarchy, not the route the person
              took to get there.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-button"
        title="Button"
        description="Five variants at two heights. Variant encodes importance, size encodes the density of its surroundings. Primary is filled with the brand — the only place in the product that happens — so it carries real weight and there is never more than one in view."
      >
        <DocsBlock label="Variants">
          <Specimens
            items={[
              {
                label: "primary",
                node: <Button variant="primary">Save changes</Button>,
              },
              {
                label: "secondary",
                node: <Button variant="secondary">Cancel</Button>,
              },
              {
                label: "tertiary",
                node: <Button variant="tertiary">Dismiss</Button>,
              },
              { label: "error", node: <Button variant="error">Delete</Button> },
              {
                label: "warning",
                node: <Button variant="warning">Override</Button>,
              },
            ]}
          />
        </DocsBlock>

        <DocsBlock
          label="Sizes"
          hint="Two, and only two. The default is 32px at weight 500 — the height every other control comes in. Small is 28px and drops to weight 400: it steps down in stature as well as size, which is what keeps it from reading as a shrunken primary action."
        >
          {/* Read off the component's own size table, so this block cannot
              outlive a size that changed or went away. */}
          <Specimens
            items={BUTTON_SIZE_ENTRIES.map(([size, spec]) => ({
              label: `${size} · ${spec.height}px · ${spec.label}px / ${spec.weight}`,
              node: (
                <Button size={size}>
                  {size[0].toUpperCase() + size.slice(1)}
                </Button>
              ),
            }))}
          />
        </DocsBlock>

        <DocsBlock label="Shapes and slots">
          <Specimens
            items={[
              {
                label: "prefix",
                node: (
                  <Button prefix={<Plus aria-hidden="true" />}>
                    New report
                  </Button>
                ),
              },
              {
                label: "suffix",
                node: (
                  <Button suffix={<CaretDown aria-hidden="true" />}>
                    Period
                  </Button>
                ),
              },
              {
                label: "square",
                node: (
                  <Button shape="square" aria-label="Delete">
                    <Trash aria-hidden="true" />
                  </Button>
                ),
              },
              {
                label: "circle",
                node: (
                  <Button shape="circle" aria-label="Open">
                    <ArrowUpRight aria-hidden="true" />
                  </Button>
                ),
              },
              {
                label: "disabled",
                node: <Button disabled>Unavailable</Button>,
              },
            ]}
          />
        </DocsBlock>

        <DocsBlock label="Props">
          <DocsTable
            head={["Prop", "Type", "Default"]}
            rows={[
              [
                "variant",
                "primary | secondary | tertiary | error | warning",
                "secondary",
              ],
              [
                "size",
                BUTTON_SIZE_ENTRIES.map(([size]) => size).join(" | "),
                "default",
              ],
              ["shape", "default | square | circle", "default"],
              ["prefix / suffix", "ReactNode", "—"],
              ["asChild", "boolean", "false"],
            ]}
          />
        </DocsBlock>

        <DocsBlock label="Usage">
          <Snippet
            code={`<Button variant="primary" prefix={<Plus aria-hidden="true" />}>
  New report
</Button>

<Button shape="square" variant="tertiary" aria-label="Share this chart">
  <ShareNetwork aria-hidden="true" />
</Button>`}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              One primary per view. It is the only element in the product filled
              with the brand, so a second one does not read as two important
              actions — it reads as neither being important.
            </>,
            <>
              Use <Token>tertiary</Token> for actions that live inside a card
              header — a secondary button there competes with the content.
            </>,
            <>
              Label the action, not the mechanism: “Save API key”, not
              “Continue”.
            </>,
            <>
              <Token>square</Token> and <Token>circle</Token> drop the label, so
              they require <Token>aria-label</Token>. Pair them with a tooltip
              using the same words.
            </>,
            <>
              Reserve <Token>error</Token> for destructive actions that already
              have a confirmation step.
            </>,
            <>
              Leave the size alone unless you have a reason. The{" "}
              <Token>default</Token> is what every other control is, so an
              unadorned button is already level with its row.
            </>,
            <>
              Reach for <Token>small</Token> only where density genuinely pays,
              and then check nothing beside it is 32px — that is how a toolbar
              ends up crooked.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-card"
        title="Card"
        description="The in-flow surface. A hairline, a 12px radius and a very soft vertical gradient — no shadow, because it has not left the page."
      >
        <DocsBlock label="Anatomy">
          <div className="max-w-[420px]">
            <Card>
              <CardHeader>
                <div className="min-w-0">
                  <CardTitle>Delivery this period</CardTitle>
                  <CardDescription>Aug 28 – Sep 06</CardDescription>
                </div>
                <Badge variant="green">+8pp</Badge>
              </CardHeader>
              <CardContent>
                <p className="tabular-nums text-h1 text-primary">841.9</p>
                <p className="mt-1 text-copy-sm text-secondary">
                  delivery points
                </p>
              </CardContent>
              <CardFooter>Updated 4 minutes ago</CardFooter>
            </Card>
          </div>
        </DocsBlock>

        <DocsBlock label="Parts">
          <DocsTable
            head={["Part", "Padding", "Notes"]}
            rows={[
              ["Card", "—", "surface-secondary, 12px radius, --border-subtle"],
              [
                "CardHeader",
                "20px / 16px top / 8px bottom",
                "Title left, actions right",
              ],
              ["CardContent", "20px, 20px bottom", "Main body"],
              [
                "CardFooter",
                "20px / 10px",
                "Sits on --ds-surface-primary, divided by --border-subtle",
              ],
            ]}
          />
        </DocsBlock>

        <DocsBlock label="Usage">
          <Snippet
            code={`<Card>
  <CardHeader>
    <div className="min-w-0">
      <CardTitle>Delivery this period</CardTitle>
      <CardDescription>Aug 28 – Sep 06</CardDescription>
    </div>
    <Badge variant="green">+8pp</Badge>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>Updated 4 minutes ago</CardFooter>
</Card>`}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Compose from the named parts rather than adding props. A card that
              needs a new capability needs a new part, not a boolean.
            </>,
            <>
              Keep the 20px gutter identical across header, content and footer
              so the left edge of the content forms one line.
            </>,
            <>
              The footer is for metadata and captions. Actions belong in the
              header.
            </>,
            <>
              Never add a shadow. If it needs to float, it is an overlay, not a
              card.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-collapsible"
        title="Collapsible"
        description="Progressive disclosure for a block that is usually summarised. Animates grid rows rather than height, so no measurement is needed and reflow stays correct."
      >
        <DocsBlock label="Example">
          <Example>
            <Collapsible>
              <CollapsibleTrigger className="inline-flex items-center gap-1.5 text-label-default text-primary outline-none focus-visible:shadow-[var(--ds-focus-ring)]">
                <CaretDown aria-hidden="true" className="size-3.5" />
                Show detail
              </CollapsibleTrigger>
              <CollapsibleContent>
                <p className="pt-2 text-copy-sm text-secondary">
                  Content revealed on demand. The closed state occupies no
                  height, and the transition runs on the Pensero swift curve.
                </p>
              </CollapsibleContent>
            </Collapsible>
          </Example>
        </DocsBlock>

        <BestPractice
          items={[
            <>
              The collapsed state must still answer the question. Expanding
              explains why, not what.
            </>,
            <>
              Rotate the caret to signal direction rather than swapping the icon
              — a rotation is one animation, a swap is two states.
            </>,
            <>
              Never hide something a user must act on. Errors and required
              fields stay visible.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-empty-state"
        title="Empty state"
        description="What a list shows when it has nothing. Says why it is empty and, wherever possible, hands over the next action."
      >
        <DocsBlock label="Example">
          <EmptyState
            icon={<MagnifyingGlass aria-hidden="true" />}
            title="No repositories match these filters"
            description="Try a different search term, or clear the filters to see everything."
            action={<Button variant="secondary">Clear filters</Button>}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Distinguish the three empties: nothing yet, nothing matching,
              nothing permitted. Each needs different words and a different
              action.
            </>,
            <>
              “No results” is not enough. Say what was searched and offer the
              way back.
            </>,
            <>
              Keep the dashed border — it reads as a container awaiting content
              rather than as a broken card.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-input"
        title="Input"
        description="A text field with optional adornments. One height, 32px, so it is level with a Select, Menu or Button beside it. Focus darkens the border and adds a halo rather than a coloured ring — the accent stays reserved for buttons and links."
      >
        <DocsBlock label="Examples">
          <Example>
            <div className="flex max-w-[420px] flex-col gap-3">
              <Input
                placeholder="Search people or teams…"
                prefix={<MagnifyingGlass aria-hidden="true" />}
              />
              <Input defaultValue="Disabled" disabled />
            </div>
          </Example>
        </DocsBlock>

        <DocsBlock label="Usage">
          <Snippet
            code={`<label className="sr-only" htmlFor="people-search">Search people</label>
<Input
  id="people-search"
  name="people-search"
  type="search"
  autoComplete="off"
  spellCheck={false}
  placeholder="Search people…"
  prefix={<MagnifyingGlass aria-hidden="true" />}
/>`}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Every input needs a label. A visually hidden{" "}
              <Token>&lt;label&gt;</Token> counts; a placeholder does not.
            </>,
            <>
              Set <Token>type</Token> and <Token>autocomplete</Token> honestly —
              it drives the mobile keyboard and the password manager.
            </>,
            <>
              Turn off <Token>spellCheck</Token> on names, codes and
              identifiers.
            </>,
            <>
              Placeholders show an example and end with an ellipsis. They never
              repeat the label.
            </>,
            <>
              Use <Token>autoFocus</Token> almost never — only for a single
              primary field on desktop.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-menu"
        title="Menu"
        description="A list of actions or a single choice, on an overlay surface. Built on Radix, so focus, typeahead and dismissal come for free."
      >
        <DocsBlock label="Example">
          <Example>
            <Menu>
              <MenuTrigger asChild>
                <Button suffix={<CaretDown aria-hidden="true" />}>
                  Open menu
                </Button>
              </MenuTrigger>
              <MenuContent className="w-[220px]">
                <MenuLabel>Actions</MenuLabel>
                <MenuItem>
                  <Plus aria-hidden="true" />
                  New report
                </MenuItem>
                <MenuItem>
                  <ArrowUpRight aria-hidden="true" />
                  Open in new tab
                </MenuItem>
                <MenuSeparator />
                <MenuItem>
                  <Trash aria-hidden="true" />
                  Delete
                </MenuItem>
              </MenuContent>
            </Menu>
          </Example>
        </DocsBlock>

        <DocsBlock label="Parts">
          <DocsTable
            head={["Part", "Purpose"]}
            rows={[
              [
                <Token key="a">MenuContent</Token>,
                "Overlay surface, 12px radius, 4px padding",
              ],
              [
                <Token key="b">MenuItem</Token>,
                "32px row, 6px radius, highlight on keyboard or pointer focus",
              ],
              [
                <Token key="c">MenuRadioItem</Token>,
                "Single choice with a check indicator",
              ],
              [
                <Token key="d">MenuLabel</Token>,
                "Group heading, 12px secondary",
              ],
              [
                <Token key="e">MenuSeparator</Token>,
                "Full-bleed hairline between groups",
              ],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              The highlight <em>is</em> the focus state. Do not add a focus ring
              on top of it.
            </>,
            <>
              Group with a separator and label rather than shipping a list of
              twelve flat items.
            </>,
            <>Destructive items go last, after a separator.</>,
            <>
              Embedding a control inside a menu — a switcher, a date field —
              needs <Token>onKeyDown</Token> stopped so roving focus does not
              swallow its keys.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-pagination"
        title="Pagination"
        description="Range and steppers rather than numbered pages. For logs and long tables the span matters more than the index."
      >
        <DocsBlock label="Example">
          <Example>
            <Pagination
              page={2}
              pageSize={20}
              total={132}
              onPageChange={() => {}}
              label="runs"
            />
          </Example>
        </DocsBlock>

        <BestPractice
          items={[
            <>
              State the range and the total. “21–40 of 132” answers where you
              are and how much is left in one line.
            </>,
            <>
              Disable rather than hide the steppers at the ends, so the control
              does not change width.
            </>,
            <>
              Reset to page 1 whenever a filter changes, or the view can land on
              an empty page.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-popover"
        title="Popover"
        description="A floating panel for content richer than a menu: filters, pickers, small forms."
      >
        <DocsBlock label="Example">
          <Example>
            <Popover>
              <PopoverTrigger asChild>
                <Button suffix={<CaretDown aria-hidden="true" />}>
                  12 people
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[260px] p-0">
                <div className="border-b border-[var(--border-subtle)] p-2">
                  <Input
                    placeholder="Search…"
                    prefix={<MagnifyingGlass aria-hidden="true" />}
                  />
                </div>
                <ul className="max-h-[180px] overflow-y-auto overscroll-contain p-1">
                  {["Aisha K.", "Daniel W.", "Elena V.", "Tomas L."].map(
                    (name) => (
                      <li
                        key={name}
                        className="flex h-9 items-center gap-2.5 rounded-[var(--radius)] px-2 text-label-default text-primary"
                      >
                        <Avatar name={name} size="sm" />
                        {name}
                      </li>
                    ),
                  )}
                </ul>
              </PopoverContent>
            </Popover>
          </Example>
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Menu for actions, popover for content. A popover holding only menu
              items should be a menu.
            </>,
            <>
              Set <Token>p-0</Token> and pad the regions yourself when the panel
              has a header or a scroll area.
            </>,
            <>
              Any scrollable region inside gets{" "}
              <Token>overscroll-contain</Token> so the page behind does not
              move.
            </>,
            <>
              Keep it under roughly 320px wide. Wider than that and it wants to
              be a dialog.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-segmented"
        title="Segmented control"
        description="A small set of mutually exclusive options shown in full. The indicator slides between segments so the change of state is legible."
      >
        <DocsBlock label="Example">
          <Specimens
            items={[
              {
                label: "two options",
                node: (
                  <SegmentedControl
                    aria-label="Adoption mode"
                    value={segment}
                    onValueChange={setSegment}
                    options={[
                      { value: "assisted", label: "AI-assisted" },
                      { value: "agentic", label: "Agentic" },
                    ]}
                  />
                ),
              },
              {
                label: "icon labels",
                node: (
                  <SegmentedControl
                    aria-label="Density"
                    value={segment}
                    onValueChange={setSegment}
                    options={[
                      { value: "assisted", label: "Compact" },
                      { value: "agentic", label: "Comfortable" },
                    ]}
                  />
                ),
              },
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Two to five options. Beyond that the labels shrink past reading
              size — use a menu.
            </>,
            <>
              Options must be siblings of one kind. “AI-assisted / Agentic”
              works; “AI-assisted / Export” does not.
            </>,
            <>
              It changes a view, never commits a change. Nothing here should
              need saving.
            </>,
            <>
              Give it an <Token>aria-label</Token>; the group needs a name even
              when the options are self-evident.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-select"
        title="Select"
        description="A single choice from a known list. Sized and bordered like a secondary button, so filter rows stay optically level."
      >
        <DocsBlock label="Example">
          <Example>
            <div className="flex flex-wrap items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger aria-label="Status" className="min-w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Example>
        </DocsBlock>

        <DocsBlock
          label="On a row"
          hint="Input, Select, Menu and Segmented control are all 32px, and a default Button matches them, so a filter row is level with no per-site adjustment."
        >
          <Example>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Search…"
                prefix={<MagnifyingGlass aria-hidden="true" />}
                containerClassName="w-[180px]"
              />
              <Select defaultValue="all">
                <SelectTrigger
                  aria-label="Row status"
                  className="min-w-[140px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any status</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="secondary">Clear</Button>
            </div>
          </Example>
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Name the empty option for what it does — “Any status”, not “All
              statuss”. Never build a plural by appending an <Token>s</Token>.
            </>,
            <>
              Select for a value, segmented control for two to five, menu for
              actions.
            </>,
            <>
              Give every trigger an <Token>aria-label</Token>: the visible text
              is the value, not the field.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-skeleton"
        title="Skeleton"
        description="A placeholder shaped like the content it stands in for, so nothing shifts when the real value arrives."
      >
        <DocsBlock label="Example">
          <Example>
            <div className="flex max-w-[360px] flex-col gap-2">
              <Skeleton className="h-5 w-[74px] rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </Example>
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Match the real element’s box exactly. A skeleton of the wrong
              height causes the layout shift it exists to prevent.
            </>,
            <>
              Use it for content that arrives after the page, such as the
              asynchronous health badges on the integrations list.
            </>,
            <>
              Never use a spinner inside a card. Content-shaped loading tells
              the reader what is coming.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-switch"
        title="Switch"
        description="An immediate on/off. Flipping it takes effect at once — there is no save step."
      >
        <DocsBlock label="Example">
          <Specimens
            items={[
              { label: "off", node: <Switch aria-label="Example off" /> },
              {
                label: "on",
                node: <Switch defaultChecked aria-label="Example on" />,
              },
              {
                label: "disabled",
                node: <Switch disabled aria-label="Example disabled" />,
              },
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Switch for a setting that applies immediately; a checkbox for one
              that is submitted with a form.
            </>,
            <>
              Label the thing, not the state. “Automatically connect
              repositories”, never “Enabled”.
            </>,
            <>
              When a switch was flipped by the system rather than the user,
              explain why next to it — an info tooltip is enough.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-table"
        title="Table"
        description="Dense tabular data. Scrolls horizontally inside its own container so the page never does, and rows separate with the same hairline as the card holding them."
      >
        <DocsBlock label="Example">
          <Example padded={false}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell sortable direction="asc">
                    Name
                  </TableHeaderCell>
                  <TableHeaderCell>PRs</TableHeaderCell>
                  <TableHeaderCell>Last fetch</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  ["acme/web-app", "1284 / 1284", "2 hours ago"],
                  ["acme/api", "962 / 962", "2 hours ago"],
                  ["acme/docs", "87 / 132", "1 day ago"],
                ].map((row) => (
                  <TableRow key={row[0]} interactive>
                    <TableCell>{row[0]}</TableCell>
                    <TableCell className="tabular-nums">{row[1]}</TableCell>
                    <TableCell className="text-secondary">{row[2]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Example>
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Every numeric column takes <Token>tabular-nums</Token>, or the
              digits will not align down the column.
            </>,
            <>
              Secondary columns — timestamps, counts — use{" "}
              <Token>--ds-gray-900</Token> so the identifying column reads
              first.
            </>,
            <>
              Set <Token>aria-sort</Token> on the sorted header, and keep the
              caret slot reserved on unsorted ones so headers do not shift on
              click.
            </>,
            <>
              Give the whole row a link target rather than only the first cell;{" "}
              <Token>interactive</Token> adds the hover that signals it.
            </>,
            <>
              A sticky first column needs its own background, or rows will show
              through as it scrolls.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-tabs"
        title="Tabs"
        description="Peer views of the same subject. A hover pill, a sliding 2px underline and a shared hairline underneath. Labels stay at weight 400 throughout — the underline and colour carry the active state on their own."
      >
        <DocsBlock label="Example">
          <Example padded={false}>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="px-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="economics">AI economics</TabsTrigger>
                <TabsTrigger value="budget">AI budget</TabsTrigger>
              </TabsList>
              <TabsContent
                value={tab}
                className="px-4 py-5 text-copy-sm text-secondary"
              >
                Content for “{tab}”.
              </TabsContent>
            </Tabs>
          </Example>
        </DocsBlock>

        <DocsBlock
          label="Implementation note"
          hint="The hairline lives on a wrapper, not on the scrolling list. overflow-x-auto clips to the padding box, which would swallow an underline sitting on the list's own bottom edge. The indicator also mounts only on the active trigger — toggling display on a shared-layout element leaves it measured at zero and it never paints."
        >
          <Snippet
            code={`<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="summary">Summary</TabsTrigger>
  </TabsList>
  <TabsContent value="summary">…</TabsContent>
</Tabs>`}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Tabs switch views of one subject. If the panels are unrelated,
              that is navigation.
            </>,
            <>
              Deep-link the active tab through a query parameter so a shared URL
              reopens on the same view.
            </>,
            <>
              Controls that apply to every tab live above the tab bar, not
              inside a panel.
            </>,
            <>
              Keep the active indicator neutral. It marks position, not brand.
            </>,
            <>
              Mark the active tab the way the nav marks its active item: weight
              500 and full-contrast text. One pattern for &ldquo;you are
              here&rdquo; across the product beats two.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-theme-switcher"
        title="Theme switcher"
        description="A three-way pill — system, light, dark — with a spring indicator, matching the control in Vercel's own footer."
      >
        <DocsBlock label="Example">
          <Specimens
            items={[
              { label: "system / light / dark", node: <ThemeSwitcher /> },
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Offer <em>system</em> as a real option, not just light and dark,
              and default to it.
            </>,
            <>
              Render the indicator only once mounted; the server does not know
              the stored preference and will otherwise hydrate the wrong
              segment.
            </>,
            <>
              Keep it in the account menu. It is a preference, not a page-level
              control.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="component-tooltip"
        title="Tooltip"
        description="A short, non-essential clarification on hover or focus. A surface with a hairline, not an inverted chip — tooltips stay in the same material as the rest of the interface."
      >
        <DocsBlock label="Example">
          <Specimens
            items={[
              {
                label: "on a button",
                node: (
                  <Tooltip content="Share this chart">
                    <Button
                      shape="square"
                      variant="tertiary"
                      aria-label="Share this chart"
                    >
                      <ArrowUpRight aria-hidden="true" />
                    </Button>
                  </Tooltip>
                ),
              },
              {
                label: "explanatory",
                node: (
                  <Tooltip content="Percentage of active developers with any AI tool usage tracked by Pensero.">
                    <Button variant="secondary">Hover for detail</Button>
                  </Tooltip>
                ),
              },
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Never put information here that a user needs to complete a task —
              tooltips are unavailable on touch.
            </>,
            <>
              On an icon button, the tooltip should repeat the{" "}
              <Token>aria-label</Token> word for word.
            </>,
            <>
              One <Token>TooltipProvider</Token> at the app root sets the delay
              for everything.
            </>,
            <>
              No interactive content. A tooltip that needs a link is a popover.
            </>,
          ]}
        />
      </DocsEntry>
    </DocsSection>
  );
}
