import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchLottoRound } from "@/lib/api";
import { formatDate, estimateLatestRound } from "@/lib/utils";
import { generateMeta, generateRoundJsonLd } from "@/lib/seo";
import LottoBalls from "@/components/LottoBalls";
import PrizeTable from "@/components/PrizeTable";
import RoundNav from "@/components/RoundNav";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ round: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { round: roundStr } = await params;
  const roundNo = parseInt(roundStr, 10);
  if (isNaN(roundNo)) return generateMeta({ title: "회차 정보 없음" });

  const round = await fetchLottoRound(roundNo);
  if (!round) return generateMeta({ title: "회차 정보 없음" });

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
  if (!round) notFound();

  const latestRound = estimateLatestRound();

  return (
    <>
      <JsonLd
        data={generateRoundJsonLd(
          round.roundNo,
          round.drawDate,
          round.numbers,
          round.bonusNo
        )}
      />

      <Breadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: `${round.roundNo}회` },
        ]}
      />

      <section aria-label={`제 ${round.roundNo}회 로또 당첨번호`}>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            제 <span className="text-blue-600 dark:text-blue-400">{round.roundNo}</span>회
          </h1>
          <time
            dateTime={round.drawDate}
            className="text-sm text-gray-500 dark:text-gray-400 mt-1 block"
          >
            {formatDate(round.drawDate)} 추첨
          </time>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 shadow-sm">
          <LottoBalls numbers={round.numbers} bonusNo={round.bonusNo} size="lg" />
        </div>

        <div className="mt-6 bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">당첨 정보</h2>
          <PrizeTable round={round} />
        </div>

        <RoundNav currentRound={round.roundNo} latestRound={latestRound} />
      </section>
    </>
  );
}
