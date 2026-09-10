import { cn } from "@/lib/utils";

const sizeMap = {
  xs: "size-5 text-[9px]",
  sm: "size-6 text-[10px]",
  md: "size-7 text-[11px]",
  lg: "size-8 text-[12px]",
} as const;

/** Deterministic Geist hue per person so avatars stay stable across renders. */
const GRADIENTS = [
  "linear-gradient(140deg, var(--ds-blue-600), var(--ds-blue-800))",
  "linear-gradient(140deg, var(--ds-purple-600), var(--ds-purple-800))",
  "linear-gradient(140deg, var(--ds-teal-600), var(--ds-teal-800))",
  "linear-gradient(140deg, var(--ds-amber-600), var(--ds-amber-800))",
  "linear-gradient(140deg, var(--ds-pink-600), var(--ds-pink-800))",
  "linear-gradient(140deg, var(--ds-green-600), var(--ds-green-800))",
] as const;

export function avatarGradient(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

export function initialsOf(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof sizeMap;
  className?: string;
}) {
  return (
    <span
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        "font-medium text-white ring-1 ring-[var(--ds-gray-alpha-400)] ring-inset",
        sizeMap[size],
        className,
      )}
      style={{ backgroundImage: avatarGradient(name) }}
    >
      {initialsOf(name)}
    </span>
  );
}
