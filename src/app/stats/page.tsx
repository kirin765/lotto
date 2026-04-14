import type { Metadata } from "next";
import { fetchMultipleRounds } from "@/lib/api";
import { estimateLatestRound } from "@/lib/utils";
import { generateItemListJsonLd, generateMeta, generateWebPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import JsonLd from "@/components/JsonLd";
import Breadcrumb from "@/components/Breadcrumb";
import StatsContent from "./StatsContent";
import type { NumberStat } from "@/types/lotto";

export const metadata: Metadata = generateMeta({
  title: "번호 통계",
  description:
    "로또 6/45 번호별 출현 빈도, 최근 출현 회차, 평균 출현 간격 등 상세 통계를 확인하세요.",
  path: "/stats",
  images: ["/opengraph-image"],
});

export const revalidate = 86400;

function computeStats(rounds: { roundNo: number; numbers: number[] }[]): NumberStat[] {
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

  return Array.from(statsMap.entries()).map(([number, data]) => {
    const sorted = data.appearances.sort((a, b) => a - b);
    let totalInterval = 0;
    for (let i = 1; i < sorted.length; i++) {
      totalInterval += sorted[i] - sorted[i - 1];
    }
    const avgInterval = sorted.length > 1 ? Math.round(totalInterval / (sorted.length - 1)) : 0;
    return { number, frequency: data.freq, lastAppeared: data.last, avgInterval };
  });
}

export default async function StatsPage() {
  const latestRound = estimateLatestRound();
  const count = Math.min(latestRound, 100);
  const rounds = await fetchMultipleRounds(latestRound, count);
  const stats = rounds.length > 0 ? computeStats(rounds) : [];

  const top10 = [...stats]
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  const itemListJsonLd = generateItemListJsonLd(
    `로또 6/45 번호별 출현 통계 Top 10 (최근 ${count}회차)`,
    top10.map((s, i) => ({
      position: i + 1,
      name: `번호 ${s.number} — ${s.frequency}회 출현`,
      url: `${SITE_URL}/stats`,
    }))
  );
  const pageJsonLd = generateWebPageJsonLd({
    title: "로또 번호 통계",
    description: `최근 ${count}회차를 기준으로 번호별 출현 빈도와 최근 출현 회차를 보여주는 통계 페이지입니다.`,
    path: "/stats",
    type: "CollectionPage",
  });

  return (
    <>
      <JsonLd data={pageJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "번호 통계" }]} />
      <h1 className="text-xl font-bold mb-2">📊 번호 통계</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        최근 {count}회차 기준 번호별 출현 통계
      </p>
      <p className="mb-6 text-sm leading-6 text-gray-600 dark:text-gray-300">
        이 페이지는 최근 {count}회차의 로또 6/45 결과를 바탕으로 각 번호의 출현 빈도,
        마지막 출현 회차, 평균 출현 간격을 정리합니다.
      </p>
      <StatsContent serverStats={stats} count={count} latestRound={latestRound} />
    </>
  );
}
