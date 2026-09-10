"use client";

import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Collapsible = CollapsiblePrimitive.Root;
export const CollapsibleTrigger = CollapsiblePrimitive.Trigger;

/**
 * Grid-rows transition rather than a height animation: it needs no measurement
 * and stays correct when the content reflows.
 */
export function CollapsibleContent({
  className,
  children,
  ...props
}: ComponentProps<typeof CollapsiblePrimitive.Content>) {
  return (
    <CollapsiblePrimitive.Content
      forceMount
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-200",
        "ease-[var(--ds-motion-timing-swift)]",
        "data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100",
        "data-[state=closed]:grid-rows-[0fr] data-[state=closed]:opacity-0",
        className,
      )}
      {...props}
    >
      <div className="overflow-hidden">{children}</div>
    </CollapsiblePrimitive.Content>
  );
}
