import type { Metadata } from "next";
import { fetchLatestRound } from "@/lib/api";
import { estimateLatestRound, formatDate } from "@/lib/utils";
import { generateMeta, generateRoundJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import HomeContent from "./HomeContent";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const round = await fetchLatestRound();
  if (!round) {
    return generateMeta({
      path: "/",
      images: ["/opengraph-image"],
    });
  }

  return generateMeta({
    title: `제 ${round.roundNo}회 로또 당첨번호 (${formatDate(round.drawDate)})`,
    description: `동행복권 로또 6/45 제 ${round.roundNo}회 당첨번호와 보너스 번호를 확인하세요.`,
    path: "/",
    images: ["/opengraph-image"],
  });
}

export default async function HomePage() {
  const round = await fetchLatestRound();
  const latestRound = estimateLatestRound();

  return (
    <>
      {round && (
        <JsonLd
          data={generateRoundJsonLd(
            round.roundNo,
            round.drawDate,
            round.numbers,
            round.bonusNo
          )}
        />
      )}
      <HomeContent serverData={round} latestRound={latestRound} />
    </>
  );
}
