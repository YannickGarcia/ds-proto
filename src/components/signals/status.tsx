import {
  ArrowCircleDownRight,
  ArrowCircleUpRight,
  CheckCircle,
  WarningCircle,
  type Icon,
} from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL, type SignalStatus } from "@/lib/signals-data";
import { cn } from "@/lib/utils";

/**
 * One hue per status, used for the glyph, the focus window of the chart and
 * nothing else. The arrows point the way performance moves, not the way
 * the number moves: cycle time falling is an arrow up.
 */
export const STATUS_TONE: Record<
  SignalStatus,
  { line: string; text: string; icon: Icon }
> = {
  "on-track": {
    line: "var(--ds-green-700)",
    text: "var(--ds-green-text)",
    icon: CheckCircle,
  },
  "getting-there": {
    line: "var(--ds-blue-700)",
    text: "var(--ds-blue-text)",
    icon: ArrowCircleUpRight,
  },
  "at-risk": {
    line: "var(--ds-amber-700)",
    text: "var(--ds-amber-text)",
    icon: WarningCircle,
  },
  regressing: {
    line: "var(--ds-red-700)",
    text: "var(--ds-red-text)",
    icon: ArrowCircleDownRight,
  },
};

export function StatusGlyph({
  status,
  className,
}: {
  status: SignalStatus;
  className?: string;
}) {
  const { icon: Glyph, text } = STATUS_TONE[status];
  return (
    <Glyph
      role="img"
      aria-label={STATUS_LABEL[status]}
      weight="fill"
      className={cn("size-4 shrink-0", className)}
      style={{ color: text }}
    />
  );
}

/**
 * The status in words. Neutral, as in Linear: the glyph beside the name
 * already carries the colour, and two coloured marks per row would compete.
 */
export function StatusChip({ status }: { status: SignalStatus }) {
  return (
    <Badge size="md" className="text-primary">
      {STATUS_LABEL[status]}
    </Badge>
  );
}
