"use client";

import {
  CalendarDots,
  CaretDown,
  CaretLeft,
  CaretRight,
} from "@/components/icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  MenuContent,
  MenuLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";

export const PERIOD_PRESETS = [
  { value: "current-week", label: "Current week", range: "Sep 07 – Sep 13" },
  { value: "previous-week", label: "Previous week", range: "Aug 28 – Sep 06" },
  { value: "previous-cycle", label: "Previous cycle", range: "Aug 11 – Aug 24" },
  { value: "last-n-days", label: "Last N days", range: "Aug 08 – Sep 06" },
  { value: "last-n-months", label: "Last N months", range: "Jun 07 – Sep 06" },
  { value: "custom", label: "Custom range", range: "From / To" },
] as const;

export type PeriodValue = (typeof PERIOD_PRESETS)[number]["value"];

export function PeriodSelector({
  value,
  onValueChange,
  range,
  onStep,
}: {
  value: PeriodValue;
  onValueChange: (value: PeriodValue) => void;
  range: string;
  onStep: (direction: -1 | 1) => void;
}) {
  const [open, setOpen] = useState(false);
  const preset = PERIOD_PRESETS.find((item) => item.value === value);

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="secondary"
        shape="square"
        aria-label="Previous period"
        onClick={() => onStep(-1)}
      >
        <CaretLeft aria-hidden="true" />
      </Button>

      <Menu open={open} onOpenChange={setOpen}>
        <MenuTrigger asChild>
          <Button
            variant="secondary"
            prefix={<CalendarDots aria-hidden="true" />}
            suffix={<CaretDown aria-hidden="true" />}
          >
            <span className="flex items-baseline gap-1.5">
              {preset?.label ?? "Previous week"}
              <span className="tabular-nums text-label-sm text-secondary">
                {range}
              </span>
            </span>
          </Button>
        </MenuTrigger>
        <MenuContent align="end" className="w-[264px]">
          <MenuLabel>Period</MenuLabel>
          <MenuRadioGroup
            value={value}
            onValueChange={(next) => onValueChange(next as PeriodValue)}
          >
            {PERIOD_PRESETS.filter((item) => item.value !== "custom").map(
              (item) => (
                <MenuRadioItem key={item.value} value={item.value}>
                  <span className="flex-1">{item.label}</span>
                  <span className="tabular-nums text-label-xs text-secondary">
                    {item.range}
                  </span>
                </MenuRadioItem>
              ),
            )}
          </MenuRadioGroup>
          <MenuSeparator />
          <MenuLabel>Custom range</MenuLabel>
          <div
            className="flex items-center gap-2 px-2 pb-2"
            onKeyDown={(event) => event.stopPropagation()}
          >
            <Input
              aria-label="From date"
              name="period-from"
              type="date"
              autoComplete="off"
              defaultValue="2025-08-28"
              className="text-label-sm"
            />
            <span className="text-label-sm text-secondary">→</span>
            <Input
              aria-label="To date"
              name="period-to"
              type="date"
              autoComplete="off"
              defaultValue="2025-09-06"
              className="text-label-sm"
            />
          </div>
        </MenuContent>
      </Menu>

      <Button
        variant="secondary"
        shape="square"
        aria-label="Next period"
        onClick={() => onStep(1)}
      >
        <CaretRight aria-hidden="true" />
      </Button>
    </div>
  );
}
