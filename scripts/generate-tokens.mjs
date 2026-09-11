/**
 * Emits docs/tokens.md from globals.css.
 *
 * The token table is the one piece of documentation an outside reader needs
 * most and is the easiest to let rot, so it is generated rather than written.
 * Values are resolved the way the browser resolves them: var() aliases are
 * followed within the theme, and the `color-mix(in srgb, …)` used by the
 * brand-tint derivation is computed, so the numbers here are the numbers that
 * ship.
 *
 *   node scripts/generate-tokens.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

// Strip comments first: prose inside them contains colons and token names,
// which the declaration pattern would otherwise read as declarations.
const css = readFileSync("src/app/globals.css", "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

/* ---------------------------------------------------------------- parsing */

/** Declarations inside the block starting at `selector`, in source order. */
function block(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`missing block: ${selector}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  let i = open;
  for (; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) break;
  }
  const body = css.slice(open + 1, i);
  const out = new Map();
  for (const m of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    out.set(m[1], m[2].trim().replace(/\s+/g, " "));
  }
  return out;
}

const shared = block(":root {");
const lightRaw = block(":root,\n.light-theme");
const darkRaw = block(".dark,\n.dark-theme");
const derived = block(":root,\n.dark,\n.dark-theme");

/* -------------------------------------------------------------- resolving */

const hex = (s) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s.trim());

function toRgb(h) {
  let v = h.trim().slice(1);
  if (v.length === 3) v = [...v].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
}
const toHex = (rgb) =>
  "#" + rgb.map((c) => Math.round(Math.max(0, Math.min(255, c))).toString(16).padStart(2, "0")).join("");

/* sRGB <-> OKLab, so the tint's oklch mix can be resolved to a number. */
const lin = (c) => (c /= 255, c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const unlin = (c) =>
  Math.round(255 * (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055));

function hexToOklch(h) {
  const [r, g, b] = toRgb(h).map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [L, Math.hypot(A, B), (Math.atan2(B, A) * 180) / Math.PI];
}

function oklchToHex(L, C, H) {
  const A = C * Math.cos((H * Math.PI) / 180);
  const B = C * Math.sin((H * Math.PI) / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return toHex([
    unlin(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    unlin(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    unlin(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]);
}

/** color-mix(in oklch, <a> <p>%, <b>) — how the tint colour is desaturated. */
function mixOklch(expr, lookup) {
  const m = expr.match(/^color-mix\(\s*in oklch,\s*(.+?)\s+([\d.]+)%,\s*(.+)\)$/);
  if (!m) return null;
  const a = resolve(m[1], lookup);
  const b = resolve(m[3], lookup);
  if (!hex(a) || !hex(b)) return null;
  const p = parseFloat(m[2]) / 100;
  const [al, ac, ah] = hexToOklch(a);
  const [bl, bc, bh] = hexToOklch(b);
  // An achromatic colour has no meaningful hue — CSS calls it powerless and
  // keeps the other side's. Averaging the two instead swings the result off
  // the brand hue, which is the whole point of mixing toward a neutral twin.
  const hue =
    ac < 0.002 ? bh : bc < 0.002 ? ah : ah * p + bh * (1 - p);
  return oklchToHex(al * p + bl * (1 - p), ac * p + bc * (1 - p), hue);
}

/** color-mix(in srgb, <a> <p>%, <b>) — the only mix form the tint uses. */
function mixSrgb(expr, lookup) {
  const m = expr.match(/^color-mix\(\s*in srgb,\s*(.+?)\s+([\d.]+)%,\s*(.+)\)$/);
  if (!m) return null;
  const a = resolve(m[1], lookup);
  const b = resolve(m[3], lookup);
  if (!hex(a) || !hex(b)) return null;
  const p = parseFloat(m[2]) / 100;
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  return toHex([ar * p + br * (1 - p), ag * p + bg * (1 - p), ab * p + bb * (1 - p)]);
}

function resolve(expr, lookup, seen = new Set()) {
  let value = expr.trim();
  for (let pass = 0; pass < 12; pass++) {
    const v = value.match(/^var\((--[\w-]+)\)$/);
    if (v) {
      if (seen.has(v[1])) return value;
      seen.add(v[1]);
      const next = lookup(v[1]);
      if (next === undefined) return value;
      value = next.trim();
      continue;
    }
    if (value.startsWith("color-mix(")) {
      // inner var()s first
      const inlined = value.replace(/var\((--[\w-]+)\)/g, (whole, name) => {
        const r = lookup(name);
        return r === undefined ? whole : resolve(r, lookup, new Set(seen));
      });
      const mixed = mixSrgb(inlined, lookup) ?? mixOklch(inlined, lookup);
      return mixed ?? inlined;
    }
    return value;
  }
  return value;
}

function themeLookup(themeRaw, tintPercent) {
  const scope = new Map([...shared, ...themeRaw, ...derived]);
  scope.set("--brand-tint", tintPercent);
  return (name) => scope.get(name);
}

const light = themeLookup(lightRaw, shared.get("--tint-light"));
const dark = themeLookup(darkRaw, shared.get("--tint-dark"));

/* ---------------------------------------------------------------- grouping */

const GROUPS = [
  ["Brand", (n) => n.startsWith("--brand") || n.startsWith("--tint")],
  ["Surfaces", (n) => n.startsWith("--ds-surface")],
  ["Text", (n) => n.startsWith("--ds-text")],
  ["Action", (n) => n.startsWith("--ds-action")],
  ["Status text", (n) => /^--ds-[a-z]+-text$/.test(n)],
  ["Grays", (n) => /^--ds-gray-\d+$/.test(n)],
  ["Gray alpha", (n) => n.startsWith("--ds-gray-alpha")],
  ["Hues", (n) => /^--ds-(blue|green|amber|red|purple|teal|pink)-\d+$/.test(n)],
  ["Borders", (n) => n.startsWith("--border")],
  ["Focus", (n) => n.startsWith("--ds-focus")],
  ["Elevation", (n) => n.startsWith("--surface-sheen") || n.startsWith("--shadow-elevated")],
  ["Radius & space", (n) => n === "--radius" || n === "--space"],
  ["Motion", (n) => n.startsWith("--ds-motion")],
];

const names = [...new Set([...shared.keys(), ...lightRaw.keys(), ...darkRaw.keys(), ...derived.keys()])];

let out = `# Token reference

Generated by \`node scripts/generate-tokens.mjs\` — do not edit by hand.
Values are resolved: \`var()\` aliases are followed and the brand-tint
\`color-mix\` is computed, so these are the values that reach the browser.

Every surface and gray below is derived from three dials at the top of
\`src/app/globals.css\` — \`--tint-light\`, \`--tint-dark\`, \`--tint-saturation\`.
Change a dial and this whole table moves with it.

`;

for (const [title, match] of GROUPS) {
  const rows = names.filter(match).sort();
  if (!rows.length) continue;
  out += `## ${title}\n\n| Token | Light | Dark |\n| --- | --- | --- |\n`;
  for (const n of rows) {
    const l = resolve(`var(${n})`, light);
    const d = resolve(`var(${n})`, dark);
    const cell = (v) => (v.length > 60 ? v.slice(0, 57) + "…" : v);
    out += `| \`${n}\` | ${cell(l)} | ${l === d ? "same" : cell(d)} |\n`;
  }
  out += "\n";
}

const ungrouped = names.filter((n) => !GROUPS.some(([, m]) => m(n)));
if (ungrouped.length) {
  out += `## Other\n\n${ungrouped.sort().map((n) => `\`${n}\``).join(", ")}\n`;
}

mkdirSync("docs", { recursive: true });
writeFileSync("docs/tokens.md", out);
console.log(`docs/tokens.md — ${names.length} tokens across ${GROUPS.length} groups`);
