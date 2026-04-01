import type { Metadata } from "next";
import { fetchLatestRound } from "@/lib/api";
import { estimateLatestRound, formatDate } from "@/lib/utils";
import { generateMeta, generateRoundJsonLd, generateFAQJsonLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import HomeContent from "./HomeContent";

export const revalidate = 3600;

const FAQ_ITEMS = [
  {
    question: "로또 6/45 추첨은 언제 하나요?",
    answer:
      "로또 6/45는 매주 토요일 오후 8시 35분에 MBC에서 생방송으로 추첨합니다. 구매는 추첨 당일 오후 8시까지 가능합니다.",
  },
  {
    question: "로또 1등 당첨 확률은 얼마인가요?",
    answer:
      "로또 6/45의 1등 당첨 확률은 45개 번호 중 6개를 맞출 확률로, 약 1/8,145,060(814만 5060분의 1)입니다.",
  },
  {
    question: "로또 번호 조합은 총 몇 가지인가요?",
    answer:
      "45개 번호 중 6개를 선택하는 조합의 수는 8,145,060가지입니다. 이 중 하나가 매주 추첨됩니다.",
  },
  {
    question: "당첨금은 언제까지 수령할 수 있나요?",
    answer:
      "로또 당첨금은 추첨일로부터 1년 이내에 청구해야 합니다. 1년이 지나면 청구권이 소멸되어 수령할 수 없습니다.",
  },
  {
    question: "로또 당첨번호는 어디서 확인하나요?",
    answer:
      "동행복권 공식 사이트(dhlottery.co.kr), 네이버 검색, 이 사이트에서 최신 회차부터 역대 모든 회차의 당첨번호를 확인할 수 있습니다.",
  },
];

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
      <JsonLd data={generateFAQJsonLd(FAQ_ITEMS)} />
      <HomeContent serverData={round} latestRound={latestRound} />
      <section aria-label="자주 묻는 질문" className="mt-10">
        <h2 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-4">자주 묻는 질문</h2>
        <dl className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-4 py-3"
            >
              <dt className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {item.question}
              </dt>
              <dd className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
