"use client";

import { DropdownMenu as MenuPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Menu — floating overlay surface, 12px radius, 32px rows,
 * entering with the swift overlay curve.
 */
export const Menu = MenuPrimitive.Root;
export const MenuTrigger = MenuPrimitive.Trigger;
export const MenuGroup = MenuPrimitive.Group;
export const MenuRadioGroup = MenuPrimitive.RadioGroup;

export function MenuContent({
  className,
  sideOffset = 6,
  align = "start",
  ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Content
        sideOffset={sideOffset}
        align={align}
        className={cn(
          "z-50 min-w-[200px] overflow-hidden rounded-xl p-1",
          "surface-tertiary elevated border border-[var(--border-subtle)]",
          "origin-(--radix-dropdown-menu-content-transform-origin)",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-fade-out",
          className,
        )}
        {...props}
      />
    </MenuPrimitive.Portal>
  );
}

export function MenuItem({
  className,
  inset,
  ...props
}: ComponentProps<typeof MenuPrimitive.Item> & { inset?: boolean }) {
  return (
    <MenuPrimitive.Item
      className={cn(
        "relative flex h-8 cursor-default select-none items-center gap-2 rounded-[var(--radius)] px-2",
        "text-label-default text-primary outline-none",
        "transition-colors duration-100",
        "data-[highlighted]:bg-[var(--ds-gray-alpha-200)]",
        "data-[disabled]:pointer-events-none data-[disabled]:text-tertiary",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-secondary",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}

export function MenuRadioItem({
  className,
  children,
  ...props
}: ComponentProps<typeof MenuPrimitive.RadioItem>) {
  return (
    <MenuPrimitive.RadioItem
      className={cn(
        "relative flex h-8 cursor-default select-none items-center gap-2 rounded-[var(--radius)] py-0 pr-2 pl-7",
        "text-label-default text-primary outline-none transition-colors duration-100",
        "data-[highlighted]:bg-[var(--ds-gray-alpha-200)]",
        className,
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <MenuPrimitive.ItemIndicator>
          <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
            <path
              d="M3.5 8.5l3 3 6-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </MenuPrimitive.ItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export function MenuLabel({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Label>) {
  return (
    <MenuPrimitive.Label
      className={cn(
        "px-2 pt-2 pb-1 text-label-xs text-secondary",
        className,
      )}
      {...props}
    />
  );
}

export function MenuSeparator({
  className,
  ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
  return (
    <MenuPrimitive.Separator
      className={cn("-mx-1 my-1 h-px bg-[var(--ds-gray-alpha-400)]", className)}
      {...props}
    />
  );
}
