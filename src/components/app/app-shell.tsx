"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/app/sidebar";

const GUTTER = "mx-auto w-full px-[max(1.5rem,env(safe-area-inset-left))] lg:px-8";

/**
 * Measures. Line length is a function of what is being read, not of the
 * window: tables want every pixel, a settings form wants a column you can
 * scan without moving your head.
 */
export const MEASURE = {
  /** Tables, charts, anything genuinely dense. */
  full: `${GUTTER} max-w-[1440px]`,
  /** Lists, cards, reading-oriented pages. */
  content: `${GUTTER} max-w-[1040px]`,
  /** Settings and single-column forms. */
  narrow: `${GUTTER} max-w-[760px]`,
} as const;

export type Measure = keyof typeof MEASURE;

/** Page gutter shared by the header and the content beneath it. */
export const SHELL = MEASURE.full;

/**
 * App frame: permanent sidebar, skip link and tooltip context. Each page
 * supplies its own header and content so the chrome stays identical between
 * the dashboard and the design system.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-50 focus-visible:rounded-[var(--radius)] focus-visible:border focus-visible:border-[var(--ds-gray-alpha-400)] focus-visible:bg-[var(--ds-surface-secondary)] focus-visible:px-3 focus-visible:py-2 focus-visible:text-button-default"
      >
        Skip to content
      </a>

      <div className="flex min-h-dvh">
        <Sidebar />
        {children}
      </div>
    </TooltipPrimitive.Provider>
  );
}

/** Sticky page header. Blurs the page tint rather than painting over it. */
/**
 * The header always spans the full measure, whatever the body below it uses.
 * Chrome that changed width between pages would make the title and actions
 * jump on every navigation.
 */
export function PageHeader({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 bg-[color-mix(in_srgb,var(--ds-surface-primary)_85%,transparent)] backdrop-blur-md">
      <div className={MEASURE.full}>{children}</div>
    </header>
  );
}
