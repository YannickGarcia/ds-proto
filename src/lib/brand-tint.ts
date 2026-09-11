/**
 * The three brand-tint dials, live.
 *
 * `globals.css` declares them on `:root`; this store overrides them as inline
 * custom properties on `<html>`, which wins over any selector. Nothing else in
 * the system needs to know — every surface token is derived from these three,
 * so moving a dial re-tints the whole app.
 *
 * Values are percentages, stored as plain numbers.
 *
 * This module stays free of React so the root layout — a server component —
 * can import `BRAND_TINT_SCRIPT`. The hook lives in `use-brand-tint.ts`.
 */
export interface BrandTint {
  /** Amount of tint mixed into light-theme surfaces. */
  light: number;
  /** Amount of tint mixed into dark-theme surfaces. */
  dark: number;
  /** Chroma of the tint colour, relative to `--brand`. Shared by both themes. */
  saturation: number;
}

/** Must match the values committed in `globals.css`. */
export const BRAND_TINT_DEFAULTS: BrandTint = {
  light: 2.5,
  dark: 10,
  saturation: 25,
};

export const BRAND_TINT_KEY = "ds-proto.brand-tint";

export const BRAND_TINT_LIMITS = {
  light: { min: 0, max: 10, step: 0.5 },
  dark: { min: 0, max: 20, step: 0.5 },
  saturation: { min: 0, max: 100, step: 5 },
} as const satisfies Record<
  keyof BrandTint,
  { min: number; max: number; step: number }
>;

const VARS = {
  light: "--tint-light",
  dark: "--tint-dark",
  saturation: "--tint-saturation",
} as const satisfies Record<keyof BrandTint, string>;

const KEYS = Object.keys(VARS) as (keyof BrandTint)[];

function clamp(key: keyof BrandTint, value: unknown): number {
  const { min, max } = BRAND_TINT_LIMITS[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return BRAND_TINT_DEFAULTS[key];
  }
  return Math.min(max, Math.max(min, value));
}

/**
 * Runs before first paint, from the document head, so a stored tint is already
 * on `<html>` when the first frame is composed. Inlined as a string because it
 * has to beat React to the DOM. Kept in sync with `applyBrandTint` below.
 */
export const BRAND_TINT_SCRIPT = `
try {
  var v = JSON.parse(localStorage.getItem(${JSON.stringify(BRAND_TINT_KEY)}));
  if (v) {
    var s = document.documentElement.style;
    ${KEYS.map(
      (key) =>
        `if (typeof v.${key} === "number") s.setProperty("${VARS[key]}", v.${key} + "%");`,
    ).join("\n    ")}
  }
} catch (e) {}
`.trim();

export function applyBrandTint(tint: BrandTint) {
  const style = document.documentElement.style;
  for (const key of KEYS) {
    style.setProperty(VARS[key], `${tint[key]}%`);
  }
}

/* -------------------------------------------------------------------------- */
/* Store                                                                       */
/* -------------------------------------------------------------------------- */

let current: BrandTint | null = null;
const listeners = new Set<() => void>();

function load(): BrandTint {
  try {
    const raw = localStorage.getItem(BRAND_TINT_KEY);
    if (!raw) return BRAND_TINT_DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<BrandTint>;
    return {
      light: clamp("light", parsed.light),
      dark: clamp("dark", parsed.dark),
      saturation: clamp("saturation", parsed.saturation),
    };
  } catch {
    return BRAND_TINT_DEFAULTS;
  }
}

export function getBrandTintSnapshot(): BrandTint {
  // Cached so the reference stays stable between reads, as the store contract
  // requires — a fresh object every call would loop the render.
  current ??= load();
  return current;
}

export function getBrandTintServerSnapshot(): BrandTint {
  return BRAND_TINT_DEFAULTS;
}

export function subscribeBrandTint(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setBrandTint(next: BrandTint) {
  current = {
    light: clamp("light", next.light),
    dark: clamp("dark", next.dark),
    saturation: clamp("saturation", next.saturation),
  };
  applyBrandTint(current);
  try {
    localStorage.setItem(BRAND_TINT_KEY, JSON.stringify(current));
  } catch {
    // Private browsing, or storage full. The dial still applies for this session.
  }
  for (const listener of listeners) listener();
}

export function resetBrandTint() {
  setBrandTint(BRAND_TINT_DEFAULTS);
}
