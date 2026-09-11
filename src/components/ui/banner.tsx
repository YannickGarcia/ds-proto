"use client";

import type { ReactNode } from "react";
import { Info, Warning, WarningCircle, CheckCircle, X } from "@/components/icons";
import { cn } from "@/lib/utils";

export type BannerSeverity = "info" | "warning" | "error" | "success";

const TONE = {
  info: {
    icon: Info,
    border: "border-[var(--ds-blue-400)]",
    surface: "bg-[var(--ds-blue-100)]",
    mark: "text-[var(--ds-blue-text)]",
  },
  warning: {
    icon: Warning,
    border: "border-[var(--ds-amber-400)]",
    surface: "bg-[var(--ds-amber-100)]",
    mark: "text-[var(--ds-amber-text)]",
  },
  error: {
    icon: WarningCircle,
    border: "border-[var(--ds-red-400)]",
    surface: "bg-[var(--ds-red-100)]",
    mark: "text-[var(--ds-red-text)]",
  },
  success: {
    icon: CheckCircle,
    border: "border-[var(--ds-green-400)]",
    surface: "bg-[var(--ds-green-100)]",
    mark: "text-[var(--ds-green-text)]",
  },
} as const;

/**
 * Page-level notice. One pattern for every severity: mark, title, body and an
 * optional action, so a page full of conditional banners still reads as a set.
 */
export function Banner({
  severity = "info",
  title,
  children,
  action,
  onDismiss,
  className,
}: {
  severity?: BannerSeverity;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}) {
  const tone = TONE[severity];
  const Mark = tone.icon;

  return (
    <div
      role={severity === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3.5",
        tone.border,
        tone.surface,
        className,
      )}
    >
      <Mark
        aria-hidden="true"
        className={cn("mt-px size-4 shrink-0", tone.mark)}
        weight="fill"
      />
      <div className="min-w-0 flex-1">
        <p className="text-label-sm font-medium text-primary">
          {title}
        </p>
        {children ? (
          <div className="mt-0.5 text-copy-sm text-pretty text-secondary">
            {children}
          </div>
        ) : null}
        {action ? <div className="mt-2 flex gap-2">{action}</div> : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn(
            "-m-1 rounded-[4px] p-1 text-tertiary outline-none",
            "transition-colors hover:text-primary",
            "focus-visible:shadow-[var(--ds-focus-ring)]",
          )}
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

/** Inline status line, for a message attached to a single row or field. */
export function InlineStatus({
  severity = "warning",
  children,
}: {
  severity?: BannerSeverity;
  children: ReactNode;
}) {
  const tone = TONE[severity];
  const Mark = tone.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-label-xs", tone.mark)}>
      <Mark aria-hidden="true" className="size-3.5 shrink-0" weight="fill" />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}
