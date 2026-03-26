"use client";

import { useEffect, useState, useCallback } from "react";
import type { LottoRound, DhlotteryApiResponse } from "@/types/lotto";
import { formatDate } from "@/lib/utils";
import LottoBalls from "@/components/LottoBalls";
import PrizeTable from "@/components/PrizeTable";
import RoundNav from "@/components/RoundNav";
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
  };
}

interface HomeContentProps {
  serverData: LottoRound | null;
  latestRound: number;
}

export default function HomeContent({ serverData, latestRound }: HomeContentProps) {
  const [round, setRound] = useState<LottoRound | null>(serverData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchFromProxy = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // latest 키워드로 최신 회차 조회
      const res = await fetch("/api/lotto?drwNo=latest");
      if (!res.ok) throw new Error();
      const json = await res.json();
      if (json.returnValue !== "success") throw new Error();
      setRound(parseResponse(json));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!serverData) fetchFromProxy();
  }, [serverData, fetchFromProxy]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="flex gap-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          당첨번호를 불러오는 중...
        </p>
      </div>
    );
  }

  if (!round) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          당첨번호를 불러올 수 없습니다.
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
          잠시 후 다시 시도해주세요.
        </p>
        {error && (
          <button
            type="button"
            onClick={fetchFromProxy}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        )}
      </div>
    );
  }

  return (
    <section aria-label="최신 로또 당첨번호">
      <div className="text-center mb-6">
        <Link
          href={`/lotto/${round.roundNo}`}
          className="inline-block hover:opacity-80 transition-opacity"
        >
          <h1 className="text-2xl font-bold">
            제 <span className="text-blue-600 dark:text-blue-400">{round.roundNo}</span>회
          </h1>
        </Link>
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

      <div className="mt-8 grid grid-cols-2 gap-3">
        <Link
          href="/stats"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
        >
          📊 번호 통계
        </Link>
        <Link
          href="/generator"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 text-sm font-medium hover:bg-green-100 dark:hover:bg-green-900 transition-colors"
        >
          🎲 번호 생성
        </Link>
      </div>
    </section>
  );
}
