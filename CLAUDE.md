@AGENTS.md

# ds-proto

A design system worked out in real screens. This file is the short form of it,
written to be loaded as context.

**If you are adapting this system into another codebase**, read in this order:
this file, then `docs/tokens.md` for the resolved values, then `/design-system`
in the running app for the reasoning behind each decision, then
`src/components/ui/` for the implementations. The tokens in
`src/app/globals.css` are portable on their own — that file depends on nothing
else in the tree. The component layer assumes Tailwind v4 and Radix.

---

## How to work here

**A component change is not finished until the design system reflects it, in
the same change.** `/design-system` is the spec, not a demo gallery — it is
what the product is tuned from, so a stale page is worse than no page. When
you touch anything in `src/components/ui/`, bring the matching `DocsEntry` in
`src/components/design-system/` in line: the specimens, the size and variant
tables with their real values, and the description and Best practice prose,
which is where the rules actually live. If the change spans components — a
shared scale, a token rename, a new surface — it belongs in Foundations, not
repeated per component.

**Prefer deriving documentation from the source over restating it.** The brand
tint block renders from the live store, and the Button size table is exported
from `button.tsx` and read by both the component and the docs page. Those
cannot disagree with the app. Restating a value by hand is how a page rots.

**Regenerate `docs/tokens.md` after touching `globals.css`**: `npm run tokens`.
It follows `var()` chains and computes the `color-mix` derivations, and its
output is verified to match the browser exactly.

---

## The system

### Colour

Ten scales of ten steps, each climbing in **even OKLCH lightness** in both
themes, so a step means the same thing in any hue and a green badge carries
the same weight as a red one. This deliberately departs from Geist, whose
scales are hand-tuned per colour and contain inversions and duplicate values.
Keep the ramp even when adjusting a step.

- **Step semantics**: 100–300 backgrounds, 400–600 borders, 700–800 solid
  fills, 900–1000 text.
- **Coloured text uses `--ds-<hue>-text`, never `--ds-<hue>-900`.** Step 900
  is both text and a button hover fill, and the ramp pins it below 800 — in
  light that lands near L42, where amber reads as mud and red as maroon,
  because warm hues lose their identity as they darken. The text step sits
  outside the ramp at ~L54 and clears 4.6:1 on white and on the hue's 100 and
  200 tints.
- **Text colour is a rank, not a grey**: `text-primary`, `-secondary`,
  `-tertiary`, `-disabled`. The same ladder serves icons.

### Brand

`--brand` is `#16DB65`. It appears in exactly three places: the mark, the
surface tint, and the primary button.

- **Brand tint.** Every surface is a neutral with a trace of brand mixed in,
  driven by three dials at the top of `globals.css` — `--tint-light`,
  `--tint-dark`, `--tint-saturation`. Every surface and gray token derives
  from them through one block. Never paste a tinted hex into a component.
- **The primary button is the brand's only fill.** `--ds-action-primary` is
  cut from the brand hue (149.4) at the lightness its label needs — L52 in
  light, L72 in dark — with the label as `--ds-surface-secondary` so it
  inverts. It takes `--ds-focus-ring-neutral`, because a brand ring around a
  brand button reads as one blur.

### Surfaces and elevation

Two separate decisions. A surface is a colour; elevation is a shadow.

- **Three surface levels, no more**: `--ds-surface-primary` (the page,
  sidebar, table headers, card footers), `--ds-surface-secondary` (cards,
  panels and every control), `--ds-surface-tertiary` (menus, popovers,
  tooltips).
- Controls take the secondary **token** directly, not the
  `.surface-secondary` utility — the sheen falls off over 120px and cannot
  read on a 32px control.
- **`.elevated` is the only shadow** and means "this left the document flow".
  Compose it: a menu is `surface-tertiary elevated`, a card is
  `surface-secondary` alone. Never shadow a card.
- Hover and selected states are alpha fills over the level already there,
  never a fourth level.

### Typography

Four categories, then a size. Pick the category by what the text is doing.

| category | classes |
| --- | --- |
| Headings | `text-h1`–`h5` — 32 / 24 / 20 / 16 / 14, weight 600 |
| Copy — several lines, looser leading | `text-copy-default` 14/20, `-sm` 13/18, `-xs` 12/16, `-sm-mono` |
| Label — one line, tight, sits level with an icon | `text-label-default` 14/20, `-sm` 13/16, `-xs` 12/16, `-xs-mono`, `-overline` |
| Buttons — only inside a button component | `text-button-default` 14/20/500, `-xs` 12/16/500 |

- `text-copy-default` is what a paragraph already is; the body is set to it.
- `text-label-overline` is the small caps heading a region (11/16/500/+0.04em,
  uppercase baked in). Tertiary when it heads a region the reader scans past,
  secondary when it names something to be read.
- The scale holds only sizes the product uses. Add one when a screen needs it,
  not in advance.

### The form scale

**32px is the form height.** Input, Select, Menu and SegmentedControl come in
it and nothing else — they have no size prop, because a second height on a
text field only creates the chance of a crooked row. Button defaults to the
same 32px and additionally offers `small` (28px, label weight 400) for dense
chrome. An unadorned control is already level with its row.

### Interactive states

The treatment follows the element's **resting appearance**, not its type.
That is why a tertiary button and a nav item behave identically.

| family | at rest | hover |
| --- | --- | --- |
| Transparent | no background | `--ds-gray-alpha-100` |
| Bordered | `--ds-gray-alpha-400` edge | edge to `-500`, plus the alpha-100 wash |
| Filled | a solid fill | one step down the same hue |

- **Selected is `--ds-gray-alpha-200`** — an adjacent step, so a selected row
  still responds to hover.
- **Focus**: `--ds-focus-ring` everywhere except text fields, which use
  `--ds-focus-border`, because a ring around a field reads as a second
  border. Always `:focus-visible`, never `:focus`.
- **Disabled** keeps the shape and drops the contrast, so layout never shifts.
- There is no pressed state.

### Borders, radius, icons

- **Borders are one device pixel.** `--border-width` is 0.5px at 2dppx and
  1px below, and the `border*` utilities are overridden to read the token.
  Never set a border width at a call site. Colour by role:
  `--border-subtle` (object edges), `--border-structural` (the frame),
  `--ds-gray-alpha-400` (control edges).
- **Radius** is `--radius` (6px) for controls, `rounded-xl` (12px) for cards.
- **Icons** come from `src/components/icons.tsx` only — a single Phosphor
  re-export, which is what keeps the library swappable.

### Naming

Name the standard option `default`. Every scale designates one — a component
size, a type step — so it can be used without consulting a table, and nobody
has to infer which of `small | medium | large` was meant.

---

## Traps

Each of these cost real debugging. They are mechanical and silent, and will
recur in any Tailwind v4 + shadcn codebase.

1. **A custom class in `@layer utilities` gets no variants.** Written as plain
   CSS, `text-secondary` works bare but `hover:text-secondary` falls through
   to shadcn's same-named theme colour — near-black, invisible on dark. The
   text ranks are declared as `@theme` colours for this reason, and the
   shadcn bridge deliberately does not map `--color-primary` or
   `--color-secondary`.
2. **Testing a class name for collisions before using it proves nothing.**
   Tailwind generates utilities on demand, so an unused name looks free even
   when the theme would claim it.
3. **The type scale must stay in `@layer components`.** Each class carries a
   font-weight; in `utilities` it silently beat a `font-medium` written
   beside it — dead at 21 call sites before anyone noticed.
4. **tailwind-merge does not know custom classes.** Unregistered, it keeps
   *both* of a conflicting pair and lets source order decide. The scale and
   the ranks are registered in `src/lib/utils.ts`; register anything new.
5. **A self-referential custom property is silently void.** Renaming a token
   to a name its own alias already used (`--radius: var(--radius)`) does not
   error — the value simply disappears.
6. **A `key` on the first child of a mapped fragment does nothing.** The
   fragment is the mapped element, so it needs `<Fragment key>`.
7. **Filled controls must label themselves with a surface token**, never a
   literal white or black: step 800 is dark in light and light in dark.

---

## Layout

```
src/app/globals.css            the token foundation — dials first, rest derived
src/app/                       routes
src/components/ui/             the component library
src/components/design-system/  the /design-system page
src/components/app/            the analytics screen
src/components/integrations/   the integrations screens
src/components/charts/         vendored chart source, patched
src/lib/utils.ts               cn() and the tailwind-merge registrations
docs/tokens.md                 generated token reference — npm run tokens
scripts/generate-tokens.mjs
```
