import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchMultipleRounds } from "@/lib/api";
import { estimateLatestRound } from "@/lib/utils";
import { generateMeta } from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
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
    robots: page > 1 ? { index: false, follow: true } : undefined,
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

  return (
    <>
      <Breadcrumb items={[{ label: "홈", href: "/" }, { label: "당첨번호 이력" }]} />
      <h1 className="text-xl font-bold mb-6">📋 당첨번호 이력</h1>
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
