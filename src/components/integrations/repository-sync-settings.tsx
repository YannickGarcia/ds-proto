"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Plus, Prohibit, Trash, X } from "@/components/icons";
import { EXCLUDED_PATTERNS } from "@/lib/integrations-data";
import { IntegrationsPage, Section } from "./shared";

/** A pattern is a path, optionally ending in a single trailing wildcard. */
const PATTERN = /^[a-z0-9][a-z0-9._-]*(\/[a-z0-9._-]+)*(\/\*)?$|^[a-z0-9][a-z0-9._-]*\*$/i;

export function RepositorySyncSettings() {
  const [autoConnect, setAutoConnect] = useState(true);
  const [patterns, setPatterns] = useState<string[]>(EXCLUDED_PATTERNS);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<number | null>(null);

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    if (!PATTERN.test(value)) {
      setError(
        "Use a repository path, optionally ending in a single * — for example acme/sandbox-* or group/sub/project.",
      );
      return;
    }
    if (patterns.includes(value)) {
      setError("That pattern is already in the list.");
      return;
    }
    setPatterns((list) => [...list, value]);
    setDraft("");
    setError(null);
    setChecked(null);
  };

  return (
    <IntegrationsPage
      crumbs={[
        { label: "Organization", href: "/integrations" },
        { label: "Repository sync" },
      ]}
      title="Repository sync"
      measure="narrow"
    >
      <div className="flex flex-col gap-8">
        {/* Auto-connect --------------------------------------------------- */}
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4 p-5">
            <div className="min-w-0 max-w-[62ch]">
              <h2 className="text-h5 text-primary">
                Automatically connect repositories
              </h2>
              <p className="mt-1 text-copy-sm text-pretty text-secondary">
                New repositories found on a connected provider start syncing on
                their own. Turn this off if you would rather add each
                repository yourself.
              </p>
            </div>
            <Switch
              checked={autoConnect}
              onCheckedChange={setAutoConnect}
              aria-label="Automatically connect repositories"
            />
          </div>
        </Card>

        {/* Exclusions ------------------------------------------------------ */}
        <Section
          title="Excluded repositories"
          description="Repositories matching these patterns are never connected automatically, and are skipped when a provider is re-scanned. Existing connections are not removed."
          actions={
            <Button
              variant="secondary"
              onClick={() => setChecked(patterns.length * 3 + 2)}
            >
              Check against provider
            </Button>
          }
        >
          <Card className="overflow-hidden">
            {patterns.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={<Prohibit aria-hidden="true" />}
                  title="No repositories are currently excluded"
                  description="Every repository the provider exposes is eligible for automatic connection."
                />
              </div>
            ) : (
              <ul className="divide-y divide-[var(--border-subtle)]">
                {patterns.map((pattern) => (
                  <li
                    key={pattern}
                    className="flex items-center justify-between gap-3 px-4 py-2.5"
                  >
                    <code className="truncate text-copy-sm-mono text-primary">
                      {pattern}
                    </code>
                    <Button
                      variant="tertiary"
                      shape="square"
                      aria-label={`Remove ${pattern}`}
                      onClick={() => {
                        setPatterns((list) => list.filter((p) => p !== pattern));
                        setChecked(null);
                      }}
                    >
                      <Trash aria-hidden="true" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t border-[var(--border-subtle)] p-4">
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-[260px] flex-1">
                  <label className="sr-only" htmlFor="pattern">
                    Add an exclusion pattern
                  </label>
                  <Input
                    id="pattern"
                    name="pattern"
                    value={draft}
                    autoComplete="off"
                    spellCheck={false}
                    aria-invalid={error ? true : undefined}
                    aria-describedby="pattern-hint"
                    onChange={(event) => {
                      setDraft(event.target.value);
                      setError(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        add();
                      }
                    }}
                    placeholder="org-x/*  or  group/sub/project"
                  />
                </div>
                <Button
                  variant="secondary"
                  prefix={<Plus aria-hidden="true" />}
                  onClick={add}
                >
                  Add pattern
                </Button>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="mt-2 flex items-start gap-1.5 text-label-xs text-[var(--ds-red-900)]"
                >
                  <X aria-hidden="true" className="mt-px size-3.5 shrink-0" />
                  {error}
                </p>
              ) : (
                <p
                  id="pattern-hint"
                  className="mt-2 text-label-xs text-secondary"
                >
                  A repository path, optionally ending in a single{" "}
                  <code className="text-label-xs-mono">*</code>. Wildcards match the
                  rest of the path and cannot appear in the middle.
                </p>
              )}

              {checked !== null ? (
                <p className="mt-3 flex items-center gap-2 text-label-sm text-primary">
                  <CheckCircle
                    aria-hidden="true"
                    className="size-4 shrink-0 text-[var(--ds-green-900)]"
                    weight="fill"
                  />
                  {checked} repositories on the provider match these patterns.
                  <Badge>2 already connected</Badge>
                </p>
              ) : null}
            </div>
          </Card>
        </Section>
      </div>
    </IntegrationsPage>
  );
}
