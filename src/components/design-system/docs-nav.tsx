"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface DocsNavGroup {
  title: string;
  href: string;
  items: { label: string; href: string }[];
}

export const DOCS_NAV: DocsNavGroup[] = [
  {
    title: "Foundations",
    href: "#foundations",
    items: [
      { label: "Colour", href: "#foundations-color" },
      { label: "Brand tint", href: "#foundations-brand" },
      { label: "Data visualisation", href: "#foundations-dataviz" },
      { label: "Typography", href: "#foundations-typography" },
      { label: "Spacing & layout", href: "#foundations-spacing" },
      { label: "Radius", href: "#foundations-radius" },
      { label: "Surfaces", href: "#foundations-surfaces" },
      { label: "Elevation", href: "#foundations-elevation" },
      { label: "Borders", href: "#foundations-borders" },
      { label: "Motion", href: "#foundations-motion" },
      { label: "Icons", href: "#foundations-icons" },
    ],
  },
  {
    title: "Components",
    href: "#components",
    items: [
      { label: "Avatar", href: "#component-avatar" },
      { label: "Badge", href: "#component-badge" },
      { label: "Banner", href: "#component-banner" },
      { label: "Breadcrumb", href: "#component-breadcrumb" },
      { label: "Button", href: "#component-button" },
      { label: "Card", href: "#component-card" },
      { label: "Collapsible", href: "#component-collapsible" },
      { label: "Empty state", href: "#component-empty-state" },
      { label: "Input", href: "#component-input" },
      { label: "Menu", href: "#component-menu" },
      { label: "Pagination", href: "#component-pagination" },
      { label: "Popover", href: "#component-popover" },
      { label: "Segmented control", href: "#component-segmented" },
      { label: "Select", href: "#component-select" },
      { label: "Skeleton", href: "#component-skeleton" },
      { label: "Switch", href: "#component-switch" },
      { label: "Table", href: "#component-table" },
      { label: "Tabs", href: "#component-tabs" },
      { label: "Theme switcher", href: "#component-theme-switcher" },
      { label: "Tooltip", href: "#component-tooltip" },
    ],
  },
  {
    title: "Patterns",
    href: "#patterns",
    items: [
      { label: "KPI card", href: "#pattern-kpi" },
      { label: "Chart card", href: "#pattern-chart-card" },
      { label: "Scope & period", href: "#pattern-scope" },
      { label: "Sidebar navigation", href: "#pattern-nav" },
      { label: "Page shell", href: "#pattern-shell" },
    ],
  },
];

/** Only the leaf entries get a highlight, so only they are tracked. */
const ITEM_IDS = DOCS_NAV.flatMap((group) =>
  group.items.map((item) => item.href.slice(1)),
);

/**
 * Highlights the entry that has reached the middle of the viewport.
 *
 * The rule is "the last entry whose top has crossed the midline", measured
 * rather than observed: entries are separated by gaps, and an
 * IntersectionObserver band would drop the highlight whenever the line fell
 * between two of them. Purely an enhancement — the links work regardless.
 */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    // Measured straight off the scroll event: browsers already coalesce those
    // to one per frame, and a single batch of reads costs one layout pass.
    const measure = () => {
      const nodes = ITEM_IDS.map((id) => document.getElementById(id)).filter(
        (node): node is HTMLElement => node !== null,
      );
      if (nodes.length === 0) return;

      const midline = window.innerHeight / 2;
      let current = nodes[0];
      for (const node of nodes) {
        if (node.getBoundingClientRect().top > midline) break;
        current = node;
      }

      // The closing entries are usually too short to ever reach the midline,
      // so the foot of the page always resolves to the last of them.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;

      setActive(atBottom ? nodes[nodes.length - 1].id : current.id);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return active;
}

/**
 * Keeps the highlighted link inside the nav's own scroll box. Written as
 * scrollTop arithmetic rather than `scrollIntoView`, which would also scroll
 * the page and fight the reader.
 */
function useFollowActive(active: string | null) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = ref.current;
    if (!active || !nav) return;
    const link = nav.querySelector<HTMLElement>(
      `[href="#${CSS.escape(active)}"]`,
    );
    if (!link) return;

    const navBox = nav.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    const margin = 8;
    if (linkBox.top < navBox.top + margin) {
      nav.scrollTop -= navBox.top + margin - linkBox.top;
    } else if (linkBox.bottom > navBox.bottom - margin) {
      nav.scrollTop += linkBox.bottom - navBox.bottom + margin;
    }
  }, [active]);

  return ref;
}

export function DocsNav() {
  const active = useActiveSection();
  const ref = useFollowActive(active);

  return (
    <nav
      ref={ref}
      aria-label="Design system"
      className="no-scrollbar sticky top-28 hidden max-h-[calc(100dvh-8rem)] w-[212px] shrink-0 overflow-y-auto pb-10 xl:block"
    >
      {DOCS_NAV.map((group) => (
        <div key={group.title} className="mb-5">
          <a
            href={group.href}
            className={cn(
              "block px-2 pb-2 text-[11px] leading-4 font-medium tracking-[0.04em] uppercase",
              "text-[var(--ds-gray-700)] transition-colors hover:text-[var(--ds-gray-1000)]",
            )}
          >
            {group.title}
          </a>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = active === item.href.slice(1);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "block rounded-[var(--radius)] px-2 py-1.5 text-label-13",
                      "transition-colors duration-150",
                      isActive
                        ? "bg-[var(--ds-gray-alpha-200)] font-medium text-[var(--ds-gray-1000)]"
                        : "text-[var(--ds-gray-900)] hover:bg-[var(--ds-gray-alpha-100)] hover:text-[var(--ds-gray-1000)]",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
