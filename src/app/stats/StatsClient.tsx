"use client";

import { useState } from "react";
import type { NumberStat } from "@/types/lotto";
import { getBallColor } from "@/lib/constants";

type SortKey = "number" | "frequency" | "lastAppeared";

interface StatsClientProps {
  stats: NumberStat[];
}

export default function StatsClient({ stats }: StatsClientProps) {
  const [sortBy, setSortBy] = useState<SortKey>("frequency");
  const [sortDesc, setSortDesc] = useState(true);

  const sorted = [...stats].sort((a, b) => {
    const diff = a[sortBy] - b[sortBy];
    return sortDesc ? -diff : diff;
  });

  const maxFreq = Math.max(...stats.map((s) => s.frequency));

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(key);
      setSortDesc(true);
    }
  }

  const arrow = (key: SortKey) =>
    sortBy === key ? (sortDesc ? " ▼" : " ▲") : "";

  return (
    <div>
      {/* 빈도 시각화 */}
      <div className="grid grid-cols-9 gap-1.5 max-w-sm mx-auto mb-8">
        {stats.map((s) => {
          const color = getBallColor(s.number);
          const opacity = s.frequency / maxFreq;
          return (
            <div
              key={s.number}
              className={`aspect-square rounded-full flex items-center justify-center text-xs font-bold ${color.bg} ${color.text}`}
              style={{ opacity: Math.max(0.3, opacity) }}
              title={`${s.number}번: ${s.frequency}회 출현`}
            >
              {s.number}
            </div>
          );
        })}
      </div>

      {/* 상세 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th
                className="py-2 px-2 text-left cursor-pointer select-none hover:text-blue-600"
                onClick={() => handleSort("number")}
              >
                번호{arrow("number")}
              </th>
              <th
                className="py-2 px-2 text-right cursor-pointer select-none hover:text-blue-600"
                onClick={() => handleSort("frequency")}
              >
                출현횟수{arrow("frequency")}
              </th>
              <th
                className="py-2 px-2 text-right cursor-pointer select-none hover:text-blue-600"
                onClick={() => handleSort("lastAppeared")}
              >
                마지막 출현{arrow("lastAppeared")}
              </th>
              <th className="py-2 px-2 text-right">평균 간격</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const color = getBallColor(s.number);
              return (
                <tr
                  key={s.number}
                  className="border-b border-gray-50 dark:border-gray-800/50"
                >
                  <td className="py-2 px-2">
                    <span
                      className={`${color.bg} ${color.text} w-7 h-7 inline-flex items-center justify-center rounded-full text-xs font-bold`}
                    >
                      {s.number}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(s.frequency / maxFreq) * 100}%` }}
                        />
                      </div>
                      {s.frequency}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right text-gray-500 dark:text-gray-400">
                    {s.lastAppeared}회
                  </td>
                  <td className="py-2 px-2 text-right text-gray-500 dark:text-gray-400">
                    {s.avgInterval > 0 ? `${s.avgInterval}회` : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
