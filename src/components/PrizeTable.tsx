import { formatPrize } from "@/lib/utils";
import type { LottoRound } from "@/types/lotto";

interface PrizeTableProps {
  round: LottoRound;
}

const RANK_LABELS = ["🥇 1등", "🥈 2등", "🥉 3등", "4등", "5등"];
const RANK_MATCH = [
  "6개 번호 일치",
  "5개 + 보너스",
  "5개 번호 일치",
  "4개 번호 일치",
  "3개 번호 일치",
];

export default function PrizeTable({ round }: PrizeTableProps) {
  const hasPrizes = round.prizes && round.prizes.length > 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="py-2 px-3 text-left font-semibold text-gray-500 dark:text-gray-400">등위</th>
            <th className="py-2 px-3 text-right font-semibold text-gray-500 dark:text-gray-400">당첨금</th>
            <th className="py-2 px-3 text-right font-semibold text-gray-500 dark:text-gray-400">당첨자</th>
          </tr>
        </thead>
        <tbody>
          {hasPrizes ? (
            round.prizes.map((prize) => (
              <tr
                key={prize.rank}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                <td className="py-2.5 px-3">
                  <span className="font-medium">{RANK_LABELS[prize.rank - 1]}</span>
                  <span className="block text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {RANK_MATCH[prize.rank - 1]}
                  </span>
                </td>
                <td
                  className={`py-2.5 px-3 text-right font-bold ${
                    prize.rank === 1
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {formatPrize(prize.perAmount)}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums">
                  {prize.winnerCount.toLocaleString()}명
                </td>
              </tr>
            ))
          ) : (
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-2.5 px-3 font-medium">🥇 1등</td>
              <td className="py-2.5 px-3 text-right font-bold text-amber-600 dark:text-amber-400">
                {formatPrize(round.firstPrizeAmount)}
              </td>
              <td className="py-2.5 px-3 text-right">{round.firstPrizeWinners}명</td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 text-center">
        총 판매금액: {formatPrize(round.totalSalesAmount)}
      </p>
    </div>
  );
}
