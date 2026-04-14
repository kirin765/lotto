import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchLottoRound } from "@/lib/api";
import { formatDate, estimateLatestRound } from "@/lib/utils";
import { generateMeta, generateRoundJsonLd, generateWebPageJsonLd } from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import RoundContent from "./RoundContent";

interface PageProps {
  params: Promise<{ round: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { round: roundStr } = await params;
  const roundNo = parseInt(roundStr, 10);
  const latestRound = estimateLatestRound();
  if (isNaN(roundNo) || roundNo < 1) {
    return generateMeta({
      title: "회차 정보 없음",
      path: "/lotto",
      noIndex: true,
    });
  }

  if (roundNo > latestRound) {
    return generateMeta({
      title: `제 ${roundNo}회 로또 당첨번호`,
      description: `제 ${roundNo}회는 아직 추첨되지 않았거나 확인할 수 없습니다.`,
      path: `/lotto/${roundNo}`,
      noIndex: true,
    });
  }

  const result = await fetchLottoRound(roundNo);
  if (result.status === "success") {
    return generateMeta({
      title: `제 ${roundNo}회 로또 당첨번호 (${formatDate(result.round.drawDate)})`,
      description: `로또 6/45 제 ${roundNo}회 당첨번호: ${result.round.numbers.join(", ")} + 보너스 ${result.round.bonusNo}. ${formatDate(result.round.drawDate)} 추첨.`,
      path: `/lotto/${roundNo}`,
      openGraphType: "article",
      images: [`/lotto/${roundNo}/opengraph-image`],
    });
  }

  if (result.status === "not_found") {
    return generateMeta({
      title: `제 ${roundNo}회 로또 당첨번호`,
      description: `요청한 회차 정보를 찾을 수 없습니다.`,
      path: `/lotto/${roundNo}`,
      noIndex: true,
    });
  }

  return generateMeta({
    title: `제 ${roundNo}회 로또 당첨번호`,
    description: `일시적으로 회차 데이터를 불러오지 못했습니다.`,
    path: `/lotto/${roundNo}`,
    noIndex: true,
  });
}

export default async function RoundPage({ params }: PageProps) {
  const { round: roundStr } = await params;
  const roundNo = parseInt(roundStr, 10);
  const latestRound = estimateLatestRound();
  if (isNaN(roundNo) || roundNo < 1 || roundNo > latestRound) notFound();

  const result = await fetchLottoRound(roundNo);
  if (result.status === "not_found") notFound();
  const round = result.status === "success" ? result.round : null;

  return (
    <>
      {round && (
        <>
          <JsonLd
            data={generateRoundJsonLd(
              round.roundNo,
              round.drawDate,
              round.numbers,
              round.bonusNo
            )}
          />
          <JsonLd
            data={generateWebPageJsonLd({
              title: `제 ${round.roundNo}회 로또 당첨번호`,
              description: `${formatDate(round.drawDate)} 추첨된 제 ${round.roundNo}회 로또 6/45 당첨번호 ${round.numbers.join(", ")}와 보너스 번호 ${round.bonusNo}를 확인할 수 있는 회차 상세 페이지입니다.`,
              path: `/lotto/${round.roundNo}`,
            })}
          />
        </>
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
