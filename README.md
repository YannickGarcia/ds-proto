# ds-proto

A design system worked out in real screens rather than on a swatch sheet.

The app is a prototype of an engineering-analytics product, and exists mostly
as a place for the system to be wrong in. Three areas:

- **Analytics** — the screen the system was designed against: a KPI row,
  scoped charts, period controls.
- **Integrations** — five pages covering a provider catalogue, a repository
  tree, pull requests, a sync log and sync settings.
- **`/design-system`** — the reference: foundations, components and patterns,
  each with rules, usage and best practice. Live, not screenshots — the
  specimens are the real components, so the page cannot drift from the app.

## Running it

```bash
npm install
npm run dev
```

## The system

**Colour.** Ten scales of ten steps, built on an even OKLCH lightness ramp in
both themes, so a step means the same thing in any hue and a green badge
carries the same weight as a red one. Most published palettes are hand-tuned
per colour and drift: they contain inversions, where a step is lighter than
the one before it, and outright duplicate values. Those read as mistakes on a
ramp, so the ramp won.

**Brand tint.** Every surface is a neutral with a trace of the brand colour
mixed in. Three dials — amount per theme, plus a shared saturation — drive
every surface token through a single derivation, so nothing below that block
is hand-picked. The design system page carries live controls for the three, so
a value can be judged on real UI and then pasted back into `globals.css`.

**Surfaces and elevation are separate.** Three surface levels
(primary/secondary/tertiary) describe colour and nothing else. Elevation is
the drop shadow, and answers one question: has this left the document flow? A
card is `surface-secondary`; a menu is `surface-tertiary elevated`.

**One form scale.** Input, Select, Menu and the segmented control come in a
single 32px height and have no size prop at all — a second height on a text
field only creates the chance of a crooked row. Button defaults to the same
32px and additionally offers a 28px `small` for dense chrome.

**Hairline borders.** `0.5px` at 2dppx, where it lands on exactly one device
pixel; `1px` below, where a half pixel has to be antialiased and can fade out
at these alphas.

## Adapting this system

If you are porting these decisions into another codebase — by hand or with an
agent — read them in this order:

1. **`CLAUDE.md`** — the conventions in their shortest form, written to be
   loaded as context. Every rule that is easy to break by accident is here:
   the form scale, the surface levels, the border width, the tint dials, and
   the requirement that a component change ships with its docs update.
2. **`docs/tokens.md`** — every token with its resolved value in both
   themes, generated from the stylesheet by `npm run tokens` and verified
   against the browser, so it cannot drift.
3. **`src/app/globals.css`** — the tokens themselves, ordered so the dials
   come first and everything else derives from them.
4. **`/design-system`** — the reasoning. Each entry carries not just what a
   value is but why, and a Best practice section naming the failure mode it
   prevents. Most of those were written after hitting the failure.
5. **The component library**, under `src/components/`. Read `button.tsx`
   first: its size table is exported and consumed by both the component and
   the docs page, which is the pattern that keeps the two from disagreeing.

The tokens are portable on their own — `globals.css` depends on nothing else
in the tree. The component layer assumes Tailwind v4 and Radix.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 ·
Radix primitives · [Bklit](https://bklit.com) charts (visx) · Phosphor icons

## Layout

```
src/app/              routes
src/app/globals.css   the token foundation — the dials and everything derived
src/components/       the component library, the docs page, and the screens
src/components/charts/  vendored chart source, patched
src/lib/              data and hooks
docs/tokens.md        generated token reference
```

`CLAUDE.md` holds the conventions that are easy to break by accident, and the
rule that a component change ships with its design-system update.
