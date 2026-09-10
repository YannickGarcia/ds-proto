/**
 * Sample dataset for the Integrations area. Placeholder org "Acme"; every
 * value is invented, none is a real account.
 */

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                   */
/* -------------------------------------------------------------------------- */

export const CATEGORIES = [
  {
    id: "code-repositories",
    label: "Code repositories",
    blurb:
      "Pull requests, reviews, commits and branch activity. This is what delivery and review metrics are built from.",
  },
  {
    id: "tickets-tracking",
    label: "Tickets tracking",
    blurb:
      "Issues, epics and sprint state, so delivery can be attributed to planned work rather than raw commits.",
  },
  {
    id: "coding-ai-assistants",
    label: "Coding AI assistants",
    blurb:
      "Accepted suggestions, token usage and agent sessions — the basis of every AI adoption and cost figure.",
  },
  {
    id: "documents",
    label: "Documents",
    blurb: "Specs and design docs, linked to the work that implements them.",
  },
  {
    id: "code-coverage",
    label: "Code coverage",
    blurb: "Coverage deltas per pull request, to weigh delivery against risk.",
  },
  {
    id: "code-quality",
    label: "Code quality",
    blurb: "Static analysis findings and quality gates alongside review data.",
  },
  {
    id: "collaboration",
    label: "Collaboration",
    blurb: "Delivers digests and alerts where the team already works.",
  },
  {
    id: "calendars",
    label: "Calendars",
    blurb: "Meeting load, used to separate focus time from collaboration time.",
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export type HealthState = "working" | "attention" | "disabled";

export interface ConnectedIntegration {
  id: string;
  name: string;
  category: CategoryId;
  href: string;
  health: HealthState;
  /** Shown in the badge tooltip when the state is not "working". */
  healthReason?: string;
  status?: { severity: "warning" | "error"; message: string };
  /** Self-hosted providers can take additional instances. */
  selfHostable?: boolean;
  /** A self-hosted instance exists but the cloud account is not connected. */
  needsOAuth?: boolean;
}

export const CONNECTED: ConnectedIntegration[] = [
  {
    id: "github",
    name: "GitHub",
    category: "code-repositories",
    href: "/integrations/github",
    health: "working",
    selfHostable: true,
  },
  {
    id: "gitlab",
    name: "GitLab",
    category: "code-repositories",
    href: "/integrations/github",
    health: "attention",
    healthReason: "3 of 14 repositories could not be fetched in the last run.",
    status: { severity: "warning", message: "Partial sync — 3 repositories skipped" },
    selfHostable: true,
    needsOAuth: true,
  },
  {
    id: "jira",
    name: "Jira",
    category: "tickets-tracking",
    href: "/integrations/github",
    health: "working",
  },
  {
    id: "cursor",
    name: "Cursor",
    category: "coding-ai-assistants",
    href: "/integrations/github",
    health: "working",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    category: "coding-ai-assistants",
    href: "/integrations/github",
    health: "disabled",
    healthReason: "Paused by an administrator on 12 Aug.",
  },
  {
    id: "notion",
    name: "Notion",
    category: "documents",
    href: "/integrations/github",
    health: "attention",
    healthReason: "The OAuth token expired 2 days ago.",
    status: { severity: "error", message: "Login expired – sync paused" },
  },
  {
    id: "codecov",
    name: "Codecov",
    category: "code-coverage",
    href: "/integrations/github",
    health: "working",
  },
  {
    id: "slack",
    name: "Slack",
    category: "collaboration",
    href: "/integrations/github",
    health: "working",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "calendars",
    href: "/integrations/github",
    health: "working",
  },
];

export interface AvailableIntegration {
  id: string;
  name: string;
  category: CategoryId;
  blurb: string;
  enterpriseOnly?: boolean;
  /** Renders a split button with alternative connection methods. */
  altMethods?: string[];
  /** Renders the provider's own branded button. */
  branded?: boolean;
  disabledReason?: string;
}

export const AVAILABLE: AvailableIntegration[] = [
  {
    id: "bitbucket",
    name: "Bitbucket",
    category: "code-repositories",
    blurb: "Bring Bitbucket pull requests into the same delivery view as your other repositories.",
    altMethods: ["Connect with API token", "Connect a self-hosted server"],
  },
  {
    id: "linear",
    name: "Linear",
    category: "tickets-tracking",
    blurb: "Attribute delivery to Linear issues and cycles, and see scope change mid-cycle.",
  },
  {
    id: "github-projects",
    name: "GitHub Projects",
    category: "tickets-tracking",
    blurb: "Use Projects boards as the planning source when you already track work in GitHub.",
  },
  {
    id: "youtrack",
    name: "YouTrack",
    category: "tickets-tracking",
    blurb: "Sync YouTrack issues and agile boards for teams standardised on JetBrains tooling.",
    enterpriseOnly: true,
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "coding-ai-assistants",
    blurb: "Measure accepted suggestions per developer and the share of merged AI-written lines.",
  },
  {
    id: "devin",
    name: "Devin",
    category: "coding-ai-assistants",
    blurb: "Track agent sessions and attribute their delivery and spend to the person who ran them.",
    altMethods: ["Connect with API token"],
  },
  {
    id: "gemini-code-assist",
    name: "Gemini Code Assist",
    category: "coding-ai-assistants",
    blurb: "Capture Gemini usage across the org, including token spend per model.",
  },
  {
    id: "openai-codex",
    name: "OpenAI Codex",
    category: "coding-ai-assistants",
    blurb: "Bring Codex sessions into the model-fit and cost-per-point breakdowns.",
  },
  {
    id: "cline",
    name: "Cline",
    category: "coding-ai-assistants",
    blurb: "Record Cline agent runs and the code they merge.",
  },
  {
    id: "aws-bedrock",
    name: "AWS Bedrock",
    category: "coding-ai-assistants",
    blurb: "Attribute Bedrock model spend to teams and repositories.",
    enterpriseOnly: true,
    disabledReason: "Available on the Enterprise plan.",
  },
  {
    id: "confluence",
    name: "Confluence",
    category: "documents",
    blurb: "Link specs and RFCs to the pull requests that implement them.",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    category: "documents",
    blurb: "Surface design docs alongside the delivery they informed.",
  },
  {
    id: "sonarcloud",
    name: "SonarCloud",
    category: "code-quality",
    blurb: "Read quality gates and new-code findings per pull request.",
  },
  {
    id: "microsoft-teams",
    name: "Microsoft Teams",
    category: "collaboration",
    blurb: "Post weekly digests and health alerts into a Teams channel.",
  },
  {
    id: "google-chat",
    name: "Google Chat",
    category: "collaboration",
    blurb: "Send digests and alerts to a Google Chat space.",
    disabledReason: "Your plan allows one collaboration integration.",
  },
  {
    id: "microsoft-365-calendar",
    name: "Microsoft 365 Calendar",
    category: "calendars",
    blurb: "Measure meeting load for teams on Microsoft 365.",
  },
];

/** Slack ships a branded "Add to Slack" button; it is already connected here. */
export const BRANDED_PROVIDERS = new Set(["slack", "microsoft-teams"]);

/* -------------------------------------------------------------------------- */
/* GitHub instances                                                            */
/* -------------------------------------------------------------------------- */

export interface Instance {
  id: string;
  label: string;
  kind: "cloud" | "self-hosted";
  urls: { internal?: string; public: string };
  credential: { state: "ok" | "expired" | "loading"; label: string };
}

export const INSTANCES: Instance[] = [
  {
    id: "cloud",
    label: "Default",
    kind: "cloud",
    urls: { public: "github.com/acme" },
    credential: { state: "ok", label: "Token OK" },
  },
  {
    id: "ghes-eu",
    label: "Acme Enterprise (EU)",
    kind: "self-hosted",
    urls: { internal: "git.internal.acme.eu", public: "git.acme.eu" },
    credential: { state: "ok", label: "Token OK" },
  },
  {
    id: "ghes-labs",
    label: "Acme Labs",
    kind: "self-hosted",
    urls: { internal: "ghe.labs.acme.dev", public: "ghe.labs.acme.dev" },
    credential: { state: "expired", label: "Token expired" },
  },
];

/* -------------------------------------------------------------------------- */
/* Repositories                                                                */
/* -------------------------------------------------------------------------- */

export interface Repository {
  id: string;
  instanceId: string;
  owner: string;
  name: string;
  prsDownloaded: number;
  prsTotal: number;
  syncedUntil: string;
  lastFetch: string;
  lastCommit: string | null;
  autoSync: boolean;
  autoSyncNote?: string;
  syncing?: boolean;
  stale?: boolean;
  warning?: string;
}

export const REPOSITORIES: Repository[] = [
  { id: "r1", instanceId: "cloud", owner: "acme", name: "web-app", prsDownloaded: 1284, prsTotal: 1284, syncedUntil: "10 Sep 2026, 04:12", lastFetch: "2 hours ago", lastCommit: "3 hours ago", autoSync: true },
  { id: "r2", instanceId: "cloud", owner: "acme", name: "api", prsDownloaded: 962, prsTotal: 962, syncedUntil: "10 Sep 2026, 04:12", lastFetch: "2 hours ago", lastCommit: "5 hours ago", autoSync: true },
  { id: "r3", instanceId: "cloud", owner: "acme", name: "design-system", prsDownloaded: 341, prsTotal: 418, syncedUntil: "10 Sep 2026, 01:40", lastFetch: "4 hours ago", lastCommit: "1 day ago", autoSync: true, syncing: true },
  { id: "r4", instanceId: "cloud", owner: "acme", name: "infra", prsDownloaded: 208, prsTotal: 208, syncedUntil: "9 Sep 2026, 22:05", lastFetch: "8 hours ago", lastCommit: "2 days ago", autoSync: false, autoSyncNote: "Turned off automatically after 30 days without activity." },
  { id: "r5", instanceId: "cloud", owner: "acme", name: "docs", prsDownloaded: 87, prsTotal: 132, syncedUntil: "8 Sep 2026, 11:20", lastFetch: "1 day ago", lastCommit: "6 days ago", autoSync: true, warning: "Rate limited by GitHub — the remaining pull requests resume at 06:00 UTC." },
  { id: "r6", instanceId: "cloud", owner: "acme-labs", name: "prototype-kit", prsDownloaded: 44, prsTotal: 44, syncedUntil: "10 Sep 2026, 03:55", lastFetch: "3 hours ago", lastCommit: "4 days ago", autoSync: true },
  { id: "r7", instanceId: "cloud", owner: "acme-labs", name: "legacy-dashboard", prsDownloaded: 512, prsTotal: 512, syncedUntil: "2 Mar 2024, 09:14", lastFetch: "2 years ago", lastCommit: null, autoSync: false, autoSyncNote: "Archived on GitHub.", stale: true },
  { id: "r8", instanceId: "ghes-eu", owner: "platform", name: "billing-service", prsDownloaded: 673, prsTotal: 673, syncedUntil: "10 Sep 2026, 04:02", lastFetch: "2 hours ago", lastCommit: "7 hours ago", autoSync: true },
  { id: "r9", instanceId: "ghes-eu", owner: "platform", name: "ledger", prsDownloaded: 0, prsTotal: 291, syncedUntil: "—", lastFetch: "2 hours ago", lastCommit: "1 day ago", autoSync: true, warning: "Missing access — the service account cannot read this repository." },
  { id: "r10", instanceId: "ghes-eu", owner: "data", name: "warehouse", prsDownloaded: 156, prsTotal: 156, syncedUntil: "9 Sep 2026, 19:30", lastFetch: "11 hours ago", lastCommit: "3 days ago", autoSync: true, stale: true },
];

/* -------------------------------------------------------------------------- */
/* Pull requests                                                               */
/* -------------------------------------------------------------------------- */

export type PrState = "open" | "merged" | "closed" | "draft";

export interface PullRequest {
  id: number;
  state: PrState;
  author: string;
  authorUnlinked?: boolean;
  title: string;
  source: string;
  target: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  downloadedAt: string;
}

export const PULL_REQUESTS: PullRequest[] = [
  { id: 4821, state: "merged", author: "Aisha K.", title: "Move the delivery split chart onto the shared card chrome", source: "feat/chart-card", target: "main", createdAt: "8 Sep, 09:12", updatedAt: "9 Sep, 14:02", resolvedAt: "9 Sep, 14:02", downloadedAt: "9 Sep, 14:09" },
  { id: 4820, state: "open", author: "Tomas L.", title: "Add rate-limit backoff to the repository fetcher", source: "fix/rate-limit", target: "main", createdAt: "8 Sep, 08:40", updatedAt: "10 Sep, 07:55", resolvedAt: null, downloadedAt: "10 Sep, 08:01" },
  { id: 4818, state: "draft", author: "Priya N.", title: "Spike: incremental sync for very large repositories", source: "spike/incremental-sync", target: "main", createdAt: "7 Sep, 16:22", updatedAt: "9 Sep, 11:30", resolvedAt: null, downloadedAt: "9 Sep, 11:36" },
  { id: 4815, state: "merged", author: "Aisha K.", title: "Tighten the card gutter to 20px across every surface", source: "chore/gutter", target: "main", createdAt: "6 Sep, 13:05", updatedAt: "7 Sep, 10:18", resolvedAt: "7 Sep, 10:18", downloadedAt: "7 Sep, 10:25" },
  { id: 4811, state: "closed", author: "Marcus O.", authorUnlinked: true, title: "Experiment with a bento layout for the summary tab", source: "exp/bento", target: "main", createdAt: "5 Sep, 11:44", updatedAt: "6 Sep, 09:02", resolvedAt: "6 Sep, 09:02", downloadedAt: "6 Sep, 09:11" },
  { id: 4809, state: "merged", author: "Tomas L.", title: "Fix the doubled top border on raised surfaces", source: "fix/double-border", target: "main", createdAt: "4 Sep, 15:30", updatedAt: "5 Sep, 08:47", resolvedAt: "5 Sep, 08:47", downloadedAt: "5 Sep, 08:52" },
  { id: 4804, state: "merged", author: "Elena V.", title: "Teach tailwind-merge about the custom type scale", source: "fix/tw-merge", target: "main", createdAt: "3 Sep, 10:02", updatedAt: "4 Sep, 12:15", resolvedAt: "4 Sep, 12:15", downloadedAt: "4 Sep, 12:20" },
  { id: 4799, state: "open", author: "Elena V.", title: "Document the brand tint dials in the design system", source: "docs/brand-tint", target: "release/2026.09", createdAt: "2 Sep, 09:18", updatedAt: "10 Sep, 06:40", resolvedAt: null, downloadedAt: "10 Sep, 06:44" },
];

/* -------------------------------------------------------------------------- */
/* Sync log                                                                    */
/* -------------------------------------------------------------------------- */

export type SyncStatus =
  | "in-progress"
  | "completed"
  | "failed"
  | "retrying"
  | "unknown";

export interface SyncRun {
  id: string;
  provider: string;
  resource: string;
  organization: string;
  rangeFrom: string;
  rangeTo: string;
  startedAt: string;
  updatedAt: string;
  status: SyncStatus;
  message?: string;
  errors?: string[];
  skips?: string[];
}

export const SYNC_RUNS: SyncRun[] = [
  { id: "s1", provider: "github", resource: "acme/web-app", organization: "acme", rangeFrom: "1 Sep 2026", rangeTo: "10 Sep 2026", startedAt: "10 Sep, 04:00", updatedAt: "10 Sep, 04:12", status: "completed" },
  { id: "s2", provider: "github", resource: "acme/design-system", organization: "acme", rangeFrom: "1 Sep 2026", rangeTo: "10 Sep 2026", startedAt: "10 Sep, 04:00", updatedAt: "10 Sep, 08:14", status: "in-progress" },
  { id: "s3", provider: "github", resource: "acme/docs", organization: "acme", rangeFrom: "1 Aug 2026", rangeTo: "10 Sep 2026", startedAt: "10 Sep, 03:40", updatedAt: "10 Sep, 05:02", status: "retrying", message: "Paused by GitHub rate limits. The run resumes automatically when the quota resets." },
  { id: "s4", provider: "github", resource: "platform/ledger", organization: "platform", rangeFrom: "1 Sep 2026", rangeTo: "10 Sep 2026", startedAt: "10 Sep, 03:20", updatedAt: "10 Sep, 03:21", status: "failed", message: "We could not read this repository. Check that the service account still has access.", errors: ["403 Forbidden — resource not accessible by integration", "Retry 3 of 3 exhausted"], skips: ["412 pull requests skipped"] },
  { id: "s5", provider: "gitlab", resource: "acme/mobile", organization: "acme", rangeFrom: "1 Sep 2026", rangeTo: "9 Sep 2026", startedAt: "9 Sep, 22:00", updatedAt: "9 Sep, 22:31", status: "completed" },
  { id: "s6", provider: "gitlab", resource: "acme/mobile-web", organization: "acme", rangeFrom: "1 Sep 2026", rangeTo: "9 Sep 2026", startedAt: "9 Sep, 22:00", updatedAt: "9 Sep, 22:04", status: "failed", message: "The GitLab login expired. Re-connect the integration to resume syncing.", errors: ["401 Unauthorized — token revoked"], skips: [] },
  { id: "s7", provider: "jira", resource: "ACME board", organization: "acme", rangeFrom: "1 Sep 2026", rangeTo: "10 Sep 2026", startedAt: "10 Sep, 02:00", updatedAt: "10 Sep, 02:26", status: "completed" },
  { id: "s8", provider: "github", resource: "acme-labs/prototype-kit", organization: "acme-labs", rangeFrom: "1 Sep 2026", rangeTo: "10 Sep 2026", startedAt: "10 Sep, 03:55", updatedAt: "10 Sep, 03:58", status: "completed" },
  { id: "s9", provider: "github", resource: "data/warehouse", organization: "data", rangeFrom: "1 Aug 2026", rangeTo: "9 Sep 2026", startedAt: "9 Sep, 19:00", updatedAt: "9 Sep, 19:30", status: "unknown", message: "The run stopped reporting. It will be retried on the next schedule." },
  { id: "s10", provider: "cursor", resource: "Acme workspace", organization: "acme", rangeFrom: "3 Sep 2026", rangeTo: "10 Sep 2026", startedAt: "10 Sep, 01:00", updatedAt: "10 Sep, 01:07", status: "completed" },
];

/* -------------------------------------------------------------------------- */
/* Health checks                                                               */
/* -------------------------------------------------------------------------- */

export interface HealthCheck {
  id: string;
  title: string;
  description: string;
  result: string;
  tone: "ok" | "warn" | "error" | "muted";
  details?: { repo: string; reason: string; since: string }[];
}

export const HEALTH_CHECKS: HealthCheck[] = [
  {
    id: "reachability",
    title: "Can we reach GitHub?",
    description: "Login, permissions and provider availability.",
    result: "Yes",
    tone: "ok",
  },
  {
    id: "completeness",
    title: "Is the data complete?",
    description: "Repositories and their pull requests.",
    result: "Issues detected",
    tone: "warn",
    details: [
      { repo: "platform/ledger", reason: "Missing access", since: "2 days" },
      { repo: "acme/docs", reason: "Rate limited", since: "18 hours" },
    ],
  },
];

export const HEALTH_HISTORY: { at: string; result: "ok" | "warn" | "error" }[] = [
  { at: "10 Sep, 04:00", result: "warn" },
  { at: "9 Sep, 16:00", result: "ok" },
  { at: "9 Sep, 04:00", result: "ok" },
  { at: "8 Sep, 16:00", result: "error" },
  { at: "8 Sep, 04:00", result: "ok" },
  { at: "7 Sep, 16:00", result: "ok" },
  { at: "7 Sep, 04:00", result: "ok" },
  { at: "6 Sep, 16:00", result: "warn" },
  { at: "6 Sep, 04:00", result: "ok" },
  { at: "5 Sep, 16:00", result: "ok" },
  { at: "5 Sep, 04:00", result: "ok" },
  { at: "4 Sep, 16:00", result: "ok" },
];

/* -------------------------------------------------------------------------- */
/* Repository sync settings                                                    */
/* -------------------------------------------------------------------------- */

export const EXCLUDED_PATTERNS = [
  "acme/sandbox-*",
  "acme-labs/*",
  "platform/legacy/*",
  "data/warehouse-archive",
];

export const WEEKLY_STATS = [
  { label: "Time to merge", value: "18.4h", delta: "−12%", favourable: true },
  { label: "Time to approve", value: "6.1h", delta: "−4%", favourable: true },
  { label: "Time to first comment", value: "2.8h", delta: "+9%", favourable: false },
];
