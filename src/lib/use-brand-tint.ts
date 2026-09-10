"use client";

import { useSyncExternalStore } from "react";
import {
  type BrandTint,
  getBrandTintServerSnapshot,
  getBrandTintSnapshot,
  subscribeBrandTint,
} from "./brand-tint";

/** Subscribes to the live brand-tint dials. See `brand-tint.ts`. */
export function useBrandTint(): BrandTint {
  return useSyncExternalStore(
    subscribeBrandTint,
    getBrandTintSnapshot,
    getBrandTintServerSnapshot,
  );
}
