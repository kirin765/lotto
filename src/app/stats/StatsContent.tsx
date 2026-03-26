"use client";

import { useEffect, useState, useCallback } from "react";
import type { NumberStat, DhlotteryApiResponse } from "@/types/lotto";
import StatsClient from "./StatsClient";

interface StatsContentProps {
  serverStats: NumberStat[];
  count: number;
  latestRound: number;
}

export default function StatsContent({ serverStats, count, latestRound }: StatsContentProps) {
  const [stats, setStats] = useState<NumberStat[]>(serverStats);
  const [loading, setLoading] = useState(false);

  const fetchFromProxy = useCallback(async () => {
    setLoading(true);
    const statsMap = new Map<number, { freq: number; last: number; appearances: number[] }>();
    for (let n = 1; n <= 45; n++) {
      statsMap.set(n, { freq: 0, last: 0, appearances: [] });
    }

    // 최근 50회만 클라이언트에서 가져옴 (부하 방지)
    const clientCount = Math.min(count, 50);
    const promises = [];
    for (let i = 0; i < clientCount; i++) {
      const roundNo = latestRound - i;
      if (roundNo < 1) break;
      promises.push(
        fetch(`/api/lotto?drwNo=${roundNo}`)
          .then((r) => r.json())
          .then((json: DhlotteryApiResponse) => {
            if (json.returnValue === "success") {
              const nums = [json.drwtNo1, json.drwtNo2, json.drwtNo3, json.drwtNo4, json.drwtNo5, json.drwtNo6];
              for (const num of nums) {
                const stat = statsMap.get(num)!;
                stat.freq++;
                if (stat.last === 0 || json.drwNo > stat.last) stat.last = json.drwNo;
                stat.appearances.push(json.drwNo);
              }
            }
          })
          .catch(() => {})
      );
    }
    await Promise.all(promises);

    const computed = Array.from(statsMap.entries()).map(([number, data]) => {
      const sorted = data.appearances.sort((a, b) => a - b);
      let totalInterval = 0;
      for (let i = 1; i < sorted.length; i++) {
        totalInterval += sorted[i] - sorted[i - 1];
      }
      const avgInterval = sorted.length > 1 ? Math.round(totalInterval / (sorted.length - 1)) : 0;
      return { number, frequency: data.freq, lastAppeared: data.last, avgInterval };
    });

    const hasData = computed.some((s) => s.frequency > 0);
    if (hasData) setStats(computed);
    setLoading(false);
  }, [count, latestRound]);

  useEffect(() => {
    if (serverStats.length === 0 || serverStats.every((s) => s.frequency === 0)) {
      fetchFromProxy();
    }
  }, [serverStats, fetchFromProxy]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-9 gap-1.5 max-w-sm mx-auto mb-8">
          {Array.from({ length: 45 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center">통계 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (stats.length === 0 || stats.every((s) => s.frequency === 0)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">통계를 불러올 수 없습니다.</p>
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

  return <StatsClient stats={stats} />;
}
