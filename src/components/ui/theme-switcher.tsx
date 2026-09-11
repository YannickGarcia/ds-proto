"use client";

import { Monitor, Moon, Sun } from "@/components/icons";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { useMounted } from "@/lib/use-mounted";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

/**
 * theme switcher — a pill track with a spring-animated indicator,
 * matching the control in Vercel's own footer.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const active = mounted ? (theme ?? "system") : "system";

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        // h-8 keeps the pill on the 32px form scale; the 24px targets inside
        // simply centre in it, the way the segmented control's segments do.
        "relative inline-flex h-8 items-center gap-0 rounded-full border p-0.5",
        "border-[var(--ds-gray-alpha-400)] bg-[var(--ds-surface-secondary)]",
        className,
      )}
    >
      {OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = mounted && active === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={option.label}
            title={option.label}
            onClick={() => setTheme(option.value)}
            className={cn(
              "relative inline-flex size-6 items-center justify-center rounded-full outline-none",
              "transition-colors duration-150 focus-visible:shadow-[var(--ds-focus-ring)]",
              isActive
                ? "text-primary"
                : "text-tertiary hover:text-primary",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="theme-indicator"
                className="absolute inset-0 rounded-full bg-[var(--ds-gray-alpha-200)]"
                transition={{ type: "spring", stiffness: 500, damping: 40 }}
              />
            ) : null}
            <Icon className="relative z-10 size-3.5" />
          </button>
        );
      })}
    </div>
  );
}
