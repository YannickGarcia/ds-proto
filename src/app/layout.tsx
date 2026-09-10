import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import { BRAND_TINT_SCRIPT } from "@/lib/brand-tint";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI intelligence — Pensero",
  description:
    "Engineering analytics: how work splits across humans, AI-assist and agents, what it costs, and who gets the most value from it.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full`}
    >
      <head>
        {/* Applies a stored brand tint before first paint, so a tuned theme
            never flashes the committed defaults. */}
        <script dangerouslySetInnerHTML={{ __html: BRAND_TINT_SCRIPT }} />
      </head>
      <body className="min-h-full">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
