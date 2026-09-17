"use client";

import { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { Cloud, DotsThree, HardDrives } from "@/components/icons";
import {
  INSTANCES,
  REPOSITORIES,
  type Instance,
} from "@/lib/integrations-data";
import { cn } from "@/lib/utils";

/**
 * Two layouts for the same instance content, side by side for comparison.
 *
 * The hierarchy is identical in both: the instance name leads, its hosts are
 * metadata, and the actions stay quiet. "Add repository" is secondary on every
 * instance — the page header already carries the one primary button, and four
 * green buttons in a column would all shout at once.
 */

type Host = { label: string | null; value: string };

/**
 * Hosts are only labelled when there are two to tell apart. An instance whose
 * internal and public host are the same shows the host once, unlabelled.
 */
function hostsOf(inst: Instance): Host[] {
  const { internal, public: pub } = inst.urls;
  if (!internal || internal === pub) return [{ label: null, value: pub }];
  return [
    { label: "Public", value: pub },
    { label: "Internal", value: internal },
  ];
}

function repoCount(inst: Instance) {
  const n = REPOSITORIES.filter((r) => r.instanceId === inst.id).length;
  return n === 0
    ? "No repositories"
    : `${n} ${n === 1 ? "repository" : "repositories"}`;
}

function InstanceIcon({ kind }: { kind: Instance["kind"] }) {
  const Icon = kind === "cloud" ? Cloud : HardDrives;
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-[7px] bg-[var(--ds-gray-alpha-100)] text-secondary">
      <Icon aria-hidden="true" className="size-4" />
    </span>
  );
}

/** Name first; a credential problem is the only status worth a badge. */
function InstanceName({ inst }: { inst: Instance }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="truncate text-label-default font-medium text-primary">
        {inst.label}
      </span>
      {inst.credential.state === "expired" ? (
        <Badge variant="red">{inst.credential.label}</Badge>
      ) : null}
    </span>
  );
}

function InstanceMenu({ inst }: { inst: Instance }) {
  return (
    <Menu>
      <MenuTrigger asChild>
        <Button
          variant="tertiary"
          shape="square"
          aria-label={`More actions for ${inst.label}`}
        >
          <DotsThree aria-hidden="true" weight="bold" />
        </Button>
      </MenuTrigger>
      <MenuContent align="end" className="w-[200px]">
        {inst.kind === "self-hosted" ? (
          <>
            <MenuItem>Edit instance</MenuItem>
            <MenuSeparator />
            <MenuItem className="text-[var(--ds-red-text)]">
              Remove instance
            </MenuItem>
          </>
        ) : (
          <MenuItem className="text-[var(--ds-red-text)]">Disconnect</MenuItem>
        )}
      </MenuContent>
    </Menu>
  );
}

/* -------------------------------------------------------------------------- */
/* List                                                                        */
/* -------------------------------------------------------------------------- */

export function InstanceList() {
  return (
    <Card className="divide-y divide-[var(--border-subtle)] overflow-hidden">
      {INSTANCES.map((inst) => (
        <div
          key={inst.id}
          className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3"
        >
          <div className="flex min-w-0 flex-1 basis-[280px] items-center gap-3">
            <InstanceIcon kind={inst.kind} />
            <div className="min-w-0">
              <InstanceName inst={inst} />
              <p className="mt-0.5 flex flex-wrap items-baseline gap-x-3">
                {hostsOf(inst).map((host) => (
                  <span
                    key={host.value}
                    className="flex min-w-0 items-baseline gap-1.5"
                  >
                    {host.label ? (
                      <span className="text-label-xs text-tertiary">
                        {host.label}
                      </span>
                    ) : null}
                    <span className="truncate text-label-xs-mono text-secondary">
                      {host.value}
                    </span>
                  </span>
                ))}
              </p>
            </div>
          </div>
          <span className="tabular-nums hidden w-[112px] text-right text-label-sm text-secondary md:block">
            {repoCount(inst)}
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="tertiary">Permissions</Button>
            <Button variant="secondary">Add repository</Button>
            <InstanceMenu inst={inst} />
          </div>
        </div>
      ))}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Cards                                                                       */
/* -------------------------------------------------------------------------- */

export function InstanceCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {INSTANCES.map((inst) => {
        const hosts = hostsOf(inst);
        return (
          <Card key={inst.id} className="overflow-hidden">
            <div className="flex items-start gap-3 px-4 pt-4">
              <InstanceIcon kind={inst.kind} />
              <div className="min-w-0 flex-1">
                <InstanceName inst={inst} />
                <p className="mt-0.5 text-label-xs text-secondary">
                  {inst.kind === "cloud" ? "GitHub Cloud" : "Enterprise Server"}
                  {" · "}
                  <span className="tabular-nums">{repoCount(inst)}</span>
                </p>
              </div>
              <div className="-mt-1 -mr-1">
                <InstanceMenu inst={inst} />
              </div>
            </div>

            {/* Cards in a row stretch to one height; the footer's mt-auto keeps
                the actions on one line across them. */}
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] content-start gap-x-4 gap-y-1.5 px-4 pt-4 pb-4">
              {hosts.map((host) => (
                <Fragment key={host.value}>
                  <dt
                    className={cn(
                      "text-label-xs text-tertiary",
                      // A single unlabelled host still needs a term for the
                      // screen reader; it is only hidden visually.
                      !host.label && "sr-only",
                    )}
                  >
                    {host.label ?? "Host"}
                  </dt>
                  <dd
                    className={cn(
                      "truncate text-label-xs-mono text-secondary",
                      !host.label && "col-span-2",
                    )}
                  >
                    {host.value}
                  </dd>
                </Fragment>
              ))}
            </dl>

            <CardFooter className="justify-between px-3 py-2">
              <Button variant="tertiary">Permissions</Button>
              <Button variant="secondary">Add repository</Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
