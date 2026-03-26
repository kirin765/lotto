export const SITE_NAME = "로또 당첨번호";

function resolveSiteUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  try {
    const url = new URL(rawUrl);
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}

export const SITE_URL = resolveSiteUrl();
export const SITE_DESCRIPTION =
  "동행복권 로또 6/45 최신 당첨번호 확인, 회차별 조회, 번호 통계, 번호 생성기를 제공합니다.";

export const FIRST_DRAW_DATE = new Date("2002-12-07T00:00:00+09:00");
export const DRAW_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;

export const BALL_COLORS: Record<string, { bg: string; text: string }> = {
  "1-10": { bg: "bg-yellow-400", text: "text-yellow-900" },
  "11-20": { bg: "bg-blue-500", text: "text-white" },
  "21-30": { bg: "bg-red-500", text: "text-white" },
  "31-40": { bg: "bg-gray-500", text: "text-white" },
  "41-45": { bg: "bg-green-500", text: "text-white" },
};

export function getBallColor(num: number): { bg: string; text: string } {
  if (num <= 10) return BALL_COLORS["1-10"];
  if (num <= 20) return BALL_COLORS["11-20"];
  if (num <= 30) return BALL_COLORS["21-30"];
  if (num <= 40) return BALL_COLORS["31-40"];
  return BALL_COLORS["41-45"];
}

export const NAV_ITEMS = [
  { href: "/", label: "당첨번호", icon: "🎱" },
  { href: "/stats", label: "통계", icon: "📊" },
  { href: "/generator", label: "생성기", icon: "🎲" },
  { href: "/history", label: "이력", icon: "📋" },
] as const;
