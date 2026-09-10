"use client";

import {
  AmazonLogo,
  MicrosoftOutlookLogo,
  MicrosoftTeamsLogo,
  OpenAiLogo,
  SlackLogo,
} from "@phosphor-icons/react";
import * as simpleIcons from "simple-icons";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

/**
 * Provider marks come from three sources, in order of fidelity:
 *
 *  1. Simple Icons — the official brand glyph and its brand hex.
 *  2. Phosphor — for brands Simple Icons has removed at the owner's request
 *     (Slack, Teams, OpenAI, AWS), with a hand-set brand hex.
 *  3. A monogram tile — for products with no published mark (Devin, YouTrack).
 *
 * Every provider resolves through this one registry, so adding a provider is
 * a single entry and never a new import in a page.
 */

type SimpleIcon = { title: string; hex: string; path: string };

interface Mark {
  /** Simple Icons export name, e.g. `siGithub`. */
  slug?: string;
  /** Phosphor component, for brands Simple Icons no longer carries. */
  phosphor?: ComponentType<{
    className?: string;
    weight?: "fill";
    style?: React.CSSProperties;
  }>;
  /** Brand colour. Read from Simple Icons when a slug is given. */
  hex?: string;
  /** Monogram text when there is no mark at all. */
  monogram?: string;
}

const MARKS: Record<string, Mark> = {
  github: { slug: "siGithub" },
  "github-projects": { slug: "siGithub" },
  "github-copilot": { slug: "siGithubcopilot" },
  gitlab: { slug: "siGitlab" },
  bitbucket: { slug: "siBitbucket" },
  jira: { slug: "siJira" },
  linear: { slug: "siLinear" },
  youtrack: { monogram: "YT", hex: "9C27B0" },
  cursor: { slug: "siCursor" },
  "claude-code": { slug: "siClaude" },
  devin: { monogram: "DV", hex: "1F6FEB" },
  "gemini-code-assist": { slug: "siGooglegemini" },
  "openai-codex": { phosphor: OpenAiLogo, hex: "412991" },
  cline: { slug: "siCline" },
  "aws-bedrock": { phosphor: AmazonLogo, hex: "FF9900" },
  confluence: { slug: "siConfluence" },
  notion: { slug: "siNotion" },
  "google-drive": { slug: "siGoogledrive" },
  codecov: { slug: "siCodecov" },
  sonarcloud: { slug: "siSonarqubecloud" },
  slack: { phosphor: SlackLogo, hex: "4A154B" },
  "microsoft-teams": { phosphor: MicrosoftTeamsLogo, hex: "6264A7" },
  "google-chat": { slug: "siGooglechat" },
  "google-calendar": { slug: "siGooglecalendar" },
  "microsoft-365-calendar": { phosphor: MicrosoftOutlookLogo, hex: "0078D4" },
};

/**
 * Brands whose mark is essentially black or white — GitHub, Notion — disappear
 * against one of the two themes. Those render in the foreground colour instead
 * of their brand hex, which is what the brands' own guidelines call for on a
 * contrasting background.
 */
function isMonochrome(hex: string) {
  const v = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance < 0.06 || luminance > 0.85;
}

const SIZES = {
  sm: "size-5 rounded-[5px] text-[9px]",
  md: "size-8 rounded-[7px] text-[11px]",
  lg: "size-10 rounded-[9px] text-[13px]",
} as const;

const GLYPH = { sm: "size-3", md: "size-[18px]", lg: "size-5" } as const;

export function ProviderIcon({
  provider,
  size = "md",
  className,
}: {
  provider: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const mark = MARKS[provider];
  const icon = mark?.slug
    ? ((simpleIcons as unknown as Record<string, SimpleIcon>)[mark.slug] ?? null)
    : null;
  const brandHex = `#${mark?.hex ?? icon?.hex ?? "8F8F8F"}`;
  const monochrome = isMonochrome(brandHex);
  const glyph = monochrome ? "var(--ds-gray-1000)" : brandHex;
  const wash = monochrome
    ? "var(--ds-gray-alpha-100)"
    : `color-mix(in srgb, ${brandHex} 12%, transparent)`;
  const Phosphor = mark?.phosphor;

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-medium",
        // A faint wash of the brand colour keeps the tile readable in both
        // themes without letting saturated logos dominate the page.
        "ring-1 ring-[var(--border-subtle)] ring-inset",
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: wash }}
    >
      {icon ? (
        <svg
          viewBox="0 0 24 24"
          className={GLYPH[size]}
          style={{ fill: glyph }}
          role="presentation"
        >
          <path d={icon.path} />
        </svg>
      ) : Phosphor ? (
        <Phosphor className={GLYPH[size]} weight="fill" style={{ color: glyph }} />
      ) : (
        <span style={{ color: glyph }}>{mark?.monogram ?? "?"}</span>
      )}
    </span>
  );
}
