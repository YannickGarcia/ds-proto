"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import {
  CaretDown,
  ClockCounterClockwise,
  PlugsConnected,
} from "@/components/icons";
import { ProviderIcon } from "@/components/provider-icon";
import {
  AVAILABLE,
  CATEGORIES,
  CONNECTED,
  type CategoryId,
} from "@/lib/integrations-data";
import {
  HealthBadge,
  IntegrationsPage,
  InlineRowStatus,
  Section,
  useDismissible,
} from "./shared";

export function IntegrationsListing() {
  const banners = useDismissible();

  const connectedByCategory = CATEGORIES.map((category) => ({
    category,
    items: CONNECTED.filter((item) => item.category === category.id),
  })).filter((group) => group.items.length > 0);

  const availableByCategory = CATEGORIES.map((category) => ({
    category,
    items: AVAILABLE.filter((item) => item.category === category.id),
  })).filter((group) => group.items.length > 0);

  return (
    <IntegrationsPage
      crumbs={[{ label: "Integrations" }]}
      title="Integrations"
      measure="content"
      actions={
        <>
          <Button
            asChild
            variant="secondary"
            prefix={<ClockCounterClockwise aria-hidden="true" />}
          >
            <Link href="/integrations/sync-log">Sync log</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/integrations/github">Your repositories</Link>
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-10">
        {/* Contextual banner --------------------------------------------- */}
        {banners.visible("restricted") ? (
          <Banner
            severity="warning"
            title="Two GitHub organizations restrict OAuth access"
            onDismiss={() => banners.dismiss("restricted")}
            action={
              <Button variant="secondary">
                Request approval
              </Button>
            }
          >
            <code className="text-label-xs-mono">acme-security</code> and{" "}
            <code className="text-label-xs-mono">acme-finance</code> require an
            administrator to approve the Pensero app before their repositories
            can be read.
          </Banner>
        ) : null}

        {/* Connected ------------------------------------------------------ */}
        <Section
          title="Connected"
          description={`${CONNECTED.length} integrations are sending data to Pensero.`}
        >
          <div className="flex flex-col gap-6">
            {connectedByCategory.map(({ category, items }) => (
              <div key={category.id}>
                <h3 className="mb-2 text-label-overline text-tertiary">
                  {category.label}
                </h3>
                <Card className="divide-y divide-[var(--border-subtle)] overflow-hidden">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 px-4 py-3"
                    >
                      <ProviderIcon provider={item.id} />
                      <Link
                        href={item.href}
                        className="truncate text-label-default font-medium text-primary underline-offset-2 outline-none hover:underline focus-visible:shadow-[var(--ds-focus-ring)]"
                      >
                        {item.name}
                      </Link>
                      <HealthBadge
                        state={item.health}
                        reason={item.healthReason}
                      />
                      {/* Pushes the status and the action to the right edge,
                          keeping every row on one baseline. */}
                      <span className="ml-auto flex min-w-0 items-center gap-4">
                        {item.status ? (
                          <InlineRowStatus severity={item.status.severity}>
                            {item.status.message}
                          </InlineRowStatus>
                        ) : null}
                        <Button asChild variant="secondary">
                          <Link href={item.href}>Manage</Link>
                        </Button>
                      </span>
                    </div>
                  ))}
                </Card>
              </div>
            ))}
          </div>
        </Section>

        {/* Available ------------------------------------------------------ */}
        <Section
          title="Available"
          description="Connect more sources to widen what Pensero can measure."
        >
          <div className="flex flex-col gap-8">
            {availableByCategory.map(({ category, items }) => (
              <AvailableCategory
                key={category.id}
                id={category.id}
                label={category.label}
                blurb={category.blurb}
                items={items}
              />
            ))}
          </div>
        </Section>
      </div>
    </IntegrationsPage>
  );
}

function AvailableCategory({
  label,
  blurb,
  items,
}: {
  id: CategoryId;
  label: string;
  blurb: string;
  items: typeof AVAILABLE;
}) {
  return (
    <div>
      <h3 className="text-label-default font-medium text-primary">
        {label}
      </h3>
      <p className="mt-1 max-w-[76ch] text-copy-sm text-pretty text-secondary">
        {blurb}
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.id} className="gap-0 p-4">
            <div className="flex items-start gap-3">
              <ProviderIcon provider={item.id} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="truncate text-label-default font-medium text-primary">
                    {item.name}
                  </span>
                  {item.enterpriseOnly ? (
                    <Tooltip content="Included with the Enterprise plan. Talk to your account manager to enable it.">
                      <Badge variant="purple">Enterprise only</Badge>
                    </Tooltip>
                  ) : null}
                </div>
                <p className="mt-1 text-copy-sm text-pretty text-secondary">
                  {item.blurb}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5">
              <ConnectAction item={item} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ConnectAction({ item }: { item: (typeof AVAILABLE)[number] }) {
  if (item.disabledReason) {
    return (
      <Tooltip content={item.disabledReason}>
        {/* A disabled button cannot receive hover, so the tooltip needs a host. */}
        <span className="inline-flex">
          <Button variant="secondary" disabled>
            Connect
          </Button>
        </span>
      </Tooltip>
    );
  }

  if (item.id === "microsoft-teams") {
    return (
      <button
        type="button"
        className="inline-flex h-8 items-center gap-2 rounded-[var(--radius)] bg-[#6264A7] px-3 text-button-default text-white outline-none transition-opacity hover:opacity-90 focus-visible:shadow-[var(--ds-focus-ring)]"
      >
        <ProviderIcon provider="microsoft-teams" size="sm" className="ring-0" />
        Add to Teams
      </button>
    );
  }

  if (item.altMethods?.length) {
    return (
      <div className="flex items-stretch">
        <Button variant="secondary" className="rounded-r-none">
          Connect
        </Button>
        <Menu>
          <MenuTrigger asChild>
            <Button
              variant="secondary"
              shape="square"
              aria-label={`Other ways to connect ${item.name}`}
              className="-ml-px rounded-l-none"
            >
              <CaretDown aria-hidden="true" />
            </Button>
          </MenuTrigger>
          <MenuContent align="start" className="w-[248px]">
            {item.altMethods.map((method) => (
              <MenuItem key={method}>{method}</MenuItem>
            ))}
          </MenuContent>
        </Menu>
      </div>
    );
  }

  return (
    <Button
      variant="secondary"
      prefix={<PlugsConnected aria-hidden="true" />}
    >
      Connect
    </Button>
  );
}
