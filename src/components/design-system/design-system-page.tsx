"use client";

import {
  Shapes,
} from "@/components/icons";
import { AppShell, PageHeader, SHELL } from "@/components/app/app-shell";
import { ComponentsDocs } from "./components-docs";
import { DocsNav } from "./docs-nav";
import { Foundations } from "./foundations";
import { PatternsDocs } from "./patterns-docs";

export function DesignSystemPage() {
  return (
    <AppShell>
      <div className="min-w-0 flex-1">
        <PageHeader>
          <div className="flex flex-wrap items-center justify-between gap-3 pt-5 pb-4">
            <h1 className="flex items-center gap-2 text-heading-24 text-[var(--ds-gray-1000)]">
              <Shapes
                aria-hidden="true"
                className="size-5 text-[var(--ds-gray-900)]"
              />
              Design system
            </h1>
            <p className="text-copy-13 text-[var(--ds-gray-900)]">
              Foundations, components and patterns
            </p>
          </div>
          <div className="border-b border-[var(--border-structural)]" />
        </PageHeader>

        <div className={`${SHELL} pt-8 pb-24`}>
          <div className="flex gap-10">
            <DocsNav />
            <main
              id="main-content"
              className="flex min-w-0 max-w-[880px] flex-1 flex-col gap-16 scroll-mt-28"
            >
              <Foundations />
              <ComponentsDocs />
              <PatternsDocs />
            </main>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
