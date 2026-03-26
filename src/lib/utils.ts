import { FIRST_DRAW_DATE, DRAW_INTERVAL_MS } from "./constants";

export function formatPrize(amount: number): string {
  if (amount >= 100_000_000) {
    const eok = Math.floor(amount / 100_000_000);
    const remainder = amount % 100_000_000;
    if (remainder >= 10_000_000) {
      const cheonman = Math.floor(remainder / 10_000_000);
      return `${eok}억 ${cheonman}천만원`;
    }
    return `${eok}억원`;
  }
  if (amount >= 10_000_000) {
    const cheonman = Math.floor(amount / 10_000_000);
    return `${cheonman}천만원`;
  }
  if (amount >= 10_000) {
    const man = Math.floor(amount / 10_000);
    return `${man.toLocaleString()}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export function formatAmount(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, ".");
}

export function estimateLatestRound(): number {
  const now = new Date();
  const diff = now.getTime() - FIRST_DRAW_DATE.getTime();
  const weeks = Math.floor(diff / DRAW_INTERVAL_MS);
  return weeks + 1;
}

export function estimateDrawDate(roundNo: number): string {
  if (roundNo < 1) return FIRST_DRAW_DATE.toISOString().slice(0, 10);
  const drawTime = FIRST_DRAW_DATE.getTime() + (roundNo - 1) * DRAW_INTERVAL_MS;
  const drawDate = new Date(drawTime);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(drawDate)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== "literal") acc[part.type] = part.value;
      return acc;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function sortNumbers(nums: number[]): number[] {
  return [...nums].sort((a, b) => a - b);
}
