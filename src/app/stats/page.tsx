import type { Metadata } from "next";
import { fetchMultipleRounds } from "@/lib/api";
import { estimateLatestRound } from "@/lib/utils";
import { generateMeta } from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
import StatsClient from "./StatsClient";

export const metadata: Metadata = generateMeta({
  title: "번호 통계",
  description:
    "로또 6/45 번호별 출현 빈도, 최근 출현 회차, 평균 출현 간격 등 상세 통계를 확인하세요.",
  path: "/stats",
});

export const revalidate = 86400;

export default async function StatsPage() {
  const latestRound = estimateLatestRound();
  const count = Math.min(latestRound, 100);
  const rounds = await fetchMultipleRounds(latestRound, count);

  // 번호별 통계 계산
  const statsMap = new Map<number, { freq: number; last: number; appearances: number[] }>();
  for (let n = 1; n <= 45; n++) {
    statsMap.set(n, { freq: 0, last: 0, appearances: [] });
  }

  for (const round of rounds) {
    for (const num of round.numbers) {
      const stat = statsMap.get(num)!;
      stat.freq++;
      if (stat.last === 0 || round.roundNo > stat.last) stat.last = round.roundNo;
      stat.appearances.push(round.roundNo);
    }
  }

  const stats = Array.from(statsMap.entries()).map(([number, data]) => {
    const sorted = data.appearances.sort((a, b) => a - b);
    let totalInterval = 0;
    for (let i = 1; i < sorted.length; i++) {
      totalInterval += sorted[i] - sorted[i - 1];
    }
    const avgInterval = sorted.length > 1 ? Math.round(totalInterval / (sorted.length - 1)) : 0;

    return { number, frequency: data.freq, lastAppeared: data.last, avgInterval };
  });

  return (
    <>
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "번호 통계" }]} />
      <h1 className="text-xl font-bold mb-2">📊 번호 통계</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        최근 {count}회차 기준 번호별 출현 통계
      </p>
      <StatsClient stats={stats} />
    </>
  );
}
