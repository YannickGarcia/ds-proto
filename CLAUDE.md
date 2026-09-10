@AGENTS.md

# Pensero prototype

## The design system page is part of every component change

`/design-system` is the spec, not a demo gallery — it is what the product is
tuned from. So a change to anything in `src/components/geist/` is not finished
until `src/components/design-system/` reflects it, **in the same change**.

What to bring in line in the affected `DocsEntry`:

- **Specimens** — the rendered examples, including any size or variant that was
  added, renamed or removed.
- **Tables** of sizes, variants and tokens, with their real values.
- **Description and Best practice** — these carry the rules, so a changed rule
  changes the prose, not only the demo.
- **Foundations** when the change spans components: a shared scale, a token
  rename, a new surface. Documenting it once per component loses the fact that
  it is shared.

Prefer deriving docs content from the live source over restating it. The brand
tint block renders from the store (`BrandTintSnippet`), so it cannot disagree
with the app — that whole class of staleness is designed out rather than
repeatedly fixed.

## Conventions worth knowing

- **Form scale.** 32px is the form height. Input, Select, Menu and
  SegmentedControl come in it and nothing else — they have no size prop.
  Button defaults to it (`default`, label 14px/500) and additionally offers
  `small` (28px, label 14px/400) for genuinely dense chrome. So an unadorned
  control is already level with its row.
- **Name the standard option `default`.** Every scale designates one — a
  component size, a variant, a type step — so a reader can use it without
  consulting a table. The typography roles each name their default step, and
  unstyled text is already the copy default (14px/20/400) via the body.
- **Icons** come from `src/components/icons.tsx` only. It is the single
  Phosphor re-export, which is what makes the library swappable.
- **Borders** are one device pixel: `--border-width` is 0.5px at 2dppx and
  1px below it, and the `border*` utilities are overridden to read the token.
  Never set a border width at a call site.
- **Colour scales** climb in even OKLCH lightness, in both themes, so a step
  means the same thing in any hue. This deliberately diverges from Geist,
  whose scales are hand-tuned per colour and contain inversions and duplicate
  values. Keep the ramp even when adding or adjusting a step.
- **Filled controls** label themselves with `--ds-surface-secondary`, never a
  literal white or black: step 800 is dark in light and light in dark, and the
  surface token flips with it.
- **Brand tint** is three dials at the top of `globals.css`
  (`--tint-light`, `--tint-dark`, `--tint-saturation`). Every surface token is
  derived from them; never paste a tinted hex into a component.
- **Surfaces are colour; elevation is shadow.** Two separate decisions.
  Three surface levels and no more: `--ds-surface-primary` (page, sidebar,
  table headers, card footers), `--ds-surface-secondary` (cards, panels and
  every control), `--ds-surface-tertiary` (menus, popovers, tooltips).
  Controls take the secondary token directly rather than the
  `.surface-secondary` utility — the sheen cannot read on a 32px element.
  Hover and selected states are alpha fills over the level already there,
  never a fourth level.
- **`.elevated`** is the only shadow, and means "this left the document
  flow". Compose it: a menu is `surface-tertiary elevated`, a card is
  `surface-secondary` alone. Never shadow a card.
