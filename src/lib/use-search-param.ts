"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

/**
 * Reads a query-string value without `useSearchParams`, which would force the
 * page under a Suspense boundary. Visx's `ParentSize` measures 0 inside a
 * suspended subtree and never recovers, so every chart would render empty.
 *
 * Returns `null` during SSR and the first client render, then the real value.
 */
export function useSearchParam(key: string) {
  return useSyncExternalStore(
    subscribe,
    () => new URLSearchParams(window.location.search).get(key),
    () => null,
  );
}
