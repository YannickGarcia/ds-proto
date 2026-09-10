"use client";

import { CaretDown, Check, MagnifyingGlass, Users } from "@/components/icons";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/geist/avatar";
import { Button } from "@/components/geist/button";
import { Input } from "@/components/geist/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/geist/popover";
import { people, TEAMS } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Scope selector — filters every chart and table on the page to the selected
 * people. Cohorts are shortcuts that set the selection wholesale.
 */
export function ScopeSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return people;
    return people.filter(
      (person) =>
        person.name.toLowerCase().includes(needle) ||
        person.team.toLowerCase().includes(needle) ||
        person.position.toLowerCase().includes(needle),
    );
  }, [query]);

  const toggle = (id: string) => {
    onChange(
      selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id],
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          prefix={<Users aria-hidden="true" />}
          suffix={<CaretDown aria-hidden="true" />}
          className="geist-tabular-nums"
        >
          {selected.length} {selected.length === 1 ? "person" : "people"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[288px] p-0">
        <div className="border-b border-[var(--border-subtle)] p-2">
          <label className="sr-only" htmlFor="scope-search">
            Search people or teams
          </label>
          <Input
            id="scope-search"
            name="scope-search"
            type="search"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search people or teams…"
            prefix={<MagnifyingGlass aria-hidden="true" />}
          />
        </div>

        {/* Wraps: on the shared form scale these chips are 32px, and four of
            them no longer fit one line of a 288px popover. */}
        <div className="flex flex-col gap-1.5 border-b border-[var(--border-subtle)] px-2 py-2">
          <span className="px-1 text-label-12 text-[var(--ds-gray-900)]">
            Cohorts
          </span>
          <div className="flex flex-wrap items-center gap-1">
            <Button
              variant="tertiary"
              onClick={() => onChange(people.map((person) => person.id))}
            >
              Everyone
            </Button>
            {TEAMS.map((team) => (
              <Button
                key={team}
                variant="tertiary"
                onClick={() =>
                  onChange(
                    people
                      .filter((person) => person.team === team)
                      .map((person) => person.id),
                  )
                }
              >
                {team}
              </Button>
            ))}
          </div>
        </div>

        <ul className="geist-no-scrollbar max-h-[264px] overflow-y-auto overscroll-contain p-1">
          {filtered.map((person) => {
            const isSelected = selected.includes(person.id);
            return (
              <li key={person.id}>
                <button
                  type="button"
                  onClick={() => toggle(person.id)}
                  className={cn(
                    "flex h-9 w-full items-center gap-2.5 rounded-[var(--geist-radius)] px-2 outline-none",
                    "transition-colors duration-100 hover:bg-[var(--ds-gray-alpha-200)]",
                    "focus-visible:shadow-[var(--ds-focus-ring)]",
                  )}
                >
                  <Avatar name={person.name} size="sm" />
                  <span className="min-w-0 flex-1 truncate text-left text-label-14 text-[var(--ds-gray-1000)]">
                    {person.name}
                  </span>
                  <span className="text-label-12 text-[var(--ds-gray-900)]">
                    {person.team}
                  </span>
                  <Check
                    aria-hidden="true"
                    className={cn(
                      "size-3.5 shrink-0 text-[var(--ds-gray-1000)] transition-opacity duration-100",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                </button>
              </li>
            );
          })}
          {filtered.length === 0 ? (
            <li className="px-2 py-6 text-center text-copy-13 text-[var(--ds-gray-900)]">
              No people match “{query}”
            </li>
          ) : null}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
