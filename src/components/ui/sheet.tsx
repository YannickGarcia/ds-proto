"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { X } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Sheet — a panel that slides in from the right edge to go deeper into
 * something without leaving the page.
 *
 * Where a Modal asks for a decision, a Sheet is for exploring: a breakdown,
 * a detail view, a drill-down. It sits on the same rung as a Modal — a
 * tertiary surface, `elevated-lg`, over `--ds-overlay` — because it is the
 * other surface not anchored to a trigger. The overlay dims rather than
 * hides, so the page it came from stays legible behind it.
 *
 * Radix supplies the behaviour: focus is trapped while open and returned on
 * close, Escape and outside-click dismiss, and the title labels the panel.
 */
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-[var(--ds-overlay)]",
          "data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out",
        )}
      />
      <DialogPrimitive.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-[560px] flex-col",
          "surface-tertiary elevated-lg border-l border-[var(--border-subtle)]",
          "text-primary outline-none",
          "data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/** Title, description and anything that should stay put while the body scrolls. */
export function SheetHeader({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative shrink-0 border-b border-[var(--border-subtle)] px-6 pt-5 pb-4",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        aria-label="Close"
        className={cn(
          "absolute top-4 right-4 inline-flex size-8 items-center justify-center rounded-md",
          "text-tertiary transition-colors hover:bg-[var(--ds-gray-alpha-100)] hover:text-primary",
          "outline-none focus-visible:shadow-[var(--ds-focus-ring)]",
        )}
      >
        <X aria-hidden="true" className="size-4" />
      </DialogPrimitive.Close>
    </div>
  );
}

/** What is being explored. Wired to aria-labelledby by Radix. */
export function SheetTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("pr-10 text-h4 text-primary", className)}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("mt-1 text-copy-sm text-secondary", className)}
      {...props}
    />
  );
}

/** Scrolls on its own; the header stays put. */
export function SheetBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto px-6 py-5", className)}
      {...props}
    />
  );
}
