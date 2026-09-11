"use client";

import {
  ArrowUpRight,
  Broadcast,
  Buildings,
  CaretRight,
  CaretUpDown,
  Compass,
  CreditCard,
  Gear,
  GitPullRequest,
  Heartbeat,
  Kanban,
  Lifebuoy,
  Plug,
  Pulse,
  Robot,
  Scroll,
  SealCheck,
  Shapes,
  SignOut,
  Sparkle,
  Speedometer,
  Target,
  User,
  Users,
} from "@/components/icons";
import type { Icon } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { PenseroLogo } from "@/components/pensero-logo";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: Icon;
  /** Route this item points at. Items without one are not yet built. */
  href?: string;
  external?: boolean;
  children?: { label: string }[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const SECTIONS: NavSection[] = [
  { items: [{ label: "Signals", icon: Broadcast }] },
  {
    title: "AI adoption",
    items: [
      { label: "AI intelligence", icon: Sparkle, href: "/" },
      { label: "Agents", icon: Robot },
    ],
  },
  {
    title: "Engineering intelligence",
    items: [
      { label: "Work", icon: Kanban },
      { label: "Quality", icon: SealCheck },
      { label: "Efficiency", icon: Speedometer },
      { label: "Reviews", icon: GitPullRequest },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "Contributors", icon: Users },
      { label: "Benchmark", icon: Speedometer },
      { label: "Impact", icon: Pulse },
      { label: "Calibrate", icon: Target },
      { label: "CapEx", icon: CreditCard },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        label: "Org settings",
        icon: Buildings,
        children: [
          { label: "General" },
          { label: "Members" },
          { label: "Teams" },
          { label: "AI budgets" },
          { label: "Billing" },
        ],
      },
      { label: "Integrations", icon: Plug, href: "/integrations" },
      { label: "Data health", icon: Heartbeat },
      { label: "Help center", icon: Lifebuoy, external: true },
      { label: "Getting started", icon: Compass },
    ],
  },
];

const itemClasses = (active?: boolean) =>
  cn(
    "group flex h-8 w-full items-center gap-2 rounded-[var(--radius)] px-2",
    "text-label-default outline-none transition-colors duration-150",
    "focus-visible:shadow-[var(--ds-focus-ring)]",
    active
      ? "bg-[var(--ds-gray-alpha-200)] font-medium text-primary"
      : "text-secondary hover:bg-[var(--ds-gray-alpha-100)] hover:text-primary",
  );

function NavEntry({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const Icon = item.icon;
  const isActive = item.href !== undefined && pathname === item.href;

  if (item.children) {
    return (
      <li>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className={itemClasses(false)}
        >
          <Icon
            aria-hidden="true"
            className="size-4 shrink-0 text-tertiary transition-colors group-hover:text-primary"
          />
          <span className="truncate">{item.label}</span>
          <CaretRight
            aria-hidden="true"
            className={cn(
              "ml-auto size-3.5 shrink-0 text-tertiary",
              "transition-[transform,color] duration-200 ease-[var(--ds-motion-timing-swift)]",
              "group-hover:text-secondary",
              open && "rotate-90",
            )}
          />
        </button>
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-200 ease-[var(--ds-motion-timing-swift)]",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <ul className="ml-[15px] overflow-hidden border-l border-[var(--border-structural)] pl-2">
            {item.children.map((child) => (
              <li key={child.label}>
                <button type="button" className={itemClasses(false)}>
                  <span className="truncate">{child.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  const content = (
    <>
      <Icon
        aria-hidden="true"
        className={cn(
          "size-4 shrink-0 transition-colors",
          isActive ? "text-primary" : "text-tertiary group-hover:text-primary",
        )}
      />
      <span className="truncate">{item.label}</span>
      {item.external ? (
        <ArrowUpRight
          aria-hidden="true"
          className="ml-auto size-3.5 shrink-0 text-tertiary transition-colors group-hover:text-secondary"
        />
      ) : null}
    </>
  );

  return (
    <li>
      {item.href ? (
        <Link
          href={item.href}
          aria-current={isActive ? "page" : undefined}
          className={itemClasses(isActive)}
        >
          {content}
        </Link>
      ) : (
        <button type="button" className={itemClasses(false)}>
          {content}
        </button>
      )}
    </li>
  );
}

export function Sidebar() {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col lg:flex",
        "border-r border-[var(--border-structural)] bg-[var(--ds-surface-primary)]",
      )}
    >
      <Link
        href="/"
        className="flex h-14 items-center gap-2 px-4 outline-none focus-visible:shadow-[var(--ds-focus-ring)]"
      >
        <PenseroLogo className="h-[22px] text-primary" />
      </Link>

      <nav className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        {SECTIONS.map((section, index) => (
          <div key={section.title ?? `section-${index}`} className="mb-5">
            {section.title ? (
              <h2 className="px-2 pt-1 pb-2 text-[11px] leading-4 font-medium tracking-[0.04em] text-tertiary uppercase">
                {section.title}
              </h2>
            ) : null}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavEntry key={item.label} item={item} />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--border-structural)] p-3">
        <Menu>
          <MenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-2.5 rounded-[var(--radius)] p-2 outline-none",
                "transition-colors duration-150 hover:bg-[var(--ds-gray-alpha-100)]",
                "focus-visible:shadow-[var(--ds-focus-ring)]",
                "data-[state=open]:bg-[var(--ds-gray-alpha-200)]",
              )}
            >
              <Avatar name="Mara D." size="lg" />
              <span className="min-w-0 flex-1 text-left">
                <span className="block truncate text-label-default font-medium text-primary">
                  Mara D.
                </span>
                <span className="block truncate text-label-xs text-secondary">
                  mara@acme.com
                </span>
              </span>
              <CaretUpDown
                aria-hidden="true"
                className="size-3.5 shrink-0 text-tertiary"
              />
            </button>
          </MenuTrigger>
          <MenuContent side="top" align="start" className="w-[218px]">
            <MenuItem>
              <User aria-hidden="true" />
              View my profile
            </MenuItem>
            <MenuItem>
              <Gear aria-hidden="true" />
              Account settings
            </MenuItem>
            <MenuItem>
              <Scroll aria-hidden="true" />
              Competency matrix
            </MenuItem>
            <MenuItem asChild>
              <Link href="/design-system">
                <Shapes aria-hidden="true" />
                Design system
              </Link>
            </MenuItem>
            <MenuSeparator />
            <div
              className="flex items-center justify-between gap-2 py-1 pr-1 pl-2"
              // The switcher is a control, not a menu item — keep Radix's
              // roving focus and select-to-close from swallowing its clicks.
              onKeyDown={(event) => event.stopPropagation()}
            >
              <span className="text-label-default text-primary">Theme</span>
              <ThemeSwitcher />
            </div>
            <MenuSeparator />
            <MenuItem>
              <SignOut aria-hidden="true" />
              Logout
            </MenuItem>
          </MenuContent>
        </Menu>
      </div>
    </aside>
  );
}
