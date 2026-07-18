import Link from "next/link";

interface RoundNavProps {
  currentRound: number;
  latestRound: number;
}

export default function RoundNav({ currentRound, latestRound }: RoundNavProps) {
  const hasPrev = currentRound > 1;
  const hasNext = currentRound < latestRound;
  const prevRounds: number[] = [];
  for (let r = currentRound - 1; r >= Math.max(1, currentRound - 10); r--) {
    prevRounds.push(r);
  }

  return (
    <>
      <nav className="flex items-center justify-between gap-3 mt-6" aria-label="회차 이동">
        {hasPrev ? (
          <Link
            href={`/lotto/${currentRound - 1}`}
            className="flex-1 py-2.5 px-4 text-center rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ← {currentRound - 1}회
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {hasNext ? (
          <Link
            href={`/lotto/${currentRound + 1}`}
            className="flex-1 py-2.5 px-4 text-center rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {currentRound + 1}회 →
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </nav>

      {prevRounds.length > 0 && (
        <nav className="mt-4" aria-label="이전 회차 바로가기">
          <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">
            이전 회차 당첨번호 바로가기
          </h2>
          <ul className="flex flex-wrap gap-2">
            {prevRounds.map((r) => (
              <li key={r}>
                <Link
                  href={`/lotto/${r}`}
                  className="inline-block py-1.5 px-3 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {r}회
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
