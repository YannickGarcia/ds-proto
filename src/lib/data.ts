/**
 * Sample dataset for the "AI intelligence" page.
 *
 * Period: Aug 28 – Sep 06 · scope: 12 people · org with AI budgets enabled.
 * Everything is generated from a fixed seed so the prototype renders
 * identically on the server and the client.
 */

import { monthAbbr, shortDate } from "./format";

/* -------------------------------------------------------------------------- */
/* Deterministic randomness                                                    */
/* -------------------------------------------------------------------------- */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth 0 → 1 ramp used to model adoption curves. */
function logistic(t: number, midpoint = 0.55, steepness = 9) {
  return 1 / (1 + Math.exp(-steepness * (t - midpoint)));
}

const round = (value: number, dp = 1) => {
  const factor = 10 ** dp;
  return Math.round(value * factor) / factor;
};

/* -------------------------------------------------------------------------- */
/* Period                                                                      */
/* -------------------------------------------------------------------------- */

export const PERIOD_LABEL = "Aug 28 – Sep 06";
export const PERIOD_PRESET = "Previous week";
export const SCOPE_SIZE = 12;

const WEEK_COUNT = 52;
/** Monday of the last week in the series. */
const LAST_WEEK_START = Date.UTC(2025, 8, 1);
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/* -------------------------------------------------------------------------- */
/* Weekly series                                                               */
/* -------------------------------------------------------------------------- */

export interface WeekPoint {
  /** Bklit reads series values off the row by key. */
  [key: string]: string | number | null;

  /** Unique categorical key for the bar band. */
  week: string;
  label: string;
  monthLabel: string | null;
  monthIndex: number;

  // Delivery points, split by attribution
  human: number;
  assisted: number;
  agentic: number;
  total: number;

  // Adoption — headcount out of the 12 scoped people
  activeDevs: number;
  aiUsers: number;
  nonAiUsers: number;
  agenticUsers: number;
  nonAgenticUsers: number;
  aiUsersPct: number;
  nonAiUsersPct: number;
  agenticUsersPct: number;
  nonAgenticUsersPct: number;

  // Cost
  costAssisted: number;
  costAgentic: number;
  costTotal: number;

  // Efficiency, $ per delivery point
  cppAssisted: number;
  cppAgentic: number;
  cppTotal: number;
}

export const HARNESSES = [
  "Cursor",
  "Claude Code",
  "GitHub Copilot",
  "Gemini Code Assist",
  "OpenAI Codex",
  "Cline",
  "AWS Bedrock",
  "Devin",
  "Qodo Merge",
  "CodeRabbit",
  "Greptile",
  "Sourcery",
  "Korbit",
  "Sweep",
  "AI co-author",
] as const;

export const MODELS = [
  "Claude Opus 5",
  "Claude Opus 4.1",
  "Claude Sonnet",
  "GPT models",
  "Default",
  "Other",
] as const;

export type HarnessName = (typeof HARNESSES)[number];
export type ModelName = (typeof MODELS)[number];

/** Weekly 100%-stacked share rows keyed by series name. */
export type ShareRow = { week: string; label: string } & Record<string, number | string>;

const rand = mulberry32(20250906);

function buildWeeks(): WeekPoint[] {
  const weeks: WeekPoint[] = [];
  let previousMonth = -1;

  for (let i = 0; i < WEEK_COUNT; i += 1) {
    const start = new Date(LAST_WEEK_START - (WEEK_COUNT - 1 - i) * WEEK_MS);
    const t = i / (WEEK_COUNT - 1);
    const jitter = (amount: number) => (rand() - 0.5) * amount;

    // Delivery: agentic share ramps from ~2% to ~82% across the year.
    const agenticShare = 0.02 + 0.8 * logistic(t, 0.58, 8) + jitter(0.03);
    const assistedShare = Math.max(
      0.1,
      0.3 - 0.18 * logistic(t, 0.5, 6) + jitter(0.04),
    );
    const humanShare = Math.max(0.05, 1 - agenticShare - assistedShare);
    const normaliser = agenticShare + assistedShare + humanShare;

    const total = 78 + 26 * t + jitter(18);

    const human = round((total * humanShare) / normaliser);
    const assisted = round((total * assistedShare) / normaliser);
    const agentic = round((total * agenticShare) / normaliser);
    const weekTotal = round(human + assisted + agentic);

    // Adoption out of 12 scoped developers.
    const activeDevs = 11 + Math.round(rand());
    const aiUsersPctRaw = 62 + 24 * logistic(t, 0.45, 6) + jitter(7);
    const aiUsers = Math.min(
      activeDevs,
      Math.max(5, Math.round((aiUsersPctRaw / 100) * activeDevs)),
    );
    const agenticUsers = Math.min(
      aiUsers,
      Math.max(0, Math.round(aiUsers * (0.1 + 0.8 * logistic(t, 0.6, 8)))),
    );

    // Cost: on-demand + subscription-included, plus estimated agentic spend.
    const costAssisted = round(38 + 62 * t + jitter(22), 2);
    const costAgentic = round(4 + 190 * logistic(t, 0.62, 8) + jitter(16), 2);
    const costTotal = round(Math.max(12, costAssisted + costAgentic), 2);

    const cppAssisted = round(costAssisted / Math.max(assisted + human, 1), 2);
    const cppAgentic = round(costAgentic / Math.max(agentic, 1), 2);

    const month = start.getUTCMonth();
    const isNewMonth = month !== previousMonth;
    previousMonth = month;

    weeks.push({
      week: start.toISOString().slice(0, 10),
      label: shortDate(start),
      monthLabel: isNewMonth ? monthAbbr(month) : null,
      monthIndex: month,

      human,
      assisted,
      agentic,
      total: weekTotal,

      activeDevs,
      aiUsers,
      nonAiUsers: activeDevs - aiUsers,
      agenticUsers,
      nonAgenticUsers: activeDevs - agenticUsers,
      aiUsersPct: round((aiUsers / activeDevs) * 100),
      nonAiUsersPct: round(100 - (aiUsers / activeDevs) * 100),
      agenticUsersPct: round((agenticUsers / activeDevs) * 100),
      nonAgenticUsersPct: round(100 - (agenticUsers / activeDevs) * 100),

      costAssisted: Math.max(6, costAssisted),
      costAgentic: Math.max(0, costAgentic),
      costTotal,

      cppAssisted,
      cppAgentic,
      cppTotal: round(costTotal / Math.max(weekTotal, 1), 2),
    });
  }

  return weeks;
}

export const weeks = buildWeeks();

// The bar charts use `label` as the categorical band key, so it has to be
// unique across the whole series.
if (process.env.NODE_ENV !== "production") {
  const labels = new Set(weeks.map((week) => week.label));
  if (labels.size !== weeks.length) {
    throw new Error("Week labels must be unique to key the bar band scale");
  }
}

/** Percentage-of-month positions used to lay out the month axis. */
export const monthTicks = weeks
  .map((week, index) => ({ week, index }))
  .filter(({ week }) => week.monthLabel !== null)
  .map(({ week, index }) => ({
    label: week.monthLabel as string,
    offset: (index + 0.5) / weeks.length,
  }));

/* -------------------------------------------------------------------------- */
/* 100%-stacked share series                                                   */
/* -------------------------------------------------------------------------- */

function buildShareSeries(
  names: readonly string[],
  weights: readonly number[],
  seed: number,
  /** Share the leading series must hold in the most recent week. */
  leaderTargetShare: number,
): ShareRow[] {
  const localRand = mulberry32(seed);
  const lastIndex = weeks.length - 1;

  return weeks.map((week, weekIndex) => {
    const t = weekIndex / lastIndex;
    const raw = names.map((_, index) => {
      // Leaders strengthen over the year, the long tail thins out.
      const drift = index === 0 ? 1 + 0.5 * t : 1 - 0.35 * t;
      return Math.max(0.01, weights[index] * drift * (0.75 + localRand() * 0.5));
    });

    // The most recent week is the one quoted in the card headline, so the
    // leader is pinned to the sample value and the rest share the remainder.
    if (weekIndex === lastIndex) {
      const tailSum = raw.slice(1).reduce((acc, value) => acc + value, 0);
      raw[0] = 0;
      for (let i = 1; i < raw.length; i += 1) {
        raw[i] = (raw[i] / tailSum) * (100 - leaderTargetShare);
      }
      raw[0] = leaderTargetShare;
    }

    const sum = raw.reduce((acc, value) => acc + value, 0);
    const row: ShareRow = { week: week.week, label: week.label };
    let running = 0;
    names.forEach((name, index) => {
      const value =
        index === names.length - 1
          ? round(100 - running, 1)
          : round((raw[index] / sum) * 100, 1);
      running = round(running + value, 1);
      row[name] = value;
    });
    return row;
  });
}

const HARNESS_WEIGHTS = [
  46, 18, 9, 4.5, 4, 3.4, 2.6, 2.4, 1.9, 1.7, 1.4, 1.2, 1, 0.8, 0.7,
];
const MODEL_WEIGHTS = [30, 17, 15, 15, 12, 11];

export const harnessShare = buildShareSeries(
  HARNESSES,
  HARNESS_WEIGHTS,
  8811,
  66.7,
);
export const modelShare = buildShareSeries(MODELS, MODEL_WEIGHTS, 4477, 29);

/** Leader in the most recent week, used for the card headlines. */
function leaderOf(series: ShareRow[], names: readonly string[]) {
  const latest = series[series.length - 1];
  let best = names[0];
  let bestValue = 0;
  for (const name of names) {
    const value = Number(latest[name] ?? 0);
    if (value > bestValue) {
      bestValue = value;
      best = name;
    }
  }
  return { name: best, share: bestValue };
}

export const harnessLeader = leaderOf(harnessShare, HARNESSES);
export const modelLeader = leaderOf(modelShare, MODELS);

/* -------------------------------------------------------------------------- */
/* Hero KPIs                                                                   */
/* -------------------------------------------------------------------------- */

export interface Kpi {
  label: string;
  value: string;
  subLabel: string;
  delta?: { value: string; direction: "up" | "down" };
  /** Governance metrics report status rather than a period-over-period delta. */
  tone?: "default" | "positive";
}

export const kpis: Kpi[] = [
  {
    label: "Agentic",
    value: "82%",
    subLabel: "of PR & review delivery",
    delta: { value: "+8pp", direction: "up" },
  },
  {
    label: "AI cost",
    value: "$270",
    subLabel: "in this period",
    delta: { value: "+15%", direction: "up" },
  },
  {
    label: "Efficiency",
    value: "$0.95",
    subLabel: "$/point",
    delta: { value: "+2%", direction: "up" },
  },
  {
    label: "People in budget",
    value: "100%",
    subLabel: "12 of 12",
    tone: "positive",
  },
  {
    label: "Excess spend",
    value: "$0",
    subLabel: "above budget limits",
    tone: "positive",
  },
  {
    label: "Top model",
    value: "Claude Opus 5",
    subLabel: "50% of AI tokens",
    delta: { value: "+12pp", direction: "up" },
  },
];

/* -------------------------------------------------------------------------- */
/* Daily AI cost heatmap                                                       */
/* -------------------------------------------------------------------------- */

export type HeatLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface HeatDay {
  date: Date;
  /** Dollars of AI spend for the scoped people on that day. */
  cost: number;
  level: HeatLevel;
  /** Subscription-covered usage that costs nothing extra. */
  includedInPlan: boolean;
}

export const HEAT_BUCKETS: {
  level: HeatLevel;
  label: string;
  cssVar: string;
}[] = [
  { level: 0, label: "No usage", cssVar: "var(--heat-none)" },
  { level: 1, label: "Included in plan", cssVar: "var(--heat-included)" },
  { level: 2, label: "Low", cssVar: "var(--heat-low)" },
  { level: 3, label: "Moderate", cssVar: "var(--heat-moderate)" },
  { level: 4, label: "High", cssVar: "var(--heat-high)" },
  { level: 5, label: "Very high", cssVar: "var(--heat-very-high)" },
];

function buildHeatmap(year: number): HeatDay[] {
  const heatRand = mulberry32(year * 7919);
  const days: HeatDay[] = [];
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year, 11, 31);

  for (let ts = start; ts <= end; ts += 24 * 60 * 60 * 1000) {
    const date = new Date(ts);
    const dayOfWeek = date.getUTCDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayOfYear = Math.round((ts - start) / (24 * 60 * 60 * 1000));
    const t = dayOfYear / 364;

    const roll = heatRand();
    let cost = 0;
    let includedInPlan = false;

    if (isWeekend) {
      cost = roll < 0.72 ? 0 : round(heatRand() * 9, 2);
    } else if (roll < 0.06) {
      cost = 0;
    } else if (roll < 0.24) {
      includedInPlan = true;
      cost = 0;
    } else {
      // Spend ramps through the year as agents come online.
      cost = round(3 + 58 * logistic(t, 0.62, 7) * (0.45 + heatRand()), 2);
    }

    let level: HeatLevel;
    if (includedInPlan) {
      level = 1;
    } else if (cost <= 0) {
      level = 0;
    } else if (cost < 8) {
      level = 2;
    } else if (cost < 22) {
      level = 3;
    } else if (cost < 42) {
      level = 4;
    } else {
      level = 5;
    }

    days.push({ date, cost, level, includedInPlan });
  }

  return days;
}

const heatmapCache = new Map<number, HeatDay[]>();

export function heatmapForYear(year: number): HeatDay[] {
  const cached = heatmapCache.get(year);
  if (cached) return cached;
  const built = buildHeatmap(year);
  heatmapCache.set(year, built);
  return built;
}

/* -------------------------------------------------------------------------- */
/* $/point distribution                                                        */
/* -------------------------------------------------------------------------- */

export type DistributionDimension =
  | "category"
  | "magnitude"
  | "complexity"
  | "person"
  | "model";

export interface DistributionBar {
  bucket: string;
  costPerPoint: number;
  spend: number;
  delivery: number;
  /** Share of the period's total delivery points, 0–100. */
  shareOfPoints: number;
}

function withDerivedShares(
  rows: { bucket: string; costPerPoint: number; delivery: number }[],
): DistributionBar[] {
  const totalDelivery = rows.reduce((acc, row) => acc + row.delivery, 0);
  return rows
    .map((row) => ({
      bucket: row.bucket,
      costPerPoint: row.costPerPoint,
      delivery: row.delivery,
      spend: round(row.costPerPoint * row.delivery, 2),
      shareOfPoints: round((row.delivery / totalDelivery) * 100, 1),
    }))
    .sort((a, b) => b.costPerPoint - a.costPerPoint);
}

export const DISTRIBUTION_DIMENSIONS: {
  value: DistributionDimension;
  label: string;
  emptyState: string;
}[] = [
  {
    value: "category",
    label: "Category",
    emptyState: "No categorized work with AI spend in this period",
  },
  {
    value: "magnitude",
    label: "Magnitude",
    emptyState: "No sized work with AI spend in this period",
  },
  {
    value: "complexity",
    label: "Complexity",
    emptyState: "No complexity-scored work with AI spend in this period",
  },
  {
    value: "person",
    label: "Person",
    emptyState: "Nobody has both AI spend and delivery in this period",
  },
  {
    value: "model",
    label: "Model",
    emptyState:
      "No usage-based model cost in this period — subscription-only tools never appear here",
  },
];

export const distribution: Record<DistributionDimension, DistributionBar[]> = {
  category: withDerivedShares([
    { bucket: "New Stuff", costPerPoint: 0.39, delivery: 96.4 },
    { bucket: "Dev Productivity", costPerPoint: 1.23, delivery: 41.8 },
    { bucket: "Maintenance", costPerPoint: 0.28, delivery: 62.1 },
    { bucket: "KTLO", costPerPoint: 0.85, delivery: 33.6 },
  ]),
  magnitude: withDerivedShares([
    { bucket: "XS", costPerPoint: 1.42, delivery: 18.2 },
    { bucket: "S", costPerPoint: 0.94, delivery: 47.5 },
    { bucket: "M", costPerPoint: 0.61, delivery: 79.3 },
    { bucket: "L", costPerPoint: 0.37, delivery: 58.4 },
    { bucket: "XL", costPerPoint: 0.22, delivery: 30.5 },
  ]),
  complexity: withDerivedShares([
    { bucket: "High", costPerPoint: 1.18, delivery: 44.9 },
    { bucket: "Medium", costPerPoint: 0.66, delivery: 108.2 },
    { bucket: "Low", costPerPoint: 0.31, delivery: 80.8 },
  ]),
  person: withDerivedShares([
    { bucket: "Priya N.", costPerPoint: 1.64, delivery: 14.2 },
    { bucket: "Marcus O.", costPerPoint: 1.21, delivery: 19.6 },
    { bucket: "Mara D.", costPerPoint: 0.98, delivery: 26.4 },
    { bucket: "Sofia R.", costPerPoint: 0.77, delivery: 22.1 },
    { bucket: "Elena V.", costPerPoint: 0.63, delivery: 31.8 },
    { bucket: "Tomas L.", costPerPoint: 0.44, delivery: 28.9 },
    { bucket: "Aisha K.", costPerPoint: 0.36, delivery: 35.2 },
    { bucket: "Daniel W.", costPerPoint: 0.29, delivery: 24.7 },
  ]),
  model: withDerivedShares([
    { bucket: "Claude Opus 5", costPerPoint: 1.31, delivery: 62.4 },
    { bucket: "GPT models", costPerPoint: 0.88, delivery: 34.1 },
    { bucket: "Claude Opus 4.1", costPerPoint: 0.72, delivery: 48.9 },
    { bucket: "Claude Sonnet", costPerPoint: 0.34, delivery: 71.6 },
  ]),
};

/* -------------------------------------------------------------------------- */
/* People — quadrant scatter                                                   */
/* -------------------------------------------------------------------------- */

export interface Person {
  id: string;
  name: string;
  position: string;
  team: string;
  level: string;
  /** Percentile 0–100. */
  delivery: number;
  /** Percentile 0–100 — higher means a lower cost per point. */
  efficiency: number;
  deliveryPoints: number;
  spend: number;
  costPerPoint: number;
}

const PEOPLE_SEED: Omit<
  Person,
  "id" | "costPerPoint" | "delivery" | "efficiency"
>[] = [
  { name: "Aisha K.", position: "Backend", team: "Platform", level: "Senior", deliveryPoints: 35.2, spend: 12.7 },
  { name: "Daniel W.", position: "Backend", team: "Payments", level: "Staff", deliveryPoints: 24.7, spend: 7.2 },
  { name: "Elena V.", position: "Full-stack", team: "Platform", level: "Senior", deliveryPoints: 31.8, spend: 20.0 },
  { name: "Tomas L.", position: "Frontend", team: "Growth", level: "Mid", deliveryPoints: 28.9, spend: 12.7 },
  { name: "Sofia R.", position: "Full-stack", team: "Growth", level: "Senior", deliveryPoints: 22.1, spend: 17.0 },
  { name: "Mara D.", position: "Frontend", team: "Growth", level: "Staff", deliveryPoints: 26.4, spend: 25.9 },
  { name: "Marcus O.", position: "Backend", team: "Payments", level: "Mid", deliveryPoints: 19.6, spend: 23.7 },
  { name: "Priya N.", position: "Data", team: "Platform", level: "Senior", deliveryPoints: 14.2, spend: 23.3 },
  { name: "Kenji T.", position: "Infra", team: "Platform", level: "Staff", deliveryPoints: 30.4, spend: 9.1 },
  { name: "Nour A.", position: "Frontend", team: "Growth", level: "Mid", deliveryPoints: 17.8, spend: 14.6 },
  { name: "Lucas B.", position: "Backend", team: "Payments", level: "Junior", deliveryPoints: 11.9, spend: 18.8 },
  { name: "Ingrid S.", position: "Data", team: "Platform", level: "Mid", deliveryPoints: 20.6, spend: 8.4 },
];

function percentileRank(values: number[], value: number) {
  const below = values.filter((candidate) => candidate < value).length;
  return round((below / (values.length - 1)) * 100, 1);
}

export const people: Person[] = (() => {
  const deliveryValues = PEOPLE_SEED.map((p) => p.deliveryPoints);
  const cppValues = PEOPLE_SEED.map((p) => p.spend / p.deliveryPoints);
  // Efficiency is inverted: cheaper per point ranks higher.
  const efficiencyValues = cppValues.map((value) => -value);

  return PEOPLE_SEED.map((seed, index) => ({
    ...seed,
    id: seed.name.toLowerCase().replace(/[^a-z]/g, "-"),
    costPerPoint: round(seed.spend / seed.deliveryPoints, 2),
    delivery: percentileRank(deliveryValues, seed.deliveryPoints),
    efficiency: percentileRank(efficiencyValues, efficiencyValues[index]),
  }));
})();

export const POSITIONS = [...new Set(people.map((p) => p.position))].sort();
export const TEAMS = [...new Set(people.map((p) => p.team))].sort();
export const LEVELS = ["Junior", "Mid", "Senior", "Staff"];

/* -------------------------------------------------------------------------- */
/* Derived headline figures                                                    */
/* -------------------------------------------------------------------------- */

const recent = weeks.slice(-10);
const recentTotal = recent.reduce((acc, week) => acc + week.total, 0);

export const deliverySummary = {
  totalPoints: 841.9,
  humanPct: 8,
  assistedPct: 12,
  agenticPct: 82,
  weeklyAverage: 90.3,
  /** Kept for reference — the generated series tracks the stated headline. */
  generatedWeeklyAverage: round(recentTotal / recent.length),
};

export const adoptionSummary = {
  aiPct: 85,
  aiWeeklyAverage: 78.3,
  agenticPct: 85,
  agenticWeeklyAverage: 61.9,
  benchmarkMedian: 71.4,
  devsUsingAi: 10,
  activeDevs: 12,
};

export const costSummary = {
  totalCost: 270,
  weeklyAverage: round(
    recent.reduce((acc, week) => acc + week.costTotal, 0) / recent.length,
    2,
  ),
  costPerPoint: 0.95,
  costPerPointWeeklyAverage: 0.2,
};
