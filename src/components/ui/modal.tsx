"use client";

import { Dialog as DialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { X } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Modal — a decision that blocks the rest of the page.
 *
 * Modelled on Geist's: a header carrying the title and a one-to-three
 * sentence description, a body, and a footer with Cancel on the left and the
 * action on the right. It is the top rung of the elevation ladder — a
 * tertiary surface, `elevated-lg`, over a dimming overlay — because nothing
 * else in the product sits above it.
 *
 * Radix supplies the behaviour the guidelines require: focus is trapped
 * while open and returned to the trigger on close, Escape and outside-click
 * dismiss, and the title is wired to `aria-labelledby`.
 */
export const Modal = DialogPrimitive.Root;
export const ModalTrigger = DialogPrimitive.Trigger;
export const ModalClose = DialogPrimitive.Close;

export function ModalContent({
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
          "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[540px]",
          "-translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl",
          "surface-tertiary elevated-lg border border-[var(--border-subtle)]",
          "text-primary outline-none",
          "data-[state=open]:animate-scale-in data-[state=closed]:animate-fade-out",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

/** Title and description, with the close button in the corner. */
export function ModalHeader({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("relative px-6 pt-6", className)} {...props}>
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

/** Title Case statement, never a question. Wired to aria-labelledby by Radix. */
export function ModalTitle({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("pr-10 text-h3 text-primary", className)}
      {...props}
    />
  );
}

/** Sentence case, one to three sentences — the consequence first. */
export function ModalDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("mt-2 text-copy-default text-secondary", className)}
      {...props}
    />
  );
}

/** Scrolls on its own when content outgrows the viewport; header and footer stay put. */
export function ModalBody({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("min-h-0 flex-1 overflow-y-auto px-6 pt-5 pb-6", className)}
      {...props}
    />
  );
}

/**
 * Cancel on the left, the action on the right. Recessed to the primary
 * surface with a hairline, the same way a card footer is.
 */
export function ModalFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-2 p-3",
        "border-t border-[var(--border-subtle)] bg-[var(--ds-surface-primary)]",
        className,
      )}
      {...props}
    />
  );
}
