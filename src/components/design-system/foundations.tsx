"use client";

import {
  BestPractice,
  DocsBlock,
  DocsEntry,
  DocsSection,
  DocsTable,
  DoDont,
  Example,
  Snippet,
  Token,
} from "./docs-kit";
import { Button } from "@/components/ui/button";
import { BrandTintControls, BrandTintSnippet } from "./brand-tint-controls";

/* -------------------------------------------------------------------------- */
/* Swatches                                                                    */
/* -------------------------------------------------------------------------- */

function Scale({ name, steps }: { name: string; steps: number[] }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-label-xs-mono text-secondary">{name}</span>
      <div className="flex overflow-hidden rounded-[var(--radius)] border border-[var(--border-subtle)]">
        {steps.map((step) => (
          <div
            key={step}
            title={`--ds-${name}-${step}`}
            className="h-9 flex-1"
            style={{ background: `var(--ds-${name}-${step})` }}
          />
        ))}
      </div>
    </div>
  );
}

function SwatchRow({
  items,
}: {
  items: { token: string; label: string; note?: string }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.token}
          className="flex items-center gap-3 rounded-[var(--radius)] border border-[var(--border-subtle)] p-2.5"
        >
          <span
            aria-hidden="true"
            className="size-9 shrink-0 rounded-[6px] border border-[var(--border-subtle)]"
            style={{ background: `var(${item.token})` }}
          />
          <span className="min-w-0">
            <span className="block truncate text-label-sm text-primary">
              {item.label}
            </span>
            <span className="block truncate text-label-xs-mono text-secondary">
              {item.token}
            </span>
            {item.note ? (
              <span className="block truncate text-label-xs text-secondary">
                {item.note}
              </span>
            ) : null}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * The scale, as data: one row per class, grouped by the category it belongs
 * to. The docs table and the live specimens both read this, so a class cannot
 * be documented at a size it no longer has.
 */
const TYPE_SCALE = {
  heading: {
    intro:
      "Introduce a page or a section. Weight 600 with negative tracking, which is what keeps a large size from reading as shouty.",
    rows: [
      {
        cls: "text-h1",
        spec: "32 / 40 · 600 · −1.28px",
        use: "The single largest number on a screen — a KPI value.",
      },
      {
        cls: "text-h2",
        spec: "24 / 32 · 600 · −0.96px",
        use: "Page title. One per page.",
      },
      {
        cls: "text-h3",
        spec: "20 / 26 · 600 · −0.4px",
        use: "Section header inside a page.",
      },
      {
        cls: "text-h4",
        spec: "16 / 24 · 600 · −0.32px",
        use: "Card headline, and the question a chart answers.",
      },
      {
        cls: "text-h5",
        spec: "14 / 20 · 600 · −0.28px",
        use: "Card title, panel title — a heading that must not out-size the body around it.",
      },
    ],
  },
  copy: {
    intro:
      "Several lines of prose. Looser leading than Label, because the eye has to find the next line.",
    rows: [
      {
        cls: "text-copy-default",
        spec: "14 / 20 · 400",
        use: "A paragraph. This is what you get by writing nothing — the body is already set to it.",
      },
      {
        cls: "text-copy-sm",
        spec: "13 / 18 · 400",
        use: "Secondary prose: descriptions under a heading, hints under a field, chart captions.",
      },
      {
        cls: "text-copy-xs",
        spec: "12 / 16 · 400",
        use: "Prose where space is genuinely scarce, such as a status line inside a dense row.",
      },
      {
        cls: "text-copy-sm-mono",
        spec: "13 / 18 · mono",
        use: "Code: a block of it, a fragment quoted in prose, or an identifier such as a repository path or a branch name.",
      },
    ],
  },
  label: {
    intro:
      "One line. Tighter leading than Copy so it sits level with an icon and stacks predictably in a row.",
    rows: [
      {
        cls: "text-label-default",
        spec: "14 / 20 · 400",
        use: "The workhorse: nav items, table cells, menu rows, input values.",
      },
      {
        cls: "text-label-sm",
        spec: "13 / 16 · 400",
        use: "A second line under a label, and most table body text.",
      },
      {
        cls: "text-label-xs",
        spec: "12 / 16 · 400",
        use: "Tertiary text in a busy view: legends, badges, metadata, the uppercase nav headers.",
      },
      {
        cls: "text-label-xs-mono",
        spec: "12 / 16 · mono",
        use: "A token or a count, where the figures must not shift width.",
      },
      {
        cls: "text-label-overline",
        spec: "11 / 16 · 500 · +0.04em · caps",
        use: "The small caps heading a region: sidebar sections, a category divider, the name of a KPI. Fixed size — it is a role, not a rung — and the uppercase is baked in, so the caps are never typed into the content.",
      },
    ],
  },
  button: {
    intro:
      "Only inside a component that renders a button. Weight 500 is what separates an action from the text around it.",
    rows: [
      {
        cls: "text-button-default",
        spec: "14 / 20 · 500",
        use: "Every button at the default size.",
      },
      {
        cls: "text-button-xs",
        spec: "12 / 16 · 500",
        use: "Badges and chips — a label that behaves like a control.",
      },
    ],
  },
} as const;

const TEXT_COLOURS = [
  {
    cls: "text-primary",
    token: "--ds-text-primary",
    use: "The thing itself: a value, a title, a row's subject.",
  },
  {
    cls: "text-secondary",
    token: "--ds-text-secondary",
    use: "Everything that supports it — descriptions, captions, units, most icons.",
  },
  {
    cls: "text-tertiary",
    token: "--ds-text-tertiary",
    use: "Present but not to be read: placeholders, an icon at rest, a separator's label.",
  },
  {
    cls: "text-disabled",
    token: "--ds-text-disabled",
    use: "Unavailable. Exempt from the contrast floor, and the only rank that is.",
  },
];

export function Foundations() {
  return (
    <DocsSection
      id="foundations"
      title="Foundations"
      intro="The tokens every component resolves to. Change a value here and it propagates through the whole product — no component defines a colour, a size or a shadow of its own."
    >
      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="foundations-color"
        title="Colour"
        description="Ten scales of ten steps. The step number encodes the job, not the shade — the same index does the same work in light and dark, which is why one class can serve both themes."
      >
        <DocsBlock label="Step semantics">
          <DocsTable
            head={["Steps", "Role", "Typical use"]}
            rows={[
              [
                <Token key="a">100–300</Token>,
                "Backgrounds",
                "Subtle fills, hover states, badge fills",
              ],
              [
                <Token key="b">400–600</Token>,
                "Borders",
                "Hairlines, control edges, badge borders",
              ],
              [
                <Token key="c">700–800</Token>,
                "Solid backgrounds",
                "Filled buttons, high-contrast chips",
              ],
              [
                <Token key="d">900–1000</Token>,
                "Text and icons",
                "Secondary text (900), primary text (1000). For a hue, text takes --ds-<hue>-text instead",
              ],
            ]}
          />
        </DocsBlock>

        <DocsBlock
          label="Even steps"
          hint="Every scale climbs in even OKLCH lightness, so a step means the same thing in any hue and a green badge carries the same weight as a red one. Hand-tuned palettes rarely do: they pick up inversions, where a step is lighter than the one before it, and outright duplicate values. Those read as mistakes on a ramp, so the ramp wins."
        >
          <DocsTable
            head={["Step", "Light L", "Dark L", "Stride"]}
            rows={[
              [
                "100–400",
                "97 → 88",
                "22 → 35",
                "2–4, fine enough to separate background fills",
              ],
              ["500–800", "81 → 52", "42 → 71", "7–10, the working range"],
              ["900", "42", "79", "10, the text step"],
              [
                "1000",
                "28",
                "94",
                "14, deliberately further — an end stop, not a ramp step",
              ],
            ]}
          />
        </DocsBlock>

        <DocsBlock
          label="Status text sits outside the ramp"
          hint="Step 900 does two jobs: text on a tinted surface, and the hover fill of a filled button. The ramp pins it below 800, which in light puts it near L42 — dark enough that amber turns to mud and red to maroon, because warm hues lose their identity as they darken. So coloured text uses its own step instead, around L54 with chroma at the gamut edge. In dark, 900 is already light and chromatic, and the token simply points at it."
        >
          <Example>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {(["amber", "red", "green", "blue"] as const).map((hue) => (
                <span
                  key={hue}
                  className="text-label-sm"
                  style={{ color: `var(--ds-${hue}-text)` }}
                >
                  --ds-{hue}-text
                </span>
              ))}
            </div>
          </Example>
        </DocsBlock>

        <DocsBlock label="Scales">
          <Example>
            <div className="flex flex-col gap-3">
              {[
                "gray",
                "blue",
                "green",
                "amber",
                "red",
                "purple",
                "teal",
                "pink",
              ].map((name) => (
                <Scale
                  key={name}
                  name={name}
                  steps={[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]}
                />
              ))}
            </div>
          </Example>
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Reach for the step that matches the job. A border is{" "}
              <Token>400</Token>–<Token>600</Token> whatever the hue; picking by
              eye is what makes a palette drift.
            </>,
            <>
              Never hardcode a hex in a component. If a value does not exist as
              a token, add the token.
            </>,
            <>
              Text colour is only ever <Token>--ds-gray-900</Token> (secondary)
              or <Token>--ds-gray-1000</Token> (primary). Three text greys is
              already one too many.
            </>,
            <>
              A filled control takes <Token>--ds-surface-secondary</Token> for
              its label, never a literal white or black. The 800 step is dark in
              the light theme and light in the dark one, and the background
              token flips with it — a hardcoded label only works in one theme.
            </>,
            <>
              Use <Token>--ds-gray-alpha-*</Token> over solid greys for anything
              that sits on a tinted surface — alpha keeps the tint showing
              through, solids punch a neutral hole in it.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="foundations-brand"
        title="Brand tint"
        description="Every surface is a neutral with a trace of brand green mixed in. Three dials control the whole system; each surface token is derived, never hand-picked."
      >
        <DocsBlock
          label="The dials"
          hint="Amount is per theme because light surfaces broadcast tint far more readily than dark ones — 2.5% in light reads about as strongly as 7% in dark. Move a dial to re-tint the entire app live; the block below follows, ready to paste into globals.css."
        >
          <BrandTintControls />
          <BrandTintSnippet />
        </DocsBlock>

        <DocsBlock
          label="How a surface is derived"
          hint="Desaturation happens in OKLCH against the brand’s achromatic twin — a grey at exactly the brand’s lightness (L 0.780). Mixing toward it drops chroma while holding lightness and hue, which is a true desaturation rather than a wash toward grey."
        >
          <Snippet
            code={`--brand-achromatic: #b7b7b7;                     /* L 0.780, C 0 */
--tint-color: color-mix(in oklch,
  var(--brand) var(--tint-saturation),
  var(--brand-achromatic));

/* Applied once, for both themes, to the untinted neutrals */
--ds-surface-secondary: color-mix(in srgb,
  var(--tint-color) var(--brand-tint),
  var(--neutral-surface-secondary));`}
          />
        </DocsBlock>

        <DocsBlock label="What is tinted">
          <DocsTable
            head={["Tokens", "Tinted", "Why"]}
            rows={[
              [
                <Token key="a">--ds-surface-secondary/200</Token>,
                "Yes",
                "Page and card surfaces carry the brand",
              ],
              [
                <Token key="b">--ds-gray-100…500</Token>,
                "Yes",
                "Fills and borders must sit in the same family as the surface",
              ],
              [
                <Token key="c">--ds-gray-600…1000</Token>,
                "No",
                "Icons and text stay true neutral so contrast is predictable",
              ],
              [
                <Token key="d">--ds-blue / green / amber…</Token>,
                "No",
                "Semantic and categorical hues must stay legible against any surface",
              ],
            ]}
          />
        </DocsBlock>

        <DocsBlock
          label="Accent"
          hint="The brand is too light for chrome on white — #16db65 is OKLCH L 0.78. A darkened twin at L 0.55 holds the same hue and carries the light theme."
        >
          <SwatchRow
            items={[
              { token: "--brand", label: "Brand", note: "Logo, brand marks" },
              {
                token: "--brand-strong",
                label: "Brand strong",
                note: "Light-theme accent, L 0.55",
              },
              {
                token: "--ds-focus-color",
                label: "Focus",
                note: "Resolves per theme",
              },
            ]}
          />
        </DocsBlock>

        <DoDont
          do={[
            "Change the look by moving a dial. All three are in one block at the top of globals.css.",
            "Keep the brand at full strength for the logo, and only the logo.",
            "Re-derive tokens when adding a surface, so it inherits the tint automatically.",
          ]}
          dont={[
            "Paste a tinted hex into a component — it will not follow the dials.",
            "Tint text or icon greys. Contrast becomes theme-dependent and hard to reason about.",
            "Use the accent for always-on states like an active nav item; it competes with the brand mark.",
          ]}
        />

        <BestPractice
          items={[
            <>
              Desaturate in OKLCH, not sRGB. Mixing a saturated hue toward grey
              in sRGB shifts lightness and muddies it; OKLCH holds <em>L</em>{" "}
              and <em>H</em> and moves only chroma.
            </>,
            <>
              Expect the two themes to need different amounts. Matching the
              numbers does not match the perception.
            </>,
            <>
              Keep the untinted neutrals visible in the stylesheet as{" "}
              <Token>--neutral-*</Token>. Seeing the base value next to the
              derived one makes drift obvious.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="foundations-dataviz"
        title="Data visualisation palette"
        description="Categorical colour is reserved for data. The accent means interactive. Keeping those two jobs apart is what stops a chart-heavy product turning into confetti."
      >
        <DocsBlock
          label="Attribution series"
          hint="Ordered human → assisted → agentic, so the ramp itself carries meaning."
        >
          <SwatchRow
            items={[
              { token: "--series-human", label: "Human", note: "Neutral grey" },
              {
                token: "--series-assisted",
                label: "AI-assisted",
                note: "Blue",
              },
              { token: "--series-agentic", label: "Agentic", note: "Purple" },
              {
                token: "--series-inactive",
                label: "Inactive",
                note: "Alpha grey, for the remainder in 100% stacks",
              },
            ]}
          />
        </DocsBlock>

        <DocsBlock
          label="Categorical"
          hint="Fifteen steps, leaders first and the long tail in greys so it recedes."
        >
          <Example>
            <div className="flex overflow-hidden rounded-[var(--radius)] border border-[var(--border-subtle)]">
              {Array.from({ length: 15 }, (_, index) => (
                <div
                  key={index}
                  className="h-9 flex-1"
                  style={{
                    background: `var(--series-${String(index + 1).padStart(2, "0")})`,
                  }}
                />
              ))}
            </div>
          </Example>
        </DocsBlock>

        <DocsBlock label="Heatmap buckets">
          <SwatchRow
            items={[
              { token: "--heat-none", label: "No usage" },
              { token: "--heat-included", label: "Included in plan" },
              { token: "--heat-low", label: "Low" },
              { token: "--heat-moderate", label: "Moderate" },
              { token: "--heat-high", label: "High" },
              { token: "--heat-very-high", label: "Very high" },
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Never use <Token>--ds-focus-color</Token> or the brand as a series
              colour, and never use a series colour for an interactive state.
              One glance should tell you whether something is data or a control.
            </>,
            <>
              Order a stack so the ramp means something. Human → assisted →
              agentic reads as a progression; alphabetical would not.
            </>,
            <>
              Send the long tail to grey. Fifteen saturated categories is noise;
              two or three leaders plus greys is a chart.
            </>,
            <>
              Encode direction with intent, not sign. A rising cost is amber
              even though the arrow points up.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="foundations-typography"
        title="Typography"
        description="A sans and a mono at a 14px base. Four categories — heading, copy, label, button — each setting size, line height, weight and tracking together. You pick the category by what the text is doing, then the size."
      >
        <DocsBlock
          label="Usage"
          hint="Every style is one class. Nothing sets a font-size directly, and nothing pairs a size class with a separate weight unless it means to override the category's own — which works, since the scale sits a layer below the weight utilities."
        >
          <Snippet
            code={`<p className="text-copy-default">
  A paragraph, <strong>with emphasis</strong>.
</p>`}
          />
        </DocsBlock>

        {(
          [
            ["Headings", "heading"],
            ["Copy", "copy"],
            ["Label", "label"],
            ["Buttons", "button"],
          ] as const
        ).map(([title, key]) => (
          <DocsBlock key={key} label={title} hint={TYPE_SCALE[key].intro}>
            <DocsTable
              head={["Example", "Class", "Metrics", "Usage"]}
              rows={TYPE_SCALE[key].rows.map((row) => [
                <span key="e" className={`${row.cls} text-primary`}>
                  {title === "Buttons" ? "Button" : "The quick brown fox"}
                </span>,
                <Token key="c">{row.cls}</Token>,
                <span key="s" className="whitespace-nowrap">
                  {row.spec}
                </span>,
                row.use,
              ])}
            />
          </DocsBlock>
        ))}

        <DocsBlock
          label="Colour"
          hint="Four ranks, and the same ladder serves icons — an icon is text that happens to be a shape. Rank is about how much attention a thing is owed, not about hue; a coloured token is never one of these."
        >
          <DocsTable
            head={["Example", "Class", "Token", "Usage"]}
            rows={TEXT_COLOURS.map((row) => [
              <span key="e" className={`text-label-default ${row.cls}`}>
                The quick brown fox
              </span>,
              <Token key="c">{row.cls}</Token>,
              <Token key="t">{row.token}</Token>,
              row.use,
            ])}
          />
        </DocsBlock>

        <DocsBlock
          label="Overline colour"
          hint="The overline takes one of two ranks, and which one says what the caps are for. Tertiary when it heads a region the reader scans past — a sidebar section, a category divider. Secondary when it names something they are meant to read — a KPI, a term in a definition list. Backwards, a page reads as either shouty or structureless."
        >
          <Example>
            <div className="flex flex-wrap items-start gap-10">
              <div>
                <p className="text-label-overline text-tertiary">
                  Engineering intelligence
                </p>
                <p className="mt-1 text-label-sm text-secondary">
                  A region heading — scanned past
                </p>
              </div>
              <div>
                <p className="text-label-overline text-secondary">AI cost</p>
                <p className="mt-1 text-h3 text-primary">$270</p>
              </div>
            </div>
          </Example>
        </DocsBlock>

        <DocsBlock
          label="Hierarchy"
          hint="Size descends with depth in the tree. A card headline must never out-size the section header that contains it — that inversion is the single most common way a page stops reading as a hierarchy."
        >
          <DocsTable
            head={["Level", "Class", "Size"]}
            rows={[
              ["KPI value", <Token key="a">text-h1</Token>, "32px"],
              ["Page title", <Token key="b">text-h2</Token>, "24px"],
              ["Section header", <Token key="c">text-h3</Token>, "20px"],
              ["Card headline", <Token key="d">text-h4</Token>, "16px"],
              [
                "Card title, body",
                <Token key="e">text-h5 / text-copy-default</Token>,
                "14px",
              ],
              [
                "Sub-line, caption",
                <Token key="f">text-copy-sm</Token>,
                "13px",
              ],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Pick the category first. <Token>label</Token> is one line and sits
              level with an icon; <Token>copy</Token> is several and has the
              leading to be read. Getting this wrong is why a table row can feel
              loose and a paragraph cramped at the same size.
            </>,
            <>
              <Token>text-copy-default</Token> is what a paragraph already is —
              the body is set to it. Writing the class to restate that is noise.
            </>,
            <>
              Apply <Token>tabular-nums</Token> to any number a reader will
              compare — columns, deltas, KPI values. Proportional digits make
              equal values look unequal.
            </>,
            <>
              Use <Token>text-balance</Token> on short headings and{" "}
              <Token>text-pretty</Token> on paragraphs to avoid widows.
            </>,
            <>
              The scale holds only what the product uses. A size with no call
              site is a decision nobody has had to make yet — add it when a
              screen needs it, not in advance.
            </>,
          ]}
        />
      </DocsEntry>

      <DocsEntry
        id="foundations-spacing"
        title="Spacing & layout"
        description="A 4px grid, expressed in physical pixels so it is immune to the root font size."
      >
        <DocsBlock
          label="Why px, not rem"
          hint="Tailwind’s spacing scale defaults to rem. With a 14px root that turns p-6 into 21px — off-grid. Pinning --spacing to 4px keeps the rhythm exact."
        >
          <Snippet
            code={`@theme inline {\n  --spacing: 4px;   /* p-6 → 24px, whatever the root size */\n}`}
          />
        </DocsBlock>

        <DocsBlock
          label="Form scale"
          hint="32px is the form height, and the default of every control that has a size at all. Only Button offers anything else — a 28px tier for genuinely dense chrome, which steps its label down to weight 400 so it reads as subordinate rather than merely shrunken. Fields, selects and menus have no size prop: a second height on a text field only ever creates the chance of a crooked row."
        >
          <DocsTable
            head={["Height", "Label", "Components", "How to get it"]}
            rows={[
              [
                "32px",
                "14px / 500",
                "Input, Select, Menu, Segmented control, Button",
                "The default everywhere — pass nothing",
              ],
              [
                "28px",
                "14px / 400",
                "Button only",
                <>
                  <Token key="a">size=&quot;small&quot;</Token>, for dense
                  chrome
                </>,
              ],
            ]}
          />
        </DocsBlock>

        <DocsBlock label="Key measures">
          <DocsTable
            head={["Measure", "Value", "Where"]}
            rows={[
              ["Card gutter", "20px", "Card header, body and footer padding"],
              ["Grid gap", "16px", "Between cards in a row"],
              ["Section gap", "48px", "Between page sections"],
              ["Page gutter", "24px → 32px", "Container padding, mobile → lg"],
              ["Sidebar", "248px", "Fixed"],
            ]}
          />
        </DocsBlock>

        <DocsBlock
          label="Line length"
          hint="Content width is chosen by what is being read, not by the window. A table wants every pixel; a settings form wants a column you can scan without moving your head."
        >
          <DocsTable
            head={["Measure", "Max width", "Use"]}
            rows={[
              [
                <Token key="a">full</Token>,
                "1440px",
                "Tables, charts, genuinely dense views",
              ],
              [
                <Token key="b">content</Token>,
                "1040px",
                "Lists, cards, reading-oriented pages",
              ],
              [
                <Token key="c">narrow</Token>,
                "760px",
                "Settings and single-column forms",
              ],
            ]}
          />
          <Snippet
            code={`<IntegrationsPage measure="narrow" …>   {/* settings */}
<IntegrationsPage measure="content" …>  {/* a listing */}
<IntegrationsPage …>                    {/* full, the default */}`}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Every value is a multiple of 4. If a design needs 18px, the answer
              is 16 or 20.
            </>,
            <>
              Space belongs to the container, not the child. Use{" "}
              <Token>gap</Token> on a flex or grid parent rather than margins on
              items.
            </>,
            <>
              Give flex children <Token>min-w-0</Token> whenever text inside
              them may truncate, or they will refuse to shrink.
            </>,
            <>
              Pick the measure from the content, not the page. A settings form
              stretched to 1440px puts the label and its control at opposite
              ends of the screen.
            </>,
            <>
              Page chrome — the header, its breadcrumb and actions — always
              spans the full measure, whatever the body uses. Chrome that
              resized between pages would jump on every navigation.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="foundations-radius"
        title="Radius"
        description="Four steps. Nested corners step down so the inner shape follows the outer one."
      >
        <Example>
          <div className="flex flex-wrap items-end gap-6">
            {[
              { r: "4px", label: "4px — inner elements", cls: "rounded-[4px]" },
              {
                r: "6px",
                label: "6px — controls",
                cls: "rounded-[var(--radius)]",
              },
              { r: "8px", label: "8px — grouped controls", cls: "rounded-lg" },
              { r: "12px", label: "12px — cards, overlays", cls: "rounded-xl" },
            ].map((item) => (
              <div key={item.r} className="flex flex-col items-start gap-2">
                <div
                  className={`size-16 border border-[var(--border-subtle)] bg-[var(--ds-gray-alpha-200)] ${item.cls}`}
                />
                <span className="text-label-xs-mono text-secondary">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </Example>

        <BestPractice
          items={[
            <>
              <Token>--radius</Token> (6px) is the default for anything
              interactive: buttons, inputs, menu items, nav rows.
            </>,
            <>
              Cards and floating surfaces are 12px. A 6px card reads as an
              oversized button.
            </>,
            <>
              Nest downward. A 4px indicator inside a 6px control inside a 12px
              card; the inner radius should be roughly outer minus padding.
            </>,
            <>
              Full rounding is reserved for avatars and pills, never for
              containers.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="foundations-surfaces"
        title="Surfaces"
        description="Three background levels, and that is the whole set. A surface is a colour, nothing more — whether it floats is a separate question, answered by Elevation below."
      >
        <DocsBlock
          label="The three levels"
          hint="Primary is the ground everything sits on; secondary is what content sits in; tertiary is what sits over content. Naming them by rank rather than by tone is what lets one class work in both themes — in light, each level steps toward white; in dark, each steps away from black."
        >
          <DocsTable
            head={["Level", "Token", "Used for"]}
            rows={[
              [
                "Primary",
                <Token key="s1">--ds-surface-primary</Token>,
                "The page itself, the sidebar, table headers, card footers — the ground",
              ],
              [
                "Secondary",
                <Token key="s2">--ds-surface-secondary</Token>,
                "Cards, panels and every control: buttons, inputs, selects, segmented tracks",
              ],
              [
                "Tertiary",
                <Token key="s3">--ds-surface-tertiary</Token>,
                "Anything over content: menus, popovers, tooltips, select lists",
              ],
            ]}
          />
        </DocsBlock>

        <DocsBlock
          label="Nesting"
          hint="A level only means something relative to the one under it. Read down the stack: the page is primary, a card on it is secondary, a menu opened from the card is tertiary. Content that needs to recede inside a card — a footer, a table header — goes back to primary rather than inventing a fourth level."
        >
          <Example>
            <div className="surface-primary rounded-xl p-5">
              <p className="text-label-xs text-secondary">primary — the page</p>
              <div className="surface-secondary mt-3 rounded-xl border border-[var(--border-subtle)] p-4">
                <p className="text-label-xs text-secondary">
                  secondary — a card, and the controls on it
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button variant="secondary">Control</Button>
                  <span className="surface-tertiary elevated rounded-[var(--radius)] border border-[var(--border-subtle)] px-2.5 py-1.5 text-label-xs text-primary">
                    tertiary — a menu over it
                  </span>
                </div>
              </div>
            </div>
          </Example>
        </DocsBlock>

        <DocsBlock
          label="Light compresses at the top"
          hint="You cannot go lighter than white, so in the light theme the three levels sit a hair apart and elevation carries most of the separation. Dark has room and separates by tone as well — which is why a popover reads as detached on dark without leaning on its shadow."
        >
          <DocsTable
            head={["Level", "Light", "Dark"]}
            rows={[
              ["Primary", "#fafafa", "#000000"],
              ["Secondary", "#fdfdfd", "#0a0a0a"],
              ["Tertiary", "#ffffff", "#151515"],
            ]}
          />
        </DocsBlock>

        <DocsBlock
          label="Fills are not surfaces"
          hint="A hover or selected state is not a new level — it is a wash over the level already there. These are alpha on purpose: a solid grey would punch a neutral hole in the brand tint, while an alpha lets it through."
        >
          <DocsTable
            head={["Token", "Use"]}
            rows={[
              [
                <Token key="f1">--ds-gray-alpha-100</Token>,
                "Hover on a row, a menu item, a tertiary button",
              ],
              [
                <Token key="f2">--ds-gray-alpha-200</Token>,
                "Selected or active: the current nav item, the segmented indicator",
              ],
              [
                <Token key="f3">--ds-gray-alpha-400</Token>,
                "Control edges, and the track a segmented control sits in",
              ],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Three levels is the whole system. Anything that seems to need a
              fourth is usually a fill — a hover or selected state — or content
              that should drop back to primary instead.
            </>,
            <>
              Do not stack secondary on secondary. Two cards nested in each
              other read as one confused object.
            </>,
            <>
              Controls take <Token>--ds-surface-secondary</Token> directly
              rather than the <Token>.surface-secondary</Token> utility: the
              sheen falls off over 120px, so on a 32px control it resolves to a
              flat tone anyway and only costs a paint.
            </>,
            <>
              A filled control labels itself with a surface token, never a
              literal white or black — the token flips with the theme and the
              literal does not.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="foundations-elevation"
        title="Elevation"
        description="Elevation is the drop shadow, and only the drop shadow. It answers one question — has this left the document flow? — and it is orthogonal to which surface an element uses."
      >
        <DocsBlock
          label="One utility"
          hint="Compose it with a surface. A menu is `surface-tertiary elevated`; a card is `surface-secondary` and nothing else. There is no second shadow step: an interface either has a thing floating over it or it does not."
        >
          <Snippet
            code={`.elevated { box-shadow: var(--shadow-elevated); }

/* A menu: a tertiary surface that has left the flow */
<div className="surface-tertiary elevated" />

/* A card: a secondary surface, in the flow, no shadow */
<div className="surface-secondary" />`}
          />
        </DocsBlock>

        <DocsBlock label="Specimens">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="surface-secondary rounded-xl border border-[var(--border-subtle)] p-5">
              <p className="text-label-sm font-medium text-primary">In flow</p>
              <p className="mt-1 text-copy-sm text-secondary">
                Separates by tone and a hairline. No shadow.
              </p>
            </div>
            <div className="surface-tertiary elevated rounded-xl border border-[var(--border-subtle)] p-5">
              <p className="text-label-sm font-medium text-primary">Elevated</p>
              <p className="mt-1 text-copy-sm text-secondary">
                Detached. The shadow is what says so.
              </p>
            </div>
          </div>
        </DocsBlock>

        <DoDont
          do={[
            "Give floating layers a shadow — it is what tells the eye they are detached.",
            "Let in-flow cards separate by tone and a hairline alone.",
            "Treat the surface and the shadow as two decisions, taken separately.",
          ]}
          dont={[
            "Put a drop shadow on a card. It dates the interface immediately.",
            "Add an inset top highlight on top of a border. Two adjacent lines read as a doubled edge — this is why the highlight was removed.",
            "Reach for a shadow to separate two things that are both in the flow. That is a surface or a border problem.",
          ]}
        />

        <BestPractice
          items={[
            <>
              Ask one question: does this element leave the document flow? If
              yes it is elevated. If no it is not. Nothing else enters into it.
            </>,
            <>
              The sheen belongs to the surface, not to elevation. It is a light
              treatment on a colour; the shadow is a statement about depth.
            </>,
            <>
              Let the sheen gradient run past the element it sits on. A falloff
              shorter than the card resolves inside it and reads as a band.
            </>,
            <>
              Dark surfaces need roughly a tenth of the sheen strength that
              light ones do — 0.016 against 0.28 here.
            </>,
          ]}
        />
      </DocsEntry>

      <DocsEntry
        id="foundations-borders"
        title="Borders"
        description="One width and three colours. The width is a hairline; the colour is chosen by what the line separates. Getting the colour wrong is what makes an interface feel heavy."
      >
        <DocsBlock
          label="Width"
          hint="Every border in the product is one device pixel, and the alphas below are set for that width — halving the line from 1px to 0.5px halved its presence, so each was raised by roughly half to hold the same read. On a 2dppx display that is 0.5px — the fine rule Linear draws. Below 2dppx the browser has to antialias a half pixel, and at these alphas the line can fade to nothing, so those displays fall back to a true 1px. Nothing sets a border width directly; the utilities read the token."
        >
          <Snippet
            code={`:root { --border-width: 1px; }

@media (min-resolution: 2dppx) {
  :root { --border-width: 0.5px; }
}`}
          />
        </DocsBlock>

        <DocsBlock label="Colours">
          <DocsTable
            head={["Token", "Light", "Dark", "Use"]}
            rows={[
              [
                <Token key="a">--border-subtle</Token>,
                "11% black",
                "10% white",
                "Object edges: cards, overlays, dividers inside a card",
              ],
              [
                <Token key="b">--border-structural</Token>,
                "12% black",
                "13% white",
                "The frame: sidebar edge, header hairline, nav guides",
              ],
              [
                <Token key="c">--ds-gray-alpha-400</Token>,
                "10% black",
                "16% white",
                "Controls: buttons, inputs, segmented tracks",
              ],
            ]}
          />
        </DocsBlock>

        <DocsBlock label="Comparison">
          <Example>
            <div className="flex flex-wrap gap-4">
              {[
                { t: "--border-subtle", l: "subtle" },
                { t: "--border-structural", l: "structural" },
                { t: "--ds-gray-alpha-400", l: "control" },
              ].map((item) => (
                <div key={item.t} className="flex flex-col items-start gap-2">
                  <div
                    className="h-16 w-40 rounded-xl border"
                    style={{ borderColor: `var(${item.t})` }}
                  />
                  <span className="text-label-xs-mono text-secondary">
                    {item.l}
                  </span>
                </div>
              ))}
            </div>
          </Example>
        </DocsBlock>

        <BestPractice
          items={[
            <>
              A line inside a card must never out-weigh the card’s own edge.
              Dividers within a card use <Token>--border-subtle</Token>, the
              same as the card.
            </>,
            <>
              Controls get the firmest edge because they invite a click. Panels
              get the softest because they only need to be found.
            </>,
            <>
              Dark themes need a lower alpha than light for the same perceived
              weight. The control weight <Token>--ds-gray-alpha-400</Token> is
              nearly double in dark, which is why structural chrome needed its
              own token.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="foundations-motion"
        title="Motion"
        description="Motion is feedback, not decoration. One curve, four durations, and everything collapses under reduced-motion."
      >
        <DocsBlock label="Tokens">
          <DocsTable
            head={["Token", "Value", "Use"]}
            rows={[
              [
                <Token key="a">--ds-motion-timing-swift</Token>,
                "cubic-bezier(.175,.885,.32,1.1)",
                "Every entrance and transform",
              ],
              ["Colour transition", "100–150ms", "Hover, active, focus"],
              [
                "Overlay entrance",
                "200ms popover / 300ms overlay",
                "Menus, popovers, dialogs",
              ],
              ["Card entrance", "340ms, 30ms stagger", "Page load sequence"],
            ]}
          />
        </DocsBlock>

        <DocsBlock
          label="Staggered entrance"
          hint="Built in CSS keyframes rather than a JS animation library. animation-fill-mode: both guarantees the resting state even if the animation never runs, and the global reduced-motion rule collapses it to the end state for free."
        >
          <Snippet
            code={`.animate-enter {
  animation: card-enter 340ms var(--ds-motion-timing-swift) both;
  animation-delay: calc(var(--i, 0) * 30ms);
}

<Card className="animate-enter" style={{ "--i": index }} />`}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              List the properties you transition. <Token>transition: all</Token>{" "}
              animates layout properties by accident and costs frames.
            </>,
            <>
              Animate <Token>transform</Token> and <Token>opacity</Token> only —
              they are the two the compositor can handle without a repaint.
            </>,
            <>
              Prefer CSS for decorative motion. It survives being interrupted,
              needs no runtime, and honours{" "}
              <Token>prefers-reduced-motion</Token> without extra code.
            </>,
            <>
              Keep feedback under 200ms. Anything an entrance, not a response,
              can take 300–400ms.
            </>,
          ]}
        />
      </DocsEntry>

      {/* ---------------------------------------------------------------- */}
      <DocsEntry
        id="foundations-icons"
        title="Icons"
        description="Phosphor, at regular weight — 1.5px on its 256-unit grid, which keeps icons optically level with the type."
      >
        <DocsBlock
          label="Weights"
          hint="Phosphor scales stroke by weight rather than by a stroke-width number. Regular is the product default; heavier weights read bolder than the type they sit beside."
        >
          <DocsTable
            head={["Weight", "Stroke at 24px", "Use"]}
            rows={[
              [<Token key="a">thin</Token>, "0.75px", "Not used"],
              [<Token key="b">light</Token>, "1.13px", "Not used"],
              [
                <Token key="c">regular</Token>,
                "1.5px",
                "Everything — set globally via IconContext",
              ],
              [
                <Token key="d">bold</Token>,
                "2.25px",
                "Reserved for a filled or emphasised state",
              ],
              [
                <Token key="e">fill</Token>,
                "solid",
                "Reserved for selected states",
              ],
            ]}
          />
        </DocsBlock>

        <DocsBlock label="Sizes">
          <DocsTable
            head={["Size", "Class", "Use"]}
            rows={[
              ["12px", <Token key="a">size-3</Token>, "Inside a small badge"],
              [
                "14px",
                <Token key="b">size-3.5</Token>,
                "Icon buttons, inline affordances, carets",
              ],
              [
                "16px",
                <Token key="c">size-4</Token>,
                "Nav items, menu items, input adornments",
              ],
              ["20px", <Token key="d">size-5</Token>, "Page title"],
            ]}
          />
        </DocsBlock>

        <BestPractice
          items={[
            <>
              Decorative icons take <Token>aria-hidden=&quot;true&quot;</Token>.
              An icon next to a label is decorative.
            </>,
            <>
              An icon-only control needs an <Token>aria-label</Token> and,
              ideally, a tooltip carrying the same words.
            </>,
            <>
              Icons inherit <Token>currentColor</Token>. Colour the parent,
              never the icon.
            </>,
            <>
              Set the weight once through <Token>IconContext</Token> at the app
              root rather than per icon. Anything heavier than{" "}
              <Token>regular</Token> reads bolder than the type beside it.
            </>,
            <>
              Import from <Token>@/components/icons</Token>, never from the icon
              package directly — that single re-export is what makes the set
              swappable.
            </>,
          ]}
        />
      </DocsEntry>
    </DocsSection>
  );
}
