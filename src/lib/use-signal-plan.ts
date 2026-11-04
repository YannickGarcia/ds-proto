"use client";

import { useSyncExternalStore } from "react";
import { LAST, SEED_PLAN, type MetricId, type Plan } from "@/lib/signals-data";

/**
 * The action plan, one action per metric, remembered in this browser.
 *
 * A store rather than component state so the page summary and every signal
 * row read the same plan. The server — and the first client render — use the
 * seed, so hydration matches; the stored plan arrives on the next tick.
 */
const KEY = "ds-proto.signal-plan";

let current: Plan | null = null;
const listeners = new Set<() => void>();

function load(): Plan {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Plan) : SEED_PLAN;
  } catch {
    return SEED_PLAN;
  }
}

function save(next: Plan) {
  current = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private browsing, or storage full. The plan still holds for this visit.
  }
  for (const listener of listeners) listener();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => (current ??= load());
const getServerSnapshot = () => SEED_PLAN;

export function useSignalPlan() {
  const plan = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    plan,
    /** Adds or rewrites an action. Rewording keeps the week it was first set. */
    setAction(id: MetricId, text: string) {
      const existing = plan[id];
      save({
        ...plan,
        [id]: { text, setWeek: existing?.setWeek ?? LAST + 1 },
      });
    },
    removeAction(id: MetricId) {
      const next = { ...plan };
      delete next[id];
      save(next);
    },
  };
}
