import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchMultipleRounds } from "@/lib/api";
import { estimateLatestRound } from "@/lib/utils";
import { generateMeta, generateItemListJsonLd, generateWebPageJsonLd } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import HistoryContent from "./HistoryContent";

export const revalidate = 3600;

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);

  return generateMeta({
    title: page === 1 ? "당첨번호 이력" : `당첨번호 이력 ${page}페이지`,
    description:
      "로또 6/45 전체 회차 당첨번호 이력을 확인하세요. 최신 회차부터 과거 회차까지 모든 당첨번호를 제공합니다.",
    path: "/history",
    canonical: page === 1 ? "/history" : `/history?page=${page}`,
    noIndex: page > 1,
    images: ["/opengraph-image"],
  });
}

export default async function HistoryPage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);
  const latestRound = estimateLatestRound();
  const totalPages = Math.ceil(latestRound / PAGE_SIZE);
  if (page > totalPages) notFound();

  const startRound = latestRound - (page - 1) * PAGE_SIZE;
  const rounds = await fetchMultipleRounds(startRound, PAGE_SIZE);

  const prevHref = page > 1
    ? (page === 2 ? `${SITE_URL}/history` : `${SITE_URL}/history?page=${page - 1}`)
    : null;
  const nextHref = page < totalPages ? `${SITE_URL}/history?page=${page + 1}` : null;
  const pageJsonLd = generateWebPageJsonLd({
    title: page === 1 ? "로또 당첨번호 이력" : `로또 당첨번호 이력 ${page}페이지`,
    description:
      "최신 회차부터 과거 회차까지 로또 6/45 당첨번호를 순서대로 확인할 수 있는 이력 페이지입니다.",
    path: page === 1 ? "/history" : `/history?page=${page}`,
    type: "CollectionPage",
  });
  const itemListJsonLd = generateItemListJsonLd(
    page === 1 ? "로또 당첨번호 이력" : `로또 당첨번호 이력 ${page}페이지`,
    rounds.slice(0, 10).map((round, index) => ({
      position: index + 1,
      name: `제 ${round.roundNo}회 당첨번호`,
      url: `${SITE_URL}/lotto/${round.roundNo}`,
    }))
  );

  return (
    <>
      <JsonLd data={pageJsonLd} />
      <JsonLd data={itemListJsonLd} />
      {prevHref && <link rel="prev" href={prevHref} />}
      {nextHref && <link rel="next" href={nextHref} />}
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "당첨번호 이력" }]} />
      <h1 className="text-xl font-bold mb-6">📋 당첨번호 이력</h1>
      <p className="mb-6 text-sm leading-6 text-gray-600 dark:text-gray-300">
        로또 6/45 당첨번호 이력 페이지입니다. 최신 회차부터 페이지 단위로 과거 회차를
        탐색할 수 있으며, 각 회차 상세 페이지에서 당첨번호와 보너스 번호를 바로 확인할 수 있습니다.
      </p>
      <HistoryContent
        serverRounds={rounds}
        page={page}
        totalPages={totalPages}
        startRound={startRound}
        pageSize={PAGE_SIZE}
      />
    </>
  );
}
