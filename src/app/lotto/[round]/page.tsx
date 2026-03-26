import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchLottoRound } from "@/lib/api";
import { formatDate, estimateLatestRound } from "@/lib/utils";
import { generateMeta, generateRoundJsonLd } from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import RoundContent from "./RoundContent";

interface PageProps {
  params: Promise<{ round: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { round: roundStr } = await params;
  const roundNo = parseInt(roundStr, 10);
  if (isNaN(roundNo)) return generateMeta({ title: "회차 정보 없음" });

  const round = await fetchLottoRound(roundNo);
  if (!round) {
    return generateMeta({
      title: `제 ${roundNo}회 로또 당첨번호`,
      description: `로또 6/45 제 ${roundNo}회 당첨번호를 확인하세요.`,
      path: `/lotto/${roundNo}`,
    });
  }

  return generateMeta({
    title: `제 ${roundNo}회 로또 당첨번호 (${formatDate(round.drawDate)})`,
    description: `로또 6/45 제 ${roundNo}회 당첨번호: ${round.numbers.join(", ")} + 보너스 ${round.bonusNo}. ${formatDate(round.drawDate)} 추첨.`,
    path: `/lotto/${roundNo}`,
  });
}

export default async function RoundPage({ params }: PageProps) {
  const { round: roundStr } = await params;
  const roundNo = parseInt(roundStr, 10);
  if (isNaN(roundNo) || roundNo < 1) notFound();

  const round = await fetchLottoRound(roundNo);
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

      <Breadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: `${roundNo}회` },
        ]}
      />

      <RoundContent serverData={round} roundNo={roundNo} latestRound={latestRound} />
    </>
  );
}
