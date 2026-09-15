import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, ArrowSquareOut } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Text links — navigation that is text, not a control.
 *
 * Three kinds of isolated text interaction exist, and this component covers
 * two of them:
 *
 * - An **action**, or navigation sitting where a control would, is a tertiary
 *   `Button` (wrap a `Link` with `asChild`). It gets a background on hover.
 * - **Navigation in content** — a table row's name, a breadcrumb, "View all"
 *   under a list — is `TextLink`. No background, no colour: it underlines on
 *   hover, which is the quieter signal and does not collide with a row's own
 *   hover fill.
 * - A **link inside prose** is `InlineLink`, underlined at rest, because a
 *   colour change alone does not reach the 3:1 WCAG asks for against the
 *   surrounding text.
 *
 * There is deliberately no link colour. Blue would be a fourth accent beside
 * the brand and the status hues; green would read as success or as the
 * primary button.
 */

const base = [
  "rounded-sm underline-offset-4 outline-none",
  "transition-colors duration-150",
  "focus-visible:shadow-[var(--ds-focus-ring)]",
];

const variants = {
  /** The row's subject, a title: full-contrast text. */
  default: "text-primary hover:underline",
  /** Supporting navigation, a breadcrumb: secondary text that brightens. */
  subtle: "text-secondary hover:text-primary hover:underline",
} as const;

export type TextLinkVariant = keyof typeof variants;

type TextLinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  variant?: TextLinkVariant;
  /** Leaves the product: new tab, rel="noreferrer", trailing external icon. */
  external?: boolean;
  /** "The next step" — a trailing arrow. Ignored when `external` is set. */
  arrow?: boolean;
  children: ReactNode;
};

export function TextLink({
  href,
  variant = "default",
  external = false,
  arrow = false,
  className,
  children,
  ...props
}: TextLinkProps) {
  const Icon = external ? ArrowSquareOut : arrow ? ArrowRight : null;
  const classes = cn(
    base,
    variants[variant],
    Icon && "inline-flex items-center gap-1",
    className,
  );
  const content = (
    <>
      {children}
      {Icon ? (
        <Icon
          aria-hidden="true"
          className="size-[0.9em] shrink-0 text-tertiary"
        />
      ) : null}
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}

/**
 * A link inside a sentence. Underlined at rest — the underline, not a colour,
 * is what separates it from the text around it — and it inherits size, weight
 * and colour so it never changes the rhythm of the paragraph.
 */
export function InlineLink({
  href,
  className,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-sm underline decoration-[var(--ds-gray-alpha-600)] decoration-1 underline-offset-2",
        "outline-none transition-[text-decoration-color] duration-150",
        "hover:decoration-current focus-visible:shadow-[var(--ds-focus-ring)]",
        className,
      )}
      {...props}
    />
  );
}
