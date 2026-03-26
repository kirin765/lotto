import { formatPrize } from "@/lib/utils";
import type { LottoRound } from "@/types/lotto";

interface PrizeTableProps {
  round: LottoRound;
}

export default function PrizeTable({ round }: PrizeTableProps) {
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
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <td className="py-2.5 px-3 font-medium">🥇 1등</td>
            <td className="py-2.5 px-3 text-right font-bold text-amber-600 dark:text-amber-400">
              {formatPrize(round.firstPrizeAmount)}
            </td>
            <td className="py-2.5 px-3 text-right">{round.firstPrizeWinners}명</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 text-center">
        총 판매금액: {formatPrize(round.totalSalesAmount)}
      </p>
    </div>
  );
}
