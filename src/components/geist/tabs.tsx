"use client";

import { motion } from "motion/react";
import { Tabs as TabsPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { createContext, useContext, useId, useMemo } from "react";
import { cn } from "@/lib/utils";

interface TabsState {
  layoutId: string;
  value?: string;
}

const TabsStateContext = createContext<TabsState>({ layoutId: "geist-tabs" });

/**
 * Geist Tabs — text triggers with a hover pill and a sliding 2px underline,
 * riding a single shared bottom hairline.
 */
export function Tabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  const id = useId();
  const state = useMemo<TabsState>(
    () => ({
      layoutId: `geist-tab-underline-${id}`,
      value: props.value ?? props.defaultValue,
    }),
    [id, props.value, props.defaultValue],
  );

  return (
    <TabsStateContext.Provider value={state}>
      <TabsPrimitive.Root
        data-slot="tabs"
        className={cn("flex flex-col", className)}
        {...props}
      />
    </TabsStateContext.Provider>
  );
}

/**
 * The hairline lives on a wrapper rather than on the list itself: the list is
 * a scroll container, and `overflow-x-auto` clips to its padding box, which
 * would swallow an active underline sitting on the list's own bottom edge.
 */
export function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <div className="relative border-b border-[var(--border-structural)]">
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(
          "geist-no-scrollbar flex items-center gap-1 overflow-x-auto",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function TabsTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { layoutId, value } = useContext(TabsStateContext);
  const isActive = value !== undefined && value === props.value;

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "group relative inline-flex h-10 items-center whitespace-nowrap px-1 outline-none",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-flex h-8 items-center rounded-[var(--geist-radius)] px-2 text-button-14",
          "text-[var(--ds-gray-900)] transition-colors duration-150",
          "group-hover:bg-[var(--ds-gray-alpha-200)] group-hover:text-[var(--ds-gray-1000)]",
          "group-data-[state=active]:text-[var(--ds-gray-1000)]",
          "group-focus-visible:shadow-[var(--ds-focus-ring)]",
        )}
      >
        {children}
      </span>
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5">
        {isActive ? (
          <motion.span
            layoutId={layoutId}
            className="block h-full w-full rounded-full bg-[var(--ds-gray-1000)]"
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
          />
        ) : null}
      </span>
    </TabsPrimitive.Trigger>
  );
}

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("outline-none", className)}
      {...props}
    />
  );
}
