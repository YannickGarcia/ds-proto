"use client";

import { ArrowCounterClockwise, Check, Copy } from "@/components/icons";
import { useState } from "react";
import { Button } from "@/components/geist/button";
import {
  BRAND_TINT_DEFAULTS,
  BRAND_TINT_LIMITS,
  type BrandTint,
  resetBrandTint,
  setBrandTint,
} from "@/lib/brand-tint";
import { useBrandTint } from "@/lib/use-brand-tint";

const DIALS: {
  key: keyof BrandTint;
  variable: string;
  label: string;
  hint: string;
}[] = [
  {
    key: "light",
    variable: "--tint-light",
    label: "Amount, light theme",
    hint: "Light surfaces broadcast tint far more readily than dark ones.",
  },
  {
    key: "dark",
    variable: "--tint-dark",
    label: "Amount, dark theme",
    hint: "Raising this also lifts lightness — the tint colour is light grey-green.",
  },
  {
    key: "saturation",
    variable: "--tint-saturation",
    label: "Saturation",
    hint: "Chroma of the tint, relative to the brand. Shared by both themes.",
  },
];

/**
 * Live controls for the three dials, wired straight to the custom properties
 * on `<html>`. Every surface in the app is derived from them, so the whole
 * page re-tints as the slider moves — this panel is the fastest way to judge
 * a value, because you are judging it on real UI rather than a swatch.
 *
 * A tuned value is stored per browser. It is a preview, not a commit: paste
 * the block below into `globals.css` to make it the product default.
 */
export function BrandTintControls() {
  const tint = useBrandTint();
  const isDefault = DIALS.every(
    ({ key }) => tint[key] === BRAND_TINT_DEFAULTS[key],
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--ds-surface-secondary)] p-4">
      {DIALS.map((dial) => {
        const limits = BRAND_TINT_LIMITS[dial.key];
        return (
          <div key={dial.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-4">
              <label
                htmlFor={`tint-${dial.key}`}
                className="text-label-13 font-medium text-[var(--ds-gray-1000)]"
              >
                {dial.label}
              </label>
              <span className="geist-tabular-nums text-mono-12 text-[var(--ds-gray-900)]">
                {dial.variable}: {tint[dial.key]}%
              </span>
            </div>
            <input
              id={`tint-${dial.key}`}
              type="range"
              min={limits.min}
              max={limits.max}
              step={limits.step}
              value={tint[dial.key]}
              onChange={(event) =>
                setBrandTint({
                  ...tint,
                  [dial.key]: Number(event.target.value),
                })
              }
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--ds-gray-alpha-400)] accent-[var(--ds-gray-1000)] outline-none [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--ds-gray-1000)] [&::-webkit-slider-thumb]:shadow-[var(--ds-shadow-small)]"
            />
            <p className="text-copy-12 text-[var(--ds-gray-900)]">
              {dial.hint}
            </p>
          </div>
        );
      })}

      <div className="flex items-center gap-2 border-t border-[var(--border-subtle)] pt-3">
        <CopyCssButton tint={tint} />
        <Button
          variant="tertiary"
          disabled={isDefault}
          onClick={resetBrandTint}
          prefix={<ArrowCounterClockwise aria-hidden="true" />}
        >
          Reset
        </Button>
        <span className="ml-auto text-copy-12 text-[var(--ds-gray-900)]">
          {isDefault
            ? "Matching globals.css"
            : "Preview only — stored in this browser"}
        </span>
      </div>
    </div>
  );
}

function cssBlock(tint: BrandTint) {
  return `:root {
  --tint-light: ${tint.light}%;
  --tint-dark: ${tint.dark}%;
  --tint-saturation: ${tint.saturation}%;
}`;
}

function CopyCssButton({ tint }: { tint: BrandTint }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="secondary"
      prefix={
        copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />
      }
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(cssBlock(tint));
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // Clipboard blocked — the same CSS is printed below the panel.
        }
      }}
    >
      {copied ? "Copied" : "Copy CSS"}
    </Button>
  );
}

/** The live values as a paste-ready block, so the snippet can never go stale. */
export function BrandTintSnippet() {
  const tint = useBrandTint();
  return (
    <pre className="geist-no-scrollbar overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--ds-surface-primary)] p-4">
      <code className="text-mono-13 text-[var(--ds-gray-1000)]">
        {`:root {
  --brand: #16db65;         /* full strength — brand marks only */
  --tint-light: ${`${tint.light}%;`.padEnd(12)}/* amount, light theme */
  --tint-dark: ${`${tint.dark}%;`.padEnd(13)}/* amount, dark theme  */
  --tint-saturation: ${`${tint.saturation}%;`.padEnd(7)}/* chroma, relative to --brand */
}`}
      </code>
    </pre>
  );
}
