import { fetchLatestRound } from "@/lib/api";
import { estimateLatestRound } from "@/lib/utils";
import { generateRoundJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import HomeContent from "./HomeContent";

export const revalidate = 3600;

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
