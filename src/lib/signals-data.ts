/**
 * Signals — four company metrics, read week by week over six months.
 *
 * A signal is not the latest number. It combines two readings:
 *
 * - **Position**: the average over the focus window — the last four weeks,
 *   or the last quarter — against the target. Never one week, so a single
 *   noisy reading cannot flip a status.
 * - **Trend**: the slope of a straight line fitted through all 26 weeks —
 *   the secular trend. It sets the status; the window's own direction
 *   against the window before (momentum) only changes the wording, so a
 *   four-week dip in a good six months is reported without being alarmed. A metric can sit below target and still be getting
 *   closer, and that is a different message from one sliding away.
 *
 * Everything here is mocked but deterministic, and computed rather than
 * written: the sentence under each signal, the "who" ranking and the plan
 * progress all derive from the same series the charts draw, so the words and
 * the lines can never disagree.
 */

/* -------------------------------------------------------------------------- */
/* Weeks                                                                       */
/* -------------------------------------------------------------------------- */

export const WEEK_COUNT = 26;
/** Weeks of projection drawn past the last reading. */
export const PROJECTION_WEEKS = 12;
/** Index of the last complete week. Plans set "this week" carry LAST + 1. */
export const LAST = WEEK_COUNT - 1;

const DAY = 86_400_000;
/** Monday of the last complete week. */
const LAST_MONDAY = Date.UTC(2026, 9, 26);
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "Oct 26" for a week index; indices past LAST are future weeks. */
export function weekLabel(index: number) {
  const date = new Date(LAST_MONDAY - (LAST - index) * 7 * DAY);
  return `${MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`;
}

export const FIRST_MONTH =
  MONTHS[new Date(LAST_MONDAY - LAST * 7 * DAY).getUTCMonth()];

/**
 * The focus window: how many recent weeks a status averages. Four weeks
 * answers "how are we doing now"; a quarter smooths that into "how did this
 * quarter go". The 26-week trend is the same either way — it is the long
 * view the window is read against.
 */
export const WINDOWS = [
  { value: "4w", weeks: 4, label: "4 weeks", phrase: "last four weeks" },
  { value: "quarter", weeks: 13, label: "Quarter", phrase: "last quarter" },
] as const;

export type WindowValue = (typeof WINDOWS)[number]["value"];
export const DEFAULT_WINDOW = WINDOWS[0];

export function windowOf(value: string | null) {
  return WINDOWS.find((item) => item.value === value) ?? DEFAULT_WINDOW;
}

/* -------------------------------------------------------------------------- */
/* Metrics                                                                     */
/* -------------------------------------------------------------------------- */

export type MetricId = "delivery" | "efficiency" | "cost" | "quality";
export type Better = "higher" | "lower";

export interface Metric {
  id: MetricId;
  /** The pillar, as the product names it. */
  label: string;
  /** The key metric's name in the data model. */
  code: string;
  better: Better;
  target: number;
  /** One sentence for the info tip: what is measured, and which way is good. */
  definition: string;
  /** Unit shown beside the value. */
  unit: string;
  format: (value: number) => string;
  /** An absolute difference, already unsigned. */
  formatDelta: (delta: number) => string;
  /** The analysis behind the signal. Names tribes the data actually ranks. */
  why: string;
  /** The one suggested action. */
  suggestion: string;
  /** The company curve the mock is built around, for t in 0..1. */
  curve: (t: number) => number;
  /**
   * Weeks that departed from the curve — a summer slowdown, an incident —
   * by week index, as a fraction of the target in the better direction.
   */
  events: Record<number, number>;
  /**
   * How each tribe departs from the company, as a fraction of the target in
   * the *better* direction: [level today, improvement across six months].
   */
  tribes: Record<TribeId, [number, number]>;
}

const fixed = (digits: number, suffix: string) => (value: number) =>
  `${value.toFixed(digits)}${suffix}`;

export const METRICS: Metric[] = [
  {
    id: "delivery",
    label: "Delivery",
    code: "delivery_per_hc",
    better: "higher",
    target: 3,
    definition:
      "Delivery points shipped per contributor per week. Higher is better.",
    unit: "pts / contributor / wk",
    format: fixed(1, " pts"),
    formatDelta: fixed(1, " pts"),
    why: "Platform and Mobile ship the most per person since they started splitting large pull requests. The last four weeks dipped across most tribes during the October incident freeze; the six-month trend is intact.",
    suggestion:
      "Share Platform's pull-request splitting guide with Payments, and pair one Platform reviewer with them for a month.",
    curve: (t) => 2.55 + 0.85 * t,
    // Summer slowdown, a strong September, then the October incident freeze:
    // the last four weeks dip while the six-month trend holds.
    events: {
      13: -0.05,
      14: -0.08,
      15: -0.04,
      19: 0.03,
      20: 0.05,
      21: 0.04,
      22: -0.06,
      23: -0.09,
      24: -0.11,
      25: -0.1,
    },
    tribes: {
      platform: [0.12, 0.1],
      mobile: [0.09, 0.06],
      growth: [0.02, 0],
      "core-api": [0, 0.02],
      data: [-0.03, 0.01],
      infra: [-0.05, -0.02],
      payments: [-0.12, -0.02],
    },
  },
  {
    id: "efficiency",
    label: "Efficiency",
    code: "cycle_time_p90",
    better: "lower",
    target: 5,
    definition:
      "Cycle time at the 90th percentile, from first commit to merge. Lower is better.",
    unit: "days, p90",
    format: fixed(1, " d"),
    formatDelta: fixed(1, " d"),
    why: "Pull requests wait less for a first review in Core API and Growth since they started review rotations. Data and Payments still wait two days or more.",
    suggestion:
      "Start a 24-hour first-review rotation in Data and Payments, like the one Core API runs.",
    curve: (t) => (t < 0.8 ? 7.3 - 1.1 * t : 6.42 - 4.4 * (t - 0.8)),
    events: { 9: -0.05, 10: -0.03, 16: 0.04 },
    tribes: {
      "core-api": [0.1, 0.14],
      growth: [0.06, 0.12],
      platform: [0.03, 0.02],
      infra: [0, -0.02],
      mobile: [-0.02, 0],
      payments: [-0.1, -0.02],
      data: [-0.14, -0.04],
    },
  },
  {
    id: "cost",
    label: "Cost",
    code: "cost_per_point",
    better: "lower",
    target: 120,
    definition:
      "Engineering cost per delivery point, the total Finance reports. Lower is better.",
    unit: "per point",
    format: (value) => `$${Math.round(value)}`,
    formatDelta: (delta) => `$${Math.round(delta)}`,
    why: "AI spend grew faster than delivery in Data and Infrastructure since August. Elsewhere it rose more slowly.",
    suggestion:
      "Cap AI agent spend per point in Data and Infrastructure at the company average, and review the cap monthly.",
    curve: (t) => 97 + 17 * t ** 1.6,
    events: { 7: -0.04, 17: -0.05, 18: -0.03 },
    tribes: {
      platform: [0.06, 0.04],
      growth: [0.05, 0.06],
      "core-api": [0.04, 0.06],
      mobile: [0.03, 0.05],
      payments: [0.02, 0.03],
      infra: [-0.09, -0.12],
      data: [-0.12, -0.16],
    },
  },
  {
    id: "quality",
    label: "Quality",
    code: "defect_cost_pct",
    better: "lower",
    target: 12,
    definition:
      "Share of engineering cost spent fixing defects. Lower is better.",
    unit: "of cost",
    format: fixed(1, "%"),
    formatDelta: fixed(1, " pp"),
    why: "Most of the rise comes from Payments and Mobile, after two incident-heavy releases in September. Platform and Core API are rising more slowly.",
    suggestion:
      "Add a release checklist and a rollback drill to Payments and Mobile before their next major release.",
    curve: (t) => 12.3 + 3.5 * t ** 1.2,
    // Two incident-heavy releases in September.
    events: { 8: 0.05, 19: -0.1, 20: -0.07 },
    tribes: {
      "core-api": [0.12, 0.1],
      platform: [0.1, 0.08],
      infra: [0.06, 0.04],
      growth: [0.05, 0.05],
      data: [0, 0.02],
      mobile: [-0.22, -0.18],
      payments: [-0.3, -0.25],
    },
  },
];

export const METRIC_BY_ID = Object.fromEntries(
  METRICS.map((metric) => [metric.id, metric]),
) as Record<MetricId, Metric>;

/** +1 when higher is better. Multiply a raw difference by it to get "better". */
export const sense = (metric: Metric) => (metric.better === "higher" ? 1 : -1);

/* -------------------------------------------------------------------------- */
/* Reading a series                                                            */
/* -------------------------------------------------------------------------- */

export type SignalStatus =
  "on-track" | "at-risk" | "getting-there" | "regressing";

export const STATUS_LABEL: Record<SignalStatus, string> = {
  "on-track": "On track",
  "at-risk": "At risk",
  "getting-there": "Getting there",
  regressing: "Regressing",
};

/** Statuses that are reason to celebrate the people behind them. */
export const CELEBRATES: Record<SignalStatus, boolean> = {
  "on-track": true,
  "getting-there": true,
  "at-risk": false,
  regressing: false,
};

export interface SignalRead {
  status: SignalStatus;
  /** Average over the focus window. */
  recent: number;
  /** recent − target, in the better direction: ≥ 0 is on the good side. */
  gap: number;
  /** Fitted line, raw units: value(i) = intercept + slope · i. */
  intercept: number;
  slope: number;
  /** Slope in the better direction, per week. */
  improving: number;
  /** Weeks until the fitted line crosses the target, when it is heading there. */
  weeksToCross: number | null;
  /** Consecutive weeks, counting back from the last, on the current side. */
  streak: number;
  /** The focus window against the same span at the start, in the better direction. */
  change: number;
  /**
   * The focus window against the window just before it, in the better
   * direction: short-term momentum, read against the six-month trend.
   */
  momentum: number;
  /** Weeks in the focus window the read was taken over. */
  weeks: number;
}

const mean = (values: number[]) =>
  values.reduce((sum, value) => sum + value, 0) / values.length;

export function readSeries(
  series: number[],
  metric: Metric,
  weeks: number = DEFAULT_WINDOW.weeks,
): SignalRead {
  const s = sense(metric);
  const n = series.length;
  const xMean = (n - 1) / 2;
  const yMean = mean(series);
  let num = 0;
  let den = 0;
  series.forEach((y, x) => {
    num += (x - xMean) * (y - yMean);
    den += (x - xMean) ** 2;
  });
  const slope = num / den;
  const intercept = yMean - slope * xMean;

  const recent = mean(series.slice(-weeks));
  const gap = (recent - metric.target) * s;
  const improving = slope * s;
  // Below a tenth of a percent of the target per week, a trend is noise.
  const flat = Math.abs(improving) < metric.target * 0.001;
  const good = gap >= 0;

  const status: SignalStatus = good
    ? improving >= 0 || flat
      ? "on-track"
      : "at-risk"
    : improving > 0 && !flat
      ? "getting-there"
      : "regressing";

  // Where the fitted line meets the target, counted from the last week.
  let weeksToCross: number | null = null;
  if (!flat && slope !== 0) {
    const crossAt = (metric.target - intercept) / slope;
    const ahead = crossAt - (n - 1);
    const heading = status === "getting-there" || status === "at-risk";
    if (heading && ahead > 0) weeksToCross = Math.max(1, Math.round(ahead));
  }

  let streak = 0;
  for (let i = n - 1; i >= 0; i -= 1) {
    if ((series[i] - metric.target) * s >= 0 !== good) break;
    streak += 1;
  }

  const change = (recent - mean(series.slice(0, weeks))) * s;
  const before = series.slice(Math.max(0, n - 2 * weeks), n - weeks);
  const momentum = before.length ? (recent - mean(before)) * s : 0;

  return {
    status,
    recent,
    gap,
    intercept,
    slope,
    improving,
    weeksToCross,
    streak,
    change,
    momentum,
    weeks,
  };
}

/**
 * What `change` is measured against, in words. Over four weeks it is the
 * start of the six months; over a quarter it is the quarter before, since
 * the first 13 of the 26 weeks are exactly that.
 */
const baseline = (read: SignalRead) =>
  read.weeks >= 13 ? "than last quarter" : `than in ${FIRST_MONTH}`;

const goodSide = (metric: Metric) =>
  metric.better === "higher" ? "above target" : "under target";
const badSide = (metric: Metric) =>
  metric.better === "higher" ? "below target" : "over target";
const capitalise = (text: string) => text[0].toUpperCase() + text.slice(1);

/** The one line under a signal. Computed, so it always matches the chart. */
export function signalLine(metric: Metric, read: SignalRead): string {
  const distance = metric.formatDelta(Math.abs(read.gap));

  // When the focus window moves against the six-month trend, say so — but
  // in the line, not the status. A dip is news; it is not yet a regression.
  const trending = Math.abs(read.improving) >= metric.target * 0.001;
  const turn = metric.target * 0.02;
  const lately = `${metric.formatDelta(Math.abs(read.momentum))} ${read.momentum >= 0 ? "better" : "worse"} than ${read.weeks >= 13 ? "the quarter before" : "the four weeks before"}`;
  if (trending && read.improving > 0 && read.momentum < -turn) {
    return read.gap >= 0
      ? `${capitalise(goodSide(metric))} and improving over six months, but ${lately}.`
      : `${distance} ${badSide(metric)} and closing over six months, but ${lately}.`;
  }
  if (trending && read.improving < 0 && read.momentum > turn) {
    return read.gap >= 0
      ? `${capitalise(goodSide(metric))} but slipping over six months, though ${lately}.`
      : `${distance} ${badSide(metric)} and moving away over six months, though ${lately}.`;
  }

  switch (read.status) {
    case "on-track":
      return read.streak >= WEEK_COUNT
        ? `${capitalise(goodSide(metric))} all six months, and still improving.`
        : `${capitalise(goodSide(metric))} for ${read.streak} straight weeks, and still improving.`;
    case "getting-there":
      return read.weeksToCross !== null && read.weeksToCross <= 26
        ? `${distance} ${badSide(metric)}, but closing — on pace to reach it around ${weekLabel(LAST + read.weeksToCross)}.`
        : `${distance} ${badSide(metric)}, but closing slowly.`;
    case "at-risk":
      return read.weeksToCross !== null && read.weeksToCross <= 26
        ? `${capitalise(goodSide(metric))}, but slipping — on pace to cross it around ${weekLabel(LAST + read.weeksToCross)}.`
        : `${capitalise(goodSide(metric))}, but slipping.`;
    case "regressing":
      return `${distance} ${badSide(metric)} and moving away — ${metric.formatDelta(Math.abs(read.change))} worse ${baseline(read)}.`;
  }
}

/* -------------------------------------------------------------------------- */
/* The organisation                                                            */
/* -------------------------------------------------------------------------- */

export type TribeId =
  "platform" | "payments" | "growth" | "data" | "mobile" | "core-api" | "infra";

export type OrgLevel = "company" | "tribe" | "team" | "person";

export interface OrgNode {
  id: string;
  name: string;
  level: OrgLevel;
  parentId: string | null;
  children: string[];
  headcount: number;
  /** People only: "Senior · Backend". */
  role?: string;
  series: Record<MetricId, number[]>;
}

const TRIBES: { id: TribeId; name: string; teams: string[] }[] = [
  {
    id: "platform",
    name: "Platform",
    teams: [
      "Identity",
      "Gateway",
      "Search",
      "Notifications",
      "Feature Flags",
      "Storage",
      "Billing Engine",
      "Audit",
      "Permissions",
      "Webhooks",
      "Rate Limits",
      "Config",
      "Scheduler",
      "Files",
      "Email",
      "Localization",
      "Admin Tools",
      "SDKs",
      "Developer Portal",
      "Sandbox",
      "Migrations",
      "Service Mesh",
    ],
  },
  {
    id: "payments",
    name: "Payments",
    teams: [
      "Checkout",
      "Ledger",
      "Payouts",
      "Fraud",
      "Disputes",
      "Invoicing",
      "Tax",
      "Cards",
      "Wallets",
      "Reconciliation",
      "Pricing",
      "Subscriptions",
      "Refunds",
      "Treasury",
      "Risk Models",
      "Compliance",
      "FX",
      "Merchant Onboarding",
      "Settlements",
      "Chargebacks",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    teams: [
      "Onboarding",
      "Activation",
      "Referrals",
      "Lifecycle",
      "Experiments",
      "Pricing Page",
      "Trials",
      "Retention",
      "SEO",
      "Landing Pages",
      "Paywall",
      "Attribution",
      "Messaging",
      "Upsell",
      "Surveys",
      "Win-back",
      "Partnerships",
      "Marketplace",
    ],
  },
  {
    id: "data",
    name: "Data",
    teams: [
      "Warehouse",
      "Pipelines",
      "Metrics Layer",
      "ML Platform",
      "Forecasting",
      "Recommendations",
      "Data Quality",
      "Streaming",
      "Catalog",
      "Privacy",
      "Feature Store",
      "Experiment Analysis",
      "BI Tools",
      "Ingestion",
      "Lineage",
      "Embeddings",
      "Labeling",
      "Query Engine",
      "Reverse ETL",
    ],
  },
  {
    id: "mobile",
    name: "Mobile",
    teams: [
      "iOS Core",
      "Android Core",
      "Mobile Checkout",
      "Offline Sync",
      "Push",
      "App Shell",
      "Design System Mobile",
      "Media",
      "Maps",
      "Camera",
      "Widgets",
      "Accessibility",
      "Performance",
      "Release Train",
      "Deep Links",
      "In-app Chat",
      "Mobile Auth",
      "Tablets",
      "Watch",
      "Mobile Analytics",
      "Crash Reporting",
    ],
  },
  {
    id: "core-api",
    name: "Core API",
    teams: [
      "Accounts",
      "Orders",
      "Catalog API",
      "Inventory",
      "Shipping",
      "Returns",
      "Reviews",
      "Pricing API",
      "Search API",
      "GraphQL",
      "Public API",
      "Partners API",
      "Events",
      "Cart",
      "Promotions",
      "Gift Cards",
      "Loyalty",
      "Addresses",
      "Contracts",
      "Quotes",
    ],
  },
  {
    id: "infra",
    name: "Infrastructure",
    teams: [
      "Compute",
      "Networking",
      "Databases",
      "Observability",
      "CI",
      "Build Tools",
      "Edge",
      "Secrets",
      "Cost Ops",
      "Kubernetes",
      "Incident Response",
      "Backups",
      "Queues",
      "Caching",
      "Developer Environments",
      "Security Ops",
      "Load Testing",
    ],
  },
];

const FIRST_NAMES = [
  "Aisha",
  "Daniel",
  "Elena",
  "Tomas",
  "Sofia",
  "Mara",
  "Marcus",
  "Priya",
  "Kenji",
  "Nour",
  "Lucas",
  "Ingrid",
  "Omar",
  "Hana",
  "Mateo",
  "Zara",
  "Felix",
  "Amara",
  "Jonas",
  "Leila",
  "Ravi",
  "Chloe",
  "Diego",
  "Yuki",
  "Noah",
  "Freya",
  "Samir",
  "Lena",
  "Arjun",
  "Mila",
  "Theo",
  "Ines",
  "Kwame",
  "Astrid",
  "Rafael",
  "Sana",
  "Emil",
  "Nadia",
  "Hugo",
  "Maya",
  "Idris",
  "Clara",
  "Viktor",
  "Aiko",
  "Bruno",
  "Lucia",
  "Tariq",
  "Elif",
  "Oscar",
  "Rosa",
  "Kai",
  "Nina",
  "Pablo",
  "Saoirse",
  "Ezra",
  "Malia",
  "Anton",
  "Imani",
  "Leon",
  "Vera",
];
const LAST_INITIALS = "ABCDEFGHIJKLMNOPRSTVWZ";
const LEVELS = ["Junior", "Mid", "Mid", "Senior", "Senior", "Staff"];
const POSITIONS = [
  "Backend",
  "Backend",
  "Frontend",
  "Full-stack",
  "Mobile",
  "Data",
  "Infra",
];

/** Seeded PRNG, so the mock is identical on every load and on the server. */
function rng(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Roughly normal, mean 0, sd 1. */
const gauss = (next: () => number) =>
  (next() + next() + next() + next() - 2) * 1.73;

/**
 * Week-to-week swings that carry over: a good week tends to follow a good
 * week. Independent noise would average away in a company of 1,500 and leave
 * every line unrealistically smooth; this keeps the bumps at every level.
 */
function wobble(next: () => number, sd: number, carry = 0.45) {
  let e = 0;
  return Array.from(
    { length: WEEK_COUNT },
    () => (e = carry * e + gauss(next) * sd),
  );
}

type Offset = [number, number];

/** Shift offsets so their headcount-weighted mean is zero. */
function centre(offsets: Offset[], weights: number[]): Offset[] {
  const total = weights.reduce((a, b) => a + b, 0);
  const level = offsets.reduce((a, o, i) => a + o[0] * weights[i], 0) / total;
  const slope = offsets.reduce((a, o, i) => a + o[1] * weights[i], 0) / total;
  return offsets.map(([l, s]) => [l - level, s - slope]);
}

function buildOrg(): Map<string, OrgNode> {
  const nodes = new Map<string, OrgNode>();
  const company: OrgNode = {
    id: "company",
    name: "Company",
    level: "company",
    parentId: null,
    children: [],
    headcount: 0,
    series: {} as OrgNode["series"],
  };
  nodes.set(company.id, company);

  // Structure first: tribes, teams, people.
  const peopleByTeam = new Map<string, OrgNode[]>();
  for (const tribe of TRIBES) {
    const tribeNode: OrgNode = {
      id: tribe.id,
      name: tribe.name,
      level: "tribe",
      parentId: company.id,
      children: [],
      headcount: 0,
      series: {} as OrgNode["series"],
    };
    nodes.set(tribeNode.id, tribeNode);
    company.children.push(tribeNode.id);

    for (const teamName of tribe.teams) {
      const teamId = `${tribe.id}/${teamName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      const next = rng(teamId);
      const size = 8 + Math.floor(next() * 7);
      const teamNode: OrgNode = {
        id: teamId,
        name: teamName,
        level: "team",
        parentId: tribeNode.id,
        children: [],
        headcount: size,
        series: {} as OrgNode["series"],
      };
      nodes.set(teamId, teamNode);
      tribeNode.children.push(teamId);

      const members: OrgNode[] = [];
      for (let p = 0; p < size; p += 1) {
        const first = FIRST_NAMES[Math.floor(next() * FIRST_NAMES.length)];
        const initial =
          LAST_INITIALS[Math.floor(next() * LAST_INITIALS.length)];
        const person: OrgNode = {
          id: `${teamId}/${p}`,
          name: `${first} ${initial}.`,
          level: "person",
          parentId: teamId,
          children: [],
          headcount: 1,
          role: `${LEVELS[Math.floor(next() * LEVELS.length)]} · ${POSITIONS[Math.floor(next() * POSITIONS.length)]}`,
          series: {} as OrgNode["series"],
        };
        nodes.set(person.id, person);
        teamNode.children.push(person.id);
        members.push(person);
      }
      peopleByTeam.set(teamId, members);
      tribeNode.headcount += size;
    }
    company.headcount += tribeNode.headcount;
  }

  // Then every person's series: the company curve, plus their tribe's,
  // team's and own departures. Each layer is centred on its parent, so the
  // aggregates below land back on the designed curve.
  for (const metric of METRICS) {
    const s = sense(metric);
    const scale = metric.target;
    const base = Array.from({ length: WEEK_COUNT }, (_, i) =>
      metric.curve(i / LAST),
    );
    const companySwing = wobble(rng(`${metric.id}/company`), 0.028);
    const companyCurve = base.map(
      (value, i) =>
        value + s * scale * (metric.events[i] ?? 0) + scale * companySwing[i],
    );

    const tribeIds = company.children;
    const tribeOffsets = centre(
      tribeIds.map((id) => metric.tribes[id as TribeId]),
      tribeIds.map((id) => nodes.get(id)!.headcount),
    );

    tribeIds.forEach((tribeId, ti) => {
      const tribe = nodes.get(tribeId)!;
      const tribeSwing = wobble(rng(`${metric.id}/${tribeId}/swing`), 0.03);
      const teamRng = rng(`${metric.id}/${tribeId}`);
      const teamOffsets = centre(
        tribe.children.map(() => [
          gauss(teamRng) * 0.07,
          gauss(teamRng) * 0.05,
        ]),
        tribe.children.map((id) => nodes.get(id)!.headcount),
      );

      tribe.children.forEach((teamId, mi) => {
        const members = peopleByTeam.get(teamId)!;
        const teamSwing = wobble(rng(`${metric.id}/${teamId}/swing`), 0.04);
        const personRng = rng(`${metric.id}/${teamId}`);
        const personOffsets = centre(
          members.map(() => [gauss(personRng) * 0.16, gauss(personRng) * 0.08]),
          members.map(() => 1),
        );
        members.forEach((person, pi) => {
          const level =
            tribeOffsets[ti][0] + teamOffsets[mi][0] + personOffsets[pi][0];
          const gain =
            tribeOffsets[ti][1] + teamOffsets[mi][1] + personOffsets[pi][1];
          const noise = rng(`${metric.id}/${person.id}`);
          person.series[metric.id] = companyCurve.map((value, i) => {
            // `gain` is the extra improvement across six months, so the
            // departure is smaller in the past by that much.
            const departure = level + gain * (i / LAST - 1);
            const swing = tribeSwing[i] + teamSwing[i] + gauss(noise) * 0.08;
            const raw = value + s * scale * departure + scale * swing;
            return Math.max(scale * 0.05, raw);
          });
        });
      });
    });
  }

  // Aggregates, bottom up: a node is the headcount-weighted mean of its children.
  const aggregate = (node: OrgNode) => {
    if (node.level === "person") return;
    node.children.forEach((id) => aggregate(nodes.get(id)!));
    for (const metric of METRICS) {
      node.series[metric.id] = Array.from({ length: WEEK_COUNT }, (_, i) => {
        let sum = 0;
        for (const id of node.children) {
          const child = nodes.get(id)!;
          sum += child.series[metric.id][i] * child.headcount;
        }
        return sum / node.headcount;
      });
    }
  };
  aggregate(company);

  return nodes;
}

let org: Map<string, OrgNode> | null = null;

export function getOrg() {
  org ??= buildOrg();
  return org;
}

export function getNode(id: string) {
  const node = getOrg().get(id);
  if (!node) throw new Error(`Unknown org node: ${id}`);
  return node;
}

/** Company › Tribe › Team, for a breadcrumb. */
export function pathTo(id: string): OrgNode[] {
  const path: OrgNode[] = [];
  let node: OrgNode | undefined = getNode(id);
  while (node) {
    path.unshift(node);
    node = node.parentId ? getNode(node.parentId) : undefined;
  }
  return path;
}

/* -------------------------------------------------------------------------- */
/* Who                                                                         */
/* -------------------------------------------------------------------------- */

export interface Ranked {
  node: OrgNode;
  read: SignalRead;
}

export function readChildren(
  id: string,
  metric: Metric,
  weeks: number = DEFAULT_WINDOW.weeks,
): Ranked[] {
  return getNode(id).children.map((childId) => {
    const node = getNode(childId);
    return { node, read: readSeries(node.series[metric.id], metric, weeks) };
  });
}

/**
 * The heading over the "who" list, and how it ranks. Celebrating statuses
 * rank by what went right; the others by where the gap comes from.
 */
export const WHO_HEADING: Record<SignalStatus, string> = {
  "on-track": "Leading the way",
  "getting-there": "Driving the improvement",
  "at-risk": "Slipping most",
  regressing: "Most of the gap",
};

export function rankFor(status: SignalStatus, items: Ranked[]): Ranked[] {
  const by = (score: (r: Ranked) => number) =>
    [...items].sort((a, b) => score(b) - score(a));
  switch (status) {
    case "on-track":
      return by((r) => r.read.gap);
    case "getting-there":
      return by((r) => r.read.change);
    case "at-risk":
      return by((r) => -r.read.change);
    case "regressing":
      // Share of the gap: a big tribe a little behind outweighs a small one far behind.
      return by((r) => -r.read.gap * r.node.headcount);
  }
}

/** The short fact beside a name in the "who" list. */
export function whoFact(
  status: SignalStatus,
  metric: Metric,
  read: SignalRead,
) {
  switch (status) {
    case "on-track":
    case "regressing":
      return `${metric.formatDelta(Math.abs(read.gap))} ${read.gap >= 0 ? goodSide(metric) : badSide(metric)}`;
    case "getting-there":
    case "at-risk":
      return `${metric.formatDelta(Math.abs(read.change))} ${read.change >= 0 ? "better" : "worse"} ${baseline(read)}`;
  }
}

/* -------------------------------------------------------------------------- */
/* Plan                                                                        */
/* -------------------------------------------------------------------------- */

export interface PlanItem {
  text: string;
  /** Week index the action was set in. LAST + 1 is the current, open week. */
  setWeek: number;
}

export type Plan = Partial<Record<MetricId, PlanItem>>;

/** What the prototype opens with: one action working, one too new to read. */
export const SEED_PLAN: Plan = {
  efficiency: {
    text: "Start a 24-hour first-review rotation in Data and Payments, like the one Core API runs.",
    setWeek: LAST - 5,
  },
  quality: {
    text: "Add a release checklist and a rollback drill to Payments and Mobile before their next major release.",
    setWeek: LAST - 1,
  },
};

export type PlanState = "new" | "working" | "stalled";

export interface PlanProgress {
  state: PlanState;
  line: string;
}

export const PLAN_STATE_LABEL: Record<PlanState, string> = {
  new: "Too early to tell",
  working: "Working",
  stalled: "Not moving yet",
};

/**
 * How an action is doing: the metric now against the week it was set, both
 * smoothed over three weeks. Two weeks is the least that says anything.
 */
export function planProgress(
  metric: Metric,
  series: number[],
  item: PlanItem,
): PlanProgress {
  const weeks = LAST - item.setWeek;
  const since = weekLabel(Math.min(item.setWeek, LAST + 1));
  if (weeks < 2) {
    return {
      state: "new",
      line:
        weeks < 0
          ? "Set this week — first reading next Monday."
          : `Set ${since} — first reading next week.`,
    };
  }
  const s = sense(metric);
  const before = mean(
    series.slice(Math.max(0, item.setWeek - 2), item.setWeek + 1),
  );
  const now = mean(series.slice(-3));
  const delta = (now - before) * s;
  if (delta <= metric.target * 0.01) {
    return { state: "stalled", line: `No improvement yet since ${since}.` };
  }
  const gapAtSet = (before - metric.target) * s;
  const closed =
    gapAtSet < 0 ? Math.min(100, Math.round((delta / -gapAtSet) * 100)) : null;
  return {
    state: "working",
    line:
      closed !== null
        ? `${metric.formatDelta(delta)} better since ${since} — ${closed}% of the gap closed.`
        : `${metric.formatDelta(delta)} better since ${since}.`,
  };
}
