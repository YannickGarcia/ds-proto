"use client";

import { IconContext } from "@phosphor-icons/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Phosphor sizes stroke by weight, not strokeWidth. `regular` is 1.5px on its
 * 256-unit grid — the closest step to the 1.75 optical weight used before.
 */
const ICON_DEFAULTS = { weight: "regular" } as const;

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <IconContext.Provider value={ICON_DEFAULTS}>
        {children}
      </IconContext.Provider>
    </NextThemesProvider>
  );
}
