import type { Metadata } from "next";
import { fetchMultipleRounds } from "@/lib/api";
import { estimateLatestRound } from "@/lib/utils";
import { generateMeta } from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
import HistoryContent from "./HistoryContent";

export const metadata: Metadata = generateMeta({
  title: "당첨번호 이력",
  description:
    "로또 6/45 전체 회차 당첨번호 이력을 확인하세요. 최신 회차부터 과거 회차까지 모든 당첨번호를 제공합니다.",
  path: "/history",
});

export const revalidate = 3600;

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HistoryPage({ searchParams }: PageProps) {
  const { page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);
  const latestRound = estimateLatestRound();
  const startRound = latestRound - (page - 1) * PAGE_SIZE;
  const rounds = await fetchMultipleRounds(startRound, PAGE_SIZE);
  const totalPages = Math.ceil(latestRound / PAGE_SIZE);

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
