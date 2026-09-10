"use client";

import { Popover as PopoverPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;
export const PopoverAnchor = PopoverPrimitive.Anchor;
export const PopoverClose = PopoverPrimitive.Close;

/** Geist Popover surface — same chrome as Menu, sized by its content. */
export function PopoverContent({
  className,
  align = "start",
  sideOffset = 6,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 overflow-hidden rounded-xl",
          "surface-tertiary elevated border border-[var(--border-subtle)]",
          "text-[var(--ds-gray-1000)] outline-none",
          "origin-(--radix-popover-content-transform-origin)",
          "data-[state=open]:animate-geist-scale-in data-[state=closed]:animate-geist-fade-out",
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}
