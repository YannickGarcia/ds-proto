const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function monthAbbr(monthIndex: number) {
  return monthFormatter.format(new Date(Date.UTC(2025, monthIndex, 1)));
}

export function shortDate(date: Date) {
  return shortDateFormatter.format(date);
}

export function usd(value: number, fractionDigits = 0) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
}

export function perPoint(value: number) {
  return `$${value.toFixed(2)}/pt`;
}

export function pct(value: number, fractionDigits = 0) {
  return `${value.toFixed(fractionDigits)}%`;
}

export function points(value: number, fractionDigits = 1) {
  return value.toFixed(fractionDigits);
}
