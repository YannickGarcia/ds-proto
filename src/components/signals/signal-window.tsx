"use client";

import { createContext, useContext } from "react";
import { DEFAULT_WINDOW, WINDOWS } from "@/lib/signals-data";

/**
 * The focus window the page is read in. A context, because every row, chart
 * and the breakdown sheet must agree on it — a sheet reading four weeks
 * beside a row reading a quarter would contradict itself.
 */
const SignalWindowContext =
  createContext<(typeof WINDOWS)[number]>(DEFAULT_WINDOW);

export const SignalWindowProvider = SignalWindowContext.Provider;

export function useSignalWindow() {
  return useContext(SignalWindowContext);
}
