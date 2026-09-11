import { cn } from "@/lib/utils";

/**
 * Placeholder product identity.
 *
 * This repository is a design-system reference, so the mark is deliberately
 * generic: change `PRODUCT_NAME` and the glyph below and nothing else in the
 * app needs touching. The tile carries `--brand` at full strength — one of
 * only three places it appears, alongside the surface tint and the primary
 * button.
 */
export const PRODUCT_NAME = "Proto";

/** The tile alone, for favicons, avatars and a collapsed sidebar. */
export function ProductMark({
  className,
  title = PRODUCT_NAME,
}: {
  className?: string;
  /** Empty string marks it decorative, for when a text label sits beside it. */
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-6", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      xmlns="http://www.w3.org/2000/svg"
    >
      {title ? <title>{title}</title> : null}
      <rect width="32" height="32" rx="8" fill="var(--brand)" />
      <rect x="8" y="17" width="4" height="7" rx="1.5" fill="#fff" />
      <rect x="14" y="12" width="4" height="12" rx="1.5" fill="#fff" />
      <rect x="20" y="8" width="4" height="16" rx="1.5" fill="#fff" />
    </svg>
  );
}

/** Mark plus wordmark. The name is live text, not paths, so it stays editable. */
export function ProductLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <ProductMark className="size-[22px] shrink-0" title="" />
      <span className="text-h5 text-primary">{PRODUCT_NAME}</span>
    </span>
  );
}
