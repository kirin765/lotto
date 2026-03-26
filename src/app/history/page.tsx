import type { Metadata } from "next";
import { fetchMultipleRounds } from "@/lib/api";
import { formatDate, estimateLatestRound } from "@/lib/utils";
import { generateMeta } from "@/lib/seo";
import LottoBalls from "@/components/LottoBalls";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

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

      <div className="space-y-3">
        {rounds.map((round) => (
          <Link
            key={round.roundNo}
            href={`/lotto/${round.roundNo}`}
            className="block bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">{round.roundNo}회</span>
              <time
                dateTime={round.drawDate}
                className="text-xs text-gray-400 dark:text-gray-500"
              >
                {formatDate(round.drawDate)}
              </time>
            </div>
            <LottoBalls numbers={round.numbers} bonusNo={round.bonusNo} size="sm" />
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-8" aria-label="페이지 이동">
          {page > 1 && (
            <Link
              href={`/history?page=${page - 1}`}
              className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              ← 이전
            </Link>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400 px-2">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/history?page=${page + 1}`}
              className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              다음 →
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
