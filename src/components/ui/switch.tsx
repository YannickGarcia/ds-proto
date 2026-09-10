"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Switch — an immediate on/off. Never use it for a value that needs saving. */
export function Switch({
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[18px] w-8 shrink-0 items-center rounded-full p-0.5 outline-none",
        "border border-transparent transition-colors duration-150",
        "bg-[var(--ds-gray-alpha-400)] data-[state=checked]:bg-[var(--ds-gray-1000)]",
        "focus-visible:shadow-[var(--ds-focus-ring)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block size-[14px] rounded-full bg-[var(--ds-surface-secondary)]",
          "shadow-[var(--ds-shadow-xs)] transition-transform duration-150",
          "ease-[var(--ds-motion-timing-swift)] data-[state=checked]:translate-x-[14px]",
        )}
      />
    </SwitchPrimitive.Root>
  );
}
