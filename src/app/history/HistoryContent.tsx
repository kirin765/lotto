"use client";

import { useEffect, useState, useCallback } from "react";
import type { LottoRound, DhlotteryApiResponse } from "@/types/lotto";
import { formatDate } from "@/lib/utils";
import LottoBalls from "@/components/LottoBalls";
import Link from "next/link";

function parseResponse(data: DhlotteryApiResponse): LottoRound {
  return {
    roundNo: data.drwNo,
    drawDate: data.drwNoDate,
    numbers: [
      data.drwtNo1, data.drwtNo2, data.drwtNo3,
      data.drwtNo4, data.drwtNo5, data.drwtNo6,
    ].sort((a, b) => a - b),
    bonusNo: data.bnusNo,
    totalSalesAmount: data.totSellamnt,
    firstPrizeAmount: data.firstWinamnt,
    firstPrizeWinners: data.firstPrzwnerCo,
    prizes: data.prizes ?? [],
  };
}

interface HistoryContentProps {
  serverRounds: LottoRound[];
  page: number;
  totalPages: number;
  startRound: number;
  pageSize: number;
}

export default function HistoryContent({
  serverRounds,
  page,
  totalPages,
  startRound,
  pageSize,
}: HistoryContentProps) {
  const [rounds, setRounds] = useState<LottoRound[]>(serverRounds);
  const [loading, setLoading] = useState(false);

  const fetchFromProxy = useCallback(async () => {
    setLoading(true);
    const fetched: LottoRound[] = [];
    const promises = [];
    for (let i = 0; i < pageSize; i++) {
      const roundNo = startRound - i;
      if (roundNo < 1) break;
      promises.push(
        fetch(`/api/lotto?drwNo=${roundNo}`)
          .then((r) => r.json())
          .then((json) => {
            if (json.returnValue === "success") fetched.push(parseResponse(json));
          })
          .catch(() => {})
      );
    }
    await Promise.all(promises);
    fetched.sort((a, b) => b.roundNo - a.roundNo);
    if (fetched.length > 0) setRounds(fetched);
    setLoading(false);
  }, [startRound, pageSize]);

  useEffect(() => {
    if (serverRounds.length === 0) fetchFromProxy();
  }, [serverRounds, fetchFromProxy]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl p-4 border border-gray-100 dark:border-gray-800 animate-pulse h-20 bg-gray-50 dark:bg-gray-900" />
        ))}
      </div>
    );
  }

  if (rounds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">이력을 불러올 수 없습니다.</p>
        <button
          type="button"
          onClick={fetchFromProxy}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {rounds.map((round) => (
          <Link
            key={round.roundNo}
            href={`/lotto/${round.roundNo}`}
            className="block bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold">{round.roundNo}회</span>
              <time dateTime={round.drawDate} className="text-xs text-gray-400 dark:text-gray-500">
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
