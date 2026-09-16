"use client";

import type { ReactNode } from "react";
import { Info } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Tooltip } from "./tooltip";

/**
 * Info tip — a label followed by a small icon that explains it.
 *
 * Distinct from a chart card's info *action*, which is a 32px tertiary button
 * among other header controls. Here the icon lives inside a line of text, so
 * it takes no background and stays the size of the glyph; an invisible box
 * extends the hit area to 28px without moving the layout.
 *
 * It renders the label text itself. The last word and the icon are held in
 * one non-breaking group, so a label that wraps breaks at the previous word
 * and never strands the icon on a line of its own. (A word joiner does not do
 * this: the line may always break before an inline box like the button.)
 * Style the text by wrapping the component — it inherits size, case and
 * colour from its parent.
 */
export function InfoTip({
  label,
  children,
  side = "top",
  align = "start",
  className,
}: {
  /** The label being explained. Rendered, and used for "About {label}". */
  label: string;
  /** The explanation: one or two plain sentences. */
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  className?: string;
}) {
  const words = label.trim().split(/\s+/);
  const tail = words.pop();
  const head = words.join(" ");

  return (
    <>
      {head ? `${head} ` : null}
      <span className="whitespace-nowrap">
        {tail}
        <Tooltip content={children} side={side} align={align}>
          <button
            type="button"
            aria-label={`About ${label}`}
            className={cn(
              "relative ml-1 inline-flex size-3.5 shrink-0 items-center justify-center rounded-sm align-[-2px]",
              "text-tertiary outline-none transition-colors duration-150 hover:text-primary",
              "focus-visible:shadow-[var(--ds-focus-ring)]",
              "after:absolute after:-inset-[7px] after:content-['']",
              className,
            )}
          >
            <Info aria-hidden="true" className="size-3.5" />
          </button>
        </Tooltip>
      </span>
    </>
  );
}
