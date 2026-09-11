"use client";

import {
  Check,
  X,
} from "@/components/icons";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Structure                                                                   */
/* -------------------------------------------------------------------------- */

export function DocsSection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-[var(--border-structural)] pt-10 first:border-t-0 first:pt-0">
      <h2 className="text-h2 text-primary">{title}</h2>
      {intro ? (
        <p className="mt-2 max-w-[68ch] text-copy-default text-pretty text-secondary">
          {intro}
        </p>
      ) : null}
      <div className="mt-8 flex flex-col gap-12">{children}</div>
    </section>
  );
}

export function DocsEntry({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <article id={id} className="scroll-mt-28">
      <h3 className="text-h3 text-primary">{title}</h3>
      <p className="mt-1.5 max-w-[68ch] text-copy-default text-pretty text-secondary">
        {description}
      </p>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </article>
  );
}

export function DocsBlock({
  label,
  hint,
  children,
}: {
  label?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <h4 className="text-label-sm font-medium text-primary">
          {label}
        </h4>
      ) : null}
      {hint ? (
        <p className="max-w-[68ch] text-copy-sm text-pretty text-secondary">
          {hint}
        </p>
      ) : null}
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Example surface                                                             */
/* -------------------------------------------------------------------------- */

/** A live specimen on the page background, so surfaces read truthfully. */
export function Example({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "surface-secondary overflow-hidden rounded-xl border border-[var(--border-subtle)]",
        padded && "p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Row of specimens, each captioned with the variant it demonstrates. */
export function Specimens({
  items,
  className,
}: {
  items: { label: string; node: ReactNode }[];
  className?: string;
}) {
  return (
    <Example>
      <div className={cn("flex flex-wrap items-end gap-x-8 gap-y-6", className)}>
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-start gap-2">
            <div className="flex min-h-9 items-center">{item.node}</div>
            <span className="text-label-xs-mono text-secondary">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </Example>
  );
}

/* -------------------------------------------------------------------------- */
/* Code                                                                        */
/* -------------------------------------------------------------------------- */

export function Snippet({ code }: { code: string }) {
  return (
    <pre className="no-scrollbar overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--ds-surface-primary)] p-4">
      <code className="text-copy-sm-mono text-primary">
        {code.trim()}
      </code>
    </pre>
  );
}

/* -------------------------------------------------------------------------- */
/* Tables                                                                      */
/* -------------------------------------------------------------------------- */

export function DocsTable({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="no-scrollbar overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="bg-[var(--ds-surface-primary)]">
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border-b border-[var(--border-subtle)] px-4 py-2.5 text-label-xs font-medium whitespace-nowrap text-secondary"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              // biome-ignore lint/suspicious/noArrayIndexKey: static doc rows
              key={rowIndex}
              className="border-b border-[var(--border-subtle)] last:border-b-0"
            >
              {row.map((cell, cellIndex) => (
                <td
                  // biome-ignore lint/suspicious/noArrayIndexKey: static doc cells
                  key={cellIndex}
                  className="px-4 py-2.5 align-top text-label-sm text-primary"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Token({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[4px] bg-[var(--ds-gray-alpha-100)] px-1.5 py-0.5 text-label-xs-mono text-primary">
      {children}
    </code>
  );
}

/* -------------------------------------------------------------------------- */
/* Guidance                                                                    */
/* -------------------------------------------------------------------------- */

export function BestPractice({ items }: { items: ReactNode[] }) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--ds-surface-primary)] p-5">
      <h4 className="text-label-sm font-medium text-primary">
        Best practice
      </h4>
      <ul className="mt-2.5 flex list-none flex-col gap-2">
        {items.map((item, index) => (
          <li
            // biome-ignore lint/suspicious/noArrayIndexKey: static doc list
            key={index}
            className="flex gap-2.5 text-copy-sm text-pretty text-secondary"
          >
            <span
              aria-hidden="true"
              className="mt-[7px] size-1 shrink-0 rounded-full bg-[var(--ds-gray-700)]"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DoDont({
  do: doItems,
  dont: dontItems,
}: {
  do: ReactNode[];
  dont: ReactNode[];
}) {
  const column = (
    kind: "do" | "dont",
    heading: string,
    items: ReactNode[],
  ) => {
    const Icon = kind === "do" ? Check : X;
    return (
      <div className="rounded-xl border border-[var(--border-subtle)] p-4">
        <h5
          className={cn(
            "flex items-center gap-1.5 text-label-sm font-medium",
            kind === "do"
              ? "text-[var(--ds-green-text)]"
              : "text-[var(--ds-red-text)]",
          )}
        >
          <Icon aria-hidden="true" className="size-3.5" />
          {heading}
        </h5>
        <ul className="mt-2 flex flex-col gap-1.5">
          {items.map((item, index) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: static doc list
              key={index}
              className="text-copy-sm text-pretty text-secondary"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {column("do", "Do", doItems)}
      {column("dont", "Don’t", dontItems)}
    </div>
  );
}
