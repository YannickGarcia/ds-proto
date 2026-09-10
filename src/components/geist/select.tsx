"use client";

import { Select as SelectPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { CaretDown, Check } from "@/components/icons";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectGroup = SelectPrimitive.Group;

/**
 * Trigger matches a default secondary Button — 32px with a 14px label — so
 * filter rows stay level.
 */
export function SelectTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "inline-flex shrink-0 items-center justify-between gap-1.5 rounded-[var(--geist-radius)]",
        "border border-[var(--ds-gray-alpha-400)] bg-[var(--ds-surface-secondary)]",
        "text-[var(--ds-gray-1000)] outline-none",
        "h-8 px-3 text-button-14",
        "transition-[background-color,border-color] duration-150",
        "hover:border-[var(--ds-gray-alpha-500)] hover:bg-[var(--ds-gray-alpha-100)]",
        "focus-visible:shadow-[var(--ds-focus-ring)]",
        "data-[placeholder]:text-[var(--ds-gray-900)]",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <CaretDown
          aria-hidden="true"
          className="size-3.5 shrink-0 text-[var(--ds-gray-700)]"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position="popper"
        sideOffset={6}
        className={cn(
          "surface-tertiary elevated z-50 min-w-[--radix-select-trigger-width] overflow-hidden rounded-xl p-1",
          "border border-[var(--border-subtle)]",
          "origin-(--radix-select-content-transform-origin)",
          "data-[state=open]:animate-geist-scale-in",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex h-8 cursor-default items-center rounded-[var(--geist-radius)] py-0 pr-2 pl-7",
        "text-label-14 text-[var(--ds-gray-1000)] outline-none transition-colors duration-100",
        "data-[highlighted]:bg-[var(--ds-gray-alpha-200)]",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check aria-hidden="true" className="size-3.5" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
